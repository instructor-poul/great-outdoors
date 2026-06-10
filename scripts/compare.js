/**
 * compare.js  –  Trail Comparison View
 * Great Outdoors | Issue #33 (enhanced)
 *
 * Loads from data/trails.json (the shared dataset used by search.js).
 * Falls back to inline sample data when served from the filesystem.
 *
 * Enhancements over original:
 *  • Loads real trails.json schema (distance_mi, elevation_gain_ft, etc.)
 *  • Mini preview cards beneath each selector
 *  • Swap button
 *  • Same-trail guard with warning
 *  • Visual metric-card grid with bar-chart comparisons
 *  • Winner banner (easier / shorter / lower gain)
 *  • Accessible comparison table (hidden visually, readable by screen readers)
 *  • Smooth card-reveal animation on update
 */

// ─── Fallback data (mirrors data/trails.json schema) ─────────────────────
const FALLBACK_TRAILS = [
  { name:"Rattlesnake Ledge",   location:"North Bend, WA",        distance_mi:4.0,  elevation_gain_ft:1100, difficulty:"Moderate", estimated_time:"2–3 hrs",  trail_type:"out-and-back", photo_url:"" },
  { name:"Mount Si",            location:"North Bend, WA",        distance_mi:8.0,  elevation_gain_ft:3150, difficulty:"Hard",     estimated_time:"5–7 hrs",  trail_type:"out-and-back", photo_url:"" },
  { name:"Twin Falls",          location:"Olallie State Park, WA",distance_mi:2.6,  elevation_gain_ft:500,  difficulty:"Easy",     estimated_time:"1–2 hrs",  trail_type:"out-and-back", photo_url:"" },
  { name:"Franklin Falls",      location:"Snoqualmie Pass, WA",   distance_mi:2.0,  elevation_gain_ft:400,  difficulty:"Easy",     estimated_time:"1 hr",     trail_type:"out-and-back", photo_url:"" },
  { name:"Poo Poo Point",       location:"Issaquah, WA",          distance_mi:3.8,  elevation_gain_ft:1600, difficulty:"Moderate", estimated_time:"3–4 hrs",  trail_type:"out-and-back", photo_url:"" },
  { name:"Tiger Mountain Trail",location:"Issaquah, WA",          distance_mi:13.9, elevation_gain_ft:3200, difficulty:"Hard",     estimated_time:"7–9 hrs",  trail_type:"loop",         photo_url:"" },
  { name:"Mailbox Peak",        location:"Middle Fork Snoqualmie, WA", distance_mi:9.4, elevation_gain_ft:4000, difficulty:"Hard", estimated_time:"6–8 hrs", trail_type:"out-and-back", photo_url:"" },
  { name:"Snow Lake",           location:"Snoqualmie Pass, WA",   distance_mi:7.2,  elevation_gain_ft:1800, difficulty:"Moderate", estimated_time:"4–5 hrs",  trail_type:"out-and-back", photo_url:"" },
  { name:"Cape Flattery",       location:"Neah Bay, WA",          distance_mi:1.5,  elevation_gain_ft:100,  difficulty:"Easy",     estimated_time:"1 hr",     trail_type:"out-and-back", photo_url:"" },
  { name:"Maple Pass Loop",     location:"North Cascades, WA",    distance_mi:7.2,  elevation_gain_ft:2000, difficulty:"Moderate", estimated_time:"4–5 hrs",  trail_type:"loop",         photo_url:"" },
];

// ─── Difficulty ordering (lower = easier) ────────────────────────────────
const DIFFICULTY_RANK = { Easy: 1, Moderate: 2, Hard: 3, Strenuous: 4 };

// ─── Metrics definition ───────────────────────────────────────────────────
// lower: true  →  a lower numeric value is "better" (wins the comparison)
const METRICS = [
  { key:"distance_mi",       label:"Distance",        unit:"mi",  icon:"📏", lower:true,  numeric:true  },
  { key:"elevation_gain_ft", label:"Elevation Gain",  unit:"ft",  icon:"⛰️", lower:true,  numeric:true  },
  { key:"difficulty",        label:"Difficulty",      unit:"",    icon:"🎯", lower:true,  numeric:false },
  { key:"estimated_time",    label:"Est. Hike Time",  unit:"",    icon:"⏱️", lower:false, numeric:false },
  { key:"trail_type",        label:"Trail Type",      unit:"",    icon:"🔄", lower:false, numeric:false },
];

// ─── State ────────────────────────────────────────────────────────────────
let trails = [];

// ─── DOM refs ─────────────────────────────────────────────────────────────
const selectA      = document.getElementById("trail-a");
const selectB      = document.getElementById("trail-b");
const previewA     = document.getElementById("preview-a");
const previewB     = document.getElementById("preview-b");
const swapBtn      = document.getElementById("swap-btn");
const placeholder  = document.getElementById("cmp-placeholder");
const sameWarning  = document.getElementById("cmp-same-warning");
const winnerBanner = document.getElementById("cmp-winner-banner");
const cardsGrid    = document.getElementById("cmp-cards-grid");
const tableWrap    = document.getElementById("cmp-table-wrap");
const thTrailA     = document.getElementById("th-trail-a");
const thTrailB     = document.getElementById("th-trail-b");
const tbody        = document.getElementById("cmp-tbody");

