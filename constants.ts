
import { ResumeData } from './types';

export const INITIAL_DATA: ResumeData = {
  personal: {
    fullName: 'Alex Morgan',
    jobTitle: 'Product Designer Sênior',
    email: 'alex.morgan@exemplo.com',
    phone: '+55 (11) 98765-4321',
    location: 'São Paulo, SP',
    website: 'alexmorgan.design',
    summary: 'Designer de Produto criativo e orientado a detalhes com mais de 5 anos de experiência na criação de produtos digitais centrados no usuário. Proficiente em design de UI/UX, prototipagem e sistemas de design. Habilidade em liderar pequenas equipes e colaborar com engenheiros para entregar software de alta qualidade.'
  },
  experiences: [
    {
      id: 'exp-1',
      position: 'Designer Sênior',
      company: 'TechFlow Inc.',
      location: 'Remoto',
      startDate: 'Jan 2021',
      endDate: 'Presente',
      description: 'Liderei a equipe de design no lançamento de 3 grandes recursos de produto, resultando em um aumento de 15% na retenção de usuários. Estabeleci um novo sistema de design usado por mais de 20 designers e engenheiros.'
    },
    {
      id: 'exp-2',
      position: 'Designer de UI',
      company: 'Estúdio Criativo',
      location: 'São Paulo',
      startDate: 'Jun 2018',
      endDate: 'Dez 2020',
      description: 'Projetei sites de marketing para mais de 15 clientes em diversos setores. Colaborei com desenvolvedores para garantir a implementação perfeita dos designs.'
    }
  ],
  educations: [
    {
      id: 'edu-1',
      degree: 'Bacharelado em Design Gráfico',
      school: 'Universidade de Belas Artes',
      location: 'São Paulo',
      startDate: '2014',
      endDate: '2018'
    }
  ],
  skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'HTML/CSS', 'React', 'Prototipagem', 'Pesquisa de Usuário'],
  theme: {
    primaryColor: '#2563eb',
    fontSize: 'medium',
    spacing: 'normal',
    template: 'minimalist',
    fontFamily: 'sans'
  }
};
