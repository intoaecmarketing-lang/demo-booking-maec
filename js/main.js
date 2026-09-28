(function () {
  'use strict';

  // Smooth scroll for in-page anchors (#book-demo, #footer-contact, etc).
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (href === '#') return;
    var target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // --- Mobile nav toggle ---------------------------------------------------
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // --- TidyCal facade -------------------------------------------------------
  // Click-to-load only: nothing TidyCal-related (script, preconnect, iframe)
  // exists in the DOM or fires a network request until the user clicks the
  // trigger button. No IntersectionObserver/
  // scroll auto-load — that was removed on purpose so TBT is never spent
  // unless the user asks.
  var container = document.getElementById('tidycal-embed');
  var skeleton = document.getElementById('tidycal-skeleton');
  var spinner = document.getElementById('tidycal-spinner');
  var tidycalLoaded = false;

  function loadTidyCal() {
    if (tidycalLoaded || !container) return;
    tidycalLoaded = true;

    if (skeleton) skeleton.style.display = 'none';
    if (spinner) spinner.hidden = false;

    var path = container.getAttribute('data-path');
    var embedDiv = document.createElement('div');
    embedDiv.className = 'tidycal-embed-inline';
    embedDiv.setAttribute('data-path', path);
    container.appendChild(embedDiv);

    var script = document.createElement('script');
    script.src = 'https://asset-tidycal.b-cdn.net/js/embed.js';
    script.async = true;
    script.onload = function () {
      if (spinner) spinner.hidden = true;
    };
    document.body.appendChild(script);

    if (window.trackConversion) window.trackConversion('book_demo_opened');
  }

  // Fire a conversion event on the "Book a Demo" CTAs even before the
  // TidyCal widget itself loads, so the click intent is captured.
  document.querySelectorAll('[data-cta="book-demo"]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (window.trackConversion) window.trackConversion('book_demo_click');
    });
  });

  // --- Trigger CTA ----------------------------------------------------------
  // A single "Ver horarios disponibles" button replaces the old mock
  // calendar; clicking it swaps in the real TidyCal widget.
  var triggerBtn = document.getElementById('tidycal-trigger');
  if (triggerBtn) triggerBtn.addEventListener('click', loadTidyCal);

  // --- Back to top ------------------------------------------------------
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.hidden = window.scrollY < 600;
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
