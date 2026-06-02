// Issue #18 — Live Search Results Display

let allTrails = [];

// Load the trail dataset from JSON
fetch('data/trails.json')
  .then(response => response.json())
  .then(data => {
    allTrails = data;
    renderTrails(allTrails); // Show all trails on page load
  })
  .catch(() => {
    document.getElementById('trail-results').innerHTML =
      '<p class="no-results">Unable to load trails. Please try again later.</p>';
  });

// Debounce helper — waits for user to stop typing before filtering
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Filter trails by name OR location, case-insensitive
function filterTrails(query) {
  if (query === '') return allTrails;
  return allTrails.filter(trail =>
    trail.name.toLowerCase().includes(query) ||
    trail.location.toLowerCase().includes(query)
  );
}

// Return a CSS class and label for each difficulty level
function difficultyInfo(level) {
  const map = {
    'Easy':     { cls: 'badge-easy',     label: '🟢 Easy' },
    'Moderate': { cls: 'badge-moderate', label: '🟡 Moderate' },
    'Hard':     { cls: 'badge-hard',     label: '🔴 Hard' },
  };
  return map[level] || { cls: '', label: level };
}

// Render trail cards into the #trail-results div
function renderTrails(trails) {
  const container = document.getElementById('trail-results');

  if (trails.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <span class="no-results-icon">🔍</span>
        <p>No trails found for that search.</p>
        <p>Try searching by trail name or location (e.g. "North Bend" or "Easy").</p>
      </div>`;
    return;
  }

  const countLabel = trails.length === allTrails.length
    ? `${trails.length} trails`
    : `${trails.length} of ${allTrails.length} trails`;

  container.innerHTML = `
    <p class="results-count">${countLabel} found</p>
    <div class="trail-grid">
      ${trails.map(trail => {
        const diff = difficultyInfo(trail.difficulty);
        const imgSrc = trail.photo_url || 'images/outdoors.jpg';
        return `
          <div class="trail-card">
            <div class="trail-card-img-wrap">
              <img
                src="${imgSrc}"
                alt="Scenery at ${trail.name}"
                class="trail-card-img"
                onerror="this.src='images/outdoors.jpg'"
              >
              <span class="difficulty-badge ${diff.cls}">${diff.label}</span>
            </div>
            <div class="trail-card-body">
              <h3 class="trail-name">${trail.name}</h3>
              <p class="trail-location">📍 ${trail.location}</p>
              <div class="trail-stats">
                <span>📏 ${trail.distance_mi} mi</span>
                <span>⛰️ ${trail.elevation_gain_ft} ft gain</span>
                <span>⏱️ ${trail.estimated_time}</span>
                <span>🔄 ${trail.trail_type}</span>
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

// Wire up search input after DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById('search-input');

  input.addEventListener('input', debounce(function () {
    const query = input.value.toLowerCase().trim();
    renderTrails(filterTrails(query));
  }, 300));
});

// Clear button resets the field and shows all trails
function clearSearch() {
  const input = document.getElementById('search-input');
  input.value = '';
  input.focus();
  renderTrails(allTrails);
}
