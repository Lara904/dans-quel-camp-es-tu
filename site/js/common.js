// Header/footer réutilisables (sans framework) + petits helpers partagés par
// toutes les pages du site. Chaque page inclut une balise <div id="site-header">
// et <div id="site-footer"> vides, remplies ici au chargement.

const STORAGE_KEY = 'camp_reponses_v1';

function renderHeader(activePage) {
  const el = document.getElementById('site-header');
  if (!el) return;
  el.innerHTML = `
    <div class="site-header-inner">
      <a class="brand" href="index.html">
        <span class="brand-mark" aria-hidden="true">⌘</span>
        <span>Dans quel camp es-tu ?</span>
      </a>
      <nav class="site-nav">
        <a href="index.html" class="${activePage === 'index' ? 'active' : ''}">Accueil</a>
        <a href="quiz.html" class="${activePage === 'quiz' ? 'active' : ''}">Le quiz</a>
      </nav>
    </div>
  `;
}

function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
    <div class="site-footer-inner">
      <p>Basé sur les votes réels de l'Assemblée nationale (XVIe et XVIIe législatures, 2022–2026) — données ouvertes
        <a href="https://data.assemblee-nationale.fr" target="_blank" rel="noopener">data.assemblee-nationale.fr</a>.
        Ce n'est pas une recommandation de vote.</p>
      <p><a href="https://github.com/Lara904/dans-quel-camp-es-tu" target="_blank" rel="noopener">Code source sur GitHub</a></p>
    </div>
  `;
}

function sauvegarderReponses(reponses) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(reponses)); } catch (e) { /* stockage indisponible, on continue sans */ }
}

function chargerReponses() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderFooter();
});
