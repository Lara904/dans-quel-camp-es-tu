// Logique de la page quiz.html : affiche une question à la fois, enregistre
// les réponses en mémoire + sessionStorage, redirige vers resultats.html à la fin.

const Q = window.QUIZ_DATA.questions;
let idx = 0;

// Mode choisi sur l'accueil (?mode=perso), mémorisé pour la page résultats.
// S'il n'est pas dans l'URL (ex. retour en arrière), on garde le mode déjà
// mémorisé plutôt que de forcer 'parti'.
const modeUrl = new URLSearchParams(window.location.search).get('mode');
const mode = modeUrl || chargerMode();
sauvegarderMode(mode);

const reponses = chargerReponses() || {};

function renderQuestion() {
  const q = Q[idx];
  document.getElementById('q-text').textContent = q.texte_court;
  document.getElementById('q-sub').textContent = q.texte;
  document.getElementById('progress-text').textContent = `Question ${idx + 1} / ${Q.length}`;
  document.getElementById('progress-pct').textContent = Math.round((idx) / Q.length * 100) + '%';
  document.getElementById('progress-fill').style.width = (idx / Q.length * 100) + '%';

  const detail = document.getElementById('scrutin-detail');
  detail.innerHTML = `
    <div><span class="k">Scrutin :</span> ${q.titre_complet}</div>
    <div style="margin-top:6px"><span class="k">Date :</span> ${q.date} — <span class="k">Résultat :</span> ${q.resultat}</div>
    ${q.note ? `<div style="margin-top:6px">${q.note}</div>` : ''}
    <div class="mono" style="margin-top:6px; opacity:.6; font-size:11px">${q.scrutin_id}</div>
  `;
  document.querySelector('.scrutin-ref').open = false;

  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.classList.toggle('active', reponses[q.id] === btn.dataset.v);
  });
  document.getElementById('btn-prev').disabled = idx === 0;
  document.getElementById('btn-next').disabled = !reponses[q.id];
  document.getElementById('btn-next').textContent = idx === Q.length - 1 ? 'Voir mon camp →' : 'Suivant →';
}

document.querySelectorAll('.choice-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    reponses[Q[idx].id] = btn.dataset.v;
    sauvegarderReponses(reponses);
    renderQuestion();
  });
});

document.getElementById('btn-prev').addEventListener('click', () => {
  if (idx > 0) { idx--; renderQuestion(); }
});
document.getElementById('btn-next').addEventListener('click', () => {
  if (idx < Q.length - 1) { idx++; renderQuestion(); }
  else { window.location.href = 'resultats.html'; }
});

renderQuestion();
