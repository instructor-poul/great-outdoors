fetch('data/trails.json')
  .then(res => res.json())
  .then(trails => {
    const featured = trails.slice(0, 3);
    const container = document.getElementById('featured-trails');

    container.innerHTML = featured.map(trail => `
      <div class="inside-row">
        <a href="${trail.url}">
          <img src="${trail.image}" alt="${trail.title}">
        </a>
        <span class="trail-badge ${trail.difficulty}">${trail.difficulty}</span>
        <h2>${trail.title}</h2>
        <p class="trail-location">📍 ${trail.location}</p>
        <p class="trail-meta">⭐ ${trail.rating} &nbsp;·&nbsp; ${trail.distance_km} km &nbsp;·&nbsp; ${trail.est_time} &nbsp;·&nbsp; ${trail.type}</p>
      </div>
    `).join('');
  })
  .catch(err => console.error('Could not load trails.json:', err));