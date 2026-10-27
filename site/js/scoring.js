// Moteur de scoring — même logique que scripts/build_phase4.py (Python),
// recopiée en JS pur pour tourner côté client sans backend.
// accord() : à quel point la réponse de l'utilisateur colle à la position du parti.
function accord(reponseUtilisateur, positionParti) {
  if (reponseUtilisateur === 'sans_avis' || positionParti === 'abstention' || positionParti === 'indetermine') {
    return 0.5;
  }
  return reponseUtilisateur === positionParti ? 1 : 0;
}

// Lissage bayésien (cf. README § Méthodologie) : aucun parti ne disparaît du
// classement même s'il n'a pris position que sur peu de questions.
const K_PRIOR = 2.0;

// scorePartis(positions, reponses) -> tableau trié [ [familleId, {score, ...}], ... ]
function scorePartis(positions, reponses) {
  const totaux = {};
  const toutesFamilles = {};
  const nPosees = Object.keys(reponses).length;

  for (const [qid, reponseUser] of Object.entries(reponses)) {
    const posQuestion = positions[qid];
    if (!posQuestion) continue;
    const poidsQuestion = posQuestion.poids;

    for (const [fid, info] of Object.entries(posQuestion.familles)) {
      toutesFamilles[fid] = info.famille_libelle;
      const cohesion = info.cohesion_rice;
      if (cohesion === null || cohesion === undefined) continue; // vrai vide de données
      const a = accord(reponseUser, info.position);
      const poidsEffectif = poidsQuestion * cohesion;

      if (!totaux[fid]) totaux[fid] = { num: 0, denom: 0, detail: [] };
      totaux[fid].num += a * poidsEffectif;
      totaux[fid].denom += poidsEffectif;
      totaux[fid].detail.push({ qid, reponseUser, position: info.position, accord: a });
    }
  }

  const resultats = {};
  for (const [fid, libelle] of Object.entries(toutesFamilles)) {
    const t = totaux[fid] || { num: 0, denom: 0, detail: [] };
    const scoreLisse = (t.num + K_PRIOR * 0.5) / (t.denom + K_PRIOR);
    resultats[fid] = {
      libelle,
      score: scoreLisse,
      nEffectives: t.detail.length,
      nPosees,
      fiabilite: nPosees ? t.detail.length / nPosees : 0,
      detail: t.detail,
    };
  }

  return Object.entries(resultats).sort((a, b) => b[1].score - a[1].score);
}

// scorePersonnalites(personnalites, reponses) -> tableau trié [ [acteurId, {score, ...}], ... ]
// Même principe que scorePartis, mais la "position" est le vote individuel
// réel de la personne (pas une position de groupe pondérée par la cohésion) :
// chaque question connue pèse 1, chaque question sans donnée (indéterminée)
// est simplement ignorée au dénominateur plutôt que comptée comme désaccord.
function scorePersonnalites(personnalites, reponses) {
  const nPosees = Object.keys(reponses).length;
  const resultats = {};

  for (const [aid, perso] of Object.entries(personnalites)) {
    let num = 0, denom = 0;
    const detail = [];

    for (const [qid, reponseUser] of Object.entries(reponses)) {
      const position = perso.positions[qid];
      if (!position || position === 'indetermine') continue; // vrai vide de données
      const a = accord(reponseUser, position);
      num += a;
      denom += 1;
      detail.push({ qid, reponseUser, position, accord: a });
    }

    const scoreLisse = (num + K_PRIOR * 0.5) / (denom + K_PRIOR);
    resultats[aid] = {
      nom: perso.nom,
      fonction: perso.fonction,
      familleId: perso.famille_id,
      partiNom: perso.parti_nom,
      couleur: perso.couleur,
      initiales: perso.initiales,
      score: scoreLisse,
      nEffectives: detail.length,
      nPosees,
      fiabilite: nPosees ? detail.length / nPosees : 0,
      detail,
    };
  }

  return Object.entries(resultats).sort((a, b) => b[1].score - a[1].score);
}