// ─── Init ─────────────────────────────────────────────────────────────────
async function init() {
  try {
    const res = await fetch("data/trails.json");
    if (!res.ok) throw new Error("not found");
    trails = await res.json();
    // Ensure each trail has a stable id derived from its name
    trails = trails.map((t, i) => ({ ...t, id: t.id || slugify(t.name) }));
  } catch {
    trails = FALLBACK_TRAILS.map(t => ({ ...t, id: slugify(t.name) }));
  }

  populateSelects();

  selectA.addEventListener("change", () => { updatePreview(selectA, previewA, "a"); renderComparison(); });
  selectB.addEventListener("change", () => { updatePreview(selectB, previewB, "b"); renderComparison(); });
  swapBtn.addEventListener("click", swapTrails);
}

// ─── Populate selects ─────────────────────────────────────────────────────
function populateSelects() {
  trails.forEach(trail => {
    selectA.add(new Option(trail.name, trail.id));
    selectB.add(new Option(trail.name, trail.id));
  });
}

// ─── Swap handler ─────────────────────────────────────────────────────────
function swapTrails() {
  const tmp = selectA.value;
  selectA.value = selectB.value;
  selectB.value = tmp;
  updatePreview(selectA, previewA, "a");
  updatePreview(selectB, previewB, "b");
  renderComparison();
}

// ─── Mini preview cards ───────────────────────────────────────────────────
function updatePreview(select, container, side) {
  const trail = trails.find(t => t.id === select.value);
  if (!trail) { container.innerHTML = ""; return; }

  const diff = difficultyInfo(trail.difficulty);
  const imgSrc = trail.photo_url || "images/outdoors.jpg";

  container.innerHTML = `
    <div class="trail-preview-inner trail-preview-${side}">
      <img src="${imgSrc}" alt="${escHtml(trail.name)}" class="preview-img"
           loading="lazy" onerror="this.src='images/outdoors.jpg'">
      <div class="preview-body">
        <p class="preview-name">${escHtml(trail.name)}</p>
        <p class="preview-loc">📍 ${escHtml(trail.location)}</p>
        <span class="badge ${diff.cls}">${diff.icon} ${escHtml(trail.difficulty)}</span>
      </div>
    </div>`;
}

// ─── Main render ──────────────────────────────────────────────────────────
function renderComparison() {
  const trailA = trails.find(t => t.id === selectA.value);
  const trailB = trails.find(t => t.id === selectB.value);

  // Nothing selected yet
  if (!trailA || !trailB) {
    show(placeholder); hide(sameWarning); hide(winnerBanner); hide(cardsGrid); hide(tableWrap);
    return;
  }

  // Same trail selected
  if (trailA.id === trailB.id) {
    hide(placeholder); show(sameWarning); hide(winnerBanner); hide(cardsGrid); hide(tableWrap);
    return;
  }

  hide(placeholder); hide(sameWarning);

  // Column headers
  thTrailA.textContent = trailA.name;
  thTrailB.textContent = trailB.name;

  // Build metric cards & table rows
  renderMetricCards(trailA, trailB);
  renderTableRows(trailA, trailB);
  renderWinnerBanner(trailA, trailB);

  show(winnerBanner); show(cardsGrid); show(tableWrap);
}

// ─── Metric card grid ─────────────────────────────────────────────────────
function renderMetricCards(a, b) {
  // Animate out then in
  cardsGrid.classList.remove("visible");

  const maxDist = Math.max(a.distance_mi, b.distance_mi);
  const maxElev = Math.max(a.elevation_gain_ft, b.elevation_gain_ft);

  cardsGrid.innerHTML = METRICS.map(m => {
    const valA = a[m.key] ?? "—";
    const valB = b[m.key] ?? "—";
    const { winA, winB } = compareMetric(m, a, b);

    let barA = "", barB = "";
    if (m.numeric && typeof valA === "number" && typeof valB === "number") {
      const maxVal = m.key === "distance_mi" ? maxDist : maxElev;
      const pctA = maxVal > 0 ? Math.round((valA / maxVal) * 100) : 0;
      const pctB = maxVal > 0 ? Math.round((valB / maxVal) * 100) : 0;
      barA = `<div class="metric-bar-wrap"><div class="metric-bar bar-a ${winA ? 'bar-winner':''}" style="width:${pctA}%"></div></div>`;
      barB = `<div class="metric-bar-wrap"><div class="metric-bar bar-b ${winB ? 'bar-winner':''}" style="width:${pctB}%"></div></div>`;
    }

    const displayA = m.numeric ? `${valA} ${m.unit}` : formatValue(m.key, valA);
    const displayB = m.numeric ? `${valB} ${m.unit}` : formatValue(m.key, valB);

    return `
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-icon" aria-hidden="true">${m.icon}</span>
          <span class="metric-label">${m.label}</span>
        </div>
        <div class="metric-values">
          <div class="metric-side metric-side-a ${winA ? 'metric-winner' : ''}">
            ${winA ? '<span class="win-star" aria-label="Better value">★</span>' : ''}
            ${m.key === "difficulty" ? `<span class="badge ${difficultyInfo(valA).cls}">${difficultyInfo(valA).icon} ${escHtml(String(valA))}</span>` : `<span class="metric-val">${escHtml(displayA)}</span>`}
            ${barA}
          </div>
          <div class="metric-divider" aria-hidden="true"></div>
          <div class="metric-side metric-side-b ${winB ? 'metric-winner' : ''}">
            ${winB ? '<span class="win-star" aria-label="Better value">★</span>' : ''}
            ${m.key === "difficulty" ? `<span class="badge ${difficultyInfo(valB).cls}">${difficultyInfo(valB).icon} ${escHtml(String(valB))}</span>` : `<span class="metric-val">${escHtml(displayB)}</span>`}
            ${barB}
          </div>
        </div>
      </div>`;
  }).join("");

  // Trigger animation
  requestAnimationFrame(() => requestAnimationFrame(() => cardsGrid.classList.add("visible")));
}

