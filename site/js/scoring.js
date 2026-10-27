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
