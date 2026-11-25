# BRAND.md — Konnect Services visual identity

**Connecting Systems, Creating Solutions.**

The identity grows out of the original Konnect logo: a quarter-disc of green and grey dots beside the KONNECT wordmark. The site keeps the logo intact and builds a system around its geometry: the **quadrant** (a quarter circle) and the **dot matrix**. Around those sit technical linework, monospaced labels and architectural photography.

---

## Brand personality

Technical expertise · reliability · engineering precision · professionalism · safety & compliance · innovation · sustainability · dependable delivery · commercial capability.

How that translates visually:

| Trait | Expression |
|---|---|
| Precision | Strict 12-column grid, hairline rules, mono spec labels, dimension lines |
| Capability & scale | Very large expanded display type, full-bleed architectural photography |
| Technical depth | Schematic diagrams (single-line, flow & return, generation), numbered service codes (E.01, M.01, R.01) |
| Sustainability | Acid-lime renewable accent, solar and heat-pump imagery |
| Dependability | Calm dark palette, restrained motion, consistent components |

Tone of voice: plain, confident, factual. Avoid hype. Never state capabilities, clients, numbers or accreditations that can't be verified.

---

## Colour

### Core palette

| Token | Hex | Use |
|---|---|---|
| `--ink-0` | `#060807` | Deepest background (projects, footer, marquee) |
| `--ink-1` | `#0B0E0D` | Base background (near-black, slightly green) |
| `--ink-2` | `#111513` | Raised panels, form, careers |
| `--ink-3` | `#181D1B` | Hover surfaces, image placeholders |
| `--ink-4` | `#222826` | Industrial graphite |
| `--fg` | `#EEF0EC` | Primary text on dark (16.9:1) |
| `--fg-2` | `#B3BAB6` | Secondary text on dark, muted metallic silver (9.8:1) |
| `--fg-3` | `#8F9793` | Labels and meta on dark (6.2:1) |
| `--paper` | `#F3F1EA` | Warm white sections (About, Why) |
| `--paper-2` | `#E9E6DD` | Accreditations background, fact panel |
| `--text` | `#101412` | Text on paper (16.4:1) |
| `--text-2` | `#4A514D` | Secondary text on paper (7.2:1) |
| Hairlines | `rgb(232 236 233 / .12)` on dark · `rgb(16 20 18 / .14)` on light | Rules, borders |

### Brand and accent colours

| Token | Hex | Use |
|---|---|---|
| `--brand` | `#089442` | **Logo green** (sampled from the original logo). Logo, dot motifs |
| `--brand-grey` | `#939598` | **Logo grey**. Logo, dot motifs |
| `--signal` | `#41F08D` | Signal green. Primary accent on dark (buttons, active states, links, focus rings) |
| `--signal-ink` | `#056A30` | Accessible green for text and focus on light surfaces (≥ 4.5:1 on paper) |

### Discipline accents

The three disciplines share the system but each has its own accent (`--sw` / `--accent` in CSS):

| Discipline | Token | Hex |
|---|---|---|
| Electrical | `--elec` | `#41F08D` signal green |
| Mechanical | `--mech` | `#7CC9E8` steel blue |
| Renewable Energy | `--renew` | `#D2F24C` acid lime |

Rules: accents are for small areas only (rules, codes, buttons, chips, diagram strokes), never large fills except the CTA band. All text/background pairs meet WCAG AA.

---

## Typography

| Role | Typeface | Settings |
|---|---|---|
| Display & UI | **Archivo** (variable: weight 300–800, width 100–125%) | Headings use **expanded width** (`font-stretch: 104–118%`), weight ~620, tight tracking (−0.02 to −0.05em), line-height 0.88–1.1 |
| Body | Archivo | Width 100%, weight 400, line-height 1.65 |
| Technical labels | **JetBrains Mono** (variable 400–600) | Uppercase, 0.72–0.9 rem, letter-spacing 0.08–0.12em |

Both fonts are open source (SIL OFL), self-hosted, subset to Latin and preloaded. The fallback is a metric-matched Arial (`Archivo Fallback`).

### Fluid type scale (`clamp()`)

| Token | Range | Typical use |
|---|---|---|
| `--step--2` | 0.72 → 0.78 rem | Mono labels |
| `--step--1` | 0.84 → 0.90 rem | Small UI text, lists |
| `--step-0` | 1.00 → 1.10 rem | Body |
| `--step-1` | 1.15 → 1.40 rem | Lead text, sub-headings |
| `--step-2` | 1.40 → 2.00 rem | Service titles |
| `--step-3` | 1.90 → 3.30 rem | Section statements, project titles |
| `--step-4` | 2.50 → 5.25 rem | Section headings (`.h-xl`) |
| `--step-5` | 2.90 → 8.40 rem | Display (`.display`, contact title) |

---

## Logo usage

- Files: `assets/img/brand/konnect-logo.svg` (full lockup, 323 × 67 viewBox), `konnect-mark.svg` / `favicon.svg` (dot mark only).
- The SVG is a faithful vector redraw of the original 320 × 64 PNG. Swap in master artwork if supplied.
- Colours: wordmark and outer dots `#089442`, "SERVICES" and inner dots `#939598`. **Do not recolour, outline, stretch or re-letter the logo.**
- Works on dark (site default) and on white. On mid-tone photography, place it on a solid panel.
- Minimum width: 140 px on screen. Header 150–188 px, footer 190–240 px.
- Clear space: at least the height of the "K" on all sides.
- Mark-only use (favicon, app icons, small avatars): the dot quadrant on `#0B0E0D` or white.

---

## Visual direction

