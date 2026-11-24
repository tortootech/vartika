/* ==========================================================================
   content.ts: every word on the site lives here.
   Vartika: edit freely. Anything starting with "TODO" is a placeholder.
   TODO values are hidden on the live site and shown as dashed badges
   while you run `npm run dev`, so you can spot what is missing.
   ========================================================================== */

export const isTodo = (v?: string | null): boolean => !v || v.trim().startsWith('TODO');

export const site = {
  name: 'Vartika Yadav',
  /** Top-left word in the header. */
  barName: 'Portfolio',
  year: '©2026',
  title: 'Vartika Yadav: Business Analyst in the making',
  description:
    'Vartika Yadav turns messy business problems into clear requirements, clean data and decisions people can act on. SQL, Excel, Power BI and BA documentation.',
  url: 'https://tortootech.github.io/vartika/',
};

export const intro = {
  hello: "Hey, it's Vartika.",
  sub: 'Business Analyst in the making.',
};

export const hero = {
  name: 'Vartika Yadav.',
  lead: 'I turn messy business problems into clear requirements, clean data and decisions people can act on.',
  cta: 'View work',
  /** Labels on the folders (index 2 is the one that opens into the toolkit). */
  folders: ['Requirements', 'Data', 'Toolkit', 'Dashboards', 'Research'],
  scrollHint: 'Scroll to tidy up',
};

export type ToolIcon =
  | 'sql' | 'excel' | 'python' | 'powerbi'
  | 'doc' | 'stories' | 'people' | 'flow' | 'trace' | 'ab'
  | 'seo' | 'analytics' | 'keyword';

export interface Tool { name: string; detail: string; use: string; icon: ToolIcon }
export interface ToolGroup { id: string; label: string; tools: Tool[] }

export const toolkit = {
  title: ['Technical', 'toolkit.'],
  sub: 'SQL for the data, Excel and Power BI for the story, documentation for everything in between.',
  groups: [
    {
      id: 'data',
      label: 'Data',
      tools: [
        { name: 'SQL / PostgreSQL', detail: 'joins, CTEs, aggregates', icon: 'sql', use: 'Pulling and sanity-checking the numbers before anyone builds a chart on them.' },
        { name: 'Excel', detail: 'pivots, VLOOKUP, dynamic arrays', icon: 'excel', use: 'Quick models, reconciliations and the first look at any new dataset.' },
        { name: 'Python', detail: 'Pandas, NumPy', icon: 'python', use: 'Cleaning and reshaping data that is too messy for a spreadsheet.' },
        { name: 'Power BI', detail: 'DAX measures', icon: 'powerbi', use: 'Dashboards with measures like AOV and repeat rate that answer one question each.' },
      ],
    },
    {
      id: 'ba',
      label: 'Business analysis',
      tools: [
        { name: 'BRD / FRD / SRS', detail: 'requirements documents', icon: 'doc', use: 'Writing down what the business needs, so a stranger could build it.' },
        { name: 'User stories', detail: 'Agile backlog', icon: 'stories', use: 'Breaking big asks into small, testable pieces a team can ship.' },
        { name: 'Stakeholder mapping', detail: 'influence × interest', icon: 'people', use: 'Knowing who to ask, who decides and who needs to hear about it.' },
        { name: 'Process flows', detail: 'ERD / DFD', icon: 'flow', use: 'Drawing how work and data actually move, not how people think they move.' },
        { name: 'Traceability', detail: 'requirement matrix', icon: 'trace', use: 'Linking every requirement back to a need and forward to a function.' },
        { name: 'A/B test requirements', detail: 'hypotheses, metrics', icon: 'ab', use: 'Defining what success looks like before the experiment starts.' },
      ],
    },
    {
      id: 'digital',
      label: 'Digital',
      tools: [
        { name: 'SEO audits', detail: 'technical + on-page', icon: 'seo', use: 'Gap analysis for websites: where it is, where it should be, what is in the way.' },
        { name: 'Google Analytics', detail: 'traffic + behaviour', icon: 'analytics', use: 'Tracking what changed, then asking why.' },
        { name: 'Keyword research', detail: 'intent + volume', icon: 'keyword', use: 'Finding the words real customers use, then writing for them.' },
      ],
    },
  ] as ToolGroup[],
};

