/**
 * compare.js  –  Trail Comparison View logic
 * The Great Outdoors  |  Issue #33
 *
 * Attempts to load trail data from scripts/trails.json.
 * Falls back to inline sample data if the file is unavailable
 * (e.g., when opening the HTML file directly from the filesystem).
 */

// ─── Fallback / sample data ────────────────────────────────────────────────
// Mirrors the expected trails.json schema.  Replace or extend as needed.
const FALLBACK_TRAILS = [
  {
    id: "mountain",
    name: "Climb the Mountain",
    distance: "8.4 mi",
    elevationGain: "3,500 ft",
    difficulty: "Strenuous",
    estimatedTime: "6–8 hrs"
  },
  {
    id: "forest",
    name: "Wander the Forest",
    distance: "4.2 mi",
    elevationGain: "620 ft",
    difficulty: "Easy",
    estimatedTime: "2–3 hrs"
  },
  {
    id: "falls",
    name: "See the Falls",
    distance: "3.0 mi",
    elevationGain: "410 ft",
    difficulty: "Easy",
    estimatedTime: "1.5–2 hrs"
  },
  {
    id: "ferry",
    name: "Ride the Ferry",
    distance: "2.1 mi",
    elevationGain: "50 ft",
    difficulty: "Easy",
    estimatedTime: "1–1.5 hrs"
  },
  {
    id: "lake",
    name: "Walk Around the Lake",
    distance: "5.8 mi",
    elevationGain: "890 ft",
    difficulty: "Moderate",
    estimatedTime: "3–4 hrs"
  },
  {
    id: "park",
    name: "Read in the Park",
    distance: "1.5 mi",
    elevationGain: "80 ft",
    difficulty: "Easy",
    estimatedTime: "45 min–1 hr"
  }
];

// ─── Difficulty → badge class mapping ──────────────────────────────────────
const DIFFICULTY_CLASS = {
  "easy":       "badge-easy",
  "moderate":   "badge-moderate",
  "hard":       "badge-hard",
  "strenuous":  "badge-strenuous"
};

// ─── Metrics to display (in order) ─────────────────────────────────────────
const METRICS = [
  { key: "distance",      label: "Distance" },
  { key: "elevationGain", label: "Elevation Gain" },
  { key: "difficulty",    label: "Difficulty" },
  { key: "estimatedTime", label: "Estimated Time" }
];

// ─── State ──────────────────────────────────────────────────────────────────
let trails = [];

// ─── DOM refs ───────────────────────────────────────────────────────────────
const selectA      = document.getElementById("trail-a");
const selectB      = document.getElementById("trail-b");
const cmpTable     = document.getElementById("cmp-table");
const cmpPlaceholder = document.getElementById("cmp-placeholder");
const thTrailA     = document.getElementById("th-trail-a");
const thTrailB     = document.getElementById("th-trail-b");
const tbody        = document.getElementById("cmp-tbody");

// ─── Init ───────────────────────────────────────────────────────────────────
async function init() {
  try {
    const res = await fetch("scripts/trails.json");
    if (!res.ok) throw new Error("trails.json not found");
    trails = await res.json();
  } catch {
    // File not available — use fallback data
    trails = FALLBACK_TRAILS;
  }

  populateSelects();

  selectA.addEventListener("change", renderComparison);
  selectB.addEventListener("change", renderComparison);
}

// ─── Populate <select> dropdowns ────────────────────────────────────────────
function populateSelects() {
  trails.forEach(trail => {
    const optA = new Option(trail.name, trail.id);
    const optB = new Option(trail.name, trail.id);
    selectA.add(optA);
    selectB.add(optB);
  });
}

// ─── Render comparison table ────────────────────────────────────────────────
function renderComparison() {
  const idA = selectA.value;
  const idB = selectB.value;

  if (!idA || !idB) {
    showPlaceholder();
    return;
  }

  const trailA = trails.find(t => t.id === idA);
  const trailB = trails.find(t => t.id === idB);

  if (!trailA || !trailB) {
    showPlaceholder();
    return;
  }

  // Update column headers
  thTrailA.textContent = trailA.name;
  thTrailB.textContent = trailB.name;

  // Build rows
  tbody.innerHTML = "";
  METRICS.forEach(metric => {
    const valA = trailA[metric.key] ?? "—";
    const valB = trailB[metric.key] ?? "—";

    const tr = document.createElement("tr");

    // Metric label cell
    const tdLabel = document.createElement("td");
    tdLabel.className = "cmp-td-metric";
    tdLabel.textContent = metric.label;
    tr.appendChild(tdLabel);

    // Value cells
    [valA, valB].forEach((val, idx) => {
      const td = document.createElement("td");
      td.className = "cmp-td-value";
      td.setAttribute("data-trail", idx === 0 ? trailA.name : trailB.name);

      if (metric.key === "difficulty") {
        td.innerHTML = difficultyBadge(val);
      } else {
        td.textContent = val;
      }
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  showTable();
}

// ─── Difficulty badge HTML ───────────────────────────────────────────────────
function difficultyBadge(value) {
  const key = (value || "").toLowerCase();
  const cls = DIFFICULTY_CLASS[key] || "";
  return `<span class="badge ${cls}">${value}</span>`;
}

// ─── Show / hide helpers ─────────────────────────────────────────────────────
function showTable() {
  cmpPlaceholder.style.display = "none";
  cmpTable.hidden = false;
}

function showPlaceholder() {
  cmpPlaceholder.style.display = "";
  cmpTable.hidden = true;
}

// ─── Run ─────────────────────────────────────────────────────────────────────
init();
