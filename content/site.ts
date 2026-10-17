import type {
  Education,
  Experience,
  JourneyStep,
  NavItem,
  Project,
  SkillCategory,
  SocialLinks,
} from "./types";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  CENTRAL CONTENT FILE
 *  Everything personal on the site is read from here.
 *  Anything marked TODO is a placeholder — replace it before you deploy.
 *  Nothing here is a claimed metric or date unless you verified it yourself.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Chirag Patil",
  firstName: "Chirag",
  title: "Software Engineer",
  titleLine: "Backend & Distributed Systems · Cloud Infrastructure · AI/ML",
  description:
    "Chirag Patil is a software engineer focused on backend systems, distributed systems, cloud infrastructure and applied AI. Previously at Amazon Web Services.",
  // TODO: set your deployed URL (also used for sitemap, canonical and Open Graph)
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://chirag-patil.vercel.app",
  // TODO: add your real resume PDF at /public/resume.pdf
  resume: { href: "/resume.pdf", fileName: "Chirag-Patil-Resume.pdf", updated: "TODO: add date" },
  rotatingLines: [
    "I build systems that scale.",
    "I turn complex problems into reliable software.",
    "I engineer the infrastructure behind great products.",
  ],
  intro:
    "Software Engineer with experience building reliable backend systems and cloud infrastructure at AWS. Passionate about distributed systems, AI, and creating technology that solves meaningful problems.",
} as const;

export const socials: SocialLinks = {
  // TODO: replace all three with your real links
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "your-email@example.com",
  github: "https://github.com/your-username",
  linkedin: "https://www.linkedin.com/in/your-handle",
};

export const nav: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export const about = {
  heading: "Reliable systems are a craft.",
  paragraphs: [
    "I like the part of software that only shows up when something goes wrong: the retry that saves a request, the alarm that fires before a customer notices, the design that degrades instead of falling over.",
    "At AWS I worked on backend services and reliability for Amazon RDS, where small mistakes are expensive and operations are part of the job. It taught me to read a system from the outside in, debug with evidence, and own what I ship after it ships.",
    "Alongside that I study computer science at the graduate level at Virginia Tech and build full-stack and machine learning projects: streaming analytics pipelines, computer vision research, and the occasional tool I wanted to exist.",
  ],
  pillars: [
    { title: "Ownership", body: "I stay with a problem past the merge: monitoring, rollout, and the follow-up nobody asked for." },
    { title: "Curiosity", body: "I read the logs, then the source, then the paper. Understanding the mechanism beats memorizing the fix." },
    { title: "Pragmatism", body: "I pick the simplest design that survives contact with production, and say so when I'm trading something away." },
  ],
};

export const journey: JourneyStep[] = [
  {
    label: "Foundations",
    title: "Backend fundamentals",
    body: "Python and Java, APIs, data structures, and how services talk to each other.", // TODO: tailor
  },
  {
    label: "Graduate study",
    title: "Virginia Tech",
    body: "Graduate-level computer science: systems, data, and machine learning depth.", // TODO: tailor
  },
  {
    label: "Industry",
    title: "AWS · Amazon RDS",
    body: "Reliability, backend services and cloud infrastructure in production.",
  },
  {
    label: "Now",
    title: "Product + AI engineering",
    body: "Streaming data, computer vision, and agents on top of solid backend foundations.",
  },
];