// ─── Accessible table rows ────────────────────────────────────────────────
function renderTableRows(a, b) {
  tbody.innerHTML = METRICS.map(m => {
    const valA = a[m.key] ?? "—";
    const valB = b[m.key] ?? "—";
    const { winA, winB } = compareMetric(m, a, b);
    const displayA = m.numeric ? `${valA} ${m.unit}` : formatValue(m.key, valA);
    const displayB = m.numeric ? `${valB} ${m.unit}` : formatValue(m.key, valB);

    const cellA = m.key === "difficulty"
      ? `<span class="badge ${difficultyInfo(valA).cls}">${difficultyInfo(valA).icon} ${escHtml(String(valA))}</span>`
      : escHtml(displayA);
    const cellB = m.key === "difficulty"
      ? `<span class="badge ${difficultyInfo(valB).cls}">${difficultyInfo(valB).icon} ${escHtml(String(valB))}</span>`
      : escHtml(displayB);

    return `
      <tr>
        <td class="cmp-td-metric">${m.icon} ${m.label}</td>
        <td class="cmp-td-value ${winA ? 'is-better' : ''}" data-trail="${escHtml(a.name)}">${cellA}</td>
        <td class="cmp-td-value ${winB ? 'is-better' : ''}" data-trail="${escHtml(b.name)}">${cellB}</td>
      </tr>`;
  }).join("");
}

// ─── Winner banner ────────────────────────────────────────────────────────
function renderWinnerBanner(a, b) {
  let winsA = 0, winsB = 0;
  METRICS.forEach(m => {
    const { winA, winB } = compareMetric(m, a, b);
    if (winA) winsA++;
    if (winB) winsB++;
  });

  if (winsA === winsB) {
    winnerBanner.innerHTML = `<span class="banner-icon">🤝</span> <strong>It's a tie!</strong> Both trails are equally matched across these metrics.`;
    winnerBanner.className = "cmp-winner-banner banner-tie";
  } else {
    const winner = winsA > winsB ? a : b;
    const count  = winsA > winsB ? winsA : winsB;
    const side   = winsA > winsB ? "A" : "B";
    winnerBanner.innerHTML = `<span class="banner-icon">🏆</span> <strong>Trail ${side} wins</strong> — <em>${escHtml(winner.name)}</em> comes out ahead on ${count} of ${METRICS.length} metrics.`;
    winnerBanner.className = `cmp-winner-banner banner-winner banner-${side.toLowerCase()}`;
  }

  winnerBanner.hidden = false;
}

// ─── Compare a single metric: returns { winA, winB } ─────────────────────
function compareMetric(metric, a, b) {
  const valA = a[metric.key];
  const valB = b[metric.key];

  if (valA == null || valB == null) return { winA: false, winB: false };

  if (metric.numeric) {
    if (valA === valB) return { winA: false, winB: false };
    return metric.lower
      ? { winA: valA < valB, winB: valB < valA }
      : { winA: valA > valB, winB: valB > valA };
  }

  if (metric.key === "difficulty") {
    const rA = DIFFICULTY_RANK[valA] ?? 99;
    const rB = DIFFICULTY_RANK[valB] ?? 99;
    if (rA === rB) return { winA: false, winB: false };
    return { winA: rA < rB, winB: rB < rA };
  }

  return { winA: false, winB: false }; // non-comparable strings
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function difficultyInfo(level) {
  const map = {
    Easy:      { cls: "badge-easy",      icon: "🟢" },
    Moderate:  { cls: "badge-moderate",  icon: "🟡" },
    Hard:      { cls: "badge-hard",      icon: "🔴" },
    Strenuous: { cls: "badge-strenuous", icon: "🔴" },
  };
  return map[level] || { cls: "", icon: "" };
}

function formatValue(key, val) {
  if (key === "trail_type") return capitalize(String(val).replace(/-/g, " "));
  return String(val);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function show(el) { el.hidden = false; }
function hide(el) { el.hidden = true; }

// ─── Run ──────────────────────────────────────────────────────────────────
init();