1. **The quadrant.** A quarter circle, the silhouette of the logo mark. It's used as the hero image mask (`border-radius: 0 100% 0 0`), the single rounded corner on buttons, cards, frames and the form (`--radius-q`), and the small eyebrow and swatch markers.
2. **The dot matrix.** Rings of logo-style ellipse dots (green and grey, rotated along the arc) wrapping the hero quadrant, so the photograph sits *inside* the Konnect mark. Dots also act as marquee separators and list bullets.
3. **Technical linework.** A faint 12-column blueprint grid, hairline section rules, dimension lines with end ticks, coordinates in mono (51.6977° N · 0.1910° W, the Potters Bar office), indicative schematics for each discipline, and the locations network map.
4. **Photography first.** Real project photography leads, and stock imagery is limited to the discipline panels. Alternate dark and warm-paper sections set the rhythm.
5. **Editorial asymmetry.** Offset project layouts (wide left, right, full-width, mosaic), sticky discipline columns, numbered codes everywhere (01 —, E.01, P—02).

---

## Spacing system

| Token | Value | Use |
|---|---|---|
| `--gutter` | `clamp(1.25rem, 4vw, 3.5rem)` | Page side margins |
| `--wrap` | `min(1440px, 100% − 2 × gutter)` | Content width, 12-column grid |
| `--section` | `clamp(5rem, 3.5rem + 7vw, 10.5rem)` | Vertical section padding |
| `--header-h` | `76px` | Fixed header height (also scroll padding) |
| `--radius-q` | `clamp(18px, 2.2vw, 28px)` | The quadrant corner |

Internal rhythm uses multiples of 0.25 rem (0.5 / 0.75 / 1 / 1.25 / 1.5 / 2 / 2.5 / 3 rem). Minimum touch target: 44 × 44 px.

---

## Buttons and links

| Component | Style |
|---|---|
| `.btn--primary` | Signal-green fill, ink text, 1 px border, **one quadrant corner (top-right)**. On hover an off-white wipe slides in left to right and the arrow nudges right |
| `.btn` (secondary) | Transparent, 1 px hairline border, same wipe on hover |
| On light sections | Primary becomes ink fill with paper text. The hover wipe is green |
| `.link-arrow` | Text + arrow, the underline draws on hover, accent colour |
| Discipline CTAs | Primary button tinted with the discipline accent |

Every button has a visible `:focus-visible` ring (2 px signal green, 3 px offset).

---

## Image treatment

- Formats: AVIF with a WebP fallback, at 480 / 800 / 1200 / 1600 / 2000 px widths. Always set `width`/`height`.
- Frames: a dark placeholder tone (the image's average colour). Large frames take the quadrant corner.
- **Reveal:** images wipe up (`clip-path`) with a slow settle from 118% scale to 100% as they enter the viewport.
- **Parallax:** gentle ±6% vertical drift using CSS scroll-driven animations (only where supported, never with reduced motion).
- Discipline cards: slightly desaturated and darkened under a gradient, returning to full colour on hover.
- Vary aspect ratios (16:10, 4:3, 21:9, 4:5, natural-ratio masonry) to avoid a uniform grid.
- Never use AI-generated imagery to depict Konnect's work. Stock imagery is for discipline context only.

---

## Animation principles

- **Purposeful and engineered:** motion reveals structure (lines draw, schematics flow, images wipe in). It is never bouncy or decorative noise.
- Easing: `--ease-out` `cubic-bezier(.16,1,.3,1)` for entrances, `--ease-io` `cubic-bezier(.65,0,.35,1)` for wipes, `--ease` `cubic-bezier(.2,.8,.2,1)` for UI.
- Durations: 0.25–0.45 s for UI feedback, 0.9–1.4 s for reveals. Stagger 30–80 ms.
- Signature moments: the headline rises line by line (desktop), the dot rings sweep into place around the quadrant, the about statement darkens word by word, schematics draw and then carry animated "current", network lines connect Potters Bar to each location, the mobile menu opens as a circle from the toggle, and pages cross-fade (View Transitions).
- Performance: animate only `transform`, `opacity` and `clip-path`. Below-the-fold sections use `content-visibility: auto`.
- **`prefers-reduced-motion: reduce` disables all motion**, and content appears in its final state.

---

## Component reference

| Component | Class | Notes |
|---|---|---|
| Eyebrow label | `.eyebrow` | Mono, uppercase, quadrant marker in the accent colour, numbered (01 — About Konnect) |
| Section head | `.section-head` | Eyebrow, heading (7 cols), lead (5 cols) |
| Header | `.site-header` | Transparent over the hero, blurred solid once scrolled. Services disclosure menu |
| Discipline card | `.disc-card` | Photo, code, count, service preview, accent top rule on hover |
| Discipline switcher | `.disc-nav` | Sticky, with a scroll-progress underline per discipline |
| Service row | `.svc` | Code, title, brief, expandable full description, application chips |
| Schematic | `.schematic` | Blueprint-grid panel, mono caption, "Indicative" tag |
| Project card | `.proj--a/b/c/d` | Offset editorial layouts, "View case study" tag slides up on hover |
| Fact | `.fact` | Huge tabular numeral and a short definition |
| Chips | `.chips` | Mono, uppercase, one quadrant corner |
| Form fields | `.field` | Dark inset fields, green focus ring, inline mono error text |
| Accreditation plate | `.accred__item` | White logo plate and paper caption strip |
| Gallery and lightbox | `.gallery`, `.lightbox` | Natural-ratio masonry and a native `<dialog>` viewer |
| CTA band | `.cta-band` | Full-width signal-green strip |
