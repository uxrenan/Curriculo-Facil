
import { ResumeData } from './types';

export const INITIAL_DATA: ResumeData = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: ''
  },
  experiences: [],
  educations: [],
  skills: [],
  theme: {
    primaryColor: '#2563eb',
    fontSize: 'medium',
    spacing: 'normal',
    template: 'minimalist',
    fontFamily: 'sans'
  }
};
