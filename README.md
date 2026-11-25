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
- **Photo:** put `vartika.jpg` in `public/`, then set `about.photo` to `'vartika.jpg'`.
- **Resume:** replace `public/Vartika_Yadav_Resume.pdf` (same name) or change `contact.resume`.
- **Contact details:** `contact.email`, `contact.phone`, `contact.linkedin`, `contact.github`. A blank or `TODO` value hides that row.
- **Thesis chapters:** `chapters` in `content.ts` (questions, findings, links).

## Contact form (Web3Forms, free, no backend)
The "Connect with me" form in the Contact section sends through Web3Forms. The key is public by design
(it only lets the form send to her inbox), but it is still never committed to this repo.
1. Go to https://web3forms.com, enter `vartikay415@gmail.com` and copy the access key it emails.
2. **Vercel** (the main deployment): Project → Settings → Environment Variables → add `VITE_WEB3FORMS_KEY`
   with the key, then Deployments → Redeploy. Vite reads it at build time.
3. **Local:** copy `.env.example` to `.env` and paste the key after `VITE_WEB3FORMS_KEY=` (`.env` is git-ignored).

**GitHub Pages has no runtime environment variables.** The key must be present when the site is *built*.
The `docs/` folder in this repo is built without it, so on GitHub Pages the form falls back to opening the
visitor's email app (it never fails silently). To send from Pages too, build in a GitHub Actions workflow
that reads the key from a repository secret (Settings → Secrets and variables → Actions → `VITE_WEB3FORMS_KEY`).

## Deploy
**Vercel** (`vercel.json` points Vercel at the `docs` build folder):
```bash
npm i -g vercel
vercel          # first deploy: link the project
vercel --prod
```
**GitHub Pages** (current address https://tortootech.github.io/vartika/): run `npm run build` (it writes `docs/`),
commit and push; Pages serves the `portfolio-v2` branch, `/docs` folder. Build with the key in `.env` so the form is connected.
