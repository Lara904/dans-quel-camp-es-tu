"""
Génère site/js/data.js à partir de data/questions_scrutins.json et
data/positions_partis.json : ajoute les libellés courts "pour/contre", les
métadonnées des partis (nom, couleur), les représentant·es (président·es de
groupe) et les descriptions neutres, puis exporte le tout en un seul objet JS
embarqué dans le site statique (pas de backend, pas d'appel réseau au moment
de la visite).

Usage : python3 scripts/build_data_js.py   (depuis la racine du dépôt)
"""
import json
import os

SRC_QUESTIONS = 'data/questions_scrutins.json'
SRC_POSITIONS = 'data/positions_partis.json'
SRC_PERSONNALITES = 'data/positions_personnalites.json'
OUT = 'site/js/data.js'

# Libellé court "sujet" affiché en gros titre de la carte (le "avortement pour
# ou contre" demandé) ; la question d'origine précise (texte legislatif) passe
# en sous-texte + dans le détail "voir le vote réel correspondant".
LIBELLES_COURTS = {
    "fin_de_vie": "Euthanasie",
    "retraites_reforme_2023": "Retraites à 64 ans",
    "ivg_constitutionnalisation": "Avortement (IVG)",
    "rsa_conditionnalite": "RSA",
    "nationalite_mayotte": "Immigration",
    "impot_ultra_riches": "Taxe sur les ultra-riches",
    "assurance_chomage": "Assurance chômage",
    "encadrement_loyers": "Encadrement des loyers",
    "moratoire_eolien_solaire_fessenheim": "Énergie nucléaire",
    "ratio_soignants_hopital": "Personnel soignant à l'hôpital",
    "securite_ordre_public": "Sécurité",
    "narcotrafic_retention": "Narcotrafic",
    "fraude_fiscale_sociale": "Fraude fiscale",
    "budget_2025": "Budget 2025",
    "montagne_territoires": "Territoires de montagne",
    "soutien_ukraine": "Ukraine",
    "retraites_agricoles": "Retraites agricoles",
}

# Métadonnées fixes par famille politique (identifiants = famille_id de
# scripts/build_correspondance_partis.py). Couleurs = couleurs officielles
# des groupes à l'Assemblée nationale.
PARTIS_META = {
    "macronistes": {"nom": "EPR", "couleur": "#7B4591", "nom_long": "Ensemble pour la République"},
    "modem":       {"nom": "Dem", "couleur": "#F07E26", "nom_long": "Les Démocrates (MoDem)"},
    "horizons":    {"nom": "HOR", "couleur": "#B5E2F9", "nom_long": "Horizons"},
    "rn":          {"nom": "RN", "couleur": "#313567", "nom_long": "Rassemblement National"},
    "lfi":         {"nom": "LFI-NFP", "couleur": "#C00D0D", "nom_long": "La France insoumise"},
    "ps":          {"nom": "SOC", "couleur": "#F5B4CE", "nom_long": "Parti socialiste"},
    "ecologistes": {"nom": "EcoS", "couleur": "#77AA79", "nom_long": "Écologistes"},
    "gdr":         {"nom": "GDR", "couleur": "#830E21", "nom_long": "Gauche démocrate et républicaine"},
    "lr_dr":       {"nom": "DR", "couleur": "#8CB0DC", "nom_long": "Droite Républicaine (ex-LR)"},
    "liot":        {"nom": "LIOT", "couleur": "#FFD96F", "nom_long": "LIOT"},
    "udr":         {"nom": "UDR", "couleur": "#3367A7", "nom_long": "UDR (Ciotti)"},
}

# Représentant·e = président·e du groupe parlementaire à l'Assemblée nationale
# (le niveau pertinent ici, puisque tout le quiz est basé sur les votes de
# groupe). Vérifié par recherche web au 27/10/2026 — à revérifier
# périodiquement, une présidence de groupe peut changer en cours de
# législature. Pas de photo réelle (restriction de la plateforme utilisée
# pour générer ce site) : l'avatar est généré (initiales, couleur du parti).
REPRESENTANTS = {
    "macronistes": {"nom": "Gabriel Attal", "fonction": "Président du groupe Ensemble pour la République"},
    "modem":       {"nom": "Marc Fesneau", "fonction": "Président du groupe Les Démocrates (MoDem)"},
    "horizons":    {"nom": "Laurent Marcangeli", "fonction": "Président du groupe Horizons & Indépendants"},
    "rn":          {"nom": "Marine Le Pen", "fonction": "Présidente du groupe Rassemblement National"},
    "lfi":         {"nom": "Mathilde Panot", "fonction": "Présidente du groupe La France insoumise"},
    "ps":          {"nom": "Boris Vallaud", "fonction": "Président du groupe Socialistes et apparentés"},
    "ecologistes": {"nom": "Cyrielle Chatelain", "fonction": "Présidente du groupe Écologiste et social"},
    "gdr":         {"nom": "André Chassaigne", "fonction": "Président du groupe GDR (PCF et apparentés)"},
    "lr_dr":       {"nom": "Laurent Wauquiez", "fonction": "Président du groupe Droite Républicaine"},
    "liot":        {"nom": "Stéphane Lenormand", "fonction": "Président du groupe LIOT"},
    "udr":         {"nom": "Éric Ciotti", "fonction": "Président du groupe UDR"},
}

