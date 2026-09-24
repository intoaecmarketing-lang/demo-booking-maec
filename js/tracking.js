(function () {
  'use strict';

  // TODO: paste real IDs before launch.
  var GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX';   // TODO: paste GA4 ID
  var META_PIXEL_ID = 'XXXXXXXXXXXXXXX';      // TODO: paste Meta Pixel ID
  var CLARITY_PROJECT_ID = 'xxxxxxxxxx';      // TODO: paste Clarity ID

  // NOTE: the source page (maec.ai/solicitar-demo/) currently loads TWO GTM
  // containers, a THIRD separate gtag.js, and a duplicate Meta Pixel
  // implementation, which double-counts conversions (see build spec's audit
  // findings). This file intentionally loads exactly ONE instance of each
  // tool, and only after window 'load', so tracking never competes with the
  // page's LCP/TBT budget and never double-fires.

  var loaded = false;

  function loadGA4() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_MEASUREMENT_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA4_MEASUREMENT_ID);
  }

  function loadMetaPixel() {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function loadClarity() {
    /* eslint-disable */
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, 'clarity', 'script', CLARITY_PROJECT_ID);
    /* eslint-enable */
  }

  function loadTracking() {
    if (loaded) return;
    loaded = true;
    loadGA4();
    loadMetaPixel();
    loadClarity();
  }

  window.addEventListener('load', loadTracking);

  // Called from js/main.js on the two funnel actions: sign-up form submit
  // and Book a Demo click/open.
  window.trackConversion = function (action) {
    if (window.gtag) {
      window.gtag('event', action, { event_category: 'lead_gen' });
    }
    if (window.fbq) {
      window.fbq('trackCustom', action);
    }
    if (window.clarity) {
      window.clarity('event', action);
    }
  };
})();
