import type {
  ContactInfo,
  ContactLink,
  ExperienceItem,
  PortfolioData,
  Project,
  SkillGroup,
} from "@/lib/portfolio/types";

export const defaultProjects: Project[] = [
  {
    id: "cohort-hcm",
    slug: "cohort-hcm",
    title: "Cohort HCM",
    description:
      "A modern, cloud-based Human Capital Management solution engineered for the next generation of digital-first enterprises.",
    longDescription:
      "A modern, cloud-based Human Capital Management solution engineered for the next generation of digital-first enterprises.",
    imageUrl: null,
    tags: ["Laravel", "React", "Next.js", "PostgreSQL"],
    category: "PHP/Laravel",
    employer: "Cohort HCM",
    role: "Lead Fullstack Architect",
    year: "2024",
    problem:
      "Legacy HCM systems are often characterized by fragmented architectures, sluggish interfaces, and a lack of real-time data synchronization. Enterprises struggle with siloed employee data, manual payroll overhead, and rigid scaling capabilities.",
    solution:
      "Cohort HCM leverages a unified data layer to eliminate silos. Built with high-frequency performance in mind, it provides an intuitive, consumer-grade experience for employees while offering robust, automated tools for HR teams.",
    features: [
      "Automated onboarding workflows, intelligent leave management, and real-time payroll reconciliation reduce manual intervention by up to 60%.",
      "Built using a micro-services ready approach, ensuring the platform scales effortlessly from startups to global enterprises without performance degradation.",
      "Multi-layer encryption, SOC2 compliance standards, and granular RBAC to keep sensitive human capital data protected.",
    ],
    techStack: [
      { name: "Laravel", icon: "terminal", description: "Core Logic & API" },
      { name: "React", icon: "layers", description: "Dynamic UI" },
      { name: "Next.js", icon: "sparkles", description: "SSR & Performance" },
      { name: "PostgreSQL", icon: "database", description: "Data Persistence" },
    ],
    featured: true,
    displayOrder: 1,
  },
  {
    id: "smart-inventory",
    slug: "smart-inventory",
    title: "SmartInventory Pro",
    description:
      "Enterprise-grade inventory tracking with automated restocking alerts and real-time analytics.",
    imageUrl: null,
    tags: ["Laravel", "MySQL"],
    category: "PHP/Laravel",
    features: [],
    techStack: [],
    featured: false,
    displayOrder: 2,
  },
  {
    id: "edusphere",
    slug: "edusphere",
    title: "EduSphere LMS",
    description:
      "Scalable e-learning solution managing courses, student progress, and interactive certifications.",
    imageUrl: null,
    tags: ["PHP", "JavaScript"],
    category: "PHP/Laravel",
    features: [],
    techStack: [],
    featured: false,
    displayOrder: 3,
  },
  {
    id: "neural-nexus",
    slug: "neural-nexus",
    title: "NeuralNexus",
    description:
      "An AI-driven personal assistant for developers that automates documentation and test generation.",
    imageUrl: null,
    tags: ["Python", "NLP"],
    category: "AI/ML",
    features: [],
    techStack: [],
    featured: false,
    displayOrder: 4,
  },
  {
    id: "vault-x",
    slug: "vault-x",
    title: "Vault-X",
    description:
      "A secure digital wallet featuring instant currency conversion and multi-layer encryption.",
    imageUrl: null,
    tags: ["Next.js", "Prisma"],
    category: "React/Next.js",
    features: [],
    techStack: [],
    featured: false,
    displayOrder: 5,
  },
];

export const defaultExperience: ExperienceItem[] = [
  {
    id: "l-one",
    company: "L-One Systems",
    role: "Full-Stack Developer",
    period: "Present",
    description:
      "Architecting AI-driven development workflows and scalable backend systems using NestJS, Supabase, and TYPO3. Focused on high-performance integration and modular architecture.",
    tags: ["AI Development", "NestJS", "Supabase"],
    isCurrent: true,
  },
  {
    id: "cubeta",
    company: "Cubeta",
    role: "Back-End Developer",
    period: "2022 - 2024",
    description:
      "Engineered robust RESTful APIs with PHP/Laravel. Optimized MySQL database schemas for high-traffic environments, significantly reducing query latency and improving system reliability.",
    tags: ["Laravel", "MySQL", "REST API"],
  },
  {
    id: "data-bank",
    company: "Data Bank",
    role: "Help Desk Support",
    period: "2019 - 2022",
    description:
      "Provided critical technical support and troubleshooting. Managed hardware and software infrastructure while maintaining high SLA standards for enterprise-level data operations.",
    tags: ["Troubleshooting", "IT Support"],
  },
];

export const defaultSkillGroups: SkillGroup[] = [
  {
    id: "languages",
    title: "Languages",
    icon: "terminal",
    skills: ["C", "JavaScript", "PHP", "SQL", "TypeScript"],
    description: "Production languages I rely on for application and systems work.",
    displayOrder: 1,
  },
  {
    id: "frameworks",
    title: "Frameworks",
    icon: "layers",
    skills: ["Laravel", "Next.js", "React.js", "NestJS", "TailwindCSS"],
    description: "Frameworks I use to ship fast without compromising system design.",
    isHighlight: true,
    displayOrder: 2,
  },
  {
    id: "tools",
    title: "Tools",
    icon: "wrench",
    skills: ["Git", "GitLab", "Supabase", "TYPO3", "Docker"],
    description: "Infrastructure and delivery tooling around day-to-day engineering work.",
    displayOrder: 3,
  },
  {
    id: "research",
    title: "Research",
    icon: "flask-conical",
    skills: ["RAG Architectures", "Vector DBs", "LLM Ops"],
    description: "Applied AI and retrieval work used in modern developer tooling.",
    displayOrder: 4,
  },
];

export const defaultContactInfo: ContactInfo = {
  id: "primary",
  email: "khaldounalhalabi42@gmail.com",
  phone: "+963 936 955 531",
  location: "Damascus, Syria",
  intro:
    "Whether you have a technical challenge, a project proposal, or just want to discuss the future of full-stack architecture, my digital door is open.",
  availability: "Available for new opportunities",
  resumeLabel: "Resume",
  resumeUrl: "",
};

export const defaultContactLinks: ContactLink[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "#",
    icon: "linkedin",
    displayOrder: 1,
  },
  {
    id: "github",
    label: "GitHub",
    url: "#",
    icon: "github",
    displayOrder: 2,
  },
  {
    id: "twitter",
    label: "Twitter",
    url: "#",
    icon: "twitter",
    displayOrder: 3,
  },
];

export const defaultPortfolioData: PortfolioData = {
  projects: defaultProjects,
  experience: defaultExperience,
  skillGroups: defaultSkillGroups,
  contactInfo: defaultContactInfo,
  contactLinks: defaultContactLinks,
};
