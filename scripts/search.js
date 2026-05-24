// Issue #24 — Search Filter Logic

let allTrails = [];

// Load the trail dataset from JSON
fetch('data/trails.json')
  .then(response => response.json())
  .then(data => {
    allTrails = data;
    renderTrails(allTrails); // Show all trails on page load
  });

// Filter trails by name OR location, case-insensitive
function filterTrails(query) {
  if (query === '') {
    return allTrails; // Empty input → show all trails
  }
  return allTrails.filter(trail =>
    trail.name.toLowerCase().includes(query) ||
    trail.location.toLowerCase().includes(query)
  );
}

// Render trail cards into the #trail-results div
function renderTrails(trails) {
  const container = document.getElementById('trail-results');

  if (trails.length === 0) {
    container.innerHTML = '<p>No trails found. Try a different search!</p>';
    return;
  }

  container.innerHTML = trails.map(trail => `
    <div class="trail-card">
      <h3>${trail.name}</h3>
      <p>📍 ${trail.location}</p>
      <p>📏 ${trail.distance_mi} mi &nbsp;|&nbsp; ⛰️ ${trail.elevation_gain_ft} ft gain &nbsp;|&nbsp; 🥾 ${trail.difficulty}</p>
      <p>⏱️ ${trail.estimated_time} &nbsp;|&nbsp; 🔄 ${trail.trail_type}</p>
    </div>
  `).join('');
}

// Called on every keystroke from the input
document.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById('search-input');

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

input.addEventListener('input', debounce(function () {
  const query = input.value.toLowerCase().trim();
  const results = filterTrails(query);
  renderTrails(results);
}, 300));
});

// Clear button resets the field and shows all trails
function clearSearch() {
  document.getElementById('search-input').value = '';
  renderTrails(allTrails);
}