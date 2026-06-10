// guides.js — Loads trails from trails.json and builds the card grid dynamically

let allTrails = [];          // stores all trails after fetch
let activeFilter = 'all';    // tracks the current difficulty filter



// ── CROWD SCORE ─────────────────────────────────────────────────────────────

const popularityScore = { low: 2, medium: 5, high: 8 };
const difficultyBonus = { easy: 1, moderate: 0, hard: -1 };

function getCrowdScore(trail) {
  return popularityScore[trail.popularity] + difficultyBonus[trail.difficulty];
}

// ── FETCH & RENDER ──────────────────────────────────────────────────────────
// Load trails.json, save the data, then render all cards
async function loadTrails() {
  try {
    const response = await fetch('data/trails.json');
    allTrails = await response.json();
    renderCards(allTrails);
  } catch (error) {
    console.error('Could not load trails.json:', error);
    document.getElementById('guides-grid').innerHTML =
      '<p style="color:red">Failed to load trails. Make sure trails.json is in the same folder.</p>';
  }
}


// ── BUILD CARDS ─────────────────────────────────────────────────────────────

// Takes an array of trail objects and builds + injects the card HTML
function renderCards(trails) {
  const grid = document.getElementById('guides-grid');
  const count = document.getElementById('guide-count');

  if (trails.length === 0) {
    grid.innerHTML = '<p style="color: var(--muted); font-size: 0.9rem;">No trails match your search.</p>';
    count.textContent = '0 guides';
    return;
  }

  grid.innerHTML = trails.map(trail => createCardHTML(trail)).join('');
  count.textContent = `${trails.length} guide${trails.length !== 1 ? 's' : ''}`;
}

// Returns the HTML string for a single trail card
function createCardHTML(trail) {
  const difficultyLabel = trail.difficulty.charAt(0).toUpperCase() + trail.difficulty.slice(1);
  const crowdScore = getCrowdScore(trail);
  return `
    <a href="${trail.url}" class="guide-card" data-difficulty="${trail.difficulty}" aria-label="${trail.title} guide">
      <div class="card-img-wrap">
        <img src="${trail.image}" alt="${trail.title}" loading="lazy" onerror="this.style.display='none';this.parentElement.querySelector('.img-placeholder').style.display='flex'">
        <div class="img-placeholder" style="display:none">${trail.emoji}</div>
        <span class="card-badge">
          <span class="badge-dot ${trail.difficulty}"></span>${difficultyLabel}
        </span>
        <button class="card-save" aria-label="Save guide" onclick="event.preventDefault()">
          <svg viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div class="card-body">
        <div class="card-title">${trail.title}</div>
        <div class="card-location">📍 ${trail.location}</div>
        <div class="card-meta">
          <span class="meta-rating"><span class="star">★</span> ${trail.rating}</span>
          <span class="meta-sep">·</span>
          <span>${trail.distance_km} km</span>
          <span class="meta-sep">·</span>
          <span>${trail.est_time}</span>
          <span class="card-type-tag">${trail.type}</span>
          <span class="meta-sep">·</span>
          <span>👥 ${crowdScore}/10</span>  <!-- ← add this -->
        </div>
      </div>
    </a>
  `;
}


// ── FILTER ──────────────────────────────────────────────────────────────────

// Called by the filter chip buttons
function filterCards(difficulty, btn) {
  activeFilter = difficulty;

  // Update active chip styling
  document.querySelectorAll('.chip').forEach(chip => chip.classList.remove('active'));
  btn.classList.add('active');

  applyFilters();
}


// ── SEARCH ──────────────────────────────────────────────────────────────────

// Set up search input listener once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadTrails();

  document.querySelector('.nav-search input').addEventListener('input', function () {
    applyFilters();
  });
});


// ── COMBINED FILTER + SEARCH ─────────────────────────────────────────────────

// Applies both the active difficulty filter and the search query at the same time
function applyFilters() {
  const query = document.querySelector('.nav-search input').value.toLowerCase().trim();

  const filtered = allTrails.filter(trail => {
    const matchesDifficulty = activeFilter === 'all' || trail.difficulty === activeFilter;
    const matchesSearch =
      trail.title.toLowerCase().includes(query) ||
      trail.location.toLowerCase().includes(query);

    return matchesDifficulty && matchesSearch;
  });

  renderCards(filtered);
}