// Portfolio data types

export type TemplateStyle = 'minimal' | 'modern' | 'creative' | 'bold' | 'elegant';

export type HostingOption = 'hosted' | 'custom-domain';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  location: string;
  email: string;
  phone?: string;
  website?: string;
  linkedinUrl?: string;
  photoUrl?: string;
}

export interface Experience {
  id: string;
  company: string;
  companyLogoUrl?: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  schoolLogoUrl?: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
  technologies: string[];
}

export interface PortfolioData {
  id: string;
  personal: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  templateStyle: TemplateStyle;
  hostingOption: HostingOption;
  customDomain?: string;
  colorAccent?: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LinkedInExportData {
  profile?: {
    firstName?: string;
    lastName?: string;
    headline?: string;
    summary?: string;
    location?: string;
    email?: string;
  };
  positions?: Array<{
    companyName?: string;
    title?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  education?: Array<{
    schoolName?: string;
    degreeName?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    notes?: string;
  }>;
  skills?: string[];
}
