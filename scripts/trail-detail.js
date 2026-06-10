/**
 * trail-detail.js  —  Task #46: Display Trail Information Dynamically
 *
 * Reads ?trail=<name> from the URL, fetches trails.json,
 * finds the matching trail, and populates the detail page.
 *
 * Acceptance criteria covered:
 *  ✅ Trail name displays correctly
 *  ✅ Trail location displays correctly
 *  ✅ Trail distance displays correctly
 *  ✅ Trail difficulty displays correctly
 *  ✅ Trail description displays correctly (time, type, elevation)
 *  ✅ Data comes from the existing trail-data source (data/trails.json)
 */

const DIFFICULTY_META = {
  Easy:     { color: '#2d6a4f', badge: '🟢 Easy',     tip: 'Great for all fitness levels.' },
  Moderate: { color: '#c9893a', badge: '🟡 Moderate',  tip: 'Some elevation — pace yourself.' },
  Hard:     { color: '#b94040', badge: '🔴 Hard',      tip: 'Challenging terrain. Prepare well.' },
};

const TRAIL_DESCRIPTIONS = {
  'Rattlesnake Ledge':           'One of the most popular hikes near Seattle, Rattlesnake Ledge rewards hikers with sweeping views of Rattlesnake Lake and the Cascade foothills from its dramatic rocky ledge.',
  'Mount Si':                    'A legendary Seattle-area climb, Mount Si offers a relentless but rewarding ascent past old-growth forests to a rocky summit with panoramic Cascade and Puget Sound views.',
  'Twin Falls':                  'Twin Falls is a gem of a short hike following the South Fork Snoqualmie River to a pair of thundering waterfalls framed by mossy cliffs and towering conifers.',
  'Franklin Falls':              'An easy stroll through old-growth forest leads to one of Washington\'s most accessible and spectacular waterfalls—a 70-foot cascade that\'s magical year-round.',
  'Poo Poo Point':               'Famous as the launch site for paragliders, this moderate climb offers front-row views of colorful wings soaring above the Issaquah Alps.',
  'Tiger Mountain Trail':        'A full-day adventure through the heart of Tiger Mountain State Forest, this demanding loop traverses ridgelines, dense forest, and quiet clearings far from the crowds.',
  'Mailbox Peak':                'Named for the literal mailbox at its summit, this brutal climb is a rite of passage for serious hikers—the views of the Cascades and Snoqualmie Valley are well worth the pain.',
  'Lake Serene':                 'Arguably one of the most beautiful destinations in the Cascades, Lake Serene sits below the dramatic north face of Mount Index with gem-blue waters and year-round snowfields.',
  'Snow Lake':                   'The most visited backcountry lake in the Alpine Lakes Wilderness offers stunning alpine scenery, shimmering water, and rock-hopping at the basin edge.',
  'Ira Spring Trail':            'Named in honor of legendary hiking photographer Ira Spring, this trail climbs through forest and meadow to the Mason Lake basin with views of Mount Rainier.',
  'Tolmie Peak':                 'The fire lookout atop Tolmie Peak delivers one of the finest views of Mount Rainier\'s north face, with Eunice Lake reflecting the volcano on calm mornings.',
  'Spray Park':                  'Spray Park is a wildflower paradise on Mount Rainier\'s northwest flank—fields of lupine, paintbrush, and aster blooming against the glacier-draped volcano.',
  'Skyline Trail':               'This classic loop circles the Paradise area of Mount Rainier, crossing snowfields and wildflower meadows with the volcano looming overhead at every turn.',
  'Cape Flattery':               'At the northwest tip of the continental United States, Cape Flattery\'s short boardwalk trail ends at sea stacks, tide pools, and open Pacific views of the Strait of Juan de Fuca.',
  'Hurricane Hill':              'Hurricane Ridge is famous for its flower-speckled meadows and stunning views of the Olympic Mountains and Strait of Juan de Fuca—Hurricane Hill adds extra elevation and solitude.',
  'Hoh Rain Forest Hall of Mosses': 'The Hall of Mosses is one of the most enchanting short walks in the country—a cathedral of ancient big-leaf maples draped in luminous chartreuse moss.',
  'High Divide Loop':            'A multi-day classic in the heart of Olympic National Park, the High Divide Loop traverses subalpine ridges with front-row views of the glaciated Bailey Range and Sol Duc valley.',
  'Silver Falls Loop':           'A peaceful loop in a quiet corner of Mount Rainier National Park, Silver Falls tumbles through a mossy gorge with old-growth cedar and fir lining the trail.',
  'Maple Pass Loop':             'Rated among the best fall hikes in Washington, Maple Pass Loop circles above Lake Ann through a larch forest that turns gold in late September against a sky-blue alpine backdrop.',
  'Chain Lakes Loop':            'Circling beneath Mount Shuksan and Mount Baker, the Chain Lakes Loop passes five turquoise tarns with some of the most photographed mountain reflections in the state.',
};

