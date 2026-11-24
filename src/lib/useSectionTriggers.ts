import { useLayoutEffect, type RefObject } from 'react';
import { sectionNo } from '../content';
import { ScrollTrigger, gsap, prefersReducedMotion } from './scroll';
import { setSection, type Theme } from './store';

/**
 * Registers a section with the HUD (counter) and top-bar theme,
 * and gives it the "paper slide" entrance: its inner content rises in as the sheet comes up.
 */
export function useSectionTriggers(ref: RefObject<HTMLElement | null>, theme: Theme, prevTheme?: Theme) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const index = sectionNo(el.id); // position comes from nav.sections, never hard-coded
    const ctx = gsap.context(() => {
      // A pinned section (Thesis, Projects) scrolls for longer than its own height: measure its in-flow
      // pin spacer, so the counter and theme stay on it for the whole pinned stretch.
      const flow = () => (el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el);
      const top = () => flow().getBoundingClientRect().top + window.scrollY;
      const bottom = () => top() + flow().offsetHeight;
      ScrollTrigger.create({
        start: () => top() - window.innerHeight / 2,
        end: () => bottom() - window.innerHeight / 2,
        onToggle: (s) => s.isActive && setSection({ index }),
        refreshPriority: -1, // measured after every pin on the page is in place
      });
      ScrollTrigger.create({
        start: () => top() - 40,
        end: () => bottom() - 40,
        onToggle: (s) => s.isActive && setSection({ theme }),
        refreshPriority: -1,
        // scrolling back above this section: the bar returns to the previous section's theme
        onLeaveBack: () => prevTheme && setSection({ theme: prevTheme }),
      });
      const inner = el.querySelector<HTMLElement>('[data-sheet-inner]');
      if (inner && !prefersReducedMotion) {
        gsap.fromTo(
          inner,
          { y: () => window.innerHeight * 0.12 },
          { y: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: true, invalidateOnRefresh: true } },
        );
      }
    }, el);
    return () => ctx.revert();
  }, [ref, theme, prevTheme]);
}
