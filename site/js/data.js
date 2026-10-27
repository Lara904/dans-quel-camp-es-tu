// Généré par scripts/build_data_js.py — données du quiz (questions, positions des partis, partis). Ne pas éditer à la main.
window.QUIZ_DATA = {
 "questions": [
  {
   "id": "fin_de_vie",
   "question_quiz": "Faut-il légaliser une aide active à mourir pour les patients en phase avancée ou terminale ?",
   "scrutin_id": "VTANR5L17V8280",
   "date": "2026-07-15",
   "titre_complet": "l'ensemble de la proposition de loi relative au droit à l'aide à mourir (lecture définitive).",
   "resultat": "adopté (291 pour, 241 contre, 29 abstentions, 561 votants)",
   "nombre_votants": 561,
   "confiance": "haute",
   "note": "CORRECTION : le scrutin_id initial (VTANR5L17V561) était faux — il pointait vers un amendement sans rapport (loi d'urgence Mayotte), probablement une confusion de ma part entre un nombre de votants et un identifiant de scrutin lors de la rédaction initiale. Corrigé avec le vrai scrutin de lecture définitive du 15/07/2026, vérifié directement en base.",
   "texte_court": "Aide active à mourir (euthanasie)"
  },
  {
   "id": "retraites_reforme_2023",
   "question_quiz": "Faut-il abroger la réforme des retraites de 2023 (retour à l'âge légal antérieur à 64 ans) ?",
   "scrutin_id": "VTANR5L17V2257",
   "date": "2025-06-05",
   "titre_complet": "la proposition de résolution visant à abroger la loi n° 2023-270 du 14 avril 2023 de financement rectificative de la sécurité sociale pour 2023 dite réforme des retraites.",
   "resultat": "adopté (198 pour, 35 contre, 0 abstention, 233 votants)",
   "nombre_votants": 233,
   "confiance": "haute",
   "note": "Remplace le scrutin retiré (voir _meta.questions_retirees) : celui-ci est une PROPOSITION DE RÉSOLUTION (déposée par les députés communistes), donc sans valeur législative contraignante — c'est une prise de position politique, pas une abrogation effective. À signaler dans le quiz. Contenu vérifié par 3 sources indépendantes (LCP, Le Club des Juristes, datan.fr) : le titre correspond exactement au contenu réel. Répartition des votes vérifiée en base, cohérente avec le clivage attendu : LFI-NFP, PS, Écologistes, GDR et RN ont voté pour (cohésion 1.0 chacun) ; EPR, Dem, HOR ont voté contre (cohésion 1.0 chacun). Participation faible (233/577) typique d'un vote non contraignant où une partie du camp gouvernemental ne s'est pas déplacée plutôt que de voter contre en nombre.",
   "sources": [
    "https://lcp.fr/index.php/actualites/retraites-l-assemblee-approuve-un-texte-des-deputes-communistes-appelant-a-abroger-la",
    "https://www.leclubdesjuristes.com/en-bref/adoption-de-la-proposition-de-resolution-visant-a-abroger-la-reforme-des-retraites-a-lassemblee-nationale-10944/",
    "https://datan.fr/votes/legislature-17/vote_2257"
   ],
   "texte_court": "Retraites à 64 ans"
  },
  {
   "id": "ivg_constitutionnalisation",
   "question_quiz": "Faut-il inscrire le droit à l'avortement (IVG) dans la Constitution ?",
   "scrutin_id": "VTANR5L16V3289",
   "date": "2024-01-30",
   "legislature": "16",
   "titre_complet": "l'ensemble du projet de loi constitutionnelle relatif à la liberté de recourir à l'interruption volontaire de grossesse (première lecture).",
   "resultat": "adopté (493 pour, 30 contre, 23 abstentions, 546 votants)",
   "nombre_votants": 546,
   "confiance": "haute",
   "note": "Vote de l'Assemblée en première lecture sur le projet de loi du Gouvernement (le vote final et solennel a eu lieu au Congrès du Parlement le 04/03/2024, réunissant Assemblée+Sénat — hors périmètre de ce projet qui ne couvre que les scrutins de l'Assemblée). ATTENTION, discriminant faible : consensus très large (quasi tous les groupes majoritairement 'pour'), la vraie ligne de clivage est interne à RN (46 pour/12 contre/14 abst) et LR (40 pour/15 contre/4 abst) plutôt qu'entre partis — utile pour situer l'utilisateur, mais ne distinguera pas bien les partis entre eux dans le score de proximité.",
   "sources": [
    "https://datan.fr/votes/legislature-16/vote_3289"
   ],
   "texte_court": "Avortement (IVG) dans la Constitution"
  },
  {
   "id": "rsa_conditionnalite",
   "question_quiz": "Faut-il conditionner le versement du RSA à 15 heures d'activité hebdomadaire (formation, stage, bénévolat) ?",
   "scrutin_id": "VTANR5L16V2965",
   "date": "2023-11-14",
   "legislature": "16",
   "titre_complet": "l'ensemble du projet de loi pour le plein emploi (texte de la commission mixte paritaire).",
   "resultat": "adopté (190 pour, 147 contre, 5 abstentions, 342 votants)",
   "nombre_votants": 342,
   "confiance": "haute",
   "note": "Contenu vérifié (LCP, Public Sénat, Previssima) : le texte final instaure les '15h d'activité' comme condition du RSA et transforme Pôle emploi en France Travail. Clivage net et conforme à l'attendu : RE, LR, Dem, HOR pour ; LFI-NUPES, RN, PS, LIOT, Écolo-NUPES, GDR-NUPES contre — à noter, le RN a voté contre ce texte (pas pour les mêmes raisons que la gauche), signal intéressant pour le positionnement du quiz.",
   "sources": [
    "https://datan.fr/votes/legislature-16/vote_2965",
    "https://www.publicsenat.fr/actualites/parlementaire/rsa-sous-conditions-france-travail-que-contient-le-projet-de-loi-plein-emploi-definitivement-adopte-par-le-parlement"
   ],
   "texte_court": "RSA sous conditions d'activité"
  },
  {
   "id": "nationalite_mayotte",
   "question_quiz": "Faut-il durcir les conditions d'accès à la nationalité française pour les enfants nés à Mayotte de parents étrangers ?",
   "scrutin_id": "VTANR5L17V1308",
   "date": "2025-04-08",
   "titre_complet": "l'ensemble de la proposition de loi visant à renforcer les conditions d'accès à la nationalité française à Mayotte (texte de la commission mixte paritaire).",
   "resultat": "adopté (339 pour, 174 contre, 11 abstentions, 524 votants)",
   "nombre_votants": 524,
   "confiance": "haute",
   "note": "Contenu vérifié via LCP : le texte exige désormais que les DEUX parents (et non un seul comme avant) résident régulièrement et sans interruption à Mayotte depuis au moins un an (contre trois mois auparavant) pour que leur enfant né sur l'île acquière la nationalité française à sa majorité. Clivage de vote net et conforme à l'attendu : RN, EPR, DR, Dem, HOR, LIOT pour (cohésion quasi parfaite) ; LFI-NFP, PS, Écologistes, GDR contre (cohésion parfaite). Vote de lecture définitive/CMP retenu plutôt que la première lecture (258 votants, 06/02/2025) pour avoir la version la plus aboutie et la plus large participation.",
   "sources": [
    "https://lcp.fr/index.php/actualites/mayotte-l-assemblee-durcit-la-restriction-du-droit-du-sol-au-terme-de-debats-houleux",
    "https://datan.fr/votes/legislature-17/vote_738"
   ],
   "texte_court": "Immigration à Mayotte"
  },
  {
   "id": "impot_ultra_riches",
   "question_quiz": "Faut-il instaurer un impôt plancher de 2 % sur le patrimoine des contribuables les plus fortunés (type « taxe Zucman ») ?",
   "scrutin_id": "VTANR5L17V881",
   "date": "2025-02-20",
   "titre_complet": "l'ensemble de la proposition de loi instaurant un impôt plancher de 2 % sur le patrimoine des ultra riches (première lecture).",
   "resultat": "adopté (116 pour, 39 contre, 31 abstentions, 186 votants)",
   "nombre_votants": 186,
   "confiance": "haute",
   "note": "Vote sur l'ensemble, intitulé explicite. Participation plus faible (186) que les autres votes 'ensemble' — à mentionner si le quiz affiche le taux de participation.",
   "texte_court": "Taxe sur les ultra-riches"
  },
  {
   "id": "assurance_chomage",
   "question_quiz": "Faut-il réduire la durée maximale d'indemnisation chômage après une rupture conventionnelle ?",
   "scrutin_id": "VTANR5L17V7260",
   "date": "2026-06-02",
   "titre_complet": "l'ensemble du projet de loi portant transposition de l'avenant n° 3 du 25 février 2026 au protocole d'accord du 10 novembre 2023 relatif à l'assurance chômage (deuxième lecture).",
   "resultat": "adopté (353 pour, 114 contre, 37 abstentions, 504 votants)",
   "nombre_votants": 504,
   "confiance": "haute",
   "note": "Vérifié : l'avenant durcit les règles — durée maximale d'indemnisation réduite de 18 à 15 mois (moins de 55 ans), en échange d'un accompagnement renforcé. Ne concerne que les ruptures conventionnelles individuelles, pas tous les demandeurs d'emploi.",
   "sources": [
    "https://cms.law/fr/fra/legal-updates/rupture-conventionnelle-les-nouvelles-regles-d-indemnisation-chomage"
   ],
   "texte_court": "Durée de l'assurance chômage"
  },
  {
   "id": "encadrement_loyers",
   "question_quiz": "Faut-il encadrer les loyers dans les zones tendues ?",
   "scrutin_id": "VTANR5L17V2262",
   "date": "2025-06-05",
   "titre_complet": "l'ensemble de la proposition de loi expérimentant l'encadrement des loyers et améliorant l'habitat dans les outre-mer (première lecture).",
   "resultat": "adopté (169 pour, 0 contre, 3 abstentions, 172 votants)",
   "nombre_votants": 172,
   "confiance": "haute",
   "note": "ID de scrutin à reconfirmer en base (extrait de la recherche par titre, non ré-interrogé individuellement) avant usage — même procédure que les autres mais non revérifié faute de temps.",
   "texte_court": "Encadrement des loyers"
  },
  {
   "id": "moratoire_eolien_solaire_fessenheim",
   "question_quiz": "Faut-il imposer un moratoire sur les nouvelles installations éoliennes et solaires, et rouvrir la centrale nucléaire de Fessenheim ?",
   "scrutin_id": "VTANR5L17V2653",
   "date": "2025-06-24",
   "titre_complet": "l'ensemble de la proposition de loi portant programmation nationale pour l'énergie et le climat pour les années 2025 à 2035 (première lecture).",
   "resultat": "rejeté (142 pour, 377 contre, 47 abstentions, 566 votants)",
   "nombre_votants": 566,
   "confiance": "haute",
   "note": "Correction après vérification (ma 1ère note indiquait 'adopté' par erreur, sans avoir vérifié — c'est faux). Le texte initial (programmation énergie-climat, origine Sénat) a été profondément remanié en séance par le RN et LR, qui y ont ajouté un moratoire sur l'éolien/le solaire et la réouverture de Fessenheim. Résultat : la gauche ET l'ex-majorité présidentielle (EPR, MoDem, Horizons) ont voté contre (pas pour les mêmes raisons), RN+UDR ont voté pour, LR s'est très majoritairement abstenu. Vérifié indépendamment dans la base : DR (LR) est bien en abstention sur ce scrutin, cohérent avec la source. Question reformulée pour refléter ce que le texte contenait vraiment (moratoire EnR + Fessenheim), pas une question générique sur 'le nucléaire'.",
   "sources": [
    "https://www.banquedesterritoires.fr/programmation-energetique-la-proposition-de-loi-gremillet-largement-rejetee-par-les-deputes"
   ],
   "texte_court": "Nucléaire plutôt qu'éolien/solaire"
  },
  {
   "id": "ratio_soignants_hopital",
   "question_quiz": "Faut-il imposer un nombre minimum de soignants par patient hospitalisé ?",
   "scrutin_id": "VTANR5L17V600",
   "date": "2025-01-23",
   "titre_complet": "l'ensemble de la proposition de loi, adoptée par le Sénat, relative à l'instauration d'un nombre minimum de soignants par patient hospitalisé (première lecture).",
   "resultat": "adopté (138 pour, 3 contre, 70 abstentions, 211 votants)",
   "nombre_votants": 211,
   "confiance": "haute",
   "note": "Vote sur l'ensemble, intitulé explicite, sujet hôpital/santé publique bien identifié (absent de la curation thématique précédente).",
   "texte_court": "Nombre minimum de soignants à l'hôpital"
  },
  {
   "id": "securite_ordre_public",
   "question_quiz": "Faut-il renforcer les pouvoirs des forces de l'ordre pour répondre aux troubles à l'ordre public ?",
   "scrutin_id": "VTANR5L17V8433",
   "date": "2026-07-21",
   "titre_complet": "l'ensemble du projet de loi visant à offrir des réponses immédiates aux phénomènes troublant l'ordre public, la sécurité et la tranquillité de nos concitoyens (texte de la commission mixte paritaire).",
   "resultat": "adopté (351 pour, 179 contre, 7 abstentions, 537 votants)",
   "nombre_votants": 537,
   "confiance": "haute",
   "note": "Inchangé depuis la 1ère curation.",
   "texte_court": "Pouvoirs des forces de l'ordre"
  },
  {
   "id": "narcotrafic_retention",
   "question_quiz": "Faut-il renforcer la rétention administrative et les mesures de sécurité contre le narcotrafic et le risque terroriste ?",
   "scrutin_id": "VTANR5L17V6318",
   "date": "2026-05-05",
   "titre_complet": "l'ensemble de la proposition de loi visant à renforcer la sécurité, la rétention administrative et la prévention des risques d'attentat (première lecture).",
   "resultat": "adopté (345 pour, 177 contre, 13 abstentions, 535 votants)",
   "nombre_votants": 535,
   "confiance": "haute",
   "note": "Inchangé depuis la 1ère curation.",
   "texte_court": "Lutte contre le narcotrafic"
  },
  {
   "id": "fraude_fiscale_sociale",
   "question_quiz": "Faut-il renforcer la lutte contre la fraude fiscale et sociale ?",
   "scrutin_id": "VTANR5L17V6023",
   "date": "2026-04-07",
   "titre_complet": "l'ensemble du projet de loi relatif à la lutte contre les fraudes sociales et fiscales (première lecture).",
   "resultat": "adopté (363 pour, 194 contre, 9 abstentions, 566 votants)",
   "nombre_votants": 566,
   "confiance": "haute",
   "note": "Inchangé depuis la 1ère curation.",
   "texte_court": "Lutte contre la fraude fiscale"
  },
  {
   "id": "budget_2025",
   "question_quiz": "Étiez-vous favorable au volet recettes du budget de l'État pour 2025 ?",
   "scrutin_id": "VTANR5L17V438",
   "date": "2024-11-12",
   "titre_complet": "la première partie du projet de loi de finances pour 2025 (première lecture).",
   "resultat": "rejeté (192 pour, 362 contre, 19 abstentions, 573 votants)",
   "confiance": "haute",
   "note": "Inchangé depuis la 1ère curation.",
   "nombre_votants": 573,
   "texte_court": "Budget de l'État 2025"
  },
  {
   "id": "montagne_territoires",
   "question_quiz": "Faut-il adopter des mesures spécifiques de soutien aux territoires de montagne ?",
   "scrutin_id": "VTANR5L17V8421",
   "date": "2026-07-20",
   "titre_complet": "l'ensemble de la proposition de loi pour une montagne vivante et souveraine (texte de la commission mixte paritaire).",
   "resultat": "adopté (376 pour, 92 contre, 4 abstentions, 472 votants)",
   "confiance": "haute",
   "note": "Inchangé depuis la 1ère curation.",
   "nombre_votants": 472,
   "texte_court": "Soutien aux territoires de montagne"
  },
  {
   "id": "soutien_ukraine",
   "question_quiz": "La France doit-elle renforcer son soutien à l'Ukraine face à la Russie ?",
   "scrutin_id": "VTANR5L17V988",
   "date": "2025-03-12",
   "titre_complet": "l'article unique de la proposition de résolution européenne appelant au renforcement du soutien à l'Ukraine.",
   "resultat": "adopté (288 pour, 54 contre, 132 abstentions, 474 votants)",
   "confiance": "moyenne",
   "note": "Résolution (non contraignante) plutôt que loi — à signaler dans le quiz que c'est une prise de position politique, pas une mesure concrète votée.",
   "nombre_votants": 474,
   "texte_court": "Soutien à l'Ukraine"
  },
  {
   "id": "retraites_agricoles",
   "question_quiz": "Faut-il revaloriser les pensions de retraite des agriculteurs ?",
   "scrutin_id": "VTANR5L17V7324",
   "date": "2026-06-04",
   "titre_complet": "l'ensemble de la proposition de loi portant plusieurs mesures de justice en faveur de la revalorisation des pensions de retraites agricoles (première lecture).",
   "resultat": "adopté (82 pour, 1 contre, 5 abstentions, 88 votants)",
   "nombre_votants": 88,
   "confiance": "moyenne",
   "note": "Participation assez faible (88/577) — sujet plus consensuel, risque de ne pas bien différencier les partis. À tester avec le calcul de cohésion avant de l'inclure dans le quiz final.",
   "texte_court": "Retraites des agriculteurs"
  }
 ],
 "positions": {
  "fin_de_vie": {
   "scrutin_id": "VTANR5L17V8280",
   "confiance": "haute",
   "poids": 1.0,
   "familles": {
    "ecologistes": {
     "famille_libelle": "Écologistes",
     "position": "pour",
     "cohesion_rice": 0.886,
     "pour": 33,
     "contre": 2,
     "abstention": 1,
     "non_votant": 0
    },
    "gdr": {
     "famille_libelle": "Gauche démocrate et républicaine (PCF et apparentés)",
     "position": "pour",
     "cohesion_rice": 0.667,
     "pour": 10,
     "contre": 2,
     "abstention": 3,
     "non_votant": 0
    },
    "horizons": {
     "famille_libelle": "Horizons",
     "position": "contre",
     "cohesion_rice": 0.059,
     "pour": 16,
     "contre": 18,
     "abstention": 1,
     "non_votant": 0
    },
    "lfi": {
     "famille_libelle": "La France insoumise",
     "position": "pour",
     "cohesion_rice": 0.937,
     "pour": 61,
     "contre": 2,
     "abstention": 3,
     "non_votant": 0
    },
    "liot": {
     "famille_libelle": "LIOT",
     "position": "pour",
     "cohesion_rice": 0.111,
     "pour": 10,
     "contre": 8,
     "abstention": 4,
     "non_votant": 0
    },
    "lr_dr": {
     "famille_libelle": "Les Républicains / Droite Républicaine",
     "position": "contre",
     "cohesion_rice": 0.783,
     "pour": 5,
     "contre": 41,
     "abstention": 2,
     "non_votant": 0
    },
    "macronistes": {
     "famille_libelle": "Macronistes (Renaissance / EPR)",
     "position": "pour",
     "cohesion_rice": 0.561,
     "pour": 64,
     "contre": 18,
     "abstention": 9,
     "non_votant": 0
    },
    "modem": {
     "famille_libelle": "MoDem (Démocrates)",
     "position": "pour",
     "cohesion_rice": 0.111,
     "pour": 20,
     "contre": 16,
     "abstention": 0,
     "non_votant": 0
    },
    "ps": {
     "famille_libelle": "Parti socialiste",
     "position": "pour",
     "cohesion_rice": 0.869,
     "pour": 57,
     "contre": 4,
     "abstention": 6,
     "non_votant": 0
    },
    "rn": {
     "famille_libelle": "Rassemblement National",
     "position": "contre",
     "cohesion_rice": 0.797,
     "pour": 12,
     "contre": 106,
     "abstention": 0,
     "non_votant": 0
    },
    "udr": {
     "famille_libelle": "UDR (Ciotti)",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 17,
     "abstention": 0,
     "non_votant": 0
    }
   }
  },
  "retraites_reforme_2023": {
   "scrutin_id": "VTANR5L17V2257",
   "confiance": "haute",
   "poids": 1.0,
   "familles": {
    "ecologistes": {
     "famille_libelle": "Écologistes",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 33,
     "contre": 0,
     "abstention": 0,
     "non_votant": 1
    },
    "gdr": {
     "famille_libelle": "Gauche démocrate et républicaine (PCF et apparentés)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 17,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "horizons": {
     "famille_libelle": "Horizons",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 7,
     "abstention": 0,
     "non_votant": 0
    },
    "lfi": {
     "famille_libelle": "La France insoumise",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 59,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "liot": {
     "famille_libelle": "LIOT",
     "position": "pour",
     "cohesion_rice": 0.143,
     "pour": 4,
     "contre": 3,
     "abstention": 0,
     "non_votant": 0
    },
    "lr_dr": {
     "famille_libelle": "Les Républicains / Droite Républicaine",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 1,
     "abstention": 0,
     "non_votant": 0
    },
    "macronistes": {
     "famille_libelle": "Macronistes (Renaissance / EPR)",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 11,
     "abstention": 0,
     "non_votant": 1
    },
    "modem": {
     "famille_libelle": "MoDem (Démocrates)",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 11,
     "abstention": 0,
     "non_votant": 0
    },
    "ps": {
     "famille_libelle": "Parti socialiste",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 44,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "rn": {
     "famille_libelle": "Rassemblement National",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 41,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    }
   }
  },
  "ivg_constitutionnalisation": {
   "scrutin_id": "VTANR5L16V3289",
   "confiance": "haute",
   "poids": 1.0,
   "familles": {
    "ecologistes": {
     "famille_libelle": "Écologistes",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 23,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "gdr": {
     "famille_libelle": "Gauche démocrate et républicaine (PCF et apparentés)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 20,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "horizons": {
     "famille_libelle": "Horizons",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 26,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "lfi": {
     "famille_libelle": "La France insoumise",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 75,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "liot": {
     "famille_libelle": "LIOT",
     "position": "pour",
     "cohesion_rice": 0.9,
     "pour": 19,
     "contre": 1,
     "abstention": 2,
     "non_votant": 0
    },
    "lr_dr": {
     "famille_libelle": "Les Républicains / Droite Républicaine",
     "position": "pour",
     "cohesion_rice": 0.455,
     "pour": 40,
     "contre": 15,
     "abstention": 4,
     "non_votant": 0
    },
    "macronistes": {
     "famille_libelle": "Macronistes (Renaissance / EPR)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 164,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "modem": {
     "famille_libelle": "MoDem (Démocrates)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 47,
     "contre": 0,
     "abstention": 2,
     "non_votant": 0
    },
    "ps": {
     "famille_libelle": "Parti socialiste",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 31,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "rn": {
     "famille_libelle": "Rassemblement National",
     "position": "pour",
     "cohesion_rice": 0.586,
     "pour": 46,
     "contre": 12,
     "abstention": 14,
     "non_votant": 0
    }
   }
  },
  "rsa_conditionnalite": {
   "scrutin_id": "VTANR5L16V2965",
   "confiance": "haute",
   "poids": 1.0,
   "familles": {
    "ecologistes": {
     "famille_libelle": "Écologistes",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 9,
     "abstention": 0,
     "non_votant": 0
    },
    "gdr": {
     "famille_libelle": "Gauche démocrate et républicaine (PCF et apparentés)",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 8,
     "abstention": 0,
     "non_votant": 0
    },
    "horizons": {
     "famille_libelle": "Horizons",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 20,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "lfi": {
     "famille_libelle": "La France insoumise",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 50,
     "abstention": 0,
     "non_votant": 1
    },
    "liot": {
     "famille_libelle": "LIOT",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 10,
     "abstention": 4,
     "non_votant": 0
    },
    "lr_dr": {
     "famille_libelle": "Les Républicains / Droite Républicaine",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 36,
     "contre": 0,
     "abstention": 1,
     "non_votant": 0
    },
    "macronistes": {
     "famille_libelle": "Macronistes (Renaissance / EPR)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 102,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "modem": {
     "famille_libelle": "MoDem (Démocrates)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 31,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "ps": {
     "famille_libelle": "Parti socialiste",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 20,
     "abstention": 0,
     "non_votant": 0
    },
    "rn": {
     "famille_libelle": "Rassemblement National",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 49,
     "abstention": 0,
     "non_votant": 0
    }
   }
  },
  "nationalite_mayotte": {
   "scrutin_id": "VTANR5L17V1308",
   "confiance": "haute",
   "poids": 1.0,
   "familles": {
    "ecologistes": {
     "famille_libelle": "Écologistes",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 32,
     "abstention": 0,
     "non_votant": 0
    },
    "gdr": {
     "famille_libelle": "Gauche démocrate et républicaine (PCF et apparentés)",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 13,
     "abstention": 0,
     "non_votant": 0
    },
    "horizons": {
     "famille_libelle": "Horizons",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 32,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "lfi": {
     "famille_libelle": "La France insoumise",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 65,
     "abstention": 0,
     "non_votant": 0
    },
    "liot": {
     "famille_libelle": "LIOT",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 13,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "lr_dr": {
     "famille_libelle": "Les Républicains / Droite Républicaine",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 47,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "macronistes": {
     "famille_libelle": "Macronistes (Renaissance / EPR)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 73,
     "contre": 0,
     "abstention": 4,
     "non_votant": 2
    },
    "modem": {
     "famille_libelle": "MoDem (Démocrates)",
     "position": "pour",
     "cohesion_rice": 0.935,
     "pour": 30,
     "contre": 1,
     "abstention": 3,
     "non_votant": 0
    },
    "ps": {
     "famille_libelle": "Parti socialiste",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 61,
     "abstention": 3,
     "non_votant": 0
    },
    "rn": {
     "famille_libelle": "Rassemblement National",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 122,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    }
   }
  },
  "impot_ultra_riches": {
   "scrutin_id": "VTANR5L17V881",
   "confiance": "haute",
   "poids": 1.0,
   "familles": {
    "ecologistes": {
     "famille_libelle": "Écologistes",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 38,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "gdr": {
     "famille_libelle": "Gauche démocrate et républicaine (PCF et apparentés)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 5,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "horizons": {
     "famille_libelle": "Horizons",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 7,
     "abstention": 3,
     "non_votant": 0
    },
    "lfi": {
     "famille_libelle": "La France insoumise",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 37,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "lr_dr": {
     "famille_libelle": "Les Républicains / Droite Républicaine",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 3,
     "abstention": 0,
     "non_votant": 0
    },
    "macronistes": {
     "famille_libelle": "Macronistes (Renaissance / EPR)",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 16,
     "abstention": 0,
     "non_votant": 1
    },
    "modem": {
     "famille_libelle": "MoDem (Démocrates)",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 9,
     "abstention": 0,
     "non_votant": 0
    },
    "ps": {
     "famille_libelle": "Parti socialiste",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 36,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "rn": {
     "famille_libelle": "Rassemblement National",
     "position": "abstention",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 0,
     "abstention": 28,
     "non_votant": 0
    }
   }
  },
  "assurance_chomage": {
   "scrutin_id": "VTANR5L17V7260",
   "confiance": "haute",
   "poids": 1.0,
   "familles": {
    "ecologistes": {
     "famille_libelle": "Écologistes",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 14,
     "abstention": 0,
     "non_votant": 0
    },
    "gdr": {
     "famille_libelle": "Gauche démocrate et républicaine (PCF et apparentés)",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 17,
     "abstention": 0,
     "non_votant": 0
    },
    "horizons": {
     "famille_libelle": "Horizons",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 30,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "lfi": {
     "famille_libelle": "La France insoumise",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 63,
     "abstention": 0,
     "non_votant": 0
    },
    "liot": {
     "famille_libelle": "LIOT",
     "position": "pour",
     "cohesion_rice": 0.81,
     "pour": 19,
     "contre": 2,
     "abstention": 0,
     "non_votant": 0
    },
    "lr_dr": {
     "famille_libelle": "Les Républicains / Droite Républicaine",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 44,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "macronistes": {
     "famille_libelle": "Macronistes (Renaissance / EPR)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 87,
     "contre": 0,
     "abstention": 0,
     "non_votant": 1
    },
    "modem": {
     "famille_libelle": "MoDem (Démocrates)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 33,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "ps": {
     "famille_libelle": "Parti socialiste",
     "position": "contre",
     "cohesion_rice": 0.895,
     "pour": 1,
     "contre": 18,
     "abstention": 37,
     "non_votant": 0
    },
    "rn": {
     "famille_libelle": "Rassemblement National",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 115,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "udr": {
     "famille_libelle": "UDR (Ciotti)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 14,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    }
   }
  },
  "encadrement_loyers": {
   "scrutin_id": "VTANR5L17V2262",
   "confiance": "haute",
   "poids": 1.0,
   "familles": {
    "ecologistes": {
     "famille_libelle": "Écologistes",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 22,
     "contre": 0,
     "abstention": 0,
     "non_votant": 1
    },
    "gdr": {
     "famille_libelle": "Gauche démocrate et républicaine (PCF et apparentés)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 17,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "horizons": {
     "famille_libelle": "Horizons",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 7,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "lfi": {
     "famille_libelle": "La France insoumise",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 33,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "liot": {
     "famille_libelle": "LIOT",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 1,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "lr_dr": {
     "famille_libelle": "Les Républicains / Droite Républicaine",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 2,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "macronistes": {
     "famille_libelle": "Macronistes (Renaissance / EPR)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 13,
     "contre": 0,
     "abstention": 0,
     "non_votant": 1
    },
    "modem": {
     "famille_libelle": "MoDem (Démocrates)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 8,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "ps": {
     "famille_libelle": "Parti socialiste",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 26,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "rn": {
     "famille_libelle": "Rassemblement National",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 39,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    }
   }
  },
  "moratoire_eolien_solaire_fessenheim": {
   "scrutin_id": "VTANR5L17V2653",
   "confiance": "haute",
   "poids": 1.0,
   "familles": {
    "ecologistes": {
     "famille_libelle": "Écologistes",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 37,
     "abstention": 0,
     "non_votant": 0
    },
    "gdr": {
     "famille_libelle": "Gauche démocrate et républicaine (PCF et apparentés)",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 13,
     "abstention": 0,
     "non_votant": 0
    },
    "horizons": {
     "famille_libelle": "Horizons",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 34,
     "abstention": 0,
     "non_votant": 0
    },
    "lfi": {
     "famille_libelle": "La France insoumise",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 71,
     "abstention": 0,
     "non_votant": 0
    },
    "liot": {
     "famille_libelle": "LIOT",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 23,
     "abstention": 0,
     "non_votant": 0
    },
    "lr_dr": {
     "famille_libelle": "Les Républicains / Droite Républicaine",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 2,
     "contre": 0,
     "abstention": 46,
     "non_votant": 0
    },
    "macronistes": {
     "famille_libelle": "Macronistes (Renaissance / EPR)",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 90,
     "abstention": 1,
     "non_votant": 1
    },
    "modem": {
     "famille_libelle": "MoDem (Démocrates)",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 36,
     "abstention": 0,
     "non_votant": 0
    },
    "ps": {
     "famille_libelle": "Parti socialiste",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 66,
     "abstention": 0,
     "non_votant": 0
    },
    "rn": {
     "famille_libelle": "Rassemblement National",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 122,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    }
   }
  },
  "ratio_soignants_hopital": {
   "scrutin_id": "VTANR5L17V600",
   "confiance": "haute",
   "poids": 1.0,
   "familles": {
    "ecologistes": {
     "famille_libelle": "Écologistes",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 27,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "gdr": {
     "famille_libelle": "Gauche démocrate et républicaine (PCF et apparentés)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 6,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "horizons": {
     "famille_libelle": "Horizons",
     "position": "contre",
     "cohesion_rice": 0.333,
     "pour": 1,
     "contre": 2,
     "abstention": 7,
     "non_votant": 1
    },
    "lfi": {
     "famille_libelle": "La France insoumise",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 35,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "liot": {
     "famille_libelle": "LIOT",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 4,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "lr_dr": {
     "famille_libelle": "Les Républicains / Droite Républicaine",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 2,
     "contre": 0,
     "abstention": 0,
     "non_votant": 2
    },
    "macronistes": {
     "famille_libelle": "Macronistes (Renaissance / EPR)",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 1,
     "abstention": 26,
     "non_votant": 4
    },
    "modem": {
     "famille_libelle": "MoDem (Démocrates)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 1,
     "contre": 0,
     "abstention": 6,
     "non_votant": 0
    },
    "ps": {
     "famille_libelle": "Parti socialiste",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 62,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "rn": {
     "famille_libelle": "Rassemblement National",
     "position": "abstention",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 0,
     "abstention": 30,
     "non_votant": 0
    }
   }
  },
  "securite_ordre_public": {
   "scrutin_id": "VTANR5L17V8433",
   "confiance": "haute",
   "poids": 1.0,
   "familles": {
    "ecologistes": {
     "famille_libelle": "Écologistes",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 36,
     "abstention": 0,
     "non_votant": 0
    },
    "gdr": {
     "famille_libelle": "Gauche démocrate et républicaine (PCF et apparentés)",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 15,
     "abstention": 0,
     "non_votant": 0
    },
    "horizons": {
     "famille_libelle": "Horizons",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 32,
     "contre": 0,
     "abstention": 0,
     "non_votant": 1
    },
    "lfi": {
     "famille_libelle": "La France insoumise",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 71,
     "abstention": 0,
     "non_votant": 0
    },
    "liot": {
     "famille_libelle": "LIOT",
     "position": "pour",
     "cohesion_rice": 0.895,
     "pour": 18,
     "contre": 1,
     "abstention": 4,
     "non_votant": 0
    },
    "lr_dr": {
     "famille_libelle": "Les Républicains / Droite Républicaine",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 46,
     "contre": 0,
     "abstention": 1,
     "non_votant": 0
    },
    "macronistes": {
     "famille_libelle": "Macronistes (Renaissance / EPR)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 84,
     "contre": 0,
     "abstention": 0,
     "non_votant": 1
    },
    "modem": {
     "famille_libelle": "MoDem (Démocrates)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 33,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "ps": {
     "famille_libelle": "Parti socialiste",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 56,
     "abstention": 1,
     "non_votant": 0
    },
    "rn": {
     "famille_libelle": "Rassemblement National",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 114,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "udr": {
     "famille_libelle": "UDR (Ciotti)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 17,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    }
   }
  },
  "narcotrafic_retention": {
   "scrutin_id": "VTANR5L17V6318",
   "confiance": "haute",
   "poids": 1.0,
   "familles": {
    "ecologistes": {
     "famille_libelle": "Écologistes",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 36,
     "abstention": 0,
     "non_votant": 0
    },
    "gdr": {
     "famille_libelle": "Gauche démocrate et républicaine (PCF et apparentés)",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 15,
     "abstention": 1,
     "non_votant": 0
    },
    "horizons": {
     "famille_libelle": "Horizons",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 35,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "lfi": {
     "famille_libelle": "La France insoumise",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 67,
     "abstention": 0,
     "non_votant": 0
    },
    "liot": {
     "famille_libelle": "LIOT",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 11,
     "contre": 0,
     "abstention": 10,
     "non_votant": 0
    },
    "lr_dr": {
     "famille_libelle": "Les Républicains / Droite Républicaine",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 44,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "macronistes": {
     "famille_libelle": "Macronistes (Renaissance / EPR)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 80,
     "contre": 0,
     "abstention": 0,
     "non_votant": 1
    },
    "modem": {
     "famille_libelle": "MoDem (Démocrates)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 33,
     "contre": 0,
     "abstention": 2,
     "non_votant": 0
    },
    "ps": {
     "famille_libelle": "Parti socialiste",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 58,
     "abstention": 0,
     "non_votant": 0
    },
    "rn": {
     "famille_libelle": "Rassemblement National",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 117,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "udr": {
     "famille_libelle": "UDR (Ciotti)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 17,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    }
   }
  },
  "fraude_fiscale_sociale": {
   "scrutin_id": "VTANR5L17V6023",
   "confiance": "haute",
   "poids": 1.0,
   "familles": {
    "ecologistes": {
     "famille_libelle": "Écologistes",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 35,
     "abstention": 0,
     "non_votant": 0
    },
    "gdr": {
     "famille_libelle": "Gauche démocrate et républicaine (PCF et apparentés)",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 17,
     "abstention": 0,
     "non_votant": 0
    },
    "horizons": {
     "famille_libelle": "Horizons",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 32,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "lfi": {
     "famille_libelle": "La France insoumise",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 71,
     "abstention": 0,
     "non_votant": 0
    },
    "liot": {
     "famille_libelle": "LIOT",
     "position": "pour",
     "cohesion_rice": 0.857,
     "pour": 13,
     "contre": 1,
     "abstention": 8,
     "non_votant": 0
    },
    "lr_dr": {
     "famille_libelle": "Les Républicains / Droite Républicaine",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 48,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "macronistes": {
     "famille_libelle": "Macronistes (Renaissance / EPR)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 87,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "modem": {
     "famille_libelle": "MoDem (Démocrates)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 36,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "ps": {
     "famille_libelle": "Parti socialiste",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 69,
     "abstention": 0,
     "non_votant": 0
    },
    "rn": {
     "famille_libelle": "Rassemblement National",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 122,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "udr": {
     "famille_libelle": "UDR (Ciotti)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 17,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    }
   }
  },
  "budget_2025": {
   "scrutin_id": "VTANR5L17V438",
   "confiance": "haute",
   "poids": 1.0,
   "familles": {
    "ecologistes": {
     "famille_libelle": "Écologistes",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 37,
     "contre": 0,
     "abstention": 1,
     "non_votant": 0
    },
    "gdr": {
     "famille_libelle": "Gauche démocrate et républicaine (PCF et apparentés)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 17,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "horizons": {
     "famille_libelle": "Horizons",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 34,
     "abstention": 0,
     "non_votant": 0
    },
    "lfi": {
     "famille_libelle": "La France insoumise",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 71,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "liot": {
     "famille_libelle": "LIOT",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 12,
     "abstention": 11,
     "non_votant": 0
    },
    "lr_dr": {
     "famille_libelle": "Les Républicains / Droite Républicaine",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 47,
     "abstention": 0,
     "non_votant": 0
    },
    "macronistes": {
     "famille_libelle": "Macronistes (Renaissance / EPR)",
     "position": "contre",
     "cohesion_rice": 0.977,
     "pour": 1,
     "contre": 87,
     "abstention": 4,
     "non_votant": 1
    },
    "modem": {
     "famille_libelle": "MoDem (Démocrates)",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 36,
     "abstention": 0,
     "non_votant": 0
    },
    "ps": {
     "famille_libelle": "Parti socialiste",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 66,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "rn": {
     "famille_libelle": "Rassemblement National",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 125,
     "abstention": 0,
     "non_votant": 0
    }
   }
  },
  "montagne_territoires": {
   "scrutin_id": "VTANR5L17V8421",
   "confiance": "haute",
   "poids": 1.0,
   "familles": {
    "ecologistes": {
     "famille_libelle": "Écologistes",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 29,
     "abstention": 1,
     "non_votant": 0
    },
    "gdr": {
     "famille_libelle": "Gauche démocrate et républicaine (PCF et apparentés)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 14,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "horizons": {
     "famille_libelle": "Horizons",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 33,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "lfi": {
     "famille_libelle": "La France insoumise",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 63,
     "abstention": 0,
     "non_votant": 0
    },
    "liot": {
     "famille_libelle": "LIOT",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 19,
     "contre": 0,
     "abstention": 2,
     "non_votant": 0
    },
    "lr_dr": {
     "famille_libelle": "Les Républicains / Droite Républicaine",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 48,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "macronistes": {
     "famille_libelle": "Macronistes (Renaissance / EPR)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 66,
     "contre": 0,
     "abstention": 0,
     "non_votant": 1
    },
    "modem": {
     "famille_libelle": "MoDem (Démocrates)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 35,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "ps": {
     "famille_libelle": "Parti socialiste",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 42,
     "contre": 0,
     "abstention": 1,
     "non_votant": 0
    },
    "rn": {
     "famille_libelle": "Rassemblement National",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 97,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "udr": {
     "famille_libelle": "UDR (Ciotti)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 17,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    }
   }
  },
  "soutien_ukraine": {
   "scrutin_id": "VTANR5L17V988",
   "confiance": "moyenne",
   "poids": 0.7,
   "familles": {
    "ecologistes": {
     "famille_libelle": "Écologistes",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 34,
     "contre": 0,
     "abstention": 2,
     "non_votant": 0
    },
    "gdr": {
     "famille_libelle": "Gauche démocrate et républicaine (PCF et apparentés)",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 9,
     "abstention": 3,
     "non_votant": 0
    },
    "horizons": {
     "famille_libelle": "Horizons",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 33,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "lfi": {
     "famille_libelle": "La France insoumise",
     "position": "contre",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 45,
     "abstention": 0,
     "non_votant": 0
    },
    "liot": {
     "famille_libelle": "LIOT",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 23,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "lr_dr": {
     "famille_libelle": "Les Républicains / Droite Républicaine",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 28,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "macronistes": {
     "famille_libelle": "Macronistes (Renaissance / EPR)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 81,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "modem": {
     "famille_libelle": "MoDem (Démocrates)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 36,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "ps": {
     "famille_libelle": "Parti socialiste",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 46,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "rn": {
     "famille_libelle": "Rassemblement National",
     "position": "abstention",
     "cohesion_rice": 1.0,
     "pour": 0,
     "contre": 0,
     "abstention": 114,
     "non_votant": 0
    }
   }
  },
  "retraites_agricoles": {
   "scrutin_id": "VTANR5L17V7324",
   "confiance": "moyenne",
   "poids": 0.7,
   "familles": {
    "ecologistes": {
     "famille_libelle": "Écologistes",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 9,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "gdr": {
     "famille_libelle": "Gauche démocrate et républicaine (PCF et apparentés)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 8,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "horizons": {
     "famille_libelle": "Horizons",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 3,
     "contre": 0,
     "abstention": 3,
     "non_votant": 0
    },
    "lfi": {
     "famille_libelle": "La France insoumise",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 18,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "liot": {
     "famille_libelle": "LIOT",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 1,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "lr_dr": {
     "famille_libelle": "Les Républicains / Droite Républicaine",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 1,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "macronistes": {
     "famille_libelle": "Macronistes (Renaissance / EPR)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 7,
     "contre": 0,
     "abstention": 2,
     "non_votant": 1
    },
    "modem": {
     "famille_libelle": "MoDem (Démocrates)",
     "position": "pour",
     "cohesion_rice": 0.6,
     "pour": 4,
     "contre": 1,
     "abstention": 0,
     "non_votant": 0
    },
    "ps": {
     "famille_libelle": "Parti socialiste",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 8,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    },
    "rn": {
     "famille_libelle": "Rassemblement National",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 20,
     "contre": 0,
     "abstention": 0,
     "non_votant": 1
    },
    "udr": {
     "famille_libelle": "UDR (Ciotti)",
     "position": "pour",
     "cohesion_rice": 1.0,
     "pour": 3,
     "contre": 0,
     "abstention": 0,
     "non_votant": 0
    }
   }
  }
 },
 "partis": {
  "macronistes": {
   "nom": "EPR",
   "couleur": "#7B4591",
   "nom_long": "Ensemble pour la République",
   "representant": {
    "nom": "Gabriel Attal",
    "fonction": "Président du groupe Ensemble pour la République"
   },
   "description": "Groupe central de la majorité présidentielle sortante, héritier de Renaissance. Positionnement centriste libéral, réformes de l'offre économique.",
   "initiales": "EP"
  },
  "modem": {
   "nom": "Dem",
   "couleur": "#F07E26",
   "nom_long": "Les Démocrates (MoDem)",
   "representant": {
    "nom": "Marc Fesneau",
    "fonction": "Président du groupe Les Démocrates (MoDem)"
   },
   "description": "Allié centriste de la majorité présidentielle, historiquement proche de François Bayrou. Ligne européenne et centriste.",
   "initiales": "DE"
  },
  "horizons": {
   "nom": "HOR",
   "couleur": "#B5E2F9",
   "nom_long": "Horizons",
   "representant": {
    "nom": "Laurent Marcangeli",
    "fonction": "Président du groupe Horizons & Indépendants"
   },
   "description": "Parti centriste-droit fondé par Édouard Philippe, allié de la majorité présidentielle sortante.",
   "initiales": "HO"
  },
  "rn": {
   "nom": "RN",
   "couleur": "#313567",
   "nom_long": "Rassemblement National",
   "representant": {
    "nom": "Marine Le Pen",
    "fonction": "Présidente du groupe Rassemblement National"
   },
   "description": "Parti de droite nationaliste. Lignes fortes sur l'immigration et la sécurité, positions sociales parfois protectionnistes.",
   "initiales": "RN"
  },
  "lfi": {
   "nom": "LFI-NFP",
   "couleur": "#C00D0D",
   "nom_long": "La France insoumise",
   "representant": {
    "nom": "Mathilde Panot",
    "fonction": "Présidente du groupe La France insoumise"
   },
   "description": "Parti de gauche radicale. Lignes fortes sur la justice sociale et fiscale, rupture avec les politiques libérales.",
   "initiales": "LF"
  },
  "ps": {
   "nom": "SOC",
   "couleur": "#F5B4CE",
   "nom_long": "Parti socialiste",
   "representant": {
    "nom": "Boris Vallaud",
    "fonction": "Président du groupe Socialistes et apparentés"
   },
   "description": "Parti social-démocrate historique. Ligne réformiste de gauche, proche des questions sociales et européennes.",
   "initiales": "SO"
  },
  "ecologistes": {
   "nom": "EcoS",
   "couleur": "#77AA79",
   "nom_long": "Écologistes",
   "representant": {
    "nom": "Cyrielle Chatelain",
    "fonction": "Présidente du groupe Écologiste et social"
   },
   "description": "Parti écologiste. Priorité à la transition environnementale, ligne de gauche sur les sujets sociaux.",
   "initiales": "EC"
  },
  "gdr": {
   "nom": "GDR",
   "couleur": "#830E21",
   "nom_long": "Gauche démocrate et républicaine",
   "representant": {
    "nom": "André Chassaigne",
    "fonction": "Président du groupe GDR (PCF et apparentés)"
   },
   "description": "Groupe de la gauche communiste et apparentés. Ligne de gauche sur la fiscalité et les services publics.",
   "initiales": "GD"
  },
  "lr_dr": {
   "nom": "DR",
   "couleur": "#8CB0DC",
   "nom_long": "Droite Républicaine (ex-LR)",
   "representant": {
    "nom": "Laurent Wauquiez",
    "fonction": "Président du groupe Droite Républicaine"
   },
   "description": "Droite républicaine classique (ex-LR). Ligne libérale sur l'économie, conservatrice sur les sujets de société et de sécurité.",
   "initiales": "DR"
  },
  "liot": {
   "nom": "LIOT",
   "couleur": "#FFD96F",
   "nom_long": "LIOT",
   "representant": {
    "nom": "Stéphane Lenormand",
    "fonction": "Président du groupe LIOT"
   },
   "description": "Groupe centriste de territoires et d'indépendants, sans ligne partisane unique, souvent décisif sur des votes transversaux.",
   "initiales": "LI"
  },
  "udr": {
   "nom": "UDR",
   "couleur": "#3367A7",
   "nom_long": "UDR (Ciotti)",
   "representant": {
    "nom": "Éric Ciotti",
    "fonction": "Président du groupe UDR"
   },
   "description": "Groupe de droite nationale fondé par Éric Ciotti après sa rupture avec Les Républicains, proche du Rassemblement National.",
   "initiales": "UD"
  }
 }
};
