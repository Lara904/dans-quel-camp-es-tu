# Dans quel camp es-tu ?

Un quiz politique qui te dit quel parti vote le plus souvent comme toi à
l'Assemblée nationale — en se basant sur des votes réels, pas sur des
promesses.

**Démo** : [ajoute ici le lien Netlify une fois déployé]

## L'idée

La plupart des tests politiques comparent tes opinions aux programmes des
partis ou à des citations de leurs responsables. Le problème : un programme,
ça ne coûte rien à écrire, et ça ne dit pas ce qu'un parti fait vraiment une
fois à l'Assemblée.

Ici, le principe est différent : **on compare tes opinions aux votes
réellement enregistrés des député·es**. Chaque question du quiz ("faut-il
taxer davantage les très hauts patrimoines ?", "faut-il durcir les
conditions d'accès au RSA ?"...) correspond à un vrai scrutin qui a eu lieu à
l'Assemblée nationale entre 2022 et 2026. Pas une interprétation, pas un
résumé vague : le texte de loi exact, la date, le résultat du vote, et pour
les sujets sensibles, une source de presse qui confirme que le texte fait
bien ce que la question dit.

À la fin, le quiz te montre quel parti a voté le plus souvent dans le même
sens que toi — et à quel point ce parti lui-même était uni ou divisé sur
chaque sujet.

## Comment c'est fait, en bref

Le projet a trois couches :

1. **Les données brutes** : l'Assemblée nationale publie en ligne, en accès
   libre, le détail de chaque vote (qui a voté quoi, dans quel groupe) pour
   chaque législature. Un script télécharge ces fichiers officiels et les
   range dans une base de données (SQLite) : environ 13 000 scrutins et
   1,9 million de votes individuels au total, sur les deux dernières
   législatures (2022-2024 et 2024-2026).

2. **La sélection des 17 questions** : parmi ces milliers de votes, il a
   fallu trouver, pour chaque sujet de société (retraites, immigration,
   fiscalité...), LE vote qui y correspond vraiment — pas un amendement
   technique sans rapport, pas un vote dont le texte a été vidé de son
   contenu en commission avant d'être adopté. Chaque question a été vérifiée
   à la main contre le texte de loi réel et, pour les cas délicats, contre un
   article de presse indépendant. Plusieurs erreurs ont été repérées et
   corrigées pendant ce travail (un identifiant de vote qui pointait vers le
   mauvais texte, un résultat noté "adopté" alors qu'il avait été rejeté...) —
   le détail est noté honnêtement dans `data/questions_scrutins.json`.

3. **Le calcul du score** : pour chaque parti, on regarde comment la majorité
   de ses député·es a voté sur chaque scrutin retenu, et à quel point le
   groupe était uni ou divisé ce jour-là (un parti coupé en deux sur un sujet
   ne peut pas "prendre crédit" de ce sujet dans son score). Le score final
   de chaque parti est une moyenne pondérée de tes réponses face à ces
   positions réelles — la formule complète est détaillée plus bas.

Le site final (`site/index.html`) est une page web unique, autonome, qui
contient directement les 17 questions et les positions calculées des partis.
Pas de serveur, pas de base de données en ligne : tout le calcul se fait
dans le navigateur de la personne qui fait le quiz.

## Structure du dépôt

```
site/                   Le site à déployer (Netlify, ou n'importe quel hébergeur statique)
  index.html            Page unique, autonome (HTML/CSS/JS inline, données du quiz embarquées)

data/                   Données finales du quiz (légères, versionnées)
  questions_scrutins.json   Les 17 questions + le scrutin réel associé à chacune, avec sources
  positions_partis.json     Position + cohésion de chaque parti sur chaque question

scripts/                Pipeline de données (Python 3, bibliothèque standard uniquement)
  download_data.sh            Télécharge les données ouvertes officielles de l'Assemblée nationale
  build_db.py                  Ingestion législature XVII (2024-2026)
  build_db_l16.py              Ingestion législature XVI (2022-2024)
  build_phase2.py              Cohésion de groupe (indice de Rice) + groupes historiques
  build_phase3.py              Aide à la sélection automatique de scrutins candidats (outil de travail, pas la source finale)
  build_correspondance_partis.py  Fait correspondre les groupes d'une législature à l'autre
  build_phase4.py              Moteur de scoring (génère positions_partis.json)

netlify.toml             Config Netlify (publie site/)
.gitignore
```

`data/quizz.db` (la base SQLite complète, ~280 Mo, 1,9M+ votes individuels)
et les données brutes téléchargées (~300-600 Mo) ne sont **pas** versionnées
dans ce dépôt — trop lourd pour git, et entièrement régénérable. Le site n'en
a de toute façon pas besoin : `site/index.html` embarque directement les
données finales (~85 Ko au total), c'est tout ce qu'il faut pour le faire
tourner.

## Déployer sur Netlify

Le site est 100% statique, un seul fichier HTML autonome, aucune dépendance
serveur.

**Option A — via l'interface Netlify (le plus simple)**
1. Pousse ce dépôt sur ton GitHub (déjà fait si tu lis ça depuis le repo).
2. Sur [app.netlify.com](https://app.netlify.com) → *Add new site* → *Import an existing project* → connecte ton GitHub → choisis ce dépôt.
3. Netlify détecte `netlify.toml` automatiquement (dossier à publier = `site`). Aucune commande de build n'est nécessaire — clique *Deploy*.

**Option B — en ligne de commande**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=site
```

Aucune variable d'environnement, aucune base de données, aucune fonction
serverless n'est nécessaire : tout tourne côté navigateur.

## Reconstruire la base (optionnel — pour modifier/étendre le quiz)

Nécessaire seulement si tu veux changer les questions, ajouter des scrutins,
ou vérifier les données toi-même. Pas nécessaire pour déployer le site tel
quel.

Prérequis : Python 3 (bibliothèque standard uniquement, aucun `pip install`),
`curl`, `unzip`, et `wget` en secours (voir la note dans le script — `curl`
s'est montré ponctuellement instable sur un gros fichier précis pendant le
développement, `wget` a réussi là où il échouait).

```bash
# 1. Télécharge les données ouvertes officielles (data.assemblee-nationale.fr)
bash scripts/download_data.sh

# 2. Législature XVII (2024-2026, en cours)
python3 scripts/build_db.py \
  --scrutins-dir data_raw/17/scrutins/json \
  --acteurs-dir  data_raw/17/amo50 \
  --actifs-dir   data_raw/17/amo10/json \
  --legislature 17 \
  --out data/quizz.db

# 3. Législature XVI (2022-2024, dissoute) — ajoutée dans la MÊME base
python3 scripts/build_db_l16.py \
  --db data/quizz.db \
  --scrutins-dir data_raw/16/scrutins/json \
  --acteurs-dir  data_raw/16/amo50/acteur \
  --organes-dir  data_raw/16/amo50/organe \
  --mandats-dir  data_raw/16/amo50/mandat

# 4. Cohésion de groupe + groupes historiques (recalcule sur les DEUX législatures)
python3 scripts/build_phase2.py --db data/quizz.db

# 5. Fait correspondre les groupes des deux législatures entre eux
python3 scripts/build_correspondance_partis.py --db data/quizz.db

# 6. Moteur de scoring -> régénère data/positions_partis.json à partir de
#    data/questions_scrutins.json (modifie ce fichier si tu ajoutes/changes
#    des questions, puis relance cette commande)
python3 scripts/build_phase4.py \
  --db data/quizz.db \
  --questions data/questions_scrutins.json \
  --out data/positions_partis.json

# 7. Répercute le changement dans le site : recopier le contenu de
#    data/questions_scrutins.json et data/positions_partis.json dans la
#    section `const DATA = {...}` du JS embarqué dans site/index.html
```

`scripts/build_phase3.py` propose automatiquement des scrutins candidats par
thème (mots-clés + score de polarisation) — c'est un outil d'aide à la
décision, pas la source finale. Les 17 questions actuelles ont été
sélectionnées et vérifiées une par une à la main (voir § Méthodologie).

## Méthodologie

**Sélection des questions.** On part de sujets de société concrets
(avortement, chômage, impôts, immigration...), puis on cherche le scrutin
réel qui y répond — plutôt que l'inverse (partir des scrutins et en déduire
des thèmes, qui donne des questions mal définies). Priorité aux votes sur
l'**ensemble** d'un texte, plus faciles à interpréter sans ambiguïté qu'un
amendement isolé. Chaque question a été vérifiée contre le contenu réel du
texte (pas seulement son titre), avec au moins une source indépendante pour
les sujets délicats — voir le champ `sources` de chaque entrée dans
`data/questions_scrutins.json`.

**Cohésion de groupe — indice de Rice.**
```
cohesion(groupe, scrutin) = |pour − contre| / (pour + contre)
```
(abstentions exclues de ce calcul précis). 1 = vote unanime du groupe, 0 =
groupe coupé exactement en deux.

**L'abstention compte comme une vraie position.** Un groupe qui s'abstient
à l'unanimité (par exemple le RN sur une résolution de soutien à l'Ukraine)
exprime une vraie position politique — ni pour, ni contre — qui doit compter
dans le score, pas être traitée comme une case vide. Elle rapporte un accord
de 0,5 avec l'utilisateur, avec un poids plein. Seul le cas où il n'existe
vraiment aucun vote exploitable (que des député·es absent·es ce jour-là) est
ignoré.

**Faire correspondre les groupes d'une législature à l'autre.** Certains
partis ont changé de nom entre 2022-2024 et 2024-2026 sans changement de
fond (Renaissance → Ensemble pour la République, LFI-NUPES → LFI-NFP...). Un
script dédié les relie sous un identifiant stable pour que leur historique
de vote compte comme celui d'un seul et même parti. Les député·es non
inscrit·es et les groupes non identifiables dans les données sont exclus du
score par défaut : ce ne sont pas des partis cohérents, les compter aurait
faussé le résultat.

**Le calcul du score.**
```
Score(parti) = [Σ(accord × poids × cohésion) + K×0,5] / [Σ(poids × cohésion) + K]
```
- `accord` vaut 1 si ta réponse correspond à la position du parti, 0 si elle
  s'y oppose, 0,5 si c'est neutre (parti abstentionniste, ou toi "sans
  avis").
- `poids` vaut 1,0 pour un scrutin bien vérifié, 0,7 pour un scrutin où le
  contenu est un peu moins certain (champ `confiance` dans les données).
- `K` est un terme de lissage statistique : un parti qui n'a pris position
  que sur une partie des questions voit son score ramené vers 0,5
  proportionnellement à ce qui manque, au lieu d'être jugé sur un trop petit
  nombre de votes ou de disparaître purement et simplement du classement.

## Limites connues (assumées, pas cachées)

- **IVG** : la question sur la constitutionnalisation de l'IVG distingue peu
  les partis — quasi-consensus à l'Assemblée (493 voix pour, 30 contre), le
  vrai clivage est interne au RN et à LR plutôt qu'entre partis.
- **Réforme des retraites** : le scrutin retenu pour "faut-il abroger la
  réforme de 2023 ?" est une proposition de résolution, donc une prise de
  position politique sans effet de loi — signalé explicitement dans la
  question.
- **RSA / SMIC** : aucun scrutin exploitable trouvé pour une revalorisation
  générale du SMIC (il est fixé par décret automatique, jamais voté). La
  conditionnalité du RSA, elle, est bien couverte (loi "plein emploi", 2023).
- Seuls les scrutins publics (votes nominaux enregistrés) sont couverts —
  une limite du jeu de données officiel, pas du projet : les votes à main
  levée ne sont tout simplement pas publiés individuellement.

Le détail complet des sujets absents et des corrections faites en cours de
route est documenté dans le champ `_meta` de `data/questions_scrutins.json`.

## Sources des données

[data.assemblee-nationale.fr](https://data.assemblee-nationale.fr) — données
ouvertes officielles de l'Assemblée nationale, Licence Ouverte / Open Licence
2.0. Vérifications complémentaires via LCP, Public Sénat, Le Club des
Juristes, datan.fr et les textes législatifs officiels (sources précises
données question par question dans `data/questions_scrutins.json`).

## État du projet

- [x] Collecte et nettoyage des données (législatures XVI et XVII)
- [x] Indice de cohésion de groupe
- [x] Sélection et vérification des 17 questions
- [x] Moteur de scoring (correspondance des partis, lissage statistique, gestion de l'abstention)
- [x] Quiz fonctionnel (site statique)
- [ ] Finitions produit (partage de résultat, page d'accueil enrichie, etc.)
