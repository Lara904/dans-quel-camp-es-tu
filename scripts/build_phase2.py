#!/usr/bin/env python3
"""
Phase 2 — Analyse.

1) groupes_historiques : étend `groupes` (groupes actuels, dataset AMO10) avec tout
   organe_id vu dans `votes` mais absent de `groupes` — pour afficher proprement les
   scrutins antérieurs à une scission/reconstitution de groupe. Label au mieux-effort,
   avec un flag `confirme` (0 = déduction, pas une donnée officielle confirmée).

2) positions_groupe_scrutin : pour chaque couple (scrutin, groupe), la position
   majoritaire + l'indice de cohésion de Rice :
       cohesion = |pour - contre| / (pour + contre)   [abstentions exclues]
   NULL si pour+contre = 0 (groupe unanimement abstentionniste/absent sur ce scrutin).

Usage:
    python3 build_phase2.py --db data/quizz.db
"""
import argparse
import sqlite3
from pathlib import Path


def build_schema(conn: sqlite3.Connection):
    conn.executescript(
        """
        DROP TABLE IF EXISTS groupes_historiques;
        CREATE TABLE groupes_historiques (
            organe_id       TEXT PRIMARY KEY,
            libelle         TEXT,
            libelle_abrege  TEXT,
            couleur         TEXT,
            confirme        INTEGER,   -- 1 = donnée officielle (dataset AMO10), 0 = déduction
            note            TEXT,
            date_min_observee TEXT,
            date_max_observee TEXT,
            nb_deputes_distincts INTEGER
        );

        DROP TABLE IF EXISTS positions_groupe_scrutin;
        CREATE TABLE positions_groupe_scrutin (
            scrutin_id          TEXT,
            organe_id           TEXT,
            position_majoritaire TEXT,
            nb_pour             INTEGER,
            nb_contre           INTEGER,
            nb_abstention       INTEGER,
            nb_non_votant       INTEGER,
            cohesion_rice       REAL,   -- NULL si pour+contre = 0
            PRIMARY KEY (scrutin_id, organe_id)
        );
        CREATE INDEX idx_pgs_scrutin ON positions_groupe_scrutin(scrutin_id);
        CREATE INDEX idx_pgs_organe ON positions_groupe_scrutin(organe_id);
        """
    )
    conn.commit()


def ingest_groupes_historiques(conn: sqlite3.Connection):
    c = conn.cursor()

    # 1) copier les groupes actuels (confirmés, dataset AMO10)
    c.execute("SELECT organe_id, libelle, libelle_abrege, couleur FROM groupes")
    actuels = c.fetchall()
    for organe_id, libelle, abrege, couleur in actuels:
        c.execute(
            """INSERT OR REPLACE INTO groupes_historiques
               (organe_id, libelle, libelle_abrege, couleur, confirme, note,
                date_min_observee, date_max_observee, nb_deputes_distincts)
               SELECT ?,?,?,?,1,NULL, MIN(s.date_scrutin), MAX(s.date_scrutin), COUNT(DISTINCT v.acteur_id)
               FROM votes v JOIN scrutins s ON s.scrutin_id = v.scrutin_id
               WHERE v.organe_id = ?""",
            (organe_id, libelle, abrege, couleur, organe_id),
        )

    # 2) organe_id vus dans les votes mais absents de `groupes` -> best-effort
    c.execute(
        """SELECT v.organe_id, MIN(s.date_scrutin), MAX(s.date_scrutin), COUNT(DISTINCT v.acteur_id)
           FROM votes v JOIN scrutins s ON s.scrutin_id = v.scrutin_id
           WHERE v.organe_id NOT IN (SELECT organe_id FROM groupes)
           GROUP BY v.organe_id"""
    )
    inconnus = c.fetchall()

    # Labels au mieux-effort — à confirmer manuellement (Phase 3 curation) :
    # ces déductions sont fondées sur les dates d'activité, l'effectif observé et
    # le contexte politique connu de la législature, PAS sur une source officielle.
    labels_deduits = {
        "PO847173": (
            "Groupe « droite » avant reconstitution (probable précurseur de l'UDR)",
            "DR/UDR (ancien)",
            "Effectif observé (16 députés) proche de l'UDR actuelle (17) ; période "
            "d'activité (oct. 2024 → juil. 2025) cohérente avec la formation du "
            "groupe de Éric Ciotti avant sa reconnaissance officielle mi-2025. "
            "Non confirmé par une source officielle — à vérifier avant tout usage "
            "dans le quiz.",
        ),
        "PO0": (
            "Non identifié (probable artefact technique du dataset)",
            "Inconnu",
            "336 députés distincts concernés sur des scrutins très divers : ne "
            "ressemble pas à un groupe politique réel. À exclure par défaut de la "
            "sélection des scrutins (Phase 3) tant que non élucidé.",
        ),
    }

    for organe_id, date_min, date_max, n_dep in inconnus:
        libelle, abrege, note = labels_deduits.get(
            organe_id,
            (f"Groupe non identifié ({organe_id})", organe_id, "Aucune correspondance trouvée dans les jeux de données officiels."),
        )
        c.execute(
            """INSERT OR REPLACE INTO groupes_historiques
               (organe_id, libelle, libelle_abrege, couleur, confirme, note,
                date_min_observee, date_max_observee, nb_deputes_distincts)
               VALUES (?,?,?,?,0,?,?,?,?)""",
            (organe_id, libelle, abrege, None, note, date_min, date_max, n_dep),
        )

    conn.commit()
    return len(actuels), len(inconnus)


