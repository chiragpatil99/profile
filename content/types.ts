export type NavItem = { id: string; label: string };

export type SocialLinks = {
  email: string;
  github: string;
  linkedin: string;
};

export type Experience = {
  id: string;
  company: string;
  role: string; // TODO: replace with your exact title
  dates: string; // TODO: replace with exact dates
  location?: string;
  summary: string;
  responsibilities: string[];
  achievements: string[]; // Only add verified, measurable results
  technologies: string[];
  accent: "blue" | "violet" | "cyan";
};

export type ProjectKind = "streaming" | "vision" | "infra";

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  kind: ProjectKind;
  technologies: string[];
  highlights: string[];
  problem: string;
  approach: string[];
  architecture: string[];
  tradeoffs: string[];
  results: string[];
  links: { github?: string; demo?: string };
  accent: "blue" | "violet" | "cyan";
};

export type SkillCategory = {
  id: string;
  label: string;
  accent: "blue" | "violet" | "cyan" | "emerald" | "amber" | "rose";
  skills: { name: string; description: string }[];
};

export type Education = {
  school: string;
  degree: string; // TODO
  dates: string; // TODO
  coursework: string[];
  achievements: string[];
  research: string;
};

export type JourneyStep = {
  label: string;
  title: string;
  body: string;
};

export type TerminalContent = {
  about: string[];
  contact: string[];
};
