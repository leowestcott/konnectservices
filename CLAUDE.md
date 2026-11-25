# CLAUDE.md — Konnect Services website

Project notes for anyone (human or AI) maintaining this site.

## What has been developed

A complete redesign of **konnectservices.com** for Konnect Services Limited (mechanical & electrical contractors, Potters Bar, est. 2007), built as static HTML for GitHub Pages.

- **Home page** (`index.html`), a single-page experience with these sections: Hero → About → Services overview → Electrical / Mechanical / Renewable Energy (one section each, 26 services) → Projects → Locations network map → Why Konnect → Accreditations → Careers (Plumbing Apprentice) → Contact & enquiry form.
- **Four project case studies** (`projects/<slug>/`), each with a specification strip, overview, scope, challenge, disciplines and a lightbox gallery.
- **Privacy policy** (`privacy/`) and a **404 page** (`404.html`).
- **Redirect stubs** for the old WordPress URLs (`/about/`, `/services/`, `/contact/`, `/projects/`) so existing links and search results land on the right section.
- **SEO assets.** These are `sitemap.xml`, `robots.txt`, canonical URLs, Open Graph/Twitter images, JSON-LD (LocalBusiness + WebSite + BreadcrumbList), the favicon set and the web manifest.

All business copy comes from the existing website (home, services, projects, about and contact pages, plus the apprenticeship pop-up). Nothing has been invented: no qualifications, clients, statistics or project details. The four statistics shown (2007, 3 disciplines, 26 services, 7 accreditations) are counted directly from the original site's content.

## Project structure

```
/
├── index.html                  Home (single-page experience)
├── 404.html                    Not-found page (uses <base href="/">, see Known limitations)
├── privacy/index.html          Privacy policy
├── projects/
│   ├── rushworth-street/       33–38 Rushworth Street case study
│   ├── nw-works/               NW Works case study
│   ├── abbey-road/             Abbey Road case study
│   ├── clarendon-road/         Clarendon Road case study
│   └── index.html              Redirect stub → /#projects
├── about/ services/ contact/   Redirect stubs for old WordPress URLs
├── assets/
│   ├── css/main.css            All styles (handwritten, commented, design tokens at the top)
│   ├── js/main.js              All behaviour (vanilla JS, ~15 KB, deferred)
│   ├── fonts/                  Archivo (variable) + JetBrains Mono (variable), subset WOFF2
│   └── img/
│       ├── brand/              Logo (SVG), mark, app icons
│       ├── projects/           Project photography (AVIF + WebP, several widths)
│       ├── services/           Discipline imagery (Unsplash, see credits below)
│       ├── accreditations/     Accreditation logos
│       ├── og/                 1200×630 social share images
│       └── manifest.json       Image dimensions/widths (used by the optimiser tool)
├── favicon.svg favicon.ico apple-touch-icon.png site.webmanifest
├── sitemap.xml robots.txt
├── _config.yml                 Tells GitHub Pages' Jekyll not to publish docs/tools/sources
├── _source-images/             Full-size originals used to generate assets/img (not published)
├── _reports/                   Lighthouse reports from local testing (not published)
├── tools/optimise-images.py    Optional image optimiser (Python + Pillow); not needed to run the site
├── CLAUDE.md                   This file
└── BRAND.md                    Visual identity documentation
```

Folders starting with `_`, plus the docs and `tools/`, are excluded from the published site by `_config.yml`.

## Technologies

- Semantic HTML5, handwritten CSS and vanilla JavaScript. **Zero dependencies**, with no framework, npm packages or build step.
- Modern CSS: custom properties, `clamp()` fluid type, `color-mix()`, `svh` units, `content-visibility`, `interpolate-size`, scroll-driven animations (`animation-timeline: view()`, progressive enhancement), cross-document View Transitions, `::details-content`, and `prefers-reduced-motion` support throughout.
- JS: `IntersectionObserver` (reveals, scrollspy, header state), native `<dialog>` (gallery lightbox), `fetch` (Formspree AJAX with normal-POST fallback when JS is off).
- Images: AVIF + WebP via `<picture>`, responsive `srcset`/`sizes`, intrinsic `width`/`height`, lazy loading below the fold, and a preloaded high-priority hero image.
- Fonts: self-hosted, subset, variable WOFF2 (Archivo 34 KB, JetBrains Mono 9 KB), preloaded, with a metric-matched fallback to prevent layout shift.

