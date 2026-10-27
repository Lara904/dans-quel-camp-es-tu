#!/usr/bin/env python3
"""
Phase 1 — Ingestion & normalisation.

Parse les exports JSON officiels de l'Assemblée nationale (data.assemblee-nationale.fr)
pour la XVIIe législature et construit une base SQLite normalisée :
  - deputes (etat civil)
  - groupes (organes de type GP : libellé, couleur, dates de vie du groupe)
  - appartenances_groupe (acteur <-> groupe, avec date_debut/date_fin du mandat GP)
  - scrutins (métadonnées du scrutin)
  - votes (un enregistrement par couple scrutin/député : position + groupe au moment du vote)

Usage:
    python3 build_db.py --scrutins-dir <dir> --acteurs-dir <dir> --out quizz.db
"""
import argparse
import json
import sqlite3
import sys
from pathlib import Path


def load_json(path: Path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def build_schema(conn: sqlite3.Connection):
    conn.executescript(
        """
        PRAGMA foreign_keys = ON;

        CREATE TABLE deputes (
            acteur_id   TEXT PRIMARY KEY,
            civ         TEXT,
            prenom      TEXT,
            nom         TEXT,
            date_naissance TEXT,
            profession  TEXT
        );

        CREATE TABLE groupes (
            organe_id       TEXT PRIMARY KEY,
            libelle         TEXT,
            libelle_abrege  TEXT,
            couleur         TEXT,
            legislature     TEXT,
            date_debut      TEXT,
            date_fin        TEXT
        );

        CREATE TABLE appartenances_groupe (
            acteur_id   TEXT,
            organe_id   TEXT,
            date_debut  TEXT,
            date_fin    TEXT,   -- NULL = toujours en cours
            PRIMARY KEY (acteur_id, organe_id, date_debut)
        );

        CREATE TABLE scrutins (
            scrutin_id      TEXT PRIMARY KEY,
            numero          INTEGER,
            legislature     TEXT,
            date_scrutin    TEXT,
            titre           TEXT,
            type_vote       TEXT,
            sort_code       TEXT,
            sort_libelle    TEXT,
            dossier_legislatif TEXT,
            nombre_votants  INTEGER,
            suffrages_exprimes INTEGER,
            pour            INTEGER,
            contre          INTEGER,
            abstentions     INTEGER,
            non_votants     INTEGER
        );

        CREATE TABLE votes (
            scrutin_id  TEXT,
            acteur_id   TEXT,
            organe_id   TEXT,     -- groupe tel que ventilé PAR le scrutin lui-même
            position    TEXT,     -- 'pour' | 'contre' | 'abstention' | 'nonVotant'
            par_delegation TEXT,
            PRIMARY KEY (scrutin_id, acteur_id)
        );

        CREATE INDEX idx_votes_acteur ON votes(acteur_id);
        CREATE INDEX idx_votes_scrutin ON votes(scrutin_id);
        CREATE INDEX idx_appart_acteur ON appartenances_groupe(acteur_id);
        CREATE INDEX idx_scrutins_date ON scrutins(date_scrutin);
        """
    )
    conn.commit()


def ingest_acteurs(conn: sqlite3.Connection, acteurs_dir: Path):
    n = 0
    for f in (acteurs_dir / "acteur").glob("*.json"):
        d = load_json(f)["acteur"]
        uid = d["uid"]["#text"] if isinstance(d["uid"], dict) else d["uid"]
        ident = d.get("etatCivil", {}).get("ident", {})
        naiss = d.get("etatCivil", {}).get("infoNaissance", {}) or {}
        prof = (d.get("profession") or {}).get("libelleCourant")
        conn.execute(
            "INSERT OR REPLACE INTO deputes VALUES (?,?,?,?,?,?)",
            (
                uid,
                ident.get("civ"),
                ident.get("prenom"),
                ident.get("nom"),
                naiss.get("dateNais"),
                prof,
            ),
        )
        n += 1
    conn.commit()
    return n


def ingest_groupes(conn: sqlite3.Connection, actifs_dir: Path):
    """Les groupes réels (avec libellé/couleur) viennent du dataset 'députés actifs'
    (AMO10), PAS du dataset 'acteurs/mandats/organes divisés' (AMO50) : ce dernier
    ne reflète pas l'appartenance effective aux groupes (bug constaté : tous les
    députés y apparaissent comme non-inscrits)."""
    n = 0
    for f in (actifs_dir / "organe").glob("*.json"):
        d = load_json(f)["organe"]
        if d.get("codeType") != "GP":
            continue
        vimode = d.get("viMoDe") or {}
        conn.execute(
            "INSERT OR REPLACE INTO groupes VALUES (?,?,?,?,?,?,?)",
            (
                d["uid"],
                d.get("libelle"),
                d.get("libelleAbrege"),
                d.get("couleurAssociee"),
                d.get("legislature"),
                vimode.get("dateDebut"),
                vimode.get("dateFin"),
            ),
        )
        n += 1
    conn.commit()
    return n


def ingest_appartenances(conn: sqlite3.Connection, actifs_dir: Path):
    """Appartenance de groupe ACTUELLE (mandat GP actif), lue depuis les mandats
    imbriqués dans chaque fichier acteur du dataset 'députés actifs' (AMO10).
    On privilégie la ligne nominPrincipale=1 quand un acteur a plusieurs mandats
    GP actifs (ex. Président de groupe apparaît aussi comme simple Membre)."""
    n = 0
    for f in (actifs_dir / "acteur").glob("*.json"):
        d = load_json(f)["acteur"]
        uid = d["uid"]["#text"] if isinstance(d["uid"], dict) else d["uid"]
        mandats = (d.get("mandats") or {}).get("mandat")
        if mandats is None:
            continue
        if isinstance(mandats, dict):
            mandats = [mandats]
        gp_mandats = [m for m in mandats if m.get("typeOrgane") == "GP"]
        if not gp_mandats:
            continue
        principal = next((m for m in gp_mandats if m.get("nominPrincipale") == "1"), gp_mandats[0])
        organe_ref = (principal.get("organes") or {}).get("organeRef")
        if not organe_ref:
            continue
        conn.execute(
            "INSERT OR REPLACE INTO appartenances_groupe VALUES (?,?,?,?)",
            (uid, organe_ref, principal.get("dateDebut"), principal.get("dateFin")),
        )
        n += 1
    conn.commit()
    return n


def iter_votants(bucket, position):
    """bucket = {'votant': [...]} ou {'votant': {...}} ou None"""
    if not bucket:
        return
    votant = bucket.get("votant")
    if votant is None:
        return
    if isinstance(votant, dict):
        votant = [votant]
    for v in votant:
        yield v, position


def ingest_scrutins(conn: sqlite3.Connection, scrutins_dir: Path):
    n_scrutins = 0
    n_votes = 0
    files = list(scrutins_dir.glob("*.json"))
    for i, f in enumerate(files):
        d = load_json(f)["scrutin"]
        uid = d["uid"]
        synth = d.get("syntheseVote", {})
        decompte = synth.get("decompte", {})
        sort = d.get("sort", {})
        objet = d.get("objet", {})
        dossier = objet.get("dossierLegislatif")
        dossier_ref = None
        if isinstance(dossier, dict):
            dossier_ref = dossier.get("titre") or dossier.get("referenceDossier")

        def to_int(x):
            try:
                return int(x)
            except (TypeError, ValueError):
                return None

        conn.execute(
            "INSERT OR REPLACE INTO scrutins VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (
                uid,
                to_int(d.get("numero")),
                d.get("legislature"),
                d.get("dateScrutin"),
                d.get("titre"),
                (d.get("typeVote") or {}).get("libelleTypeVote"),
                sort.get("code"),
                sort.get("libelle"),
                dossier_ref,
                to_int(synth.get("nombreVotants")),
                to_int(synth.get("suffragesExprimes")),
                to_int(decompte.get("pour")),
                to_int(decompte.get("contre")),
                to_int(decompte.get("abstentions")),
                to_int(decompte.get("nonVotants")),
            ),
        )
        n_scrutins += 1

        ventil = d.get("ventilationVotes", {}).get("organe", {})
        groupes = (ventil.get("groupes") or {}).get("groupe")
        if groupes is None:
            groupes = []
        elif isinstance(groupes, dict):
            groupes = [groupes]

        rows = []
        for g in groupes:
            organe_ref = g.get("organeRef")
            nominatif = (g.get("vote") or {}).get("decompteNominatif") or {}
            for bucket_key, position in [
                ("pours", "pour"),
                ("contres", "contre"),
                ("abstentions", "abstention"),
                ("nonVotants", "nonVotant"),
            ]:
                for v, pos in iter_votants(nominatif.get(bucket_key), position):
                    rows.append(
                        (
                            uid,
                            v.get("acteurRef"),
                            organe_ref,
                            pos,
                            v.get("parDelegation"),
                        )
                    )
        conn.executemany("INSERT OR REPLACE INTO votes VALUES (?,?,?,?,?)", rows)
        n_votes += len(rows)

        if (i + 1) % 1000 == 0:
            conn.commit()
            print(f"  ... {i + 1}/{len(files)} scrutins traités", file=sys.stderr)

    conn.commit()
    return n_scrutins, n_votes


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--scrutins-dir", required=True, type=Path)
    ap.add_argument("--acteurs-dir", required=True, type=Path,
                     help="dataset AMO50 (acteurs/mandats/organes divisés) : état civil complet")
    ap.add_argument("--actifs-dir", required=True, type=Path,
                     help="dataset AMO10 (députés actifs + mandats actifs) : groupes réels")
    ap.add_argument("--legislature", default="17")
    ap.add_argument("--out", required=True, type=Path)
    args = ap.parse_args()

    if args.out.exists():
        args.out.unlink()

    conn = sqlite3.connect(args.out)
    build_schema(conn)

    n_dep = ingest_acteurs(conn, args.acteurs_dir)
    print(f"Députés (acteurs) : {n_dep}")

    n_grp = ingest_groupes(conn, args.actifs_dir)
    print(f"Groupes politiques (actifs) : {n_grp}")

    n_app = ingest_appartenances(conn, args.actifs_dir)
    print(f"Appartenances de groupe (actuelles) : {n_app}")

    n_scr, n_vot = ingest_scrutins(conn, args.scrutins_dir)
    print(f"Scrutins : {n_scr}")
    print(f"Votes individuels : {n_vot}")

    conn.close()


if __name__ == "__main__":
    main()