export interface Metric { value: string; label: string }
export interface Project {
  id: string;
  file: string;
  title: string;
  kicker: string;
  summary: string;
  tags: string[];
  problem: string;
  approach: string[];
  deliverables: string[];
  outcome: string;
  metrics: Metric[];
  link: string;
}

export const projectsIntro = {
  label: 'Case files',
  title: ['Selected', 'work.'],
  sub: 'Four more case files. Each one starts with a messy question and ends with something a team can use.',
  hint: 'Open a file to read the full case.',
};

export const projects: Project[] = [
  {
    id: 'novacart',
    file: '001',
    title: 'NovaCart',
    kicker: 'Personalized recommendation engine',
    summary:
      'A requirements-first blueprint for personalized recommendations, built on the Olist Brazilian e-commerce dataset, with a working Power BI dashboard.',
    tags: ['PostgreSQL', 'Power BI', 'DAX', 'BRD'],
    problem:
      '"Add personalized recommendations" is a wish, not a spec. The business needed to know what to build, how to measure it, and how to handle customer data responsibly under the DPDP Act.',
    approach: [
      'Explored the Olist Brazilian e-commerce dataset in PostgreSQL to understand orders, customers and revenue.',
      'Mapped the stakeholders and wrote a BRD with scope, KPI definitions and success criteria.',
      'Specified A/B testing requirements so the engine is judged on evidence, not opinion.',
      'Documented DPDP Act privacy compliance for using customer behaviour data.',
      'Built a Power BI dashboard with DAX measures for Total Revenue, AOV and Repeat Purchase Rate.',
    ],
    deliverables: ['21-page report', 'BRD', 'A/B test requirements', 'DPDP Act compliance', 'KPI definitions', 'Stakeholder map', 'Power BI dashboard'],
    outcome:
      'The data told a clear story: an average order value of about 159 BRL, a repeat purchase rate of about 3.1%, and a revenue spike in November. A repeat rate that low is the business case for personalization.',
    metrics: [
      { value: '~159 BRL', label: 'Average order value' },
      { value: '~3.1%', label: 'Repeat purchase rate' },
      { value: 'Nov', label: 'Revenue spike' },
      { value: '21', label: 'Page report' },
    ],
    link: 'https://github.com/tortootech/novacart-recommendation-engine-ba',
  },
  {
    id: 'matri',
    file: '002',
    title: 'Matri',
    kicker: 'Trust badge repair',
    summary:
      'A full BRD, FRD and SRS plus an Agile backlog, built from a live stakeholder elicitation session and a live website audit.',
    tags: ['Requirements', 'Elicitation', 'Agile'],
    problem:
      'Trust badges are the small signals that tell a shopper a brand is legitimate. Matri’s were not doing their job, and the brand was missing from marketplaces where its customers already shop.',
    approach: [
      'Ran a live stakeholder elicitation session to find the real problem behind the request.',
      'Audited the live website and found broken badge links.',
      'Checked distribution across platforms and documented the gaps, including no presence on Nykaa or Myntra.',
      'Turned the findings into a BRD, FRD and SRS, then broke the work into an Agile backlog.',
    ],
    deliverables: ['11-page report', 'BRD', 'FRD', 'SRS', 'Agile backlog', 'Live website audit'],
    outcome:
      'A traceable path from one stakeholder conversation to buildable backlog items, with the broken badge links and distribution gaps written up as concrete requirements.',
    metrics: [
      { value: '11', label: 'Page report' },
      { value: '3', label: 'Specs: BRD, FRD, SRS' },
    ],
    link: 'TODO: link to the Matri report',
  },
  {
    id: 'shopsphere',
    file: '003',
    title: 'ShopSphere',
    kicker: 'End-to-end analyst workflow',
    summary:
      'A fictional Indian e-commerce company with a synthetic six-table dataset, taken from SQL to Power BI to a traced set of requirements.',
    tags: ['SQL', 'Excel', 'Power BI', 'BA docs'],
    problem:
      'What does the whole analyst workflow look like when one person owns it end to end? ShopSphere is a fictional company built to answer exactly that.',
    approach: [
      'Designed a synthetic six-table dataset and its ERD.',
      'Queried it in SQL, then modelled and checked the results in Excel.',
      'Built the reporting layer in Power BI.',
      'Wrote a BRD with 15 requirements and an FRD with 20, linked by a traceability matrix.',
      'Added an SEO strategy layer to connect the data to customer acquisition.',
    ],
    deliverables: ['Six-table dataset', 'ERD', 'SQL analysis', 'Excel models', 'Power BI dashboard', 'BRD', 'FRD', 'Traceability matrix', 'SEO strategy'],
    outcome:
      'Every requirement traces back to a business need and forward to a function, so nothing in the build exists "just because".',
    metrics: [
      { value: '6', label: 'Table dataset' },
      { value: '15', label: 'BRD requirements' },
      { value: '20', label: 'FRD requirements' },
    ],
    link: 'TODO: link to the ShopSphere repo or report',
  },
  {
    id: 'seo',
    file: '004',
    title: 'SEO client work',
    kicker: 'Four clients, four questions',
    summary:
      'Technical audits, copywriting, keyword research and brand audits for small businesses that wanted to be found.',
    tags: ['SEO', 'Audits', 'Content'],
    problem:
      'Four small businesses, each asking some version of the same question: how do we get found, and what should we fix first?',
    approach: [
      'The Timeless Oven: a seasonal blog plus a technical site audit.',
      'Castle Minds Chess Academy: SEO copywriting.',
      'School ERP Next: keyword research.',
      'Matri: a multi-platform brand audit.',
    ],
    deliverables: ['Technical audit', 'Seasonal blog', 'SEO copy', 'Keyword research', 'Brand audit'],
    outcome: 'The Timeless Oven’s technical audit came in at 92% site health.',
    metrics: [
      { value: '92%', label: 'Site health, The Timeless Oven' },
      { value: '4', label: 'Clients' },
    ],
    link: 'TODO: link to samples (blog post, audit PDF)',
  },
];