### Test results (local, gzip server mirroring GitHub Pages)

| Page | Mobile (Perf / A11y / BP / SEO) | Desktop |
|---|---|---|
| Home | 100 / 100 / 100 / 100 (LCP 0.9 s, TBT 20 ms, CLS 0) | 100 / 100 / 100 / 100 |
| Each project page | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| Privacy | 100 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |

The full HTML reports are in `_reports/`. Re-test on the live URL with https://pagespeed.web.dev once deployed, because real-network results can differ slightly.

Other checks run: HTML validated (html-validate, 0 errors), 1,101 internal links/assets/anchors crawled (0 broken), no horizontal overflow at 320 / 360 / 375 / 414 / 768 / 1024 / 1280 / 1920 px, zero console errors, and 18 interaction tests passing (mobile menu, dropdown, service accordions, deep links, scrollspy, form validation/success/error, lightbox keyboard and focus handling).

## Running locally

Any static file server works. From the project root:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

Opening `index.html` directly from disk (`file://`) mostly works, but use a server for accurate behaviour (fonts, 404 page, form).

## Updating service information

Services live in `index.html` inside the three discipline sections: `<section class="discipline" id="electrical">`, `id="mechanical"` and `id="renewable"`. Each service is one `<li class="svc">`:

```html
<li class="svc" id="fire-alarm-systems">                 <!-- id = deep-link anchor (#fire-alarm-systems) -->
  <div class="svc__head"><span class="svc__code">E.08</span><h3 class="svc__title">Fire Alarm Systems</h3>
    <button class="svc__toggle" type="button" aria-expanded="false" aria-controls="fire-alarm-systems-more">…</button></div>
  <p class="svc__brief">One-line summary shown at all times.</p>
  <div class="svc__more" id="fire-alarm-systems-more"><div><div class="svc__more-inner">
    <p>Full description shown when expanded.</p>
    <ul class="chips chips--accent" role="list" aria-label="Typical applications"><li>Commercial</li></ul>  <!-- optional -->
  </div></div></div>
</li>
```

When adding or removing a service, also update:
1. The counts: "12 services" in the discipline header, the services-overview card, and the header dropdown on **every** page. Also the total ("26") in the hero facts, the About facts and the dropdown.
2. The footer service lists (the footer is repeated in every HTML file).
3. The JSON-LD `hasOfferCatalog` block in the `<head>` of `index.html`.

> The header and footer are repeated in each HTML file (there is no build step). When changing navigation or contact details, use find-and-replace across all `.html` files.

## Adding or replacing images

1. Put the full-size original in `_source-images/`.
2. Generate responsive files with the optional optimiser (needs Python 3.9+ and Pillow 11.2+):
   ```bash
   pip install pillow
   python3 tools/optimise-images.py _source-images/my-photo.jpg projects my-photo
   ```
   This writes `assets/img/projects/my-photo-{480,800,1200,1600,…}.{avif,webp}` and prints ready-to-paste `<picture>` markup. Without Python, use https://squoosh.app to export AVIF and WebP at 480/800/1200/1600 px widths.
