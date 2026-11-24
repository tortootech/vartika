# Revision 2: plan
1. Sections: `src/desk/DeskStage.tsx` (hero desk + toolkit, one pinned timeline), then `src/sections/Rest.tsx` (lazy chunk) → Thesis (new), `Projects.tsx`, `Experience.tsx`, `About.tsx`, `Contact.tsx`.
2. Lenis: created once in `src/lib/scroll.ts` (`initSmoothScroll`, called from `main.tsx`), driven by `gsap.ticker`, with a `virtualScroll` wheel gate used by the desk's stepped scrolling.
3. ScrollTrigger: registered in `src/lib/scroll.ts`; each section builds its triggers in `useLayoutEffect` inside `gsap.context`/`matchMedia` and reverts on unmount; `useSectionTriggers` drives the HUD counter and bar theme.
4. Project files: `Projects.tsx` cards → `CaseStudy.tsx`, a native `<dialog>` (showModal) that used `lockScroll()` (lenis.stop).
5. Scroll-lock root cause: the desk's wheel gate and touch/key handlers treated "Lenis stopped" as "intro playing" and called preventDefault on every wheel/touch event, so an open file could not scroll (and the rest of that gesture was swallowed after close).
6. Fix: one `useScrollLock` hook (`src/lib/useScrollLock.ts`): locks the page, keeps the panel scrollable, traps focus, restores scroll + focus, refreshes ScrollTrigger, one overlay at a time. The desk handlers step aside while any overlay is open.
7. Header: brand → "Portfolio". About: drop working principles. Counters: computed from `nav.sections`.
8. New `src/sections/Thesis.tsx`: two pinned research-paper chapters (quick commerce, price vs volume) after the toolkit; stacked on mobile and reduced motion.
9. Projects: drop the two thesis projects. Contact: summary, copyable email/phone, links, location, drawer form (Web3Forms) + floating "Message me" button.
10. Audit pass with Playwright at 375/390/768/1024/1440/1920, reduced motion, overlays ×10, anchors, console, palette grep, build + lint.