export interface ExperienceItem {
  dates: string;
  role: string;
  org: string;
  kind: 'work' | 'education' | 'certification';
  points: string[];
}

export const experienceIntro = {
  label: 'Experience',
  title: ['Where the', 'practice happened.'],
};

export const experience: ExperienceItem[] = [
  {
    dates: 'May 2025 – Nov 2025',
    role: 'SEO Executive (Intern)',
    org: 'The Desired Solution, Jaipur',
    kind: 'work',
    points: [
      '30% organic traffic growth and a 120% spike in organic search.',
      '186+ Google Business Profile interactions.',
      'Ran site audits as gap analysis: where the site is, where it should be, and what closes the gap.',
      'Turned KPI monitoring into stakeholder reporting that clients could act on.',
    ],
  },
  {
    dates: 'Sep 2024 – Jul 2025',
    role: 'Member, Operations',
    org: 'JIC Student Core Team, JECRC Incubation Centre',
    kind: 'work',
    points: ['Supported startup incubation and mentoring programmes.', 'Organised Entrepreneurship Development Programme sessions.'],
  },
  {
    dates: 'Mar 2025 – Feb 2026',
    role: 'Co-founder',
    org: 'ALCERA, a women’s hygiene startup',
    kind: 'work',
    points: ['Pitched to 10+ investors.', 'Built the product prototype.'],
  },
  {
    dates: '2023 – 2027',
    role: 'BBA, Digital Marketing',
    org: 'JECRC University, Jaipur',
    kind: 'education',
    points: ['CGPA 8.7'],
  },
  {
    dates: 'In progress',
    role: 'Microsoft Business Analyst Professional Certificate',
    org: 'Coursera',
    kind: 'certification',
    points: ['TODO: expected completion date'],
  },
];

export const about = {
  label: 'About',
  title: ['Curious first.', 'Analyst always.'],
  /** Drop a photo at /public/vartika.jpg, then change this to '/vartika.jpg'. */
  photo: 'TODO: /vartika.jpg',
  photoAlt: 'Portrait of Vartika Yadav',
  photoPlaceholder: 'drop photo here',
  story: [
    'I started in SEO and digital marketing, watching traffic graphs climb and dip. The graphs were fun. The question behind them was more fun: why did that happen, and what should we do about it?',
    'That question pulled me into business analysis. Now I turn fuzzy asks into requirements, raw tables into SQL answers, and dashboards into decisions. Curiosity is the engine; documentation is the steering wheel.',
    'I’m based in Jaipur, finishing a BBA at JECRC University, and looking for Business Analyst roles with the 2027 batch. If your team has a messy problem, I’d like to see it.',
  ],
  marquee: ['Requirements', 'SQL', 'Power BI', 'DAX', 'Stakeholders', 'BRD', 'FRD', 'User stories', 'Excel', 'Python', 'Process flows', 'Traceability', 'A/B tests', 'SEO'],
};

