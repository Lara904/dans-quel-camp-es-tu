#!/usr/bin/env bash
# Télécharge les données ouvertes officielles de l'Assemblée nationale
# (data.assemblee-nationale.fr, Licence Ouverte / Open Licence 2.0) nécessaires
# pour reconstruire data/quizz.db. Ces archives pèsent plusieurs centaines de Mo
# au total : volontairement NON versionnées dans ce dépôt (voir .gitignore).
# Les commandes de reconstruction (README.md § Reconstruire la base) supposent
# exactement l'arborescence que ce script produit.
#
# Usage : bash scripts/download_data.sh
set -euo pipefail

RAW_DIR="data_raw"
mkdir -p "$RAW_DIR/17" "$RAW_DIR/16"

echo "== Législature XVII (2024-2026, en cours) =="

echo "-- Scrutins --"
curl -fSL "https://data.assemblee-nationale.fr/static/openData/repository/17/loi/scrutins/Scrutins.json.zip" \
  -o "$RAW_DIR/17/scrutins.zip"
unzip -oq "$RAW_DIR/17/scrutins.zip" -d "$RAW_DIR/17/scrutins"
# -> fichiers réels dans $RAW_DIR/17/scrutins/json/*.json

echo "-- Acteurs/mandats/organes divisés (AMO50 — état civil uniquement) --"
curl -fSL "https://data.assemblee-nationale.fr/static/openData/repository/17/amo/acteurs_mandats_organes_divises/AMO50_acteurs_mandats_organes_divises.json.zip" \
  -o "$RAW_DIR/17/amo50.zip"
unzip -oq "$RAW_DIR/17/amo50.zip" -d "$RAW_DIR/17/amo50"
# -> fichiers réels dans $RAW_DIR/17/amo50/acteur/*.json et $RAW_DIR/17/amo50/organe/*.json
# ATTENTION : l'appartenance aux groupes (GP) de ce dataset est cassée pour la
# législature XVII (tous les députés y apparaissent comme non-inscrits) — ne
# JAMAIS l'utiliser comme source de groupe, seulement comme état civil.

echo "-- Députés actifs + mandats actifs + organes (AMO10 — groupes réels XVII) --"
curl -fSL "https://data.assemblee-nationale.fr/static/openData/repository/17/amo/deputes_actifs_mandats_actifs_organes/AMO10_deputes_actifs_mandats_actifs_organes.json.zip" \
  -o "$RAW_DIR/17/amo10.zip"
unzip -oq "$RAW_DIR/17/amo10.zip" -d "$RAW_DIR/17/amo10"
# -> fichiers réels dans $RAW_DIR/17/amo10/json/acteur/*.json et .../json/organe/*.json

echo "== Législature XVI (2022-2024, dissoute — archive figée) =="

echo "-- Scrutins --"
curl -fSL "https://data.assemblee-nationale.fr/static/openData/repository/16/loi/scrutins/Scrutins.json.zip" \
  -o "$RAW_DIR/16/scrutins.zip"
unzip -oq "$RAW_DIR/16/scrutins.zip" -d "$RAW_DIR/16/scrutins"
# -> fichiers réels dans $RAW_DIR/16/scrutins/json/*.json

echo "-- Acteurs/mandats/organes divisés (AMO50 — seul dataset complet pour la XVI archivée) --"
# NB développement : curl s'est montré instable sur CE fichier précis (coupures
# récurrentes en plein transfert, probablement lié à sa taille ~16 Mo). wget a
# réussi du premier coup là où curl échouait de façon répétée. On tente curl
# avec retries, puis on retombe sur wget.
curl -fSL --retry 5 --retry-delay 3 \
  "https://data.assemblee-nationale.fr/static/openData/repository/16/amo/acteurs_mandats_organes_divises/AMO50_acteurs_mandats_organes_divises.json.zip" \
  -o "$RAW_DIR/16/amo50.zip" || \
wget -q -O "$RAW_DIR/16/amo50.zip" \
  "https://data.assemblee-nationale.fr/static/openData/repository/16/amo/acteurs_mandats_organes_divises/AMO50_acteurs_mandats_organes_divises.json.zip"
unzip -oq "$RAW_DIR/16/amo50.zip" -d "$RAW_DIR/16/amo50"
# -> fichiers réels dans $RAW_DIR/16/amo50/acteur/*.json, .../organe/*.json, .../mandat/*.json
# (contrairement à la XVII, c'est ICI la bonne source pour les groupes de la XVI :
#  l'archive figée à la dissolution n'a plus de dataset "actifs" exploitable.)

echo "Terminé. Données brutes dans $RAW_DIR/ (ignoré par git)."
echo "Prochaine étape : voir README.md § Reconstruire la base."
