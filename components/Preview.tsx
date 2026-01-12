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
    small: { base: 'text-[11px] md:text-[12px]', h1: 'text-xl md:text-2xl', h2: 'text-xs md:text-sm', h3: 'text-xs md:text-sm' },
    medium: { base: 'text-[13px] md:text-[14px]', h1: 'text-2xl md:text-3xl', h2: 'text-sm md:text-base', h3: 'text-sm md:text-base' },
    large: { base: 'text-[15px] md:text-[16px]', h1: 'text-3xl md:text-4xl', h2: 'text-base md:text-lg', h3: 'text-base md:text-lg' }
  };

  const currentFontSize = fontSizes[theme.fontSize];
  const currentFontFamily = fontFamilies[theme.fontFamily];

  const SectionHeader = ({ title }: { title: string }) => (
    <h2 className={`font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1 mb-3 md:mb-4 ${currentFontSize.h2}`}>
      {title}
    </h2>
  );

  const SkillsSection = () => (
    <section>
      <SectionHeader title="Habilidades" />
      <div className="flex flex-wrap gap-1.5 md:gap-2">
        {skills.map((skill) => (
          <span key={skill} className="px-2 py-0.5 md:px-3 md:py-1 bg-slate-100 text-slate-800 rounded font-medium text-[10px] md:text-xs">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );

  const renderMinimalist = () => (
    <div className={`space-y-6 md:space-y-8 w-full`}>
      <header className="border-b-2 pb-4 md:pb-6" style={{ borderColor: theme.primaryColor }}>
        <h1 className={`${currentFontSize.h1} font-bold text-slate-900 tracking-tight`}>{personal.fullName || 'Seu Nome'}</h1>
        <p className="text-base md:text-lg font-medium mt-1" style={{ color: theme.primaryColor }}>{personal.jobTitle || 'Seu Cargo'}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-slate-500 text-[10px] md:text-xs font-medium">
          {personal.email && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">mail</span>{personal.email}</span>}
          {personal.phone && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">phone</span>{personal.phone}</span>}
          {personal.location && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span>{personal.location}</span>}
          {personal.website && <span className="flex items-center gap-1 font-bold" style={{ color: theme.primaryColor }}><span className="material-symbols-outlined text-[14px]">link</span>{personal.website}</span>}
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
          <div className="space-y-5 md:space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-1">
                  <h3 className={`${currentFontSize.h3} font-bold text-slate-900`}>{exp.position}</h3>
                  <span className="text-slate-500 font-medium text-[10px] md:text-xs">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="font-semibold text-xs md:text-sm mb-2" style={{ color: theme.primaryColor }}>{exp.company}</div>
                <p className="text-slate-700 text-xs md:text-sm whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {educations.length > 0 && (
        <section>
          <SectionHeader title="Formação" />
          <div className="space-y-3 md:space-y-4">
            {educations.map((edu) => (
              <div key={edu.id}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-1">
                  <h3 className={`${currentFontSize.h3} font-bold text-slate-900`}>{edu.degree}</h3>
                  <span className="text-slate-500 font-medium text-[10px] md:text-xs">{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="text-slate-600 font-medium text-xs md:text-sm">{edu.school}</div>
              </div>
            ))}
          </div>
        </section>
      )}
      <SkillsSection />
    </div>
  );

  const renderModern = () => (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full">
      <div className="w-full md:w-1/3 space-y-6 md:space-y-8">
        <header>
          <h1 className={`${currentFontSize.h1} font-bold text-slate-900 leading-tight`}>{personal.fullName}</h1>
          <p className="font-bold mt-2" style={{ color: theme.primaryColor }}>{personal.jobTitle}</p>
        </header>
        <section className="space-y-2">
          <SectionHeader title="Contato" />
          <div className="text-[10px] md:text-xs space-y-2 text-slate-600">
            {personal.email && <p className="flex items-center gap-2 break-all"><span className="material-symbols-outlined text-[16px]">mail</span> {personal.email}</p>}
            {personal.phone && <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">phone</span> {personal.phone}</p>}
            {personal.location && <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">location_on</span> {personal.location}</p>}
            {personal.website && <p className="flex items-center gap-2 font-bold" style={{ color: theme.primaryColor }}><span className="material-symbols-outlined text-[16px]">link</span> {personal.website}</p>}
          </div>
        </section>
        <div className="hidden md:block">
          <SkillsSection />
        </div>
      </div>
      <div className="flex-1 space-y-6 md:space-y-8">
        {personal.summary && (
          <section>
            <SectionHeader title="Sobre" />
            <p className="text-slate-700 leading-relaxed text-xs md:text-sm">{personal.summary}</p>
          </section>
        )}
        <section>
          <SectionHeader title="Carreira" />
          <div className="space-y-5 md:space-y-6">
            {experiences.map(exp => (
              <div key={exp.id}>
                <h3 className="font-bold text-slate-900">{exp.position}</h3>
                <div className="text-[10px] md:text-xs font-bold mb-1" style={{ color: theme.primaryColor }}>{exp.company} | {exp.startDate} - {exp.endDate}</div>
                <p className="text-slate-600 text-xs md:text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="md:hidden">
           <SkillsSection />
        </div>
        <section>
          <SectionHeader title="Educação" />
          <div className="space-y-3 md:space-y-4">
            {educations.map(edu => (
              <div key={edu.id}>
                <h3 className="font-bold text-slate-900 text-xs md:text-sm">{edu.degree}</h3>
                <p className="text-[10px] md:text-xs text-slate-600">{edu.school} | {edu.startDate} - {edu.endDate}</p>
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
        <div className="flex justify-center flex-wrap gap-x-3 md:gap-x-4 gap-y-1 text-[10px] md:text-xs font-medium text-slate-600 mt-2">
          {personal.location && <span>{personal.location}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.email && <span>• {personal.email}</span>}
          {personal.website && (
            <span className="font-bold" style={{ color: theme.primaryColor }}>• {personal.website}</span>
          )}
        </div>
      </header>
      <div className="text-left space-y-6 md:space-y-8">
        <section>
          <SectionHeader title="Resumo" />
          <p className="italic text-slate-700 text-xs md:text-sm">{personal.summary}</p>
        </section>
        <section>
          <SectionHeader title="Experiência Profissional" />
          <div className="space-y-5 md:space-y-6">
            {experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex flex-col sm:flex-row justify-between font-bold text-sm md:text-base">
                  <span>{exp.company.toUpperCase()}</span>
                  <span className="text-xs font-normal opacity-60">{exp.location}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between italic text-[11px] md:text-sm mb-1.5 text-slate-500">
                  <span>{exp.position}</span>
                  <span>{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-slate-700 text-xs md:text-sm leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
             <SectionHeader title="Formação" />
             <div className="space-y-4">
                {educations.map(edu => (
                  <div key={edu.id}>
                    <p className="font-bold text-xs md:text-sm">{edu.degree}</p>
                    <p className="text-[10px] md:text-xs text-slate-600">{edu.school} ({edu.endDate})</p>
                  </div>
                ))}
             </div>
          </section>
          <SkillsSection />
        </div>
      </div>
    </div>
  );

  const renderCreative = () => (
    <div className="w-full">
      <header className={`bg-slate-900 text-white -mx-6 md:-mx-12 -mt-6 md:-mt-12 p-6 md:p-12 mb-6 md:mb-8`}>
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
          <div className="size-16 md:size-20 bg-white/20 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold">
             {personal.fullName.charAt(0)}
          </div>
          <div className="text-center sm:text-left">
            <h1 className={`${currentFontSize.h1} font-bold leading-none`}>{personal.fullName}</h1>
            <p className="text-lg md:text-xl mt-1 opacity-80">{personal.jobTitle}</p>
          </div>
        </div>
      </header>
      <div className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8">
        <div className="md:col-span-8 space-y-6 md:space-y-8">
          <section>
            <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2" style={{ color: theme.primaryColor }}>
              <span className="material-symbols-outlined">work</span> Experiências
            </h2>
            <div className="space-y-5 md:space-y-6">
              {experiences.map(exp => (
                <div key={exp.id} className="relative pl-5 md:pl-6 border-l-2 border-slate-200">
                  <div className="absolute top-0 -left-[9px] size-4 rounded-full border-2 border-slate-200 bg-white"></div>
                  <h3 className="font-bold text-base md:text-lg">{exp.position}</h3>
                  <p className="text-[11px] md:text-sm font-bold opacity-60 mb-2">{exp.company} | {exp.startDate} - {exp.endDate}</p>
                  <p className="text-slate-600 text-xs md:text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="md:col-span-4 space-y-6 md:space-y-8">
          <section className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
             <h2 className="font-bold mb-3 uppercase tracking-tighter text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">contact_page</span> Contato
             </h2>
             <div className="text-[11px] md:text-xs space-y-2.5">
                {personal.email && <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] opacity-60">mail</span> {personal.email}</p>}
                {personal.phone && <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] opacity-60">phone</span> {personal.phone}</p>}
                {personal.location && <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] opacity-60">location_on</span> {personal.location}</p>}
                {personal.website && <p className="flex items-center gap-2 font-bold" style={{ color: theme.primaryColor }}><span className="material-symbols-outlined text-[16px] opacity-60">link</span> {personal.website}</p>}
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
    : `bg-white shadow-2xl mx-auto w-full max-w-[800px] min-h-fit md:min-h-[1130px] p-6 md:p-12 transition-all duration-300 ${currentFontSize.base} ${currentFontFamily} rounded-xl md:rounded-none`;

  return (
    <div id={isExportVersion ? "resume-export-target" : "resume-preview"} className={containerClasses}>
      {templates[theme.template]()}
    </div>
  );
};

export default Preview;