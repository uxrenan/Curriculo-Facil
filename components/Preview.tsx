
import React from 'react';
import { ResumeData } from '../types';

interface PreviewProps {
  data: ResumeData;
  isExportVersion?: boolean;
}

const Preview: React.FC<PreviewProps> = ({ data, isExportVersion = false }) => {
  const { personal, experiences, educations, skills, theme } = data;

  const fontFamilies = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono'
  };

  const fontSizes = {
    small: { base: 'text-[12px]', h1: 'text-2xl', h2: 'text-sm', h3: 'text-sm' },
    medium: { base: 'text-[14px]', h1: 'text-3xl', h2: 'text-base', h3: 'text-base' },
    large: { base: 'text-[16px]', h1: 'text-4xl', h2: 'text-lg', h3: 'text-lg' }
  };

  const currentFontSize = fontSizes[theme.fontSize];
  const currentFontFamily = fontFamilies[theme.fontFamily];

  const SectionHeader = ({ title }: { title: string }) => (
    <h2 className={`font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1 mb-4 ${currentFontSize.h2}`}>
      {title}
    </h2>
  );

  const SkillsSection = () => (
    <section>
      <SectionHeader title="Habilidades" />
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-800 rounded font-medium text-xs">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );

  const renderMinimalist = () => (
    <div className={`space-y-8 w-full`}>
      <header className="border-b-2 pb-6" style={{ borderColor: theme.primaryColor }}>
        <h1 className={`${currentFontSize.h1} font-bold text-slate-900 tracking-tight`}>{personal.fullName || 'Seu Nome'}</h1>
        <p className="text-lg font-medium mt-1" style={{ color: theme.primaryColor }}>{personal.jobTitle || 'Seu Cargo'}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-slate-500 text-xs font-medium">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span className="font-bold" style={{ color: theme.primaryColor }}>{personal.website}</span>}
        </div>
      </header>
      {personal.summary && (
        <section>
          <SectionHeader title="Resumo" />
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{personal.summary}</p>
        </section>
      )}
      {experiences.length > 0 && (
        <section>
          <SectionHeader title="Experiência" />
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className={`${currentFontSize.h3} font-bold text-slate-900`}>{exp.position}</h3>
                  <span className="text-slate-500 font-medium text-xs">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="font-semibold text-sm mb-2" style={{ color: theme.primaryColor }}>{exp.company}</div>
                <p className="text-slate-700 text-sm whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {educations.length > 0 && (
        <section>
          <SectionHeader title="Formação" />
          <div className="space-y-4">
            {educations.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className={`${currentFontSize.h3} font-bold text-slate-900`}>{edu.degree}</h3>
                  <span className="text-slate-500 font-medium text-xs">{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="text-slate-600 font-medium text-sm">{edu.school}</div>
              </div>
            ))}
          </div>
        </section>
      )}
      <SkillsSection />
    </div>
  );

  const renderModern = () => (
    <div className="flex gap-8 w-full">
      <div className="w-1/3 space-y-8">
        <header>
          <h1 className={`${currentFontSize.h1} font-bold text-slate-900 leading-tight`}>{personal.fullName}</h1>
          <p className="font-bold mt-2" style={{ color: theme.primaryColor }}>{personal.jobTitle}</p>
        </header>
        <section className="space-y-2">
          <SectionHeader title="Contato" />
          <div className="text-xs space-y-1 text-slate-600">
            {personal.email && <p className="break-all">{personal.email}</p>}
            {personal.phone && <p>{personal.phone}</p>}
            {personal.location && <p>{personal.location}</p>}
            {personal.website && <p className="font-bold" style={{ color: theme.primaryColor }}>{personal.website}</p>}
          </div>
        </section>
        <SkillsSection />
      </div>
      <div className="flex-1 space-y-8">
        {personal.summary && (
          <section>
            <SectionHeader title="Sobre" />
            <p className="text-slate-700 leading-relaxed text-sm">{personal.summary}</p>
          </section>
        )}
        <section>
          <SectionHeader title="Carreira" />
          <div className="space-y-6">
            {experiences.map(exp => (
              <div key={exp.id}>
                <h3 className="font-bold text-slate-900">{exp.position}</h3>
                <div className="text-xs font-bold mb-1" style={{ color: theme.primaryColor }}>{exp.company} | {exp.startDate} - {exp.endDate}</div>
                <p className="text-slate-600 text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <SectionHeader title="Educação" />
          <div className="space-y-4">
            {educations.map(edu => (
              <div key={edu.id}>
                <h3 className="font-bold text-slate-900 text-sm">{edu.degree}</h3>
                <p className="text-xs text-slate-600">{edu.school} | {edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderClassic = () => (
    <div className="w-full text-center space-y-6">
      <header className="border-b-2 border-slate-900 pb-4">
        <h1 className={`${currentFontSize.h1} font-serif font-bold text-slate-900 uppercase tracking-widest`}>{personal.fullName}</h1>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-600 mt-2">
          {personal.location && <span>{personal.location}</span>}
          <span>•</span>
          {personal.phone && <span>{personal.phone}</span>}
          <span>•</span>
          {personal.email && <span>{personal.email}</span>}
          {personal.website && (
            <>
              <span>•</span>
              <span className="font-bold" style={{ color: theme.primaryColor }}>{personal.website}</span>
            </>
          )}
        </div>
      </header>
      <div className="text-left space-y-8">
        <section>
          <SectionHeader title="Resumo" />
          <p className="italic text-slate-700">{personal.summary}</p>
        </section>
        <section>
          <SectionHeader title="Experiência Profissional" />
          <div className="space-y-6">
            {experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold">
                  <span>{exp.company.toUpperCase()}</span>
                  <span>{exp.location}</span>
                </div>
                <div className="flex justify-between italic text-sm mb-1">
                  <span>{exp.position}</span>
                  <span>{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-slate-700 text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderCreative = () => (
    <div className="w-full">
      <header className={`bg-slate-900 text-white -mx-12 -mt-12 p-12 mb-8`}>
        <div className="flex items-center gap-6">
          <div className="size-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
             {personal.fullName.charAt(0)}
          </div>
          <div>
            <h1 className={`${currentFontSize.h1} font-bold leading-none`}>{personal.fullName}</h1>
            <p className="text-xl mt-1 opacity-80">{personal.jobTitle}</p>
          </div>
        </div>
      </header>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: theme.primaryColor }}>Experiências</h2>
            <div className="space-y-6">
              {experiences.map(exp => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-slate-200">
                  <div className="absolute top-0 -left-[9px] size-4 rounded-full border-2 border-slate-200 bg-white"></div>
                  <h3 className="font-bold text-lg">{exp.position}</h3>
                  <p className="text-sm font-bold opacity-60 mb-2">{exp.company} | {exp.startDate} - {exp.endDate}</p>
                  <p className="text-slate-600 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="col-span-4 space-y-8">
          <section className="p-4 bg-slate-50 rounded-xl">
             <h2 className="font-bold mb-3 uppercase tracking-tighter">Contato</h2>
             <div className="text-xs space-y-2">
                {personal.email && <p><strong>E:</strong> {personal.email}</p>}
                {personal.phone && <p><strong>T:</strong> {personal.phone}</p>}
                {personal.location && <p><strong>L:</strong> {personal.location}</p>}
                {personal.website && <p><strong>W:</strong> <span className="font-bold" style={{ color: theme.primaryColor }}>{personal.website}</span></p>}
             </div>
          </section>
          <SkillsSection />
        </div>
      </div>
    </div>
  );

  const templates = {
    minimalist: renderMinimalist,
    modern: renderModern,
    classic: renderClassic,
    creative: renderCreative
  };

  const containerClasses = isExportVersion 
    ? `bg-white w-[210mm] min-h-[297mm] p-[15mm] mx-auto ${currentFontSize.base} ${currentFontFamily}`
    : `bg-white shadow-2xl mx-auto w-full max-w-[800px] min-h-[1130px] overflow-hidden p-12 transition-all duration-300 ${currentFontSize.base} ${currentFontFamily}`;

  return (
    <div id={isExportVersion ? "resume-export-target" : "resume-preview"} className={containerClasses}>
      {templates[theme.template]()}
    </div>
  );
};

export default Preview;
