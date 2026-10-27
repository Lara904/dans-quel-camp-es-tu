// Logique de la page resultats.html : calcule le classement, affiche le
// top 3 sous forme de cercles de pourcentage + représentant + description,
// le classement complet en détail repliable, et gère le partage.

const reponses = chargerReponses();

if (!reponses || Object.keys(reponses).length === 0) {
  window.location.href = 'quiz.html';
} else {
  const Q = window.QUIZ_DATA.questions;
  const PARTIS = window.QUIZ_DATA.partis;
  const classement = scorePartis(window.QUIZ_DATA.positions, reponses);
  const nRepondu = Object.values(reponses).filter(v => v !== 'sans_avis').length;

  document.getElementById('resultats-sub').textContent =
    `D'après tes ${nRepondu} réponses tranchées sur ${Q.length} questions, voici les 3 partis dont les votes à l'Assemblée se rapprochent le plus des tiens.`;

  // --- Cercle de pourcentage en SVG ---
  function donutSvg(pct, couleur) {
    const r = 32, cx = 38, cy = 38, stroke = 7;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - pct / 100);
    return `
      <svg viewBox="0 0 76 76">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--rule)" stroke-width="${stroke}"></circle>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${couleur}" stroke-width="${stroke}"
          stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${offset}"></circle>
      </svg>
    `;
  }

  function voteDetailHtml(detail) {
    return detail.map(d => {
      const q = Q.find(x => x.id === d.qid);
      const cls = d.accord === 1 ? 'yes' : (d.accord === 0 ? 'no' : 'mid');
      const label = d.accord === 1 ? 'accord' : (d.accord === 0 ? 'désaccord' : 'neutre');
      return `<div class="vote-line"><span class="q-txt">${q ? q.texte_court : d.qid}</span><span class="tag-accord ${cls}">${label}</span></div>`;
    }).join('') || '<p style="color:var(--ink-soft);font-size:13px">Pas assez de données pour le détail.</p>';
  }

  // --- Top 3 ---
  const top3El = document.getElementById('top3');
  const top3 = classement.slice(0, 3);
  top3.forEach(([fid, r], i) => {
    const parti = PARTIS[fid] || { nom_long: r.libelle, couleur: '#888', initiales: '??' };
    const pct = Math.round(r.score * 100);
    const card = document.createElement('div');
    card.className = 'parti-card rank-' + (i + 1);
    card.innerHTML = `
      <span class="rank-badge">#${i + 1}</span>
      <div class="parti-card-top">
        <div class="donut-wrap" style="color:${parti.couleur}">
          ${donutSvg(pct, parti.couleur)}
          <div class="donut-pct">${pct}%</div>
        </div>
        <div class="parti-card-id">
          <div class="nom">${parti.nom_long}</div>
          <div class="fiab">Basé sur ${r.nEffectives}/${r.nPosees} questions avec position connue</div>
        </div>
      </div>
      <p class="desc">${parti.description}</p>
      <div class="representant">
        <div class="avatar-init" style="background:${parti.couleur}">${parti.initiales}</div>
        <div class="representant-id">
          <div class="nom">${parti.representant.nom}</div>
          <div class="fonction">${parti.representant.fonction}</div>
        </div>
      </div>
      <details>
        <summary>Voir le détail question par question</summary>
        <div>${voteDetailHtml(r.detail)}</div>
      </details>
    `;
    top3El.appendChild(card);
  });

  // --- Classement complet ---
  const fullList = document.getElementById('classement-complet-list');
  classement.forEach(([fid, r]) => {
    const parti = PARTIS[fid] || { nom_long: r.libelle, couleur: '#888' };
    const pct = Math.round(r.score * 100);
    const row = document.createElement('div');
    row.className = 'classement-row';
    row.innerHTML = `
      <span class="swatch" style="background:${parti.couleur}"></span>
      <span class="nom">${parti.nom_long}</span>
      <span class="score mono">${pct}%</span>
    `;
    fullList.appendChild(row);
  });

  // --- Partage ---
  const topParti = PARTIS[top3[0][0]];
  const topPct = Math.round(top3[0][1].score * 100);
  const shareText = `J'ai fait le quiz "Dans quel camp es-tu ?" (basé sur les votes réels de l'Assemblée nationale) : je corresponds à ${topPct}% à ${topParti.nom_long}. Fais le test toi aussi :`;
  const shareUrl = window.location.origin + window.location.pathname.replace('resultats.html', 'index.html');

  document.getElementById('btn-share').addEventListener('click', async () => {
    const feedback = document.getElementById('share-feedback');
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Dans quel camp es-tu ?', text: shareText, url: shareUrl });
      } catch (e) { /* annulé par l'utilisateur, rien à faire */ }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        feedback.textContent = 'Lien et résultat copiés — colle-les où tu veux !';
      } catch (e) {
        feedback.textContent = shareUrl;
      }
    }
  });

  document.getElementById('btn-restart').addEventListener('click', () => {
    try { sessionStorage.removeItem('camp_reponses_v1'); } catch (e) {}
    window.location.href = 'quiz.html';
  });
}
