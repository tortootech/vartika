# Vartika Yadav: portfolio

A scroll-driven portfolio built around one idea: a messy desk that organizes itself as you scroll.

**Stack:** Vite + React + TypeScript · GSAP + ScrollTrigger · Lenis · CSS Modules · inline SVG only.
The design plan and scroll timeline are in `PLAN.md`.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```

## Check and build
```bash
npx tsc -b && npm run lint && npm run build
npm run preview    # serves the production build
```

## Editing content
Every word on the site lives in `src/content.ts`. Values starting with `TODO` are hidden on the
live site and shown as dashed badges in `npm run dev`.
- **Photo:** put `vartika.jpg` in `public/`, then set `about.photo` to `'/vartika.jpg'`.
- **Resume:** put the PDF in `public/` and set the Resume link to `'/your-file.pdf'`.

## Deploy (Vercel)
```bash
npm i -g vercel
vercel          # first deploy: accept the detected Vite settings
vercel --prod
```
Or push to GitHub and import the repo at vercel.com/new (framework preset: Vite, output `dist`).
