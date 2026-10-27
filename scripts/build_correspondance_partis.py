#!/usr/bin/env python3
"""
Table de correspondance entre groupes politiques des législatures XVI et XVII.

Pourquoi : le moteur de scoring (Phase 4) doit pouvoir dire "le camp macroniste
pense ça" en combinant des scrutins votés sous deux législatures différentes
(ex. question IVG/RSA = XVI, question retraites/immigration = XVII). Mais les
groupes n'ont pas le même organe_id, ni toujours le même nom, d'une législature
à l'autre (Renaissance -> Ensemble pour la République, LFI-NUPES -> LFI-NFP,
etc.), même quand la continuité politique est évidente.

Cette table associe chaque organe_id (table groupes_historiques) à un
famille_politique_id STABLE, indépendant de la législature. Le moteur de
scoring agrège toujours par famille_politique_id, jamais par organe_id brut,
dès qu'il compare des scrutins de législatures différentes.

Cas particuliers (voir colonne `note`) :
  - NI (non-inscrit) : regroupé par convention mais la famille 'ni' n'a AUCUNE
    cohérence politique interne (c'est une catégorie administrative, pas un
    parti) -> à exclure du scoring par défaut, comme PO0/PO830170.
  - UDR (Ciotti) : parti nouveau en XVII, pas de filiation directe dans les
    scrutins XVI -> famille propre 'udr', incluant son précurseur déduit
    PO847173 (voir groupes_historiques.confirme=0).
  - PO0 et PO830170 (artefacts/non identifiés) : famille 'inconnu', exclus par
    défaut du scoring (confirme=0 dans groupes_historiques).

Usage:
    python3 build_correspondance_partis.py --db data/quizz.db
"""
import argparse
import sqlite3
from pathlib import Path

# (organe_id, famille_politique_id, famille_libelle, note, exclu_scoring_defaut)
# Le 5e champ est explicite (et non plus déduit uniquement de famille_id) car
# un même famille_id peut mélanger un organe confirmé et un organe déduit
# (cas UDR : PO847173 est une déduction non officielle, PO872880 est le
# groupe réel reconnu — seul le second doit alimenter le score).
CORRESPONDANCE = [
    # --- Camp macroniste / centre présidentiel ---
    ("PO800538", "macronistes", "Macronistes (Renaissance / EPR)", "XVI: Renaissance (RE). XVII: Ensemble pour la République (EPR), ex-Renaissance renommé en oct. 2024.", 0),
    ("PO845407", "macronistes", "Macronistes (Renaissance / EPR)", "XVII: Ensemble pour la République, continuité directe de Renaissance (XVI).", 0),
    # --- MoDem ---
    ("PO800484", "modem", "MoDem (Démocrates)", "XVI: Démocrate (MoDem et Indépendants).", 0),
    ("PO845454", "modem", "MoDem (Démocrates)", "XVII: Les Démocrates, continuité directe du MoDem (XVI).", 0),
    # --- Horizons ---
    ("PO800514", "horizons", "Horizons", "XVI: Horizons et apparentés.", 0),
    ("PO845470", "horizons", "Horizons", "XVII: Horizons & Indépendants, continuité directe.", 0),
    # --- Rassemblement national ---
    ("PO800520", "rn", "Rassemblement National", "XVI.", 0),
    ("PO845401", "rn", "Rassemblement National", "XVII, continuité directe, même sigle.", 0),
    # --- LFI ---
    ("PO800490", "lfi", "La France insoumise", "XVI: LFI - NUPES (coalition NUPES, dissoute en 2024).", 0),
    ("PO845413", "lfi", "La France insoumise", "XVII: LFI - Nouveau Front Populaire (coalition NFP a remplacé NUPES).", 0),
    # --- Parti socialiste ---
    ("PO800496", "ps", "Parti socialiste", "XVI: Socialistes et apparentés (membre de l'intergroupe NUPES).", 0),
    ("PO845419", "ps", "Parti socialiste", "XVII: Socialistes et apparentés, continuité directe, sorti du cadre NUPES/NFP formel en tant que groupe.", 0),
    # --- Écologistes ---
    ("PO800526", "ecologistes", "Écologistes", "XVI: Écologiste - NUPES.", 0),
    ("PO845439", "ecologistes", "Écologistes", "XVII: Écologiste et Social (EcoS), continuité directe.", 0),
    # --- GDR (communistes et apparentés) ---
    ("PO800502", "gdr", "Gauche démocrate et républicaine (PCF et apparentés)", "XVI: GDR - NUPES.", 0),
    ("PO845514", "gdr", "Gauche démocrate et républicaine (PCF et apparentés)", "XVII: GDR, continuité directe.", 0),
    # --- LR / DR ---
    ("PO800508", "lr_dr", "Les Républicains / Droite Républicaine", "XVI: Les Républicains (LR).", 0),
    ("PO845425", "lr_dr", "Les Républicains / Droite Républicaine", "XVII: Droite Républicaine (DR), ex-LR renommé après la scission Ciotti (2024). Continuité de l'essentiel des députés LR non partis avec Ciotti.", 0),
    # --- LIOT ---
    ("PO800532", "liot", "LIOT", "XVI.", 0),
    ("PO845485", "liot", "LIOT", "XVII, continuité directe, même sigle.", 0),
    # --- UDR (Ciotti) : pas de filiation XVI, parti né de la scission LR en 2024 ---
    ("PO847173", "udr", "UDR (Ciotti)", "XVII uniquement. Groupe DÉDUIT par mes soins (non confirmé officiellement, confirme=0 dans groupes_historiques) précédant la reconnaissance formelle de l'UDR mi-2025. CORRECTION : exclu du scoring par défaut — une déduction non officielle ne doit pas alimenter silencieusement le score du 'vrai' UDR. Reste rattaché à famille_id='udr' pour la documentation/l'affichage historique, mais exclu_scoring_defaut=1.", 1),
    ("PO872880", "udr", "UDR (Ciotti)", "XVII uniquement, reconnaissance officielle du groupe mi-2025 (confirme=1). Pas d'équivalent en XVI (parti créé après la scission LR de 2024). Seul organe de la famille 'udr' qui alimente le score.", 0),
    # --- Non-inscrits : regroupés par convention, PAS une famille politique cohérente ---
    ("PO793087", "ni", "Non-inscrits", "Catégorie administrative (députés sans groupe), PAS un parti : positions très hétérogènes. À exclure du scoring de proximité par défaut.", 1),
    ("PO840056", "ni", "Non-inscrits", "Idem XVII.", 1),
    # --- Non identifiés / artefacts : exclure du scoring ---
    ("PO830170", "inconnu", "Non identifié", "31 députés distincts, aucune correspondance officielle trouvée (XVI). confirme=0 dans groupes_historiques -> exclu par défaut.", 1),
    ("PO0", "inconnu", "Non identifié", "Artefact technique probable du dataset (XVII). confirme=0 -> exclu par défaut.", 1),
]


