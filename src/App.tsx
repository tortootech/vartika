import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { nav } from './content';
import { Cursor } from './components/Cursor';
import { HUD } from './components/HUD';
import { Intro } from './components/Intro';
import { TopBar } from './components/TopBar';
import { DeskStage } from './desk/DeskStage';
import { initSmoothScroll } from './lib/scroll';

/** Sections 3–6 live in their own chunk and mount after first paint. */
const Rest = lazy(() => import('./sections/Rest'));

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const onIntroDone = useCallback(() => setIntroDone(true), []);

  // warm the lazy chunk while the intro plays
  useEffect(() => {
    const id = window.setTimeout(() => void import('./sections/Rest'), 1200);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => initSmoothScroll(), []);

  return (
    <>
      <a className="skip-link" href="#main">
        {nav.skip}
      </a>
      <TopBar />
      <HUD />
      <Cursor />
      {!introDone && <Intro onDone={onIntroDone} />}
      <main id="main">
        <DeskStage />
        {/* below the fold: mount once the intro is done so it never competes with first paint */}
        <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--cream)' }} />}>
          {introDone ? <Rest /> : <div style={{ minHeight: '100vh', background: 'var(--cream)' }} />}
        </Suspense>
      </main>
    </>
  );
}
