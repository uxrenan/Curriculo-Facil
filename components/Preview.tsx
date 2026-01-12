
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

  // Helper para renderizar texto ou placeholder
  const renderField = (value: string | undefined, placeholder: string, className?: string) => {
    if (!value || value.trim() === '') {
      return <span className={`text-slate-300 italic font-normal ${className}`}>{placeholder}</span>;
    }
    return value;
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <h2 className={`font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1 mb-3 md:mb-4 ${currentFontSize.h2}`}>
      {title}
    </h2>
  );

  const SkillsSection = () => (
    <section>
      <SectionHeader title="Habilidades" />
      <div className="flex flex-wrap gap-1.5 md:gap-2">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <span key={skill} className="px-2 py-0.5 md:px-3 md:py-1 bg-slate-100 text-slate-800 rounded font-medium text-[10px] md:text-xs">
              {skill}
            </span>
          ))
        ) : (
          <span className="text-slate-300 italic text-xs">Adicione suas competências...</span>
        )}
      </div>
    </section>
  );

  const renderMinimalist = () => (
    <div className={`space-y-6 md:space-y-8 w-full`}>
      <header className="border-b-2 pb-4 md:pb-6" style={{ borderColor: theme.primaryColor }}>
        <h1 className={`${currentFontSize.h1} font-bold text-slate-900 tracking-tight`}>
          {renderField(personal.fullName, '{Seu Nome Completo}')}
        </h1>
        <p className="text-base md:text-lg font-medium mt-1" style={{ color: theme.primaryColor }}>
          {renderField(personal.jobTitle, '{Seu Cargo ou Título}')}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-slate-500 text-[10px] md:text-xs font-medium">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">mail</span>
            {renderField(personal.email, '{seu.email@exemplo.com}')}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">phone</span>
            {renderField(personal.phone, '{(00) 00000-0000}')}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            {renderField(personal.location, '{Cidade, Estado}')}
          </span>
          {personal.website && (
            <span className="flex items-center gap-1 font-bold" style={{ color: theme.primaryColor }}>
              <span className="material-symbols-outlined text-[14px]">link</span>
              {personal.website}
            </span>
          )}
        </div>
      </header>

      <section>
        <SectionHeader title="Resumo" />
        <p className={`leading-relaxed whitespace-pre-wrap ${!personal.summary ? 'text-slate-300 italic' : 'text-slate-700'}`}>
          {personal.summary || 'Descreva brevemente sua trajetória profissional, principais conquistas e objetivos...'}
        </p>
      </section>

      <section>
        <SectionHeader title="Experiência" />
        <div className="space-y-5 md:space-y-6">
          {experiences.length > 0 ? (
            experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-1">
                  <h3 className={`${currentFontSize.h3} font-bold text-slate-900`}>{exp.position}</h3>
                  <span className="text-slate-500 font-medium text-[10px] md:text-xs">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="font-semibold text-xs md:text-sm mb-2" style={{ color: theme.primaryColor }}>{exp.company}</div>
                <p className="text-slate-700 text-xs md:text-sm whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))
          ) : (
            <div className="text-slate-300 italic text-sm space-y-2">
              <p>Cargo na Empresa (Mês/Ano - Mês/Ano)</p>
              <p className="text-xs opacity-60">Descreva suas responsabilidades aqui...</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <SectionHeader title="Formação" />
        <div className="space-y-3 md:space-y-4">
          {educations.length > 0 ? (
            educations.map((edu) => (
              <div key={edu.id}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-1">
                  <h3 className={`${currentFontSize.h3} font-bold text-slate-900`}>{edu.degree}</h3>
                  <span className="text-slate-500 font-medium text-[10px] md:text-xs">{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="text-slate-600 font-medium text-xs md:text-sm">{edu.school}</div>
              </div>
            ))
          ) : (
            <div className="text-slate-300 italic text-sm">
              <p>Curso ou Graduação na Instituição (Ano de conclusão)</p>
            </div>
          )}
        </div>
      </section>
      <SkillsSection />
    </div>
  );

  const renderModern = () => (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full">
      <div className="w-full md:w-1/3 space-y-6 md:space-y-8">
        <header>
          <h1 className={`${currentFontSize.h1} font-bold text-slate-900 leading-tight`}>
            {renderField(personal.fullName, '{Seu Nome}')}
          </h1>
          <p className="font-bold mt-2" style={{ color: theme.primaryColor }}>
            {renderField(personal.jobTitle, '{Seu Cargo}')}
          </p>
        </header>
        <section className="space-y-2">
          <SectionHeader title="Contato" />
          <div className="text-[10px] md:text-xs space-y-2 text-slate-600">
            <p className="flex items-center gap-2 break-all">
              <span className="material-symbols-outlined text-[16px]">mail</span> 
              {renderField(personal.email, '{seu.email@exemplo.com}')}
            </p>
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">phone</span> 
              {renderField(personal.phone, '{(00) 00000-0000}')}
            </p>
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">location_on</span> 
              {renderField(personal.location, '{Cidade, Estado}')}
            </p>
            {personal.website && (
              <p className="flex items-center gap-2 font-bold" style={{ color: theme.primaryColor }}>
                <span className="material-symbols-outlined text-[16px]">link</span> 
                {personal.website}
              </p>
            )}
          </div>
        </section>
        <div className="hidden md:block">
          <SkillsSection />
        </div>
      </div>
      <div className="flex-1 space-y-6 md:space-y-8">
        <section>
          <SectionHeader title="Sobre" />
          <p className={`leading-relaxed text-xs md:text-sm ${!personal.summary ? 'text-slate-300 italic' : 'text-slate-700'}`}>
            {personal.summary || 'Apresentação profissional...'}
          </p>
        </section>
        <section>
          <SectionHeader title="Carreira" />
          <div className="space-y-5 md:space-y-6">
            {experiences.length > 0 ? (
              experiences.map(exp => (
                <div key={exp.id}>
                  <h3 className="font-bold text-slate-900">{exp.position}</h3>
                  <div className="text-[10px] md:text-xs font-bold mb-1" style={{ color: theme.primaryColor }}>{exp.company} | {exp.startDate} - {exp.endDate}</div>
                  <p className="text-slate-600 text-xs md:text-sm">{exp.description}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-300 italic text-sm">Adicione sua trajetória profissional...</p>
            )}
          </div>
        </section>
        <div className="md:hidden">
           <SkillsSection />
        </div>
        <section>
          <SectionHeader title="Educação" />
          <div className="space-y-3 md:space-y-4">
            {educations.length > 0 ? (
              educations.map(edu => (
                <div key={edu.id}>
                  <h3 className="font-bold text-slate-900 text-xs md:text-sm">{edu.degree}</h3>
                  <p className="text-[10px] md:text-xs text-slate-600">{edu.school} | {edu.startDate} - {edu.endDate}</p>
                </div>
              ))
            ) : (
               <p className="text-slate-300 italic text-sm">Adicione sua formação acadêmica...</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );

  const renderClassic = () => (
    <div className="w-full text-center space-y-6">
      <header className="border-b-2 border-slate-900 pb-4">
        <h1 className={`${currentFontSize.h1} font-serif font-bold text-slate-900 uppercase tracking-widest`}>
          {renderField(personal.fullName, '{Seu Nome Completo}')}
        </h1>
        <div className="flex justify-center flex-wrap gap-x-3 md:gap-x-4 gap-y-1 text-[10px] md:text-xs font-medium text-slate-600 mt-2">
          <span>{renderField(personal.location, '{Sua Localização}')}</span>
          <span>• {renderField(personal.phone, '{Seu Telefone}')}</span>
          <span>• {renderField(personal.email, '{Seu E-mail}')}</span>
          {personal.website && (
            <span className="font-bold" style={{ color: theme.primaryColor }}>• {personal.website}</span>
          )}
        </div>
      </header>
      <div className="text-left space-y-6 md:space-y-8">
        <section>
          <SectionHeader title="Resumo" />
          <p className={`italic text-xs md:text-sm ${!personal.summary ? 'text-slate-300' : 'text-slate-700'}`}>
            {personal.summary || 'Descreva seu perfil profissional de forma objetiva...'}
          </p>
        </section>
        <section>
          <SectionHeader title="Experiência Profissional" />
          <div className="space-y-5 md:space-y-6">
            {experiences.length > 0 ? (
              experiences.map(exp => (
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
              ))
            ) : (
              <p className="text-slate-300 italic text-sm">Histórico profissional...</p>
            )}
          </div>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
             <SectionHeader title="Formação" />
             <div className="space-y-4">
                {educations.length > 0 ? (
                  educations.map(edu => (
                    <div key={edu.id}>
                      <p className="font-bold text-xs md:text-sm">{edu.degree}</p>
                      <p className="text-[10px] md:text-xs text-slate-600">{edu.school} ({edu.endDate})</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-300 italic text-sm">Formação acadêmica...</p>
                )}
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
             {personal.fullName ? personal.fullName.charAt(0) : '?'}
          </div>
          <div className="text-center sm:text-left">
            <h1 className={`${currentFontSize.h1} font-bold leading-none`}>
              {renderField(personal.fullName, '{Seu Nome}')}
            </h1>
            <p className="text-lg md:text-xl mt-1 opacity-80">
              {renderField(personal.jobTitle, '{Seu Cargo}')}
            </p>
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
              {experiences.length > 0 ? (
                experiences.map(exp => (
                  <div key={exp.id} className="relative pl-5 md:pl-6 border-l-2 border-slate-200">
                    <div className="absolute top-0 -left-[9px] size-4 rounded-full border-2 border-slate-200 bg-white"></div>
                    <h3 className="font-bold text-base md:text-lg">{exp.position}</h3>
                    <p className="text-[11px] md:text-sm font-bold opacity-60 mb-2">{exp.company} | {exp.startDate} - {exp.endDate}</p>
                    <p className="text-slate-600 text-xs md:text-sm">{exp.description}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 border-2 border-dashed border-slate-100 rounded-xl text-slate-300 italic text-sm">
                  Suas experiências aparecerão nesta linha do tempo.
                </div>
              )}
            </div>
          </section>
        </div>
        <div className="md:col-span-4 space-y-6 md:space-y-8">
          <section className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
             <h2 className="font-bold mb-3 uppercase tracking-tighter text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">contact_page</span> Contato
             </h2>
             <div className="text-[11px] md:text-xs space-y-2.5">
                <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] opacity-60">mail</span> {renderField(personal.email, '{E-mail}')}</p>
                <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] opacity-60">phone</span> {renderField(personal.phone, '{Telefone}')}</p>
                <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] opacity-60">location_on</span> {renderField(personal.location, '{Localização}')}</p>
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
    : `bg-white shadow-2xl mx-auto w-full max-w-[800px] min-h-fit md:min-h-[1130px] p-6 md:p-12 transition-all duration-300 ${currentFontSize.base} ${currentFontFamily} rounded-xl md:rounded-none animate-template-change`;

  return (
    <div key={theme.template} id={isExportVersion ? "resume-export-target" : "resume-preview"} className={containerClasses}>
      {templates[theme.template]()}
    </div>
  );
};

export default Preview;