def compute_cohesion(conn: sqlite3.Connection):
    c = conn.cursor()
    c.execute(
        """
        INSERT INTO positions_groupe_scrutin
            (scrutin_id, organe_id, position_majoritaire, nb_pour, nb_contre,
             nb_abstention, nb_non_votant, cohesion_rice)
        SELECT
            v.scrutin_id,
            v.organe_id,
            CASE
                WHEN SUM(CASE WHEN v.position='pour' THEN 1 ELSE 0 END)
                   > SUM(CASE WHEN v.position='contre' THEN 1 ELSE 0 END)
                   AND SUM(CASE WHEN v.position='pour' THEN 1 ELSE 0 END)
                   >= SUM(CASE WHEN v.position='abstention' THEN 1 ELSE 0 END)
                THEN 'pour'
                WHEN SUM(CASE WHEN v.position='contre' THEN 1 ELSE 0 END)
                   > SUM(CASE WHEN v.position='pour' THEN 1 ELSE 0 END)
                   AND SUM(CASE WHEN v.position='contre' THEN 1 ELSE 0 END)
                   >= SUM(CASE WHEN v.position='abstention' THEN 1 ELSE 0 END)
                THEN 'contre'
                WHEN SUM(CASE WHEN v.position='abstention' THEN 1 ELSE 0 END) > 0
                THEN 'abstention'
                ELSE 'indetermine'
            END,
            SUM(CASE WHEN v.position='pour' THEN 1 ELSE 0 END),
            SUM(CASE WHEN v.position='contre' THEN 1 ELSE 0 END),
            SUM(CASE WHEN v.position='abstention' THEN 1 ELSE 0 END),
            SUM(CASE WHEN v.position='nonVotant' THEN 1 ELSE 0 END),
            CASE
                WHEN (SUM(CASE WHEN v.position='pour' THEN 1 ELSE 0 END)
                    + SUM(CASE WHEN v.position='contre' THEN 1 ELSE 0 END)) = 0
                THEN NULL
                ELSE CAST(ABS(
                        SUM(CASE WHEN v.position='pour' THEN 1 ELSE 0 END)
                      - SUM(CASE WHEN v.position='contre' THEN 1 ELSE 0 END)
                     ) AS REAL)
                     / (SUM(CASE WHEN v.position='pour' THEN 1 ELSE 0 END)
                      + SUM(CASE WHEN v.position='contre' THEN 1 ELSE 0 END))
            END
        FROM votes v
        GROUP BY v.scrutin_id, v.organe_id
        """
    )
    conn.commit()
    c.execute("SELECT COUNT(*) FROM positions_groupe_scrutin")
    return c.fetchone()[0]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", required=True, type=Path)
    args = ap.parse_args()

    conn = sqlite3.connect(args.db)
    build_schema(conn)

    n_actuels, n_inconnus = ingest_groupes_historiques(conn)
    print(f"groupes_historiques : {n_actuels} groupes actuels (confirmés) + {n_inconnus} groupes historiques/non identifiés (déduits)")

    n_pgs = compute_cohesion(conn)
    print(f"positions_groupe_scrutin : {n_pgs} lignes (scrutin x groupe)")

    conn.close()


if __name__ == "__main__":
    main()
