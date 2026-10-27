#!/usr/bin/env python3
"""
Phase 4 — Moteur de scoring (proximité utilisateur <-> partis).

1) Pour chaque question du quiz (data/questions_scrutins.json), calcule la
   position majoritaire et la cohésion de chaque FAMILLE POLITIQUE (pas
   groupe brut : on agrège via `familles_politiques` pour que XVI et XVII
   comptent comme le même parti quand la continuité est confirmée — et on
   EXCLUT les organes marqués exclu_scoring_defaut, ex. le groupe UDR déduit
   PO847173, pour que des données non confirmées n'alimentent pas
   silencieusement le score du 'vrai' UDR confirmé, PO872880).
   -> écrit data/positions_partis.json

2) Fonction de scoring, conforme à la formule du plan de dev, étendue pour
   traiter l'abstention comme une vraie position (pas une donnée manquante)
   et lissée pour que les partis avec moins de scrutins tranchés (RN, UDR)
   gardent un score complet et stable plutôt que de disparaître ou d'être
   sur-interprétés à partir d'un petit échantillon :

       Score(parti) = [Σ(accord × poids × cohésion) + K × 0.5]
                      ─────────────────────────────────────────
                      [Σ(poids × cohésion) + K]

   - accord(u,s,parti) ∈ {0, 0.5, 1} : 1 si la réponse utilisateur colle à la
     position majoritaire du parti sur le scrutin s, 0 si elle s'y oppose,
     0.5 si le parti était en 'abstention' sur s OU si l'utilisateur a
     répondu "sans avis".
   - poids(s) : poids éditorial du scrutin (confiance haute = 1.0, moyenne =
     0.7).
   - cohésion : mesure de l'unanimité du parti sur s.
       * position 'pour'/'contre' tranchée : indice de Rice classique,
         |pour-contre|/(pour+contre).
       * position 'abstention' unanime (aucun pour/contre, au moins une
         abstention) : cohésion = 1.0 — une abstention unanime est un VRAI
         signal politique fort (ex. RN sur le soutien à l'Ukraine), pas une
         absence de donnée ; elle doit peser dans le score avec accord=0.5,
         pas être ignorée comme avant cette correction.
       * aucun vote exploitable (ni pour/contre ni abstention, seulement des
         non-votants = députés absents) : cohésion = None, le scrutin est
         ignoré pour ce parti — là, il n'y a vraiment aucune information.
   - K : terme de lissage bayésien (prior neutre, par défaut K=2.0 — l'équi-
     valent de 2 questions neutres virtuelles). Effet : un parti qui n'a de
     position tranchée que sur une petite partie des questions répondues
     (ex. RN 14/17, UDR 7/17 après la correction ci-dessus) voit son score
     automatiquement TIRÉ VERS 0.5 proportionnellement à ce qui lui manque,
     au lieu d'un score bruyant calculé sur un petit échantillon ou,
     pire, d'une disparition pure et simple du classement quand le
     dénominateur est nul (ça ne peut plus arriver : le score est TOUJOURS
     défini puisque K>0). Plus un parti a de questions tranchées, moins le
     lissage influe (le prior est noyé dans la vraie donnée) — c'est
     l'inverse d'un filtrage brutal par seuil minimal de questions.

Les partis exclus par défaut (familles_politiques.exclu_scoring_defaut=1 sur
TOUS leurs organes : 'ni', 'inconnu') sont ignorés du classement — ce ne sont
pas des partis cohérents, les regrouper serait trompeur.

Usage:
    python3 build_phase4.py --db data/quizz.db --questions data/questions_scrutins.json \
        --out data/positions_partis.json
    python3 build_phase4.py --db data/quizz.db --questions data/questions_scrutins.json \
        --out data/positions_partis.json --demo
"""
import argparse
import json
import sqlite3
from pathlib import Path

POIDS_CONFIANCE = {"haute": 1.0, "moyenne": 0.7}
PRIOR_K = 2.0  # poids du prior neutre (lissage) — voir docstring