3. Use the `<picture>` pattern already in the pages (AVIF source, WebP source, `<img>` with `width`, `height`, `alt`, `loading="lazy"` and `decoding="async"`). Always write a descriptive `alt`. Keep `loading="eager"` + `fetchpriority="high"` only for the first large image on a page.
4. Wrap images in `<div class="frame" data-reveal="clip" style="--ph:#hex">` for the scroll reveal. `--ph` is a placeholder tone (the image's average colour).

`python3 tools/optimise-images.py --all` rebuilds every image listed in its `MANIFEST` and rewrites `assets/img/manifest.json`.

### Image sources and credits

- **Project photography:** taken from the existing Konnect website galleries. Clarendon Road images only exist at 550×350 px online; they have been upscaled 2× (Lanczos, no AI) so they display cleanly. Please supply the original high-resolution files.
- **Discipline imagery (`assets/img/services/`):** Unsplash photographs used under the Unsplash License (free for commercial use, attribution not required). They illustrate disciplines only and are never presented as Konnect projects.

| File | Photographer | Source |
|---|---|---|
| switchroom | NIKHIL SHAHU | https://unsplash.com/photos/gray-machine-s89Z5V0plTY |
| breakers | George Slabov | https://unsplash.com/photos/white-and-black-audio-mixer-59unzhWYbig |
| insulated-pipework | Fabian Kleiser | https://unsplash.com/photos/pipes-and-equipment-are-installed-on-a-wall-DHhp30Dn2i8 |
| rooftop-plant | Viktor Lotarev | https://unsplash.com/photos/white-concrete-building-under-blue-sky-during-daytime-PqnP6UfzJ2E |
| rooftop-solar | Nuno Marques | https://unsplash.com/photos/black-and-white-solar-panels-0GbrjL3vZF4 |
| heat-pumps | alpha innotec | https://unsplash.com/photos/three-gray-air-conditioning-units-mounted-on-a-white-wall-VsjNRXO_c2w |
| (spares, not used) pipework, data-racks, sprinkler-ceiling | Clemens van Lay, Tyler, Valentin Lacoste | originals in `_source-images/`, credits in `_source-images/stock-credits.json` |

- **Not used (deliberately):** the old site's hero background, the "Canada Water Bridge" image and the Rushworth "Project in focus" graphic. These appear to be AI-generated or marketing renders, and the brief rules out AI imagery that could misrepresent completed projects.

## Updating project case studies

Each case study is a self-contained page at `projects/<slug>/index.html`. To edit one, change its text, `.p-spec` items, scope list and gallery directly.

To **add** a project:
1. Copy an existing folder (e.g. `projects/abbey-road/`) to `projects/<new-slug>/` and edit the title, meta description, canonical URL, `og:url`, `og:image`, breadcrumb JSON-LD, content and gallery. Gallery items are `<a class="gallery__item" href="…-1600.webp" data-lightbox data-avif="…-1600.avif" data-caption="…" style="--ar:W / H">`.
2. Add a card to the **Projects** section in `index.html` (copy an `<article class="proj …">`). Layout variants are `proj--a` (wide left), `proj--b` (right), `proj--c` (full-width) and `proj--d` (mosaic/left).
3. Update the "Next project" link at the bottom of the previous project page so the loop continues.
4. Add the URL to `sitemap.xml`.
5. Optional: create a 1200×630 share image in `assets/img/og/og-<slug>.jpg`.

Only publish details that Konnect can verify.

## Modifying contact information

Contact details appear in several places. Use find-and-replace across all `.html` files for:
- Telephone: `01707&nbsp;651550` (display) and `tel:+441707651550` (links)
- Email: `contact@konnectservices.com`
- Address: `49 Darkes Lane`, `Potters Bar`, `EN6 1BJ`

Locations: header phone, mobile menu, contact section, footer (every page), privacy page, JSON-LD in `index.html`, the careers "Apply" buttons, and two messages in `assets/js/main.js` (form success and error text).

The **Locations** map (home page) is an SVG drawn from the nine coordinates on the old site's map. To add or remove a location, edit both the list (`.network__list`) and the SVG. Positions use an equirectangular projection centred on 51.63° N. Ask a developer, or remove the SVG node and keep the list.

## Deploying to GitHub Pages

The repository root *is* the site. Nothing needs building.

1. Repository: **https://github.com/leowestcott/konnectservices** (branch `main`). The site lives at the repository root.
2. To work on it locally: `git clone https://github.com/leowestcott/konnectservices.git`. Commit under your own identity only (no co-author or AI attribution lines), then `git push origin main`.
3. On GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / root**.
4. **Custom domain (konnectservices.com):** in Settings → Pages, enter `konnectservices.com` (GitHub creates a `CNAME` file). Then point DNS at GitHub Pages: apex `A` records to GitHub's Pages IPs and a `www` `CNAME` to `<account>.github.io`; see GitHub's "Managing a custom domain" docs for the current IPs. Enable **Enforce HTTPS**.
5. Later updates: edit, then `git add . && git commit -m "…" && git push`.

Canonical URLs, the sitemap, Open Graph tags and structured data all point to `https://konnectservices.com/`. If the site will live elsewhere permanently, find-and-replace that URL.

## External integrations

- **Formspree (enquiry form):** posts to `https://formspree.io/f/xwvndkow`, the endpoint used on the t4-digital.uk contact page. Important:
  - Submissions go to **whichever email owns that Formspree form (the t4-digital account)**, not automatically to contact@konnectservices.com. Change the recipient in Formspree, or create a dedicated Konnect form and replace the ID in `index.html` (search for `formspree.io/f/`).
  - The t4-digital form has a reCAPTCHA comment in its source. If reCAPTCHA is enforced on that form in Formspree, submissions from this site (no reCAPTCHA, to keep PageSpeed at 100) will be rejected. Visitors then see a clear error with the phone number and email address. Disable reCAPTCHA for this form or use a dedicated form.
  - If Formspree "allowed domains" is set, add `konnectservices.com` (and the GitHub Pages domain while testing).
  - Spam protection: `_gotcha` honeypot field. Subject line: "New website enquiry — Konnect Services".
- **Google Maps:** plain links only (directions, map, location list). No embedded map, so no cookies or third-party JavaScript.
- **Instagram:** link to https://www.instagram.com/konnectservices/ (found on the old contact page).
- No analytics, cookies or trackers. The privacy policy states this, so update it if analytics are added.

## Known limitations and information still needed

1. **Company registration details.** UK limited companies must show their registered number and registered office on their website. These weren't on the old site; add them to the footer once confirmed.
2. **Logo master artwork.** The only logo available online was a 320×64 PNG. `assets/img/brand/konnect-logo.svg` is a faithful vector redraw (traced wordmark, reconstructed dot mark). Replace it with the original vector artwork if available.
3. **Accreditation logos** are cropped from the old site's single combined image (which appears to be a screenshot collage). Request official artwork from each scheme's member area. Registration or membership numbers aren't published, so add them only if you want them shown.
4. **Clarendon Road photography** is low resolution online (550 px); please supply the originals.
5. **NW Works location** isn't stated on the old site, so the case study says "Not published".
6. **Canada Water Bridge** appeared as a gallery label on the old home page, but there's no project description and the image looks AI-generated, so it hasn't been included. Supply verified details and photos to add it.
7. **The nine map locations** are shown as "Locations" exactly as on the old map. Their purpose (offices vs project sites) isn't stated, so confirm before describing them further.
8. **Abbey Road** is a solar PV project, but none of the available photos show the PV installation. Add them if they exist.
9. **Apprenticeship vacancy** (Careers section) is taken from the old site's pop-up (dated September 2026). Remove the `<section id="careers">` block and its footer link when it closes.
10. **Testimonials, client names and project values** aren't shown because none were available to verify.
11. **404 page** uses `<base href="/">` so it works from any URL depth. This assumes the site is served from the domain root (true for konnectservices.com). On a temporary `username.github.io/repo/` address, the 404 page's links won't resolve.
12. **Caching:** GitHub Pages sets a fixed 10-minute cache lifetime, which can't be changed. It doesn't affect the PageSpeed score.
13. **Reference sites:** `tarne75.github.io/hallofflower/` returned a 404 during the build, so it couldn't be reviewed.
14. Header and footer markup is duplicated across pages (by design, with no build step).
