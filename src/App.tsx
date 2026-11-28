import { Suspense, lazy, useCallback, useState } from 'react';
import { nav } from './content';
import { Cursor } from './components/Cursor';
import { HUD } from './components/HUD';
import { Intro } from './components/Intro';
import { ConnectFab } from './components/ConnectFab';
import { TopBar } from './components/TopBar';
import { DeskStage } from './desk/DeskStage';

/** Everything after the desk lives in its own chunk, loaded and built while the intro screen holds. */
const Rest = lazy(() => import('./sections/Rest'));

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const onIntroDone = useCallback(() => setIntroDone(true), []);


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
        {/* below the fold: built while the intro screen holds still (the intro waits for it, see lib/ready) */}
        <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--cream)' }} />}>
          <Rest />
        </Suspense>
      </main>
      <ConnectFab />
    </>
  );
}
