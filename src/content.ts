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
  url: 'TODO: production URL, e.g. https://vartika.vercel.app',
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
  sub: 'Four case files. Each one starts with a messy question and ends with something a team can use.',
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
    link: 'TODO: link to the NovaCart report or dashboard (PDF, Drive, GitHub)',
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
    dates: 'TODO: start – end, e.g. Jun 2025 – Aug 2025',
    role: 'SEO & Digital Marketing Intern',
    org: 'The Desired Solution',
    kind: 'work',
    points: [
      '30% organic traffic growth and a 120% spike in organic search.',
      '186+ Google Business Profile interactions.',
      'Ran site audits as gap analysis: where the site is, where it should be, and what closes the gap.',
      'Turned KPI monitoring into stakeholder reporting that clients could act on.',
    ],
  },
  {
    dates: 'TODO: start – end',
    role: 'Core Team Member',
    org: 'JECRC Innovation and Incubation Center (JIC)',
    kind: 'work',
    points: ['TODO: one or two lines on what she did at JIC'],
  },
  {
    dates: 'TODO: start – end',
    role: 'Co-founder',
    org: 'ALCERA',
    kind: 'work',
    points: ['TODO: one or two lines on what ALCERA is and her role in it'],
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
    { q: 'Best way to reach her?', a: 'Email is best, and LinkedIn works too. Both are right below.' },
  ],
  closing: "Let's talk.",
  links: [
    { label: 'Email', href: 'TODO: mailto:her-address@example.com' },
    { label: 'LinkedIn', href: 'TODO: https://www.linkedin.com/in/…' },
    { label: 'GitHub', href: 'TODO: https://github.com/…' },
    { label: 'Resume', href: 'TODO: /Vartika-Yadav-Resume.pdf (put the PDF in /public)', download: true },
  ],
  footer: 'Designed around one messy desk. Built with React, GSAP and Lenis.',
};

export const nav = {
  contact: 'Contact',
  skip: 'Skip to content',
  sections: ['Hero', 'Toolkit', 'Projects', 'Experience', 'About', 'Contact'],
};