# Descriptions neutres et factuelles (positionnement large connu, pas de
# jugement de valeur) — volontairement courtes : le quiz compare des votes,
# pas des programmes, donc pas de promesse listée ici.
DESCRIPTIONS = {
    "macronistes": "Groupe central de la majorité présidentielle sortante, héritier de Renaissance. Positionnement centriste libéral, réformes de l'offre économique.",
    "modem":       "Allié centriste de la majorité présidentielle, historiquement proche de François Bayrou. Ligne européenne et centriste.",
    "horizons":    "Parti centriste-droit fondé par Édouard Philippe, allié de la majorité présidentielle sortante.",
    "rn":          "Parti de droite nationaliste. Lignes fortes sur l'immigration et la sécurité, positions sociales parfois protectionnistes.",
    "lfi":         "Parti de gauche radicale. Lignes fortes sur la justice sociale et fiscale, rupture avec les politiques libérales.",
    "ps":          "Parti social-démocrate historique. Ligne réformiste de gauche, proche des questions sociales et européennes.",
    "ecologistes": "Parti écologiste. Priorité à la transition environnementale, ligne de gauche sur les sujets sociaux.",
    "gdr":         "Groupe de la gauche communiste et apparentés. Ligne de gauche sur la fiscalité et les services publics.",
    "lr_dr":       "Droite républicaine classique (ex-LR). Ligne libérale sur l'économie, conservatrice sur les sujets de société et de sécurité.",
    "liot":        "Groupe centriste de territoires et d'indépendants, sans ligne partisane unique, souvent décisif sur des votes transversaux.",
    "udr":         "Groupe de droite nationale fondé par Éric Ciotti après sa rupture avec Les Républicains, proche du Rassemblement National.",
}


def initiales_nom_prenom(nom_complet):
    """'Gabriel Attal' -> 'GA' (une lettre par mot, 2 max) — pour l'avatar généré."""
    mots = [m for m in nom_complet.split(' ') if m]
    lettres = [m[0].upper() for m in mots if m[0].isalpha()]
    return ''.join(lettres[:2]) if lettres else '??'


def main():
    questions_doc = json.load(open(SRC_QUESTIONS, encoding='utf-8'))
    positions = json.load(open(SRC_POSITIONS, encoding='utf-8'))
    personnalites_src = json.load(open(SRC_PERSONNALITES, encoding='utf-8'))
    questions = questions_doc['questions']

    for q in questions:
        q['texte_court'] = LIBELLES_COURTS[q['id']]

    partis = {}
    for fid, meta in PARTIS_META.items():
        partis[fid] = {
            **meta,
            'representant': REPRESENTANTS[fid],
            'description': DESCRIPTIONS[fid],
            'initiales': ''.join(c for c in meta['nom'] if c.isalpha())[:2].upper(),
        }

    personnalites = {}
    for aid, info in personnalites_src.items():
        parti = partis[info['famille_id']]
        personnalites[aid] = {
            'nom': info['nom'],
            'fonction': info['fonction'],
            'famille_id': info['famille_id'],
            'parti_nom': parti['nom'],
            'couleur': parti['couleur'],
            'initiales': initiales_nom_prenom(info['nom']),
            'positions': info['positions'],
        }

    data = {'questions': questions, 'positions': positions, 'partis': partis, 'personnalites': personnalites}

    js = (
        "// Généré par scripts/build_data_js.py — données du quiz "
        "(questions, positions des partis, partis). Ne pas éditer à la main.\n"
        "window.QUIZ_DATA = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n"
    )

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(js)
    print('written', len(js), 'bytes to', OUT)
    print('n questions', len(questions), 'n partis', len(partis), 'n personnalites', len(personnalites))


if __name__ == '__main__':
    main()
