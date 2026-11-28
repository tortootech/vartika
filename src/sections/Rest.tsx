import { useEffect } from 'react';
import { markRestReady } from '../lib/ready';
import { ScrollTrigger, requestRefresh } from '../lib/scroll';
import { About } from './About';
import { Contact } from './Contact';
import { Experience } from './Experience';
import { Projects } from './Projects';
import { Thesis } from './Thesis';

/** Everything after the desk. Loaded as a separate chunk; ScrollTrigger re-measures once they mount. */
export default function Rest() {
  useEffect(() => {
    // Measure once the fonts are in (they change line heights), then tell the intro it may start
    // its camera move. Waiting is capped so a slow font never holds the intro up.
    let done = false;
    const measure = () => {
      if (done) return;
      done = true;
      ScrollTrigger.refresh();
      markRestReady();
    };
    const cap = window.setTimeout(measure, 1200);
    document.fonts?.ready.then(() => requestAnimationFrame(measure));
    // a late font after the cap: measure again quietly
    document.fonts?.ready.then(requestRefresh);
    return () => window.clearTimeout(cap);
  }, []);
  return (
    <>
      <Thesis />
      <Projects />
      <Experience />
      <About />
      <Contact />
    </>
  );
}
