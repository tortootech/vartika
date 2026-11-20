import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { intro } from './src/content.ts';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Renders the intro screen straight into index.html (from content.ts), so the first
 * thing a visitor sees paints before any JavaScript runs. React takes it over afterwards.
 */
function bootIntro(): Plugin {
  return {
    name: 'boot-intro',
    transformIndexHtml(html) {
      const chars = [...intro.hello]
        .map((c, i) => `<span class="boot-ch" style="--i:${i}">${c === ' ' ? '&nbsp;' : esc(c)}</span>`)
        .join('');
      const markup = `<div id="boot" aria-hidden="true"><div class="boot-text" data-text><p class="boot-hello">${chars}</p><p class="boot-sub" data-sub>${esc(intro.sub)}</p></div></div>`;
      return html.replace('<!--BOOT-->', markup);
    },
  };
}

export default defineConfig({
  // relative asset paths, so the build works at any address (e.g. https://tortootech.github.io/vartika/)
  base: './',
  plugins: [react(), bootIntro()],
});
