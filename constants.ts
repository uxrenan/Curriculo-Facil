import { ResumeData, TemplateType, TemplateCapabilities } from './types';

export const INITIAL_DATA: ResumeData = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: '',
    photo: ''
  },
  experiences: [],
  educations: [],
  skills: [],
  sections: [], // Initialize empty sections
  theme: {
    primaryColor: '#2563eb',
    fontSize: 'medium',
    spacing: 'normal',
    template: 'minimalist',
    fontFamily: 'sans'
  }
};

export const TEMPLATE_CONFIG: Record<TemplateType, TemplateCapabilities> = {
  minimalist: {
    supportsPhoto: false,
    supportsIcons: true
  },
  modern: {
    supportsPhoto: true,
    supportsIcons: true
  },
  classic: {
    supportsPhoto: false,
    supportsIcons: false
  },
  creative: {
    supportsPhoto: true,
    supportsIcons: true
  }
};