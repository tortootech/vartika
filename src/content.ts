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
  url: 'https://vartikayadav.in/',
};

export const intro = {
  hello: "Hey, it's Vartika.",
  sub: 'Curious first. Analyst somewhere in between.',
};

export const hero = {
  name: 'Vartika Yadav.',
  /** Under her name, one row each. The second pair is set lighter. */
  lead: ['A chaos of numbers.', 'A curiosity that won’t quit.', 'Some questions lead to answers,', 'others lead to another Excel sheet.'],
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
        { name: 'SQL / PostgreSQL', detail: 'joins, aggregations, subqueries', icon: 'sql', use: 'Pulling and sanity-checking the numbers before anyone builds a chart on them.' },
        { name: 'Excel', detail: 'pivot tables, XLOOKUP, SUMIFS', icon: 'excel', use: 'Quick models, reconciliations and the first look at any new dataset.' },
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
      'A self-initiated audit: a full BRD, FRD and SRS plus an Agile backlog, built from a live stakeholder elicitation session and a live website audit.',
    tags: ['Requirements', 'Elicitation', 'Agile'],
    problem:
      'Trust badges are the small signals that tell a shopper a brand is legitimate. Matri’s were not doing their job, and the brand was missing from marketplaces where its customers already shop.',
    approach: [
      'Ran a live stakeholder elicitation session to find the real problem behind the request.',
      'Audited the live website: 2 of its 6 trust badges linked to dead URLs.',
      'Checked distribution across platforms and documented the gaps, including no presence on Nykaa or Myntra.',
      'Turned the findings into a BRD, FRD and SRS, then broke the work into an Agile backlog.',
      'Traced 6 requirements end to end (BRD to FRD to backlog) and sized 6 user stories at 20 points for a 2-week sprint.',
    ],
    deliverables: ['BRD', 'FRD', 'SRS', 'Agile backlog', 'Traceability', 'Live website audit'],
    outcome:
      'A traceable path from one stakeholder conversation to buildable backlog items, with the broken badge links and distribution gaps written up as concrete requirements.',
    metrics: [
      { value: '2 of 6', label: 'Trust badges with dead links' },
      { value: '6', label: 'Requirements traced end to end' },
      { value: '20', label: 'Story points, one 2-week sprint' },
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
  /** Optional links shown under the entry (open in a new tab). */
  links?: { label: string; href: string }[];
}

export const experienceIntro = {
  label: 'Experience',
  title: ['Where the', 'practice happened.'],
};

export const experience: ExperienceItem[] = [
  {
    // the resume gives no date for the certificate, so the date slot reads "Certification"
    dates: 'Certification',
    role: 'Microsoft Business Analyst Professional Certificate',
    org: 'Coursera',
    kind: 'certification',
    points: [],
  },
  {
    dates: 'Feb 2026 – Present',
    role: 'Co-Founder',
    org: 'Airflow Station',
    kind: 'work',
    points: [
      'Building street-light-style infrastructure that generates its own power from solar and traffic wind wake and purifies the air.',
      'Incubated at IIT Jodhpur; won Envirothon at Dr. B Lal Institute of Technology.',
      'IIT Jodhpur representative at the MSME Idea Hackathon; TIE Global Pitchathon (Delhi NCR) finalist.',
    ],
    links: [
      { label: 'Website', href: 'https://airflowstation.netlify.app/' },
      { label: 'GitHub', href: 'https://github.com/tortootech/AirFlow' },
    ],
  },
  {
    dates: 'May 2025 – Nov 2025',
    role: 'SEO Executive (Intern)',
    org: 'The Desired Solution, Jaipur',
    kind: 'work',
    points: [
      'Weak organic visibility on client sites; ran technical audits and on-page fixes, growing traffic 30% with a 120% search spike.',
      'Reported KPIs to clients; one site reached 92% site health; drove 186+ Google Business Profile interactions.',
    ],
  },
  {
    dates: 'Sep 2024 – Jul 2025',
    role: 'Member, Operations',
    org: 'JIC Student Core Team, JECRC Incubation Centre',
    kind: 'work',
    points: ['Ran operations for 5+ events; supported startup incubation, mentoring and Entrepreneurship Development sessions.'],
  },
  {
    dates: '2024 – 2027',
    role: 'BBA',
    org: 'JECRC University, Jaipur',
    kind: 'education',
    points: ['CGPA 8.8'],
  },
];

/**
 * About: her own words, first person. No photo anywhere on the site (her choice):
 * the illustration is built from the pieces of her story.
 * Each beat has one key phrase (`key`, an exact substring of `text`) set in the slate accent.
 */
export const about = {
  label: 'About',
  beats: [
    {
      text: 'I’ve never really been a straight-line kind of person. My path has been a little messy: BBA, SEO, a startup idea, too many Excel sheets, and a growing habit of asking why?',
      key: 'a growing habit of asking why?',
    },
    {
      text: 'SEO was where I first fell for the numbers: spotting patterns, figuring out why traffic moved, and understanding what people were actually doing behind the graphs.',
      key: 'fell for the numbers',
    },
    {
      text: 'That curiosity grew into something bigger: an interest in how businesses work, how people make decisions, and how data can make those decisions clearer.',
      key: 'how data can make those decisions clearer',
    },
    {
      text: 'Now I’m building that through SQL, Excel, Power BI and Business Analysis.',
      key: 'SQL, Excel, Power BI and Business Analysis',
    },
    {
      text: 'I like the messy questions. That’s usually where the interesting answers are.',
      key: 'I like the messy questions.',
    },
  ],
  /** Pieces of the illustration: tags from her path and numbers from her resume. */
  tags: ['BBA', 'SEO', 'startup', 'Excel', 'SQL', 'Power BI'],
  numbers: ['30%', '120%', '186+', '92%', '5+', '8.8', '2027'],
};

export const contact = {
  label: 'Get in touch',
  /** The big two-line name in the Contact section. */
  name: ['Vartika', 'Yadav'],
  focus: ['Business Analysis', 'SQL', 'Power BI', 'Excel'],
  location: 'Jaipur, Rajasthan, India',
  email: 'vartika.analyst@gmail.com',
  /** E.164 for the tel: link; `phoneText` is how it reads on the page. */
  phone: '+916261006585',
  phoneText: '+91 62610 06585',
  linkedin: 'https://www.linkedin.com/in/vartika-yadav-b39a23314',
  github: 'https://github.com/tortootech',
  /** File in /public. Opens in the browser's PDF viewer (no download). */
  resume: 'Vartika_Yadav_Resume.pdf',
  resumeText: 'View resume',
  closing: "Let's talk.",
  footer: 'Designed around one messy desk. Built with React, GSAP and Lenis.',
};

/** The inline "Connect with me" form (Web3Forms; the key is VITE_WEB3FORMS_KEY, see README). */
export const contactForm = {
  cta: 'Connect with me',
  title: 'Connect with me',
  noKey: 'The form isn’t connected yet, so sending opens your email app with the message filled in.',
  fields: { name: 'Your name', email: 'Email address', phone: 'Phone number (optional)', message: 'Message' },
  maxMessage: 2000,
  send: 'Connect with me',
  sendMail: 'Open in email app',
  sending: 'Sending…',
  success: 'Thanks, I’ll get back to you soon',
  error: 'That didn’t go through. Try again, or email me directly.',
  retry: 'Try again',
  mailFallback: 'Email instead',
};

/** Top-bar resume button. */
export const resumeButton = { label: 'Resume', aria: 'View resume (opens in a new tab)' };

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
  noteAtLabel?: boolean;
  built: string[];
  tools: ThesisTool[];
  listTitle: string;
  points: string[];
  links: ThesisLink[];
}

