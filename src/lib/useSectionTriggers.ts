import { useLayoutEffect, type RefObject } from 'react';
import { ScrollTrigger, gsap, prefersReducedMotion } from './scroll';
import { setSection, type Theme } from './store';

/**
 * Registers a section with the HUD (counter) and top-bar theme,
 * and gives it the "paper slide" entrance: its inner content rises in as the sheet comes up.
 */
export function useSectionTriggers(ref: RefObject<HTMLElement | null>, index: number, theme: Theme, prevTheme?: Theme) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (s) => s.isActive && setSection({ index }),
      });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 40px',
        end: 'bottom 40px',
        onToggle: (s) => s.isActive && setSection({ theme }),
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
  }, [ref, index, theme, prevTheme]);
}
