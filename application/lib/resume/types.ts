export interface ResumeContact {
  email?: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  github?: string;
  gitlab?: string;
  stackoverflow?: string;
  telegram?: string;
  whatsapp?: string;
}

export interface ResumeExperience {
  id: string;
  position: string;
  companyName: string;
  location: string;
  dateRange: string;
  jobDescription: string;
}

export interface ResumeProjectTechStackItem {
  name: string;
  icon: string;
  description: string;
}

export interface ResumeProject {
  id: string;
  title: string;
  description: string;
  role: string | null;
  year: string | null;
  employer: string | null;
  projectUrl: string | null;
  techStack: ResumeProjectTechStackItem[];
}

export interface ResumeSkillGroup {
  category: string;
  skills: string[];
}

export interface ResumeEducation {
  degree: string;
  field: string;
  school: string;
  dateRange: string;
}

export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  contact: ResumeContact;
  experiences: ResumeExperience[];
  projects: ResumeProject[];
  skillGroups: ResumeSkillGroup[];
  languages?: string;
  education?: ResumeEducation;
}