export const contact = {
  label: 'Get in touch',
  /**
   * LinkedIn-style summary, in her voice. Vartika: paste your exact LinkedIn "About" text over this.
   * Every fact here is from her resume.
   */
  summaryTitle: 'Summary',
  summary:
    'I’m a BBA (Digital Marketing) student at JECRC University, Jaipur (2023 to 2027, CGPA 8.7), and I’ve moved from SEO and digital marketing into business analysis. I work in SQL, Excel and Power BI, and I write the requirements documents that turn a vague ask into something a team can build. I’ve done real client work as an SEO intern, served on the student core team at the JECRC Incubation Centre, and co-founded ALCERA, a women’s hygiene startup making algae-based sanitary pads, where I pitched to 10+ investors and built the prototype (Mar 2025 to Feb 2026). I’m looking for Business Analyst roles with the 2027 batch.',
  email: 'vartikay415@gmail.com',
  /** E.164 for the tel: link; `phoneText` is how it reads on the page. */
  phone: '+916261006585',
  phoneText: '+91 62610 06585',
  linkedin: 'https://www.linkedin.com/in/vartika-yadav-b39a23314',
  github: 'https://github.com/tortootech',
  /** File in /public. */
  resume: 'Vartika_Yadav_Resume.pdf',
  location: 'Jaipur, Rajasthan',
  cta: 'Send a message',
  closing: "Let's talk.",
  footer: 'Designed around one messy desk. Built with React, GSAP and Lenis.',
};

/** The contact drawer and its form (Web3Forms; the key is VITE_WEB3FORMS_KEY, see README). */
export const messageForm = {
  fab: 'Message me',
  title: 'Send a message',
  intro: 'A question, a role, a messy problem: write it here and it goes straight to her inbox.',
  noKey: 'The form isn’t connected yet, so this opens your email app with the message filled in.',
  fields: { name: 'Your name', email: 'Your email', subject: 'Subject (optional)', message: 'Message' },
  send: 'Send message',
  sendMail: 'Open in email app',
  sending: 'Sending…',
  success: ['Thanks, I’ll reply soon.', 'Your message is in her inbox.'],
  error: 'That didn’t go through. Try again, or email her directly.',
  retry: 'Try again',
  mailFallback: 'Email instead',
  close: 'Close',
};

/* ---------------------------------------------------------------------------
   Thesis: the two research case studies, shown as two "papers" after the toolkit.
   Every figure comes from the two GitHub repos (README, SQL, BA document).
   --------------------------------------------------------------------------- */

export interface ThesisTool { icon: ToolIcon; name: string; did: string }
export interface ThesisLink { label: string; href: string }
export interface Chapter {
  id: string;
  no: string;
  label: string;
  /** Typographic wordmarks for the split poster: plain names, no logos. */
  marks: { name: string; note?: string }[];
  question: string;
  thesis: string;
  /** Mono note under the thesis (an honesty or method note). */
  note: string;
  built: string[];
  tools: ThesisTool[];
  listTitle: string;
  points: string[];
  links: ThesisLink[];
}

export const thesisIntro = {
  label: 'Thesis',
  title: ['Two research', 'papers.'],
  sub: 'The two questions she spent the longest on, each worked from raw numbers to a written answer.',
};

/** Set when a BRD for the quick-commerce project is confirmed; until then no BRD chip is shown. */
export const TODO_CONFIRM_BRD = 'TODO_CONFIRM_BRD: is there a BRD for the quick-commerce project?';

