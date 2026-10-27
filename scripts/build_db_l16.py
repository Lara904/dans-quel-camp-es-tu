#!/usr/bin/env python3
"""
Extension — ingestion de la législature XVI (2022-2024) dans la MÊME base
que la XVII, avec legislature='16' partout, pour couvrir les sujets dont le
vote clé a eu lieu avant juillet 2024 (ex. IVG, RSA/loi plein emploi).

Différence structurelle avec le script L17 (build_db.py) : le dataset AMO50
de la XVI (archive figée à la dissolution) a les mandats dans un dossier
`mandat/` séparé (un fichier par mandat, avec acteurRef + organeRef), et non
embarqués dans le fichier acteur comme pour AMO10 de la XVII. On lit donc
`amo50/mandat/*.json` directement, filtré sur typeOrgane == 'GP' et
legislature == '16'.

Usage:
    python3 build_db_l16.py --db data/quizz.db --scrutins-dir data_l16/raw/scrutins/json \
        --acteurs-dir data_l16/raw/amo50/acteur --organes-dir data_l16/raw/amo50/organe \
        --mandats-dir data_l16/raw/amo50/mandat
"""
import argparse
import json
import sqlite3
import sys
from pathlib import Path


def load_json(path: Path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def ingest_acteurs(conn, acteurs_dir: Path):
    n = 0
    for f in acteurs_dir.glob("*.json"):
        d = load_json(f)["acteur"]
        uid = d["uid"]["#text"] if isinstance(d["uid"], dict) else d["uid"]
        ident = d.get("etatCivil", {}).get("ident", {})
        naiss = d.get("etatCivil", {}).get("infoNaissance", {}) or {}
        prof = (d.get("profession") or {}).get("libelleCourant")
        conn.execute(
            "INSERT OR IGNORE INTO deputes VALUES (?,?,?,?,?,?)",
            (uid, ident.get("civ"), ident.get("prenom"), ident.get("nom"), naiss.get("dateNais"), prof),
        )
        n += 1
    conn.commit()
    return n


def ingest_groupes(conn, organes_dir: Path, legislature: str):
    n = 0
    for f in organes_dir.glob("*.json"):
        d = load_json(f)["organe"]
        if d.get("codeType") != "GP":
            continue
        vimode = d.get("viMoDe") or {}
        date_debut = vimode.get("dateDebut")
        # Les organes GP de la XVI débutent le 2022-06-28 (NI un peu avant,
        # 2022-06-22) ; on exclut les groupes des législatures antérieures.
        if not date_debut or date_debut < "2022-06-20":
            continue
        conn.execute(
            "INSERT OR IGNORE INTO groupes VALUES (?,?,?,?,?,?,?)",
            (
                d["uid"], d.get("libelle"), d.get("libelleAbrege"), d.get("couleurAssociee"),
                legislature, date_debut, vimode.get("dateFin"),
            ),
        )
        n += 1
    conn.commit()
    return n


def ingest_appartenances(conn, mandats_dir: Path, legislature: str):
    n = 0
    for f in mandats_dir.glob("*.json"):
        d = load_json(f)["mandat"]
        if d.get("typeOrgane") != "GP" or d.get("legislature") != legislature:
            continue
        organe_ref = (d.get("organes") or {}).get("organeRef")
        if not organe_ref:
            continue
        conn.execute(
            "INSERT OR IGNORE INTO appartenances_groupe VALUES (?,?,?,?)",
            (d.get("acteurRef"), organe_ref, d.get("dateDebut"), d.get("dateFin")),
        )
        n += 1
    conn.commit()
    return n


def iter_votants(bucket, position):
    if not bucket:
        return
    votant = bucket.get("votant")
    if votant is None:
        return
    if isinstance(votant, dict):
        votant = [votant]
    for v in votant:
        yield v, position


def ingest_scrutins(conn, scrutins_dir: Path):
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
            "INSERT OR IGNORE INTO scrutins VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (
                uid, to_int(d.get("numero")), d.get("legislature"), d.get("dateScrutin"), d.get("titre"),
                (d.get("typeVote") or {}).get("libelleTypeVote"), sort.get("code"), sort.get("libelle"),
                dossier_ref, to_int(synth.get("nombreVotants")), to_int(synth.get("suffragesExprimes")),
                to_int(decompte.get("pour")), to_int(decompte.get("contre")),
                to_int(decompte.get("abstentions")), to_int(decompte.get("nonVotants")),
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
                ("pours", "pour"), ("contres", "contre"),
                ("abstentions", "abstention"), ("nonVotants", "nonVotant"),
            ]:
                for v, pos in iter_votants(nominatif.get(bucket_key), position):
                    rows.append((uid, v.get("acteurRef"), organe_ref, pos, v.get("parDelegation")))
        conn.executemany("INSERT OR IGNORE INTO votes VALUES (?,?,?,?,?)", rows)
        n_votes += len(rows)

        if (i + 1) % 1000 == 0:
            conn.commit()
            print(f"  ... {i + 1}/{len(files)} scrutins traités", file=sys.stderr)

    conn.commit()
    return n_scrutins, n_votes


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", required=True, type=Path)
    ap.add_argument("--scrutins-dir", required=True, type=Path)
    ap.add_argument("--acteurs-dir", required=True, type=Path)
    ap.add_argument("--organes-dir", required=True, type=Path)
    ap.add_argument("--mandats-dir", required=True, type=Path)
    ap.add_argument("--legislature", default="16")
    args = ap.parse_args()

    conn = sqlite3.connect(args.db)

    n_dep = ingest_acteurs(conn, args.acteurs_dir)
    print(f"Députés (acteurs XVI, ajoutés si nouveaux) : {n_dep}")

    n_grp = ingest_groupes(conn, args.organes_dir, args.legislature)
    print(f"Groupes politiques XVI : {n_grp}")

    n_app = ingest_appartenances(conn, args.mandats_dir, args.legislature)
    print(f"Appartenances de groupe XVI : {n_app}")

    n_scr, n_vot = ingest_scrutins(conn, args.scrutins_dir)
    print(f"Scrutins XVI : {n_scr}")
    print(f"Votes individuels XVI : {n_vot}")

    conn.close()


if __name__ == "__main__":
    main()
