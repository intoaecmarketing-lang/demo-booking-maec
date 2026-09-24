# MAEC Demo Landing Page — Clone

Lightweight, hand-coded HTML/CSS/vanilla-JS rebuild of
`https://maec.ai/solicitar-demo/`, built purely for speed (Core Web Vitals)
on paid/direct traffic. No WordPress, no Elementor, no build tools, no
frameworks. Two CTAs only: **Sign Up** and **Book a Demo**. See
`MAEC Demo Landing Page Clone - Build Spec.md` in this folder for the full
audit and rationale behind these decisions.

## Before this page goes live

### Tracking (js/tracking.js)
- [ ] `GA4_MEASUREMENT_ID` — paste real GA4 measurement ID
- [ ] `META_PIXEL_ID` — paste real Meta Pixel ID
- [ ] `CLARITY_PROJECT_ID` — paste real Microsoft Clarity project ID
- Only ONE instance of each is loaded, after `window.load` — do not add a
  second GTM container or a second gtag.js, that's the exact duplication
  bug documented in the build spec's audit findings.

### TidyCal (index.html, `#book-demo`)
- [ ] Verify the embed markup against your TidyCal dashboard (Booking Page
      → Share/Embed). The `data-path="moni1/reunion-demo-maec"` value and
      the `embed.js` URL in `js/main.js` are best-effort based on the build
      spec's audit — confirm they match your account's actual embed script
      before launch.

### Canonical / indexing
- [ ] Confirm `https://maec.ai/solicitar-demo/` is still the right
      canonical target, or update `<link rel="canonical">` / the
      `noindex, follow` meta tag in `index.html` if the indexing decision
      changes.

### Images
All images must ship as `.webp`. Full list with expected filenames/sizes is
in the comment block at the top of `index.html`. Summary:

| File | Size |
| --- | --- |
| `images/logo.webp` | 240×60 |
| `images/favicon.webp` / `images/favicon.ico` | 32×32 |
| `images/og-image.webp` | 1200×630 |
| `images/hero/hero-visual.webp` | 960×540 (LCP element — do not lazy-load) |
| `images/features/feature-realtime.webp` | 64×64 |
| `images/features/feature-budget.webp` | 64×64 |
| `images/features/feature-connected.webp` | 64×64 |
| `images/trust/whatsapp.webp` | 140×48 |
| `images/trust/bukku.webp` | 140×48 |
| `images/trust/meta.webp` | 140×48 |
| `images/trust/quickbooks.webp` | 140×48 |
| `images/trust/zohobooks.webp` | 140×48 |
| `images/trust/sage.webp` | 140×48 |
| `images/testimonials/avatar-1.webp` | 80×80 |
| `images/testimonials/avatar-2.webp` | 80×80 |

Convert source images with:
```
cwebp -q 80 input.jpg -o output.webp
```

### Testimonials
- [ ] The source page has **no** real customer testimonials. The
      testimonials section in `index.html` uses clearly-marked placeholder
      quotes — replace with real customer quotes (with permission) or
      remove the section entirely before launch.

### Sign-up form
- [ ] `#signup-form`'s `action="#"` is a placeholder. Wire it to a real
      backend/form service, or change the CTA to redirect to
      `https://app.intoaec.ai/auth/signUp` if you'd rather not collect the
      form on this page.

### Footer
- [ ] Privacy Policy link currently points to `#` — paste the real URL.

### Logo / favicon
- [ ] Drop in `images/logo.webp` and `images/favicon.ico` / `.webp`.

## Deployment
Deploy to a static host or subdomain (Netlify, Vercel, Cloudflare Pages, or
a static CDN bucket) — **not** the WordPress theme/install.

## Verify before launch
- No `<script>` in `<head>` without `defer`/`async` — confirmed (tracking
  and main.js are `defer`'d at the bottom of `<body>`; TidyCal loads on
  click/intersection).
- Only stylesheet load in `<head>` uses the preload+swap pattern.
- Every image has explicit `width`/`height` or `aspect-ratio` (CLS-safe).
- Re-run PageSpeed Insights (mobile + desktop) against the deployed clone
  and compare to the baseline in the build spec:
  LCP < 2.5s, FCP < 1.8s, TBT < 200ms.
