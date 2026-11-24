import { useEffect } from 'react';
import { requestRefresh } from '../lib/scroll';
import { About } from './About';
import { Contact } from './Contact';
import { Experience } from './Experience';
import { Projects } from './Projects';
import { Thesis } from './Thesis';

/** Everything after the desk. Loaded as a separate chunk; ScrollTrigger re-measures once they mount. */
export default function Rest() {
  useEffect(() => {
    requestRefresh();
    // fonts change line heights, so measure again once they are ready
    document.fonts?.ready.then(requestRefresh);
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