export const thesisIntro = {
  label: 'Selected work',
  title: ['Two case', 'studies.'],
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
    note: 'SYNTHETIC DATA · MODELLED ON PUBLIC REPORTING',
    /** Shown beside the chapter label, so it is seen first. */
    noteAtLabel: true,
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
      'In the model, Blinkit’s EBITDA per order improved from -Rs 35 to -Rs 3.02 (FY24 to FY26). Zepto sits at -Rs 78.75, Instamart at -Rs 85.18.',
      '84% of Blinkit’s FY26 orders ship within 2 km, against 19% for Zepto. Rider cost rises by about Rs 15 an order beyond 3 km.',
      'Zepto discounts 8.5% of order value, Blinkit 5.5%: a gap of about Rs 16.24 an order.',
      'In the model, closing half the discount and rider-cost gap is worth about Rs 735 Cr a year to Zepto and Rs 399 Cr to Instamart.',
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
  skip: 'Skip to content',
  /** Page order. The HUD counter and its total come from this list. */
  sections: [
    { id: 'top', label: 'Hero' },
    { id: 'toolkit', label: 'Toolkit' },
    { id: 'thesis', label: 'Case studies' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ] as NavSection[],
};

/** 1-based position of a section in the page order. */
export const sectionNo = (id: string) => nav.sections.findIndex((x) => x.id === id) + 1;