def compute_positions_partis(conn: sqlite3.Connection, questions: list) -> dict:
    c = conn.cursor()
    out = {}
    for q in questions:
        sid = q["scrutin_id"]
        c.execute(
            """
            SELECT f.famille_id, f.famille_libelle,
                   SUM(p.nb_pour), SUM(p.nb_contre), SUM(p.nb_abstention), SUM(p.nb_non_votant)
            FROM positions_groupe_scrutin p
            JOIN familles_politiques f ON f.organe_id = p.organe_id
            WHERE p.scrutin_id = ? AND f.exclu_scoring_defaut = 0
            GROUP BY f.famille_id
            """,
            (sid,),
        )
        familles = {}
        for famille_id, libelle, pour, contre, abst, non_vot in c.fetchall():
            pour = pour or 0
            contre = contre or 0
            abst = abst or 0
            non_vot = non_vot or 0
            if pour + contre > 0:
                if pour > contre:
                    position = "pour"
                elif contre > pour:
                    position = "contre"
                else:
                    position = "indetermine"
                cohesion = abs(pour - contre) / (pour + contre) if pour != contre else 0.0
            elif abst > 0:
                # Abstention unanime (ou quasi) : vraie position, signal fort,
                # pas une absence de donnée -> cohésion pleine.
                position = "abstention"
                cohesion = 1.0
            else:
                # Seulement des non-votants (absents) : aucune information.
                position = "indetermine"
                cohesion = None
            familles[famille_id] = {
                "famille_libelle": libelle,
                "position": position,
                "cohesion_rice": round(cohesion, 3) if cohesion is not None else None,
                "pour": pour,
                "contre": contre,
                "abstention": abst,
                "non_votant": non_vot,
            }
        out[q["id"]] = {
            "scrutin_id": sid,
            "confiance": q.get("confiance", "haute"),
            "poids": POIDS_CONFIANCE.get(q.get("confiance", "haute"), 1.0),
            "familles": familles,
        }
    return out


def accord(reponse_utilisateur: str, position_parti: str) -> float:
    """reponse_utilisateur, position_parti ∈ {'pour','contre','abstention','indetermine','sans_avis'}."""
    if reponse_utilisateur == "sans_avis" or position_parti in ("abstention", "indetermine"):
        return 0.5
    if reponse_utilisateur == position_parti:
        return 1.0
    return 0.0


def score_partis(positions_partis: dict, reponses: dict, prior_k: float = PRIOR_K) -> dict:
    """reponses : {question_id: 'pour'|'contre'|'sans_avis'}.
    Renvoie {famille_id: {score, fiabilite, n_questions_effectives,
    n_questions_posees, detail: [...]}} trié par score décroissant. Les
    partis exclus par défaut ne sont jamais inclus. Le score est TOUJOURS
    défini (lissage bayésien, voir docstring du module) : plus aucun parti
    ne peut disparaître du classement faute de données."""
    totaux = {}  # famille_id -> [numerateur, denominateur, libelle, detail]
    toutes_familles = {}
    n_questions_posees = len(reponses)

    for qid, reponse in reponses.items():
        if qid not in positions_partis:
            continue
        pq = positions_partis[qid]
        poids_s = pq["poids"]
        for famille_id, info in pq["familles"].items():
            toutes_familles[famille_id] = info["famille_libelle"]
            cohesion = info["cohesion_rice"]
            if cohesion is None:
                continue  # aucune information exploitable pour ce parti sur ce scrutin
            a = accord(reponse, info["position"])
            poids_effectif = poids_s * cohesion
            if famille_id not in totaux:
                totaux[famille_id] = [0.0, 0.0, info["famille_libelle"], []]
            totaux[famille_id][0] += a * poids_effectif
            totaux[famille_id][1] += poids_effectif
            totaux[famille_id][3].append(
                {"question": qid, "reponse_utilisateur": reponse, "position_parti": info["position"],
                 "accord": a, "cohesion": cohesion, "poids_scrutin": poids_s}
            )

    resultats = {}
    for famille_id, libelle in toutes_familles.items():
        num, denom, _, detail = totaux.get(famille_id, (0.0, 0.0, libelle, []))
        score_lisse = (num + prior_k * 0.5) / (denom + prior_k)  # toujours défini (prior_k > 0)
        n_eff = len(detail)
        resultats[famille_id] = {
            "famille_libelle": libelle,
            "score": round(score_lisse, 4),
            "n_questions_effectives": n_eff,
            "n_questions_posees": n_questions_posees,
            "fiabilite": round(n_eff / n_questions_posees, 3) if n_questions_posees else 0.0,
            "detail": detail,
        }
    return dict(sorted(resultats.items(), key=lambda kv: kv[1]["score"], reverse=True))


