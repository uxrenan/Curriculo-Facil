import React from 'react';
import { ResumeData, Experience, Education, TemplateType, FontFamilyType } from '../types';

interface EditorProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

const PRESET_COLORS = ['#2563eb', '#3f4e5e', '#6366f1', '#e11d48', '#059669', '#d97706'];

const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const updatePersonal = (field: keyof ResumeData['personal'], value: string) => {
    onChange({
      ...data,
      personal: { ...data.personal, [field]: value }
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    onChange({
      ...data,
      experiences: data.experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange({ ...data, experiences: [...data.experiences, newExp] });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experiences: data.experiences.filter(exp => exp.id !== id) });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange({
      ...data,
      educations: data.educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: '',
      school: '',
      location: '',
      startDate: '',
      endDate: ''
    };
    onChange({ ...data, educations: [...data.educations, newEdu] });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, educations: data.educations.filter(edu => edu.id !== id) });
  };

  const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const input = e.currentTarget;
      const val = input.value.trim();
      if (val && !data.skills.includes(val)) {
        onChange({ ...data, skills: [...data.skills, val] });
        input.value = '';
      }
    }
  };

  const removeSkill = (skill: string) => {
    onChange({ ...data, skills: data.skills.filter(s => s !== skill) });
  };

  const inputClass = "w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5 px-3";
  const sectionClass = "bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4";
  const labelClass = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5";
  const sectionTitleClass = "text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4";

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-24 md:pb-20">
      <div className="no-print px-1">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Editar Currículo</h1>
        <p className="text-slate-500 text-sm">Altere seus dados abaixo e visualize na hora.</p>
      </div>

      {/* Modelo do Currículo */}
      <section className={sectionClass}>
        <h2 className={sectionTitleClass}>Estilo & Modelo</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {(['minimalist', 'modern', 'classic', 'creative'] as TemplateType[]).map((t) => (
            <button 
              key={t}
              onClick={() => onChange({...data, theme: {...data.theme, template: t}})}
              className={`flex flex-col items-center gap-2 group p-1.5 transition-all rounded-xl ${data.theme.template === t ? 'ring-2 ring-blue-500 bg-blue-50/50' : 'opacity-60 hover:opacity-100 hover:bg-slate-50'}`}
            >
              <div className="w-full aspect-[3/4] bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden p-2 flex flex-col gap-1">
                <div className={`h-1.5 w-3/4 rounded-full ${t === 'creative' ? 'bg-blue-400' : 'bg-slate-300'}`}></div>
                <div className="h-1 w-full bg-slate-100 rounded-full"></div>
                <div className="h-1 w-full bg-slate-100 rounded-full"></div>
                <div className="mt-2 flex gap-1">
                  {t === 'modern' && <div className="w-1/3 h-10 bg-slate-100 rounded"></div>}
                  <div className="flex-1 space-y-1">
                    <div className="h-1 w-full bg-slate-200 rounded-full"></div>
                    <div className="h-1 w-full bg-slate-200 rounded-full"></div>
                    <div className="h-1 w-full bg-slate-200 rounded-full"></div>
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-tighter ${data.theme.template === t ? 'text-blue-600' : 'text-slate-500'}`}>
                {t === 'minimalist' ? 'Minimal' : t === 'modern' ? 'Moderno' : t === 'classic' ? 'Clássico' : 'Criativo'}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
          <div>
            <h2 className={sectionTitleClass}>Cor de Destaque</h2>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_COLORS.map(color => (
                <button 
                  key={color}
                  onClick={() => onChange({...data, theme: {...data.theme, primaryColor: color}})}
                  className={`size-9 rounded-full transition-transform hover:scale-110 relative ${data.theme.primaryColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                  style={{ backgroundColor: color }}
                >
                  {data.theme.primaryColor === color && (
                    <span className="material-symbols-outlined text-white text-[16px] absolute inset-0 flex items-center justify-center">check</span>
                  )}
                </button>
              ))}
              <input 
                type="color" 
                value={data.theme.primaryColor}
                onChange={(e) => onChange({...data, theme: {...data.theme, primaryColor: e.target.value}})}
                className="size-9 rounded-full overflow-hidden border border-slate-200 p-0 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <h2 className={sectionTitleClass}>Tipografia</h2>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {(['sans', 'serif', 'mono'] as FontFamilyType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => onChange({...data, theme: {...data.theme, fontFamily: f}})}
                  className={`flex-1 py-2 px-3 rounded-lg text-[11px] font-bold transition-all ${data.theme.fontFamily === f ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {f === 'sans' ? 'Sans' : f === 'serif' ? 'Serifa' : 'Mono'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Informações Pessoais */}
      <section className={sectionClass}>
        <div className="flex items-center gap-2 mb-2">
           <span className="material-symbols-outlined text-blue-600">person</span>
           <h2 className="text-lg font-bold text-slate-900">Pessoal</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className={labelClass}>Nome Completo</label>
            <input value={data.personal.fullName} onChange={(e) => updatePersonal('fullName', e.target.value)} className={inputClass} placeholder="Ex: João Silva" />
          </div>
          <div className="col-span-1">
            <label className={labelClass}>Cargo / Título</label>
            <input value={data.personal.jobTitle} onChange={(e) => updatePersonal('jobTitle', e.target.value)} className={inputClass} placeholder="Ex: Desenvolvedor Fullstack" />
          </div>
          <div className="col-span-1">
            <label className={labelClass}>E-mail</label>
            <input type="email" value={data.personal.email} onChange={(e) => updatePersonal('email', e.target.value)} className={inputClass} placeholder="exemplo@email.com" />
          </div>
          <div className="col-span-1">
            <label className={labelClass}>Telefone</label>
            <input type="tel" value={data.personal.phone} onChange={(e) => updatePersonal('phone', e.target.value)} className={inputClass} placeholder="(00) 00000-0000" />
          </div>
          <div className="col-span-1">
            <label className={labelClass}>Localização</label>
            <input value={data.personal.location} onChange={(e) => updatePersonal('location', e.target.value)} className={inputClass} placeholder="Cidade, Estado" />
          </div>
          <div className="col-span-1">
            <label className={labelClass}>Portfólio / LinkedIn</label>
            <input value={data.personal.website} onChange={(e) => updatePersonal('website', e.target.value)} className={inputClass} placeholder="linkedin.com/in/perfil" />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className={labelClass}>Resumo Profissional</label>
            <textarea value={data.personal.summary} onChange={(e) => updatePersonal('summary', e.target.value)} className={`${inputClass} h-32 resize-none`} placeholder="Conte brevemente sobre sua trajetória..." />
          </div>
        </div>
      </section>

      {/* Experiência */}
      <section className={sectionClass}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">work</span>
            <h2 className="text-lg font-bold text-slate-900">Experiência</h2>
          </div>
          <button onClick={addExperience} className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-[18px]">add</span> Adicionar
          </button>
        </div>
        <div className="space-y-4">
          {data.experiences.map((exp) => (
            <div key={exp.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 relative group">
              <button onClick={() => removeExperience(exp.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors p-1" title="Remover">
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="col-span-1">
                  <label className={labelClass}>Cargo</label>
                  <input value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} className={inputClass} />
                </div>
                <div className="col-span-1">
                  <label className={labelClass}>Empresa</label>
                  <input value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className={inputClass} />
                </div>
                <div className="col-span-1">
                  <label className={labelClass}>Início</label>
                  <input value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className={inputClass} placeholder="Mês/Ano" />
                </div>
                <div className="col-span-1">
                  <label className={labelClass}>Término</label>
                  <input value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} className={inputClass} placeholder="Mês/Ano ou Presente" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className={labelClass}>Descrição das Atividades</label>
                  <textarea value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} className={`${inputClass} h-24 resize-none`} placeholder="Descreva suas responsabilidades e conquistas..." />
                </div>
              </div>
            </div>
          ))}
          {data.experiences.length === 0 && (
            <p className="text-center py-4 text-slate-400 text-sm italic border-2 border-dashed border-slate-100 rounded-xl">Nenhuma experiência adicionada.</p>
          )}
        </div>
      </section>

      {/* Formação Acadêmica */}
      <section className={sectionClass}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">school</span>
            <h2 className="text-lg font-bold text-slate-900">Formação</h2>
          </div>
          <button onClick={addEducation} className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-[18px]">add</span> Adicionar
          </button>
        </div>
        <div className="space-y-4">
          {data.educations.map((edu) => (
            <div key={edu.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 relative group">
              <button onClick={() => removeEducation(edu.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors p-1" title="Remover">
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="col-span-1 sm:col-span-2">
                  <label className={labelClass}>Curso / Grau</label>
                  <input value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className={inputClass} />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className={labelClass}>Instituição</label>
                  <input value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} className={inputClass} />
                </div>
                <div className="col-span-1">
                  <label className={labelClass}>Início</label>
                  <input value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} className={inputClass} placeholder="Ano" />
                </div>
                <div className="col-span-1">
                  <label className={labelClass}>Término</label>
                  <input value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} className={inputClass} placeholder="Ano ou Cursando" />
                </div>
              </div>
            </div>
          ))}
          {data.educations.length === 0 && (
            <p className="text-center py-4 text-slate-400 text-sm italic border-2 border-dashed border-slate-100 rounded-xl">Nenhuma formação adicionada.</p>
          )}
        </div>
      </section>

      {/* Competências */}
      <section className={sectionClass}>
        <div className="flex items-center gap-2 mb-2">
           <span className="material-symbols-outlined text-blue-600">psychology</span>
           <h2 className="text-lg font-bold text-slate-900">Habilidades</h2>
        </div>
        <div className="flex flex-wrap gap-2 mb-4 min-h-[40px] p-2 rounded-lg bg-slate-50/50">
          {data.skills.map((skill) => (
            <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold group transition-all hover:bg-red-50 hover:text-red-700 cursor-pointer shadow-sm" onClick={() => removeSkill(skill)}>
              {skill}
              <span className="material-symbols-outlined text-[16px]">close</span>
            </span>
          ))}
          {data.skills.length === 0 && <span className="text-slate-400 text-xs italic">Adicione habilidades técnicas ou interpessoais...</span>}
        </div>
        <input 
          placeholder="Digite e aperte Enter..." 
          className={inputClass}
          onKeyDown={addSkill}
        />
      </section>
    </div>
  );
};

export default Editor;