export const chapters: Chapter[] = [
  {
    id: 'quickcommerce',
    no: '01',
    label: 'Chapter 01 · Quick commerce',
    marks: [
      { name: 'Blinkit', note: '-Rs 3.02 / order' },
      { name: 'Zepto', note: '-Rs 78.75 / order' },
      { name: 'Instamart', note: '-Rs 85.18 / order' },
    ],
    question: 'Why has one quick-commerce player reached profitability while the others haven’t?',
    thesis:
      'Unit economics per order across Blinkit, Zepto and Instamart, traced down one root-cause chain: denser dark stores keep the delivery radius short, a short radius keeps rider cost low, and that, with lighter discounting, is the gap between near break-even and deep losses.',
    note: 'Built on a synthetic order-level dataset, modeled on public reporting.',
    built: [
      'Excel unit-economics model: 26 tabs, 6 PivotTables, dashboard',
      'PostgreSQL analysis on 450,000 orders',
      'Power BI dashboard, 5 pages, DAX',
      'Written case study',
    ],
    tools: [
      { icon: 'excel', name: 'Excel', did: 'The 26-tab model: PivotTables, a data-quality audit, the dashboard and the impact sizing.' },
      { icon: 'sql', name: 'PostgreSQL', did: 'Per-order unit economics on all 450,000 orders, with LAG, NTILE and RANK.' },
      { icon: 'powerbi', name: 'Power BI', did: 'A 5-page dashboard with DAX measures and a fiscal-year slicer.' },
    ],
    listTitle: 'What it shows',
    points: [
      'Blinkit’s EBITDA per order improved from -Rs 35 to -Rs 3.02 (FY24 to FY26). Zepto sits at -Rs 78.75, Instamart at -Rs 85.18.',
      '84% of Blinkit’s FY26 orders ship within 2 km, against 19% for Zepto. Rider cost rises by about Rs 15 an order beyond 3 km.',
      'Zepto discounts 8.5% of order value, Blinkit 5.5%: a gap of about Rs 16.24 an order.',
      'Closing half the discount and rider-cost gap is worth about Rs 735 Cr a year to Zepto and Rs 399 Cr to Instamart.',
    ],
    links: [{ label: 'View on GitHub', href: 'https://github.com/tortootech/quickcommerce-blinkit-zepto-profitability' }],
  },
  {
    id: 'pricevolume',
    no: '02',
    label: 'Chapter 02 · Price-hike tolerance',
    marks: [{ name: 'Britannia' }, { name: 'HUL' }],
    question: 'If prices rise, will customers still buy?',
    thesis:
      'A price-vs-volume analysis of 18 quarters per company at HUL and Britannia. It separates price and mix effects from volume, then runs a profit break-even check: how much volume a company can lose before a price hike stops paying for itself.',
    note: 'Data: company press releases and results; some Britannia volumes from press reports. Directional, not causal.',
    built: [
      'Price simulator',
      'Price/mix gap analysis',
      'Two-year growth view',
      'BA document: stakeholders, KPIs, workflow diagrams, KPI reporting',
      'Agile artifacts: backlog, user stories, 3-sprint plan',
      'PostgreSQL SQL layer',
    ],
    tools: [
      { icon: 'sql', name: 'PostgreSQL', did: 'Schema, quarter ordering, the gap split, correlation, two-year growth with LAG, the simulator and the break-even query.' },
      { icon: 'stories', name: 'Backlog', did: 'A MoSCoW-prioritised, Jira-style backlog with user stories and a 3-sprint plan.' },
      { icon: 'doc', name: 'BA document', did: 'Problem statement, stakeholders, workflow diagrams, KPI definitions and a monthly pricing scorecard.' },
    ],
    listTitle: 'Key features',
    points: [
      'Price simulator: pick a price/mix gap and see every past quarter within 1.5 points of it, and what volume did.',
      'Break-even check: the volume fall at which a price rise stops adding profit, from margin, cost rise and price rise.',
      'Source-linked quarterly data: 36 company-quarters, each with its source link and a verification note.',
      'KPI reporting: a one-page red, amber, green pricing scorecard for the category manager and CFO.',
    ],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/tortootech/price-vs-volume-hul-britannia' },
      { label: 'See the sourced data', href: 'https://github.com/tortootech/price-vs-volume-hul-britannia/blob/main/data/hul_britannia_quarterly.csv' },
      /** The repo has the simulator as a SQL query; there is no hosted simulator yet. */
      { label: 'Open live simulator', href: 'TODO: URL of the live price simulator' },
    ],
  },
];

/** Fallback for any GitHub link that is still a TODO. */
export const githubProfile = 'https://github.com/tortootech';

export interface NavSection { id: string; label: string }
export const nav = {
  contact: 'Contact',
  skip: 'Skip to content',
  /** Page order. The HUD counter and its total come from this list. */
  sections: [
    { id: 'top', label: 'Hero' },
    { id: 'toolkit', label: 'Toolkit' },
    { id: 'thesis', label: 'Thesis' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ] as NavSection[],
};

/** 1-based position of a section in the page order. */
export const sectionNo = (id: string) => nav.sections.findIndex((x) => x.id === id) + 1;