def demo(positions_partis: dict):
    print("\n=== DÉMO : profil 'électeur de gauche classique' ===")
    reponses_gauche = {
        "retraites_reforme_2023": "pour",
        "impot_ultra_riches": "pour",
        "rsa_conditionnalite": "contre",
        "nationalite_mayotte": "contre",
        "securite_ordre_public": "contre",
        "narcotrafic_retention": "contre",
        "assurance_chomage": "contre",
    }
    for famille_id, r in score_partis(positions_partis, reponses_gauche).items():
        print(f"  {famille_id:<14} score={r['score']:<7} fiabilite={r['fiabilite']} ({r['n_questions_effectives']}/{r['n_questions_posees']})")

    print("\n=== DÉMO : profil 'électeur RN' ===")
    reponses_rn = {
        "retraites_reforme_2023": "pour",
        "impot_ultra_riches": "contre",
        "rsa_conditionnalite": "contre",
        "nationalite_mayotte": "pour",
        "securite_ordre_public": "pour",
        "narcotrafic_retention": "pour",
        "assurance_chomage": "pour",
    }
    for famille_id, r in score_partis(positions_partis, reponses_rn).items():
        print(f"  {famille_id:<14} score={r['score']:<7} fiabilite={r['fiabilite']} ({r['n_questions_effectives']}/{r['n_questions_posees']})")

    print("\n=== DÉMO cas limite : l'utilisateur ne répond qu'aux 3 questions où le RN s'abstient ===")
    reponses_pathologiques = {"impot_ultra_riches": "pour", "ratio_soignants_hopital": "pour", "soutien_ukraine": "pour"}
    for famille_id, r in score_partis(positions_partis, reponses_pathologiques).items():
        print(f"  {famille_id:<14} score={r['score']:<7} fiabilite={r['fiabilite']} ({r['n_questions_effectives']}/{r['n_questions_posees']})")

    print("\n=== DÉMO : 'sans avis' partout (doit rester neutre, ~0.5 pour tous) ===")
    reponses_neutres = {qid: "sans_avis" for qid in positions_partis}
    for famille_id, r in score_partis(positions_partis, reponses_neutres).items():
        print(f"  {famille_id:<14} score={r['score']:<7} fiabilite={r['fiabilite']} ({r['n_questions_effectives']}/{r['n_questions_posees']})")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", required=True, type=Path)
    ap.add_argument("--questions", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--demo", action="store_true")
    args = ap.parse_args()

    questions = json.loads(args.questions.read_text(encoding="utf-8"))["questions"]
    conn = sqlite3.connect(args.db)
    positions_partis = compute_positions_partis(conn, questions)
    args.out.write_text(json.dumps(positions_partis, ensure_ascii=False, indent=2))
    print(f"-> {len(positions_partis)} questions, écrit dans {args.out}")

    for qid, pq in positions_partis.items():
        n_tranches = sum(1 for f in pq["familles"].values() if f["cohesion_rice"] is not None)
        print(f"  {qid:<35} {n_tranches} partis avec position exploitable")

    if args.demo:
        demo(positions_partis)


if __name__ == "__main__":
    main()
