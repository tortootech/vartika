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
The "Connect with me" form in the Contact section sends through Web3Forms. Its access key is in
`.env.production` (committed on purpose: a Web3Forms key is public by design, it ships in the browser JS
of any site that uses it and can only deliver submissions to the account owner's inbox). Every
`npm run build` picks it up, so the GitHub Pages `docs/` build and any Vercel build both send for real.

- **Change the key:** edit `.env.production`, run `npm run build`, commit and push.
- **Where messages go:** the email of the Web3Forms account that created the key (change it in the
  form's settings on web3forms.com).
- **Allowed domains:** if the form's settings restrict domains, include `tortootech.github.io`
  (and your Vercel domain if you use one).
- Without a key the form doesn't fail: it opens the visitor's email app with the message filled in.

## Deploy
**Vercel** (`vercel.json` points Vercel at the `docs` build folder):
```bash
npm i -g vercel
vercel          # first deploy: link the project
vercel --prod
```
**GitHub Pages** (current address https://tortootech.github.io/vartika/): run `npm run build` (it writes `docs/`),
commit and push; Pages serves the `portfolio-v2` branch, `/docs` folder. Build with the key in `.env` so the form is connected.