export const experience: Experience[] = [
  {
    id: "aws",
    company: "Amazon Web Services (AWS)",
    role: "Software Engineer", // TODO: exact title / level
    dates: "[Start date] – [End date or Present]", // TODO
    location: "[City, State]", // TODO
    summary:
      "Backend engineering and reliability work on Amazon RDS: building and operating production services that customers' databases depend on.",
    responsibilities: [
      "Designed, built and maintained backend services supporting Amazon RDS.",
      "Worked on reliability: failure modes, alarms, runbooks and operational readiness.",
      "Debugged production issues across distributed components, from symptoms to root cause.",
      "Practiced operational excellence: on-call ownership, reviews and follow-through on corrective actions.",
    ],
    achievements: [
      "[Add a verified, non-confidential, measurable result here]", // TODO
      "[Add another verified result, or delete this line]", // TODO
    ],
    technologies: ["Java", "Python", "AWS", "Amazon RDS", "Distributed Systems", "Reliability Engineering"],
    accent: "cyan",
  },
  {
    id: "placeholder-next",
    company: "[Another role or internship]", // TODO: edit or delete this entry
    role: "[Title]",
    dates: "[Dates]",
    summary: "[One or two sentences on the problem you worked on and what you owned.]",
    responsibilities: ["[What you built or maintained]", "[How you worked with the team]"],
    achievements: ["[Verified, measurable outcome]"],
    technologies: ["[Tech]", "[Tech]"],
    accent: "violet",
  },
];

