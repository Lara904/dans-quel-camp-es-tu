#!/usr/bin/env python3
"""
Phase 3 — Sélection des scrutins (scoring + proposition de curation).

Produit un fichier `scrutins_candidats.json` : pour chaque thème, une liste de
scrutins candidats classés par score, avec le détail qui justifie le classement.
C'est une PROPOSITION à valider manuellement (voir plan de dev, Phase 3) — ce
script ne décide pas seul de la sélection finale.

Scoring (cumulatif) :
  - bonus solennel (+3 scrutin public solennel, +2 motion de censure)
  - participation : scrutins < 150 votants exclus d'office (bruit/niche)
  - polarisation inter-groupes : nombre de groupes confirmés (hors NI, hors
    groupes non confirmés) dont la position majoritaire diverge, pondéré par les
    effectifs des deux côtés — un scrutin où tous les groupes votent pareil ne
    discrimine rien.
  - rattachement thématique : dictionnaire de mots-clés par thème appliqué au
    titre du scrutin.
  - exclusion procédurale : nominations, ordre du jour, déports, etc.

Usage:
    python3 build_phase3.py --db data/quizz.db --out scrutins_candidats.json
"""
import argparse
import json
import re
import sqlite3
import unicodedata
from pathlib import Path

PARTICIPATION_MIN = 150

EXCLUSION_KEYWORDS = [
    "ordre du jour",
    "nomination de",
    "désignation de",
    "candidature",
    "questeur",
    "secrétaire de l'assemblée",
    "secrétaires de l'assemblée",
    "modification du règlement",
    "commission mixte paritaire est demandée",
    "suspension de séance",
    "rappel au règlement",
    "renvoi en commission",
    "demande de constitution d'une commission spéciale",
]
# NB : "exception d'irrecevabilité" et "motion de rejet préalable" sont des
# motions de procédure dans leur FORME, mais en pratique elles valent souvent
# vote de rejet global d'un texte et suivent les lignes de parti — gardées
# comme signal thématique plutôt qu'exclues.

THEMES = {
    "economie": [
        "projet de loi de finances", "budget", "dette publique", "croissance",
        "entreprise", "pme", "industrie", "compétitivité", "commerce",
    ],
    "fiscalite": [
        "impôt", "impot", "fiscal", "taxe", "tva", "csg", "niche fiscale",
        "prélèvement", "ISF", "flat tax",
    ],
    "immigration": [
        "immigration", "étranger", "asile", "titre de séjour", "régularisation",
        "expulsion", "OQTF", "naturalisation",
    ],
    "ecologie": [
        "écologi", "climat", "environnement", "biodiversité", "énergie renouvelable",
        "pollution", "zéro artificialisation", "agriculture", "pesticide", "eau",
        "montagne", "forêt",
    ],
    "securite": [
        "sécurité intérieure", "sécurité publique", "sécurité routière",
        "ordre public", "police", "délinquance", "narcotrafic", "terrorisme",
        "répression", "prison", "peine", "justice pénale", "rétention administrative",
        "trouble", "troublant l'ordre",
    ],
    "retraites": [
        "retraite", "pension", "âge de départ", "régime de retraite",
    ],
    "services_publics": [
        "hôpital", "santé publique", "éducation nationale", "école", "service public",
        "fonction publique", "sécurité sociale", "assurance maladie", "soins",
    ],
    "europe": [
        "union européenne", "europe", "directive européenne", "traité européen",
    ],
}


