// Issue #35 — Search Performance Optimization
// Improvements: debounce (300ms), multi-field search, difficulty filter,
// sort controls, result highlighting, loading state, lazy img rendering,
// skeleton cards, and accessible ARIA live region updates.

let allTrails = [];
let activeQuery = '';
let activeDifficulty = 'All';
let activeSort = 'default';

// ── Data Load ────────────────────────────────────────────────────────────────

showSkeletons(6);

fetch('data/trails.json')
  .then(r => { if (!r.ok) throw new Error('Network response was not ok'); return r.json(); })
  .then(data => {
    allTrails = data;
    applyFilters();
  })
  .catch(() => {
    document.getElementById('trail-results').innerHTML =
      '<p class="no-results error-msg">⚠️ Unable to load trails. Please try again later.</p>';
  });

// ── Debounce ─────────────────────────────────────────────────────────────────

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ── Filter + Sort ─────────────────────────────────────────────────────────────

function filterTrails(query, difficulty) {
  let results = allTrails;

  // Difficulty filter
  if (difficulty && difficulty !== 'All') {
    results = results.filter(t => t.difficulty === difficulty);
  }

  // Text search: name, location, trail_type, difficulty
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      t.trail_type.toLowerCase().includes(q) ||
      t.difficulty.toLowerCase().includes(q)
    );
  }

  return results;
}

function sortTrails(trails, sortKey) {
  const copy = [...trails];
  switch (sortKey) {
    case 'distance-asc':   return copy.sort((a, b) => a.distance_mi - b.distance_mi);
    case 'distance-desc':  return copy.sort((a, b) => b.distance_mi - a.distance_mi);
    case 'elevation-asc':  return copy.sort((a, b) => a.elevation_gain_ft - b.elevation_gain_ft);
    case 'elevation-desc': return copy.sort((a, b) => b.elevation_gain_ft - a.elevation_gain_ft);
    case 'name-asc':       return copy.sort((a, b) => a.name.localeCompare(b.name));
    default:               return copy; // preserve JSON order
  }
}

function applyFilters() {
  const filtered = filterTrails(activeQuery, activeDifficulty);
  const sorted   = sortTrails(filtered, activeSort);
  renderTrails(sorted, activeQuery);
}

// ── Difficulty Badges ─────────────────────────────────────────────────────────

function difficultyInfo(level) {
  const map = {
    'Easy':     { cls: 'badge-easy',     icon: '🟢' },
    'Moderate': { cls: 'badge-moderate', icon: '🟡' },
    'Hard':     { cls: 'badge-hard',     icon: '🔴' },
  };
  return map[level] || { cls: '', icon: '' };
}

// ── Highlight matching text ───────────────────────────────────────────────────

function highlight(text, query) {
  if (!query) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const re = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return escaped.replace(re, '<mark>$1</mark>');
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── Skeleton Loader ───────────────────────────────────────────────────────────

function showSkeletons(n) {
  const container = document.getElementById('trail-results');
  container.innerHTML = `<div class="trail-grid">
    ${Array.from({length: n}).map(() => `
      <div class="trail-card skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="trail-card-body">
          <div class="skeleton skeleton-line lg"></div>
          <div class="skeleton skeleton-line sm"></div>
          <div class="skeleton skeleton-line md"></div>
        </div>
      </div>`).join('')}
  </div>`;
}

// ── Render ────────────────────────────────────────────────────────────────────

function renderTrails(trails, query = '') {
  const container = document.getElementById('trail-results');

  if (trails.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <span class="no-results-icon">🔍</span>
        <p>No trails match <strong>"${escapeHtml(query || activeDifficulty)}"</strong>.</p>
        <p class="no-results-hint">Try a different name, location, or clear your filters.</p>
      </div>`;
    updateCount(0);
    return;
  }

  const total = allTrails.length;
  const countLabel = trails.length === total
    ? `${total} trails`
    : `${trails.length} of ${total} trails`;

  // Use DocumentFragment for performance
  const fragment = document.createDocumentFragment();

  const countEl = document.createElement('p');
  countEl.className = 'results-count';
  countEl.textContent = `${countLabel} found`;
  fragment.appendChild(countEl);

  const grid = document.createElement('div');
  grid.className = 'trail-grid';

  trails.forEach(trail => {
    const diff   = difficultyInfo(trail.difficulty);
    const imgSrc = trail.photo_url || 'images/outdoors.jpg';

    const card = document.createElement('div');
    card.className = 'trail-card';
    card.innerHTML = `
      <div class="trail-card-img-wrap">
        <img
          src="${imgSrc}"
          alt="Scenery at ${escapeHtml(trail.name)}"
          class="trail-card-img"
          loading="lazy"
          onerror="this.src='images/outdoors.jpg'"
        >
        <span class="difficulty-badge ${diff.cls}">${diff.icon} ${escapeHtml(trail.difficulty)}</span>
      </div>
      <div class="trail-card-body">
        <h3 class="trail-name">${highlight(trail.name, query)}</h3>
        <p class="trail-location">📍 ${highlight(trail.location, query)}</p>
        <div class="trail-stats">
          <span title="Distance"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 12h18M3 6h18M3 18h18"/></svg> ${trail.distance_mi} mi</span>
          <span title="Elevation gain"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg> ${trail.elevation_gain_ft} ft</span>
          <span title="Estimated time">⏱ ${escapeHtml(trail.estimated_time)}</span>
          <span title="Trail type">🔄 ${highlight(trail.trail_type, query)}</span>
        </div>
      </div>`;
    grid.appendChild(card);
  });

  fragment.appendChild(grid);
  container.innerHTML = '';
  container.appendChild(fragment);
  updateCount(trails.length);
}

function updateCount(n) {
  const badge = document.getElementById('result-count-badge');
  if (badge) badge.textContent = n > 0 ? n : '';
}

// ── Clear ─────────────────────────────────────────────────────────────────────

function clearSearch() {
  const input = document.getElementById('search-input');
  input.value = '';
  activeQuery = '';
  input.focus();
  applyFilters();
}

// ── Wire-up after DOM ready ───────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  const input      = document.getElementById('search-input');
  const diffBtns   = document.querySelectorAll('.diff-btn');
  const sortSelect = document.getElementById('sort-select');

  // Search input — debounced 300ms
  input.addEventListener('input', debounce(function () {
    activeQuery = input.value.toLowerCase().trim();
    applyFilters();
  }, 300));

  // Difficulty filter buttons
  diffBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      diffBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDifficulty = btn.dataset.diff;
      applyFilters();
    });
  });

  // Sort dropdown
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      activeSort = sortSelect.value;
      applyFilters();
    });
  }
});