export const projects: Project[] = [
  {
    slug: "realtime-ecommerce-analytics",
    title: "Real-Time E-Commerce Analytics & Dynamic Pricing",
    tagline: "Streaming events in, live dashboards and price signals out.",
    kind: "streaming",
    technologies: ["React", "FastAPI", "Kafka", "Apache Spark Streaming"],
    highlights: [
      "Real-time event processing",
      "Analytics dashboards",
      "Dynamic pricing workflows",
      "Backend APIs and data pipelines",
    ],
    problem:
      "Storefront events (views, carts, purchases) arrive continuously. Batch reports are always behind, so pricing and merchandising decisions react to yesterday's demand.",
    approach: [
      "Publish storefront events to Kafka topics, partitioned so related events stay ordered.",
      "Aggregate with Spark Streaming over windows to produce demand and conversion signals.",
      "Expose results through FastAPI endpoints consumed by a React dashboard.",
      "Feed the signals into a pricing workflow that proposes price changes within configured guardrails.",
    ],
    architecture: [
      "Event producers → Kafka topics",
      "Spark Streaming jobs (windowed aggregation)",
      "Serving layer: FastAPI",
      "React dashboard + pricing workflow",
    ],
    tradeoffs: [
      "Window size trades freshness against stability of the signal.",
      "At-least-once delivery means aggregations must be idempotent.",
      "Pricing changes are bounded by guardrails rather than fully automatic.",
    ],
    results: [
      "[Add verified results: latency, throughput, accuracy, lift. Delete if none.]", // TODO
    ],
    links: { github: undefined, demo: undefined }, // TODO: add URLs
    accent: "blue",
  },
  {
    slug: "computer-vision-research",
    title: "AI-Powered Computer Vision Research",
    tagline: "Open-vocabulary detection feeding promptable segmentation.",
    kind: "vision",
    technologies: ["Python", "PyTorch", "Grounding DINO", "Segment Anything"],
    highlights: [
      "Object detection",
      "Image segmentation",
      "Machine learning pipelines",
      "Model evaluation",
    ],
    problem:
      "Labeling segmentation masks by hand is slow. Combining text-prompted detection with promptable segmentation can produce masks for new object categories without training a new model for each one.",
    approach: [
      "Use Grounding DINO to turn a text prompt into bounding boxes.",
      "Pass those boxes as prompts to Segment Anything to get masks.",
      "Wrap the steps in a reproducible PyTorch pipeline with configurable thresholds.",
      "Evaluate against reference annotations and inspect failure cases by hand.",
    ],
    architecture: [
      "Image + text prompt",
      "Grounding DINO → boxes",
      "Segment Anything → masks",
      "Evaluation and error analysis",
    ],
    tradeoffs: [
      "Detection thresholds trade missed objects against false positives.",
      "Large models are accurate but costly to run at scale.",
      "Prompt wording changes results, so it needs to be part of the evaluation.",
    ],
    results: [
      "[Add verified evaluation results (metric, dataset). Delete if none.]", // TODO
    ],
    links: { github: undefined, demo: undefined },
    accent: "violet",
  },
  {
    slug: "cloud-distributed-systems",
    title: "Cloud & Distributed Systems Engineering",
    tagline: "Backend and infrastructure work, described without confidential detail.",
    kind: "infra",
    technologies: ["AWS", "Java", "Python", "Distributed Systems", "Reliability Engineering"],
    highlights: [
      "Reliability and operational excellence",
      "Production backend services",
      "Failure-mode thinking",
      "Public architecture patterns",
    ],
    problem:
      "[Describe a problem in general terms. Do not include confidential AWS information, internal service names or internal architecture.]", // TODO
    approach: [
      "[General engineering approach, e.g. how you reasoned about failure modes]",
      "[Public patterns you applied: retries with backoff, idempotency, timeouts, circuit breakers]",
    ],
    architecture: ["[Generic diagram or description built only from public concepts]"],
    tradeoffs: ["[A real tradeoff you weighed, stated generally]"],
    results: ["[Only verified and shareable outcomes]"],
    links: { github: undefined, demo: undefined },
    accent: "cyan",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    label: "Languages",
    accent: "blue",
    skills: [
      { name: "Python", description: "Backend services, data pipelines and ML research code." },
      { name: "Java", description: "Production backend services." },
      { name: "TypeScript", description: "Typed frontends and Node services." },
      { name: "JavaScript", description: "The web platform and tooling." },
      { name: "SQL", description: "Querying and modeling relational data." },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    accent: "violet",
    skills: [
      { name: "REST APIs", description: "Resource-oriented design, versioning, error contracts." },
      { name: "FastAPI", description: "Typed Python APIs, used in the analytics project." },
      { name: "Node.js", description: "JavaScript on the server." },
      { name: "Microservices", description: "Service boundaries, communication and failure isolation." },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & Infrastructure",
    accent: "cyan",
    skills: [
      { name: "AWS", description: "Cloud services, including professional work on Amazon RDS." },
      { name: "Cloud Computing", description: "Designing for elasticity and shared responsibility." },
      { name: "Distributed Systems", description: "Consistency, queues, retries and partial failure." },
      { name: "Reliability Engineering", description: "Alarms, runbooks, debugging and operational readiness." },
    ],
  },
  {
    id: "data",
    label: "Data & Streaming",
    accent: "emerald",
    skills: [
      { name: "Kafka", description: "Partitioned event logs and consumer groups." },
      { name: "Apache Spark", description: "Streaming and batch processing." },
      { name: "Data Pipelines", description: "Moving and transforming data reliably." },
    ],
  },
  {
    id: "ai",
    label: "AI / ML",
    accent: "amber",
    skills: [
      { name: "PyTorch", description: "Model code and experimentation." },
      { name: "Computer Vision", description: "Detection and segmentation." },
      { name: "Grounding DINO", description: "Text-prompted open-vocabulary detection." },
      { name: "Segment Anything", description: "Promptable image segmentation." },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    accent: "rose",
    skills: [
      { name: "React", description: "Component-driven interfaces." },
      { name: "Next.js", description: "App Router, SSR and static rendering." },
      { name: "Tailwind CSS", description: "Utility-first styling and design tokens." },
    ],
  },
];

export const education: Education = {
  school: "Virginia Tech",
  degree: "Master's in Computer Science", // TODO: exact degree title
  dates: "[Start] – [End]", // TODO
  coursework: ["[Course]", "[Course]", "[Course]"], // TODO
  achievements: ["[Honors, awards or leave empty]"], // TODO
  research: "[Describe research or thesis work, or remove this field.]", // TODO
};

export const exploring = [
  { title: "AI agents", body: "Tool use, evaluation, and where agents need guardrails." },
  { title: "Distributed systems", body: "Consistency models, queues and failure testing." },
  { title: "Modern cloud infrastructure", body: "Reliable platforms and the economics of operating them." },
];
