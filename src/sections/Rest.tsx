import { useEffect } from 'react';
import { requestRefresh } from '../lib/scroll';
import { About } from './About';
import { Contact } from './Contact';
import { Experience } from './Experience';
import { Projects } from './Projects';

/** Sections 3–6. Loaded as a separate chunk; ScrollTrigger re-measures once they mount. */
export default function Rest() {
  useEffect(() => {
    requestRefresh();
    // fonts change line heights, so measure again once they are ready
    document.fonts?.ready.then(requestRefresh);
  }, []);
  return (
    <>
      <Projects />
      <Experience />
      <About />
      <Contact />
    </>
  );
}
