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
  // exists in the DOM or fires a network request until the user clicks a
  // date on the calendar (or the fallback link). No IntersectionObserver/
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

  // --- Mini calendar (visual preview) --------------------------------------
  // Renders the current month; clicking any enabled day loads the real
  // TidyCal widget (see loadTidyCal above) in place of this preview.
  var monthLabel = document.getElementById('cal-month');
  var daysGrid = document.getElementById('cal-days');
  var prevBtn = document.getElementById('cal-prev');
  var nextBtn = document.getElementById('cal-next');
  var MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  var today = new Date();
  var viewYear = today.getFullYear();
  var viewMonth = today.getMonth();

  function renderCalendar() {
    if (!monthLabel || !daysGrid) return;
    monthLabel.textContent = MONTHS_ES[viewMonth] + ' ' + viewYear;
    daysGrid.innerHTML = '';

    var firstOfMonth = new Date(viewYear, viewMonth, 1);
    // Monday-first weekday index (0 = Monday ... 6 = Sunday)
    var leadDays = (firstOfMonth.getDay() + 6) % 7;
    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    var daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
    var totalCells = Math.ceil((leadDays + daysInMonth) / 7) * 7;

    for (var i = 0; i < totalCells; i++) {
      var dayNum = i - leadDays + 1;
      var cell = document.createElement(dayNum >= 1 && dayNum <= daysInMonth ? 'button' : 'span');
      cell.className = 'cal-day';

      if (dayNum < 1) {
        cell.textContent = daysInPrevMonth + dayNum;
        cell.classList.add('is-muted');
      } else if (dayNum > daysInMonth) {
        cell.textContent = dayNum - daysInMonth;
        cell.classList.add('is-muted');
      } else {
        cell.textContent = dayNum;
        cell.type = 'button';
        var isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && dayNum === today.getDate();
        if (isToday) cell.classList.add('is-today');
        cell.addEventListener('click', loadTidyCal);
      }
      daysGrid.appendChild(cell);
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      viewMonth -= 1;
      if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
      renderCalendar();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      viewMonth += 1;
      if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
      renderCalendar();
    });
  }
  renderCalendar();

  // --- Timezone auto-detect (label only, decorative) -----------------------
  var tzLabel = document.getElementById('tz-label');
  if (tzLabel) {
    try {
      tzLabel.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' ');
    } catch (err) {
      tzLabel.textContent = 'Mi zona horaria';
    }
  }

  // --- Calendar/list view toggle (visual only) ------------------------------
  var viewCalBtn = document.getElementById('view-cal');
  var viewListBtn = document.getElementById('view-list');
  if (viewCalBtn && viewListBtn) {
    [viewCalBtn, viewListBtn].forEach(function (btn) {
      btn.addEventListener('click', function () {
        viewCalBtn.classList.toggle('active', btn === viewCalBtn);
        viewListBtn.classList.toggle('active', btn === viewListBtn);
      });
    });
  }

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
