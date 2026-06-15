function showAlt(x) {
  document.getElementById("alttext").innerHTML=x.alt;
}

function hideAlt(x) {
  document.getElementById("alttext").innerHTML="";
}

// Navigation toggle for mobile
document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-navigation');
  if (!navToggle || !nav) return;

  navToggle.addEventListener('click', function () {
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    // toggle class on nav for CSS (slide down)
    nav.classList.toggle('open');
    // also set aria-hidden for assistive tech (hidden when not expanded)
    nav.setAttribute('aria-hidden', String(expanded));
  });

  // close nav when a link is clicked (mobile)
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('aria-hidden', 'true');
      }
    });
  });
});
