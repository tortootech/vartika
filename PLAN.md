# Vartika Yadav — portfolio build plan

**One idea:** a messy desk that organizes itself as you scroll. Messy data and requirements become clear structure.

> Note: the reference site (portfolio-mti1.vercel.app) could not be opened from the build environment (network policy). The borrowed patterns come straight from the brief: a `[ 0X / 06 ]` counter, editorial type with mixed weights, a fixed minimal bar, scroll-pinned scrubbing, `001.` numbering, an FAQ-style contact section, a giant closing line, and Lenis inertia.

## Stack
Vite + React + TS · GSAP + ScrollTrigger (every scroll-linked motion) · Lenis (wired via `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`) · CSS Modules · inline SVG only · Fraunces / Inter / JetBrains Mono.

Palette is locked to `--navy #142841`, `--slate #798da6` and `--cream #e5ded2`. Every tint comes from `color-mix()` of those three. `--slate-deep` (slate mixed with 40% navy) is used wherever cream text must sit on a slate fill and still pass AA (≈4.5:1).

## Sections
| # | Section | Background | Motion |
|---|---------|-----------|--------|
| 01 | Hero: the messy desk | slate desk | Intro overlay → camera pull-back → **pinned scrub** (~250vh): folders land, papers fly into folders, sticky notes peel to the top edge, copy fades in |
| 02 | Toolkit | same pinned stage | Continues the scrub: the Toolkit folder lifts, centers, its flap flips open (rotateX) and 13 tool cards pop out into 3 groups |
| 03 | Projects | cream sheet | Pinned horizontal track of 4 case-file cards (desktop) / vertical stack (mobile). Card opens a `<dialog>` case study |
| 04 | Experience | navy sheet | Timeline line scales in with scroll; entries reveal in sequence |
| 05 | About | cream sheet | Photo frame + first-person story, `001.` working principles, slow marquee |
| 06 | Contact | navy sheet | Numbered FAQ, link buttons, giant "Let's talk." with fill-on-hover |

Sections 3–6 slide up over the previous one like paper sheets: rounded top, shadow, inner parallax.

## Components
- `App` sets up Lenis/ScrollTrigger, the intro gate and lazy-mounts `Rest` (sections 3–6, a separate chunk)
- `TopBar` (VARTIKA—, ©2026, Contact pill) · `HUD` (counter + progress bar) · `Cursor` · `Intro`
- `DeskStage` (sections 1 + 2 in one pinned stage) → `Folder`, `Paper` (+ 10 SVG doodles), `StickyNote`, `Mug`, `Pen`, `Laptop`, `ToolkitLayer` → `ToolCard` + SVG icons
- `Projects` + `CaseStudy` dialog · `Experience` · `About` · `Contact`
- `lib/scroll.ts` (Lenis singleton, scrollTo, reduced-motion flag) · `lib/store.ts` (active section + bar theme)
- `content.ts` holds every word on the site. Unknowns are `TODO:` strings, which are hidden in production and shown as dashed badges in dev.

## Scroll timeline (DeskStage, one scrubbed GSAP timeline, ≈5.6 units ≈ 500vh pinned)
```
0.0–1.3  folders: messy (scattered, rotated) → tidy row (stagger 0.08)
0.15–0.9 sticky notes: peel (scale + tilt) → line up along the top edge
0.2–1.4  pen squares up beside the folders
0.25–2.45 papers (stagger 0.1): fly above their folder (rot→0, scale 1.15→1) → z-swap → drop in
2.0–2.5  hero copy fades in ("Vartika Yadav." + line + View work)
2.5–2.8  hold                                  ← counter [ 01 / 06 ]
2.8–3.4  copy, notes and other folders leave; Toolkit folder lifts (shadow) ← counter [ 02 / 06 ]
3.1–3.7  Toolkit folder moves to the center
3.7–4.25 flap rotates open (rotateX −172°, perspective 900)
4.0–5.2  tool cards spill out (back.out, stagger 0.05) to grouped positions; index card + group labels fade in
4.8–5.2  folder sinks and fades
5.2–5.6  hold
```
Every resting state is the natural CSS layout; the messy state is a set of function-based `from` offsets (`invalidateOnRefresh`). Reduced motion skips the timeline and renders the tidy layout with fades only.

## Performance and accessibility
- Only `transform` and `opacity` are animated. `will-change` is set only while the pin is active. The desk stays under 60 animated nodes (≈45 on desktop, ≈30 on mobile).
- Mobile (<768px): 3 folders, 6 papers, 3 notes, chip-style tools, a vertical project stack.
- Landmarks, a skip link, visible focus rings, `aria-label`s on SVG art, keyboard-operable project cards, and a native `<dialog>` for the focus trap and Esc.
