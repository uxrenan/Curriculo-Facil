
import { ResumeData } from './types';

export const INITIAL_DATA: ResumeData = {
  personal: {
    fullName: 'João das Neves',
    jobTitle: 'Lorde Comandante da Patrulha da Noite',
    email: 'joao.neves@muralha.org',
    phone: '+7 Reinos (00) 99887-7665',
    location: 'Castelo Negro, A Muralha',
    website: 'o-inverno-esta-chegando.com',
    summary: 'Líder experiente com histórico comprovado na defesa do reino contra ameaças ancestrais. Especialista em gestão de equipes diversificadas (incluindo gigantes e povos livres) e sobrevivência em climas extremos. Conhecido por não saber de nada, mas entregar resultados excepcionais sob pressão. Comprometido com a vigília eterna, sem terras, títulos ou glória pessoal.'
  },
  experiences: [
    {
      id: 'exp-1',
      position: 'Lorde Comandante',
      company: 'Patrulha da Noite',
      location: 'Castelo Negro',
      startDate: 'Jan 298 AL',
      endDate: 'Presente',
      description: 'Responsável pela gestão estratégica de castelos ao longo da Muralha. Liderei a integração bem-sucedida com o Povo Livre para defesa mútua contra o Exército dos Mortos. Especialista em logística de suprimentos em condições de inverno rigoroso.'
    },
    {
      id: 'exp-2',
      position: 'Intendente do Comandante',
      company: 'Patrulha da Noite',
      location: 'Muralha de Gelo',
      startDate: 'Mai 296 AL',
      endDate: 'Dez 297 AL',
      description: 'Atuei como braço direito do Lorde Comandante Jeor Mormont. Realizei incursões de reconhecimento além da Muralha e participei ativamente da Grande Patrulha, garantindo a ordem e a disciplina entre os irmãos juramentados.'
    }
  ],
  educations: [
    {
      id: 'edu-1',
      degree: 'Bacharelado em Estratégia e Combate',
      school: 'Escola de Winterfell',
      location: 'Norte',
      startDate: '283 AL',
      endDate: '295 AL'
    }
  ],
  skills: ['Esgrima (Garralonga)', 'Liderança Sob Pressão', 'Sobrevivência no Gelo', 'Diplomacia com Gigantes', 'Adestramento de Lobos', 'Visão Estratégica', 'Resistência ao Frio'],
  theme: {
    primaryColor: '#2563eb',
    fontSize: 'medium',
    spacing: 'normal',
    template: 'minimalist',
    fontFamily: 'sans'
  }
};
