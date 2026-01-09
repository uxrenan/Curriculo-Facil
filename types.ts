
export interface Experience {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface PersonalDetails {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
}

export type TemplateType = 'minimalist' | 'modern' | 'classic' | 'creative';
export type FontFamilyType = 'sans' | 'serif' | 'mono';

export interface ThemeConfig {
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'relaxed';
  template: TemplateType;
  fontFamily: FontFamilyType;
}

export interface ResumeData {
  personal: PersonalDetails;
  experiences: Experience[];
  educations: Education[];
  skills: string[];
  theme: ThemeConfig;
}
