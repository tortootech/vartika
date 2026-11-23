/* ==========================================================================
   content.ts: every word on the site lives here.
   Vartika: edit freely. Anything starting with "TODO" is a placeholder.
   TODO values are hidden on the live site and shown as dashed badges
   while you run `npm run dev`, so you can spot what is missing.
   ========================================================================== */

export const isTodo = (v?: string | null): boolean => !v || v.trim().startsWith('TODO');

export const site = {
  name: 'Vartika Yadav',
  barName: 'VARTIKA—',
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
  sub: 'Six case files. Each one starts with a messy question and ends with something a team can use.',
  hint: 'Open a file to read the full case.',
};

export const projects: Project[] = [
  {
    id: 'pricevolume',
    file: '001',
    title: 'Price vs Volume',
    kicker: 'HUL and Britannia: raise, shrink or hold?',
    summary:
      '18 quarters of reported results from Hindustan Unilever and Britannia, asking one question: what happens to volume when prices go up?',
    tags: ['PostgreSQL', 'Excel', 'Agile'],
    problem:
      'When costs rise, an FMCG company can raise prices, shrink the pack or hold. Companies do not report the trade-off directly, so the question is what the reported numbers say happened to volume when each company pushed prices up.',
    approach: [
      'Built a 36 company-quarter dataset (Apr 2022 to Sep 2026) with a source link and a verification note on every row.',
      'Estimated the price/mix gap: sales growth minus volume growth, year on year.',
      'Split the quarters at a 6-point gap and compared volume growth in PostgreSQL, with correlation and price-cycle queries.',
      'Used two-year growth to remove the base effect of the September 2025 GST change.',
      'Wrote a BA document with the problem statement, stakeholders, KPIs, requirements and an Agile plan.',
    ],
    deliverables: ['Sourced 36-row dataset', 'PostgreSQL queries', 'Price simulator', 'BA document', 'Agile backlog'],
    outcome:
      'Britannia’s volume grew about 1% in the 8 quarters with a gap of 6 points or more, against about 6.7% in the other 10. HUL showed no such penalty (5.2% vs about 2.8%). With 18 quarters and two companies, the pattern is directional, not a measured elasticity.',
    metrics: [
      { value: '~1.0%', label: 'Britannia volume growth, 6+ pt gap' },
      { value: '~6.7%', label: 'Britannia volume growth, other quarters' },
      { value: '18', label: 'Quarters analysed' },
      { value: '36', label: 'Sourced company-quarters' },
    ],
    link: 'https://github.com/tortootech/price-vs-volume-hul-britannia',
  },
  {
    id: 'quickcommerce',
    file: '002',
    title: 'Quick-Commerce',
    kicker: 'Blinkit vs Zepto vs Instamart',
    summary:
      'Why Blinkit is closing in on break-even while Zepto and Instamart lose far more per order, modelled on 450,000 orders.',
    tags: ['PostgreSQL', 'Power BI', 'Excel', 'DAX'],
    problem:
      'Which quick-commerce player has the healthiest unit economics, and what would it take for the others to catch up?',
    approach: [
      'Generated 450,000 synthetic orders across FY24 to FY26, calibrated to each company’s publicly reported scale.',
      'Ran 15 data-quality checks before any analysis.',
      'Built per-order unit economics in PostgreSQL: AOV, discount, rider cost and EBITDA per order, using LAG, NTILE and RANK.',
      'Built a 5-page Power BI dashboard with DAX measures, plus an Excel workbook with PivotTables and a data-quality audit.',
      'Sized the impact of Zepto closing half its discount and rider-cost gap to Blinkit.',
    ],
    deliverables: ['450K-order model', '15 data-quality checks', 'PostgreSQL analysis', '5-page Power BI dashboard', 'DAX measures', 'Excel workbook'],
    outcome:
      'Blinkit’s EBITDA per order improved from -Rs 35 to -Rs 3.02, against -Rs 78.75 for Zepto and -Rs 85.18 for Instamart. 84% of Blinkit’s FY26 orders ship within 2 km, against 19% for Zepto. Closing half the discount and rider-cost gap is worth about Rs 735 Cr a year to Zepto. The orders are synthetic, so this is a model, not company disclosures.',
    metrics: [
      { value: '-Rs 3.02', label: 'Blinkit EBITDA per order, FY26' },
      { value: '-Rs 78.75', label: 'Zepto EBITDA per order' },
      { value: '84% vs 19%', label: 'Orders within 2 km, Blinkit vs Zepto' },
      { value: '~Rs 735 Cr', label: 'Yearly value to Zepto' },
    ],
    link: 'https://github.com/tortootech/quickcommerce-blinkit-zepto-profitability',
  },
  {
    id: 'novacart',
    file: '003',
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
    file: '004',
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
    file: '005',
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
    file: '006',
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
    points: ['CGPA ~8.7'],
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
  principlesTitle: 'Working principles',
  principles: [
    { title: 'Ask the second why.', body: 'The first answer is usually the symptom.' },
    { title: 'Write the requirement so a stranger can build it.', body: 'If it needs me in the room to explain it, it isn’t finished.' },
    { title: 'Numbers over adjectives.', body: '"Faster" is a feeling. A target is a requirement.' },
    { title: 'Clean the data before you trust the chart.', body: 'Nulls and duplicates lie quietly.' },
    { title: 'Every requirement traces to a reason.', body: 'If it can’t, it gets cut.' },
    { title: 'Talk to the people who do the work.', body: 'Not just the people who describe it.' },
    { title: 'One dashboard, one decision.', body: 'Everything else is decoration.' },
    { title: 'Leave the desk tidier than you found it.', body: 'Docs, files, handovers. All of it.' },
  ],
  marquee: ['Requirements', 'SQL', 'Power BI', 'DAX', 'Stakeholders', 'BRD', 'FRD', 'User stories', 'Excel', 'Python', 'Process flows', 'Traceability', 'A/B tests', 'SEO'],
};

export const contact = {
  label: 'Get in touch',
  faq: [
    {
      q: 'What does she do?',
      a: 'Vartika is an aspiring Business Analyst. She gathers and writes requirements (BRD, FRD, SRS, user stories), digs into data with SQL, Excel and Python, and builds Power BI dashboards that make the answer obvious.',
    },
    { q: 'Where is she based?', a: 'Jaipur, India.' },
    {
      q: 'Is she open to internships and full-time roles?',
      a: 'Yes. She is looking for Business Analyst internships now and full-time roles with the 2027 batch.',
    },
    { q: 'Best way to reach her?', a: 'Email is best. Phone and LinkedIn work too. All of them are right below, along with her resume.' },
  ],
  closing: "Let's talk.",
  links: [
    { label: 'Email', href: 'mailto:vartikay415@gmail.com', text: 'vartikay415@gmail.com' },
    { label: 'Phone', href: 'tel:+916261006585', text: '+91 62610 06585' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vartika-yadav-b39a23314' },
    { label: 'GitHub', href: 'https://github.com/tortootech' },
    { label: 'Resume', href: 'Vartika_Yadav_Resume.pdf', text: 'Resume (PDF)', download: true },
  ],
  footer: 'Designed around one messy desk. Built with React, GSAP and Lenis.',
};

export const nav = {
  contact: 'Contact',
  skip: 'Skip to content',
  sections: ['Hero', 'Toolkit', 'Projects', 'Experience', 'About', 'Contact'],
};