def strip_accents(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


def norm(s: str) -> str:
    return strip_accents((s or "").lower())


def is_excluded(titre: str) -> bool:
    t = norm(titre)
    return any(norm(kw) in t for kw in EXCLUSION_KEYWORDS)


def matched_themes(titre: str):
    t = norm(titre)
    out = []
    for theme, kws in THEMES.items():
        if any(norm(kw) in t for kw in kws):
            out.append(theme)
    return out


def polarization(conn: sqlite3.Connection, scrutin_id: str):
    """Compte les groupes confirmés dont la position majoritaire est 'pour' vs
    'contre' (NI et groupes non confirmés exclus), pondéré par leur effectif
    votant sur CE scrutin."""
    c = conn.cursor()
    c.execute(
        """
        SELECT p.position_majoritaire, (p.nb_pour + p.nb_contre)
        FROM positions_groupe_scrutin p
        JOIN groupes_historiques g ON g.organe_id = p.organe_id
        WHERE p.scrutin_id = ? AND g.confirme = 1 AND g.libelle_abrege != 'NI'
        """,
        (scrutin_id,),
    )
    pour_groups = contre_groups = 0
    pour_members = contre_members = 0
    for pos, n in c.fetchall():
        if pos == "pour":
            pour_groups += 1
            pour_members += n
        elif pos == "contre":
            contre_groups += 1
            contre_members += n
    return pour_groups, contre_groups, pour_members, contre_members


def score_scrutin(type_vote, pour_groups, contre_groups, pour_members, contre_members):
    bonus = 0.0
    if type_vote == "scrutin public solennel":
        bonus += 3
    elif type_vote == "motion de censure":
        bonus += 2
    # polarisation : au moins 1 groupe de chaque côté avec un effectif notable
    pol = min(pour_groups, contre_groups) + min(pour_members, contre_members) / 200.0
    return bonus + pol


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--top-n", type=int, default=12, help="candidats max par thème")
    args = ap.parse_args()

    conn = sqlite3.connect(args.db)
    c = conn.cursor()

    c.execute(
        """SELECT scrutin_id, date_scrutin, titre, type_vote, sort_libelle, nombre_votants
           FROM scrutins WHERE nombre_votants >= ?""",
        (PARTICIPATION_MIN,),
    )
    rows = c.fetchall()

    n_total = len(rows)
    n_excluded = 0
    n_no_theme = 0
    candidats_par_theme = {t: [] for t in THEMES}

    for scrutin_id, date, titre, type_vote, sort_lib, nb_votants in rows:
        if is_excluded(titre):
            n_excluded += 1
            continue
        themes = matched_themes(titre)
        if not themes:
            n_no_theme += 1
            continue
        pg, cg, pm, cm = polarization(conn, scrutin_id)
        sc = score_scrutin(type_vote, pg, cg, pm, cm)
        entry = {
            "scrutin_id": scrutin_id,
            "date": date,
            "titre": titre,
            "type_vote": type_vote,
            "resultat": sort_lib,
            "nombre_votants": nb_votants,
            "score": round(sc, 2),
            "groupes_pour": pg,
            "groupes_contre": cg,
            "membres_pour": pm,
            "membres_contre": cm,
            "justification_auto": (
                f"{'scrutin solennel, ' if type_vote=='scrutin public solennel' else ''}"
                f"{pg} groupe(s) majoritairement pour vs {cg} contre "
                f"({pm} vs {cm} députés) sur {nb_votants} votants."
            ),
        }
        for t in themes:
            candidats_par_theme[t].append(entry)

    for t in candidats_par_theme:
        candidats_par_theme[t].sort(key=lambda e: e["score"], reverse=True)
        candidats_par_theme[t] = candidats_par_theme[t][: args.top_n]

    out = {
        "_meta": {
            "statut": "PROPOSITION NON VALIDÉE — à relire et curer manuellement avant usage dans le quiz",
            "participation_min": PARTICIPATION_MIN,
            "scrutins_candidats_total_examines": n_total,
            "exclus_procedure": n_excluded,
            "sans_theme_detecte": n_no_theme,
        },
        "themes": candidats_par_theme,
    }

    args.out.write_text(json.dumps(out, ensure_ascii=False, indent=2))

    print(f"Scrutins examinés (participation >= {PARTICIPATION_MIN}) : {n_total}")
    print(f"Exclus (procédure) : {n_excluded}")
    print(f"Sans thème détecté : {n_no_theme}")
    for t, lst in candidats_par_theme.items():
        print(f"  {t:<18} : {len(lst)} candidats proposés")
    print(f"-> écrit dans {args.out}")


if __name__ == "__main__":
    main()