def build(conn: sqlite3.Connection):
    conn.executescript(
        """
        DROP TABLE IF EXISTS familles_politiques;
        CREATE TABLE familles_politiques (
            organe_id            TEXT PRIMARY KEY,
            famille_id           TEXT NOT NULL,
            famille_libelle      TEXT NOT NULL,
            note                 TEXT,
            exclu_scoring_defaut  INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (organe_id) REFERENCES groupes_historiques(organe_id)
        );
        CREATE INDEX idx_familles_famille_id ON familles_politiques(famille_id);
        """
    )
    for organe_id, famille_id, famille_libelle, note, exclu in CORRESPONDANCE:
        conn.execute(
            "INSERT INTO familles_politiques VALUES (?,?,?,?,?)",
            (organe_id, famille_id, famille_libelle, note, exclu),
        )
    conn.commit()


def audit(conn: sqlite3.Connection):
    c = conn.cursor()
    c.execute("SELECT organe_id, libelle_abrege FROM groupes_historiques")
    tous = {r[0]: r[1] for r in c.fetchall()}
    c.execute("SELECT organe_id FROM familles_politiques")
    couverts = {r[0] for r in c.fetchall()}
    manquants = set(tous) - couverts
    if manquants:
        print("ATTENTION — organe_id de groupes_historiques sans correspondance :")
        for oid in manquants:
            print(f"  {oid} ({tous[oid]})")
    else:
        print("OK : tous les organe_id de groupes_historiques ont une correspondance.")

    print()
    c.execute(
        """SELECT famille_id, famille_libelle, organe_id, exclu_scoring_defaut
           FROM familles_politiques ORDER BY famille_id, organe_id"""
    )
    par_famille = {}
    for famille_id, lib, organe_id, exclu in c.fetchall():
        par_famille.setdefault((famille_id, lib), []).append((organe_id, exclu))
    for (famille_id, lib), organes in par_famille.items():
        tous_exclus = all(e for _, e in organes)
        tag = " [TOUS LES ORGANES EXCLUS DU SCORING]" if tous_exclus else ""
        print(f"{famille_id:<14} {lib}{tag}")
        for organe_id, exclu in organes:
            marque = " (exclu du scoring)" if exclu else ""
            print(f"   {organe_id}{marque}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", required=True, type=Path)
    args = ap.parse_args()
    conn = sqlite3.connect(args.db)
    build(conn)
    audit(conn)
    conn.close()


if __name__ == "__main__":
    main()
