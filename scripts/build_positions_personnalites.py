"""
Construit data/positions_personnalites.json : pour une liste de personnalités
politiques (des député·es en exercice, puisque ce sont les seul·es dont on a
un vote individuel réel et vérifiable à l'Assemblée nationale — rester
cohérent avec le principe du projet : comparer des votes réels, pas des
discours), extrait leur position individuelle sur chacun des 17 scrutins du
quiz depuis data/quizz.db.

Contrairement au score par parti (positions_partis.json, qui utilise la
position majoritaire du groupe + un indice de cohésion), ici la position
EST le vote individuel réel de la personne : pas de cohésion à calculer,
juste "a-t-elle/il voté comme moi ?".

Usage : python3 scripts/build_positions_personnalites.py   (depuis la racine)
Nécessite data/quizz.db (régénéré via scripts/build_db.py + build_db_l16.py,
voir README.md § Reconstruire la base — ce fichier n'est pas versionné,
trop lourd pour git).
"""
import json
import os
import sys
import sqlite3

DB = sys.argv[1] if len(sys.argv) > 1 else 'data/quizz.db'
SRC_QUESTIONS = 'data/questions_scrutins.json'
OUT = 'data/positions_personnalites.json'

# Personnalités retenues : des député·es en exercice, reconnaissables
# (président·es de groupe + quelques figures nationales de premier plan),
# couvrant l'éventail des familles politiques du quiz. acteur_id = identifiant
# officiel Assemblée nationale (data.assemblee-nationale.fr).
PERSONNALITES = [
    {"acteur_id": "PA722190", "nom": "Gabriel Attal", "famille_id": "macronistes", "fonction": "Président du groupe Ensemble pour la République"},
    {"acteur_id": "PA607846", "nom": "Gérald Darmanin", "famille_id": "macronistes", "fonction": "Député, ancien ministre de l'Intérieur"},
    {"acteur_id": "PA719938", "nom": "Marc Fesneau", "famille_id": "modem", "fonction": "Président du groupe Les Démocrates (MoDem)"},
    {"acteur_id": "PA605782", "nom": "Laurent Marcangeli", "famille_id": "horizons", "fonction": "Président du groupe Horizons & Indépendants"},
    {"acteur_id": "PA720614", "nom": "Marine Le Pen", "famille_id": "rn", "fonction": "Présidente du groupe Rassemblement National"},
    {"acteur_id": "PA795778", "nom": "Jean-Philippe Tanguy", "famille_id": "rn", "fonction": "Député, porte-parole économique du RN"},
    {"acteur_id": "PA720892", "nom": "Mathilde Panot", "famille_id": "lfi", "fonction": "Présidente du groupe La France insoumise"},
    {"acteur_id": "PA793444", "nom": "Manuel Bompard", "famille_id": "lfi", "fonction": "Député, coordinateur de La France insoumise"},
    {"acteur_id": "PA719930", "nom": "Boris Vallaud", "famille_id": "ps", "fonction": "Président du groupe Socialistes et apparentés"},
    {"acteur_id": "PA609332", "nom": "Olivier Faure", "famille_id": "ps", "fonction": "Député, premier secrétaire du Parti socialiste"},
    {"acteur_id": "PA794008", "nom": "Cyrielle Chatelain", "famille_id": "ecologistes", "fonction": "Présidente du groupe Écologiste et social"},
    {"acteur_id": "PA267306", "nom": "André Chassaigne", "famille_id": "gdr", "fonction": "Président du groupe GDR (PCF et apparentés)"},
    {"acteur_id": "PA267285", "nom": "Laurent Wauquiez", "famille_id": "lr_dr", "fonction": "Président du groupe Droite Républicaine"},
    {"acteur_id": "PA720100", "nom": "Aurélien Pradié", "famille_id": "lr_dr", "fonction": "Député, figure de la Droite Républicaine"},
    {"acteur_id": "PA795244", "nom": "Stéphane Lenormand", "famille_id": "liot", "fonction": "Président du groupe LIOT"},
    {"acteur_id": "PA330240", "nom": "Éric Ciotti", "famille_id": "udr", "fonction": "Président du groupe UDR"},
]


def main():
    questions_doc = json.load(open(SRC_QUESTIONS, encoding='utf-8'))
    scrutin_ids = [q['scrutin_id'] for q in questions_doc['questions']]
    qid_by_scrutin = {q['scrutin_id']: q['id'] for q in questions_doc['questions']}

    con = sqlite3.connect(DB)
    cur = con.cursor()

    resultat = {}
    for perso in PERSONNALITES:
        aid = perso['acteur_id']
        positions_qid = {}
        rows = cur.execute(
            "SELECT scrutin_id, position FROM votes WHERE acteur_id = ? AND scrutin_id IN (%s)"
            % ",".join("?" * len(scrutin_ids)),
            [aid] + scrutin_ids,
        ).fetchall()
        votes_par_scrutin = {sid: pos for sid, pos in rows}

        for sid in scrutin_ids:
            qid = qid_by_scrutin[sid]
            pos = votes_par_scrutin.get(sid)
            if pos == 'pour':
                positions_qid[qid] = 'pour'
            elif pos == 'contre':
                positions_qid[qid] = 'contre'
            elif pos == 'abstention':
                positions_qid[qid] = 'abstention'
            else:
                # nonVotant ou absent de la table (pas encore élu·e à la date du
                # scrutin, etc.) : vraie absence de donnée, pas assimilée à une
                # abstention volontaire.
                positions_qid[qid] = 'indetermine'

        resultat[aid] = {
            'nom': perso['nom'],
            'famille_id': perso['famille_id'],
            'fonction': perso['fonction'],
            'positions': positions_qid,
        }

    con.close()

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(resultat, f, ensure_ascii=False, indent=1)

    # Petit rapport de couverture pour vérifier qu'on n'a pas une personnalité
    # avec un acteur_id erroné (toutes les positions à 'indetermine').
    print(f"{len(resultat)} personnalités écrites dans {OUT}\n")
    for aid, info in resultat.items():
        connues = sum(1 for v in info['positions'].values() if v != 'indetermine')
        print(f"  {info['nom']:<22} {connues}/{len(scrutin_ids)} votes connus")


if __name__ == '__main__':
    main()
