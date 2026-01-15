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
  photo?: string; // String em Base64
}

export interface DynamicSection {
  id: string;
  title: string;
  contentType: 'text' | 'list';
  value: string | string[];
  icon?: string; // Icon identifier for Material Symbols
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
  sections: DynamicSection[]; // New dynamic sections array
  theme: ThemeConfig;
}

export type ToneType = 'Professional' | 'Formal' | 'Friendly' | 'Objective';

export interface CoverLetterForm {
  jobRole: string;
  companyName: string;
  tone: ToneType;
  highlight: string;
}

export interface TemplateCapabilities {
  supportsPhoto: boolean;
  supportsIcons: boolean;
}