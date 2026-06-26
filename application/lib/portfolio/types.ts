export type ProjectTech = {
  name: string;
  icon: string;
  description: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string | null;
  imageUrl?: string | null;
  tags: string[];
  category: string;
  employer?: string | null;
  role?: string | null;
  year?: string | null;
  problem?: string | null;
  solution?: string | null;
  features: string[];
  techStack: ProjectTech[];
  featured: boolean;
  displayOrder: number;
  projectUrl?: string | null;
};

export type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
  isCurrent?: boolean;
  companyDescription?: string | null;
  companyWebsite?: string | null;
  from?: string | null;
  location?: string | null;
  to?: string | null;
};

export type SkillGroup = {
  id: string;
  title: string;
  icon: string;
  skills: string[];
  description?: string | null;
  isHighlight?: boolean;
  displayOrder: number;
};

export type ContactInfo = {
  id: string;
  email: string;
  phone: string;
  location: string;
  intro: string;
  availability: string;
  resumeLabel?: string | null;
  resumeUrl?: string | null;
};

export type ContactLink = {
  id: string;
  label: string;
  url: string;
  icon: string;
  displayOrder: number;
};

export type PortfolioData = {
  projects: Project[];
  experience: ExperienceItem[];
  skillGroups: SkillGroup[];
  contactInfo: ContactInfo;
  contactLinks: ContactLink[];
};