/** Resolve the correct root path to data/trails.json regardless of page depth */
function dataPath() {
  // Pages live at project root, so relative path is fine
  return 'data/trails.json';
}

/** Format distance with singular/plural */
function fmtDist(mi) {
  return `${mi} ${mi === 1 ? 'mile' : 'miles'}`;
}

/** Format elevation */
function fmtElev(ft) {
  return `${ft.toLocaleString()} ft gain`;
}

/** Build a stat pill element */
function statPill(icon, label, value) {
  const div = document.createElement('div');
  div.className = 'stat-pill';
  div.innerHTML = `<span class="stat-icon" aria-hidden="true">${icon}</span>
    <div class="stat-text">
      <span class="stat-label">${label}</span>
      <span class="stat-value">${value}</span>
    </div>`;
  return div;
}

/** Show an error state in the hero */
function showError(name) {
  document.title = 'Trail not found — Great Outdoors';
  document.getElementById('trail-name').textContent = name
    ? `"${name}" not found`
    : 'No trail selected';
  document.getElementById('trail-location').textContent = 'Return to the trail list to pick a hike.';
  document.getElementById('detail-stats').innerHTML = '';
  document.getElementById('trail-description').textContent = '';
  const img = document.getElementById('trail-hero-img');
  if (img) img.style.display = 'none';
}

async function loadTrail() {
  // 1. Parse ?trail= from the URL
  const params = new URLSearchParams(window.location.search);
  const trailName = params.get('trail');

  if (!trailName) { showError(null); return; }

  // 2. Fetch data source
  let trails;
  try {
    const res = await fetch(dataPath());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    trails = await res.json();
  } catch (err) {
    console.error('Failed to load trails.json:', err);
    showError(trailName);
    return;
  }

  // 3. Find the trail (case-insensitive match)
  const trail = trails.find(
    t => t.name.toLowerCase() === trailName.toLowerCase()
  );
  if (!trail) { showError(trailName); return; }

  // 4. Populate page
  document.title = `${trail.name} — Great Outdoors`;

  // Difficulty metadata
  const diff = DIFFICULTY_META[trail.difficulty] || DIFFICULTY_META['Moderate'];

  // Hero image
  const heroImg = document.getElementById('trail-hero-img');
  if (heroImg) {
    heroImg.src = trail.photo_url || '';
    heroImg.alt = trail.name;
    heroImg.onerror = () => { heroImg.style.display = 'none'; };
  }

  // Difficulty badge colour on hero overlay
  const overlay = document.getElementById('hero-overlay');
  if (overlay) overlay.style.setProperty('--diff-color', diff.color);

  // Name & location
  document.getElementById('trail-name').textContent = trail.name;
  document.getElementById('trail-location').textContent = `📍 ${trail.location}`;

  // Difficulty badge
  const badge = document.getElementById('difficulty-badge');
  if (badge) {
    badge.textContent = diff.badge;
    badge.style.background = diff.color;
    badge.title = diff.tip;
  }

  // Stats pills
  const statsEl = document.getElementById('detail-stats');
  statsEl.innerHTML = '';
  statsEl.appendChild(statPill('🏃', 'Distance',   fmtDist(trail.distance_mi)));
  statsEl.appendChild(statPill('📈', 'Elevation',  fmtElev(trail.elevation_gain_ft)));
  statsEl.appendChild(statPill('⏱️', 'Est. Time',  trail.estimated_time));
  statsEl.appendChild(statPill('🔄', 'Trail Type', capitalize(trail.trail_type.replace('-', ' '))));

  // Description
  const desc = TRAIL_DESCRIPTIONS[trail.name]
    || `Explore ${trail.name}, a ${trail.difficulty.toLowerCase()} ${trail.trail_type.replace('-', ' ')} trail in ${trail.location}.`;
  document.getElementById('trail-description').textContent = desc;

  // Difficulty tip callout
  const tipEl = document.getElementById('difficulty-tip');
  if (tipEl) tipEl.textContent = diff.tip;

  // Reveal the page content with a fade-in
  document.querySelector('.trail-detail-page').classList.add('loaded');
}

function capitalize(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

document.addEventListener('DOMContentLoaded', loadTrail);
