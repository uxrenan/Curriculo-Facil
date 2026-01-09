
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

  const inputClass = "w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2";
  const sectionClass = "bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4";
  const labelClass = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1";
  const sectionTitleClass = "text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4";

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-20">
      <div className="no-print">
        <h1 className="text-2xl font-bold text-slate-900">Editar Currículo</h1>
        <p className="text-slate-500 text-sm">Preencha seus dados abaixo e veja as alterações em tempo real.</p>
      </div>

      {/* Modelo do Currículo */}
      <section className={sectionClass}>
        <h2 className={sectionTitleClass}>Modelo do Currículo</h2>
        <div className="grid grid-cols-4 gap-4">
          {(['minimalist', 'modern', 'classic', 'creative'] as TemplateType[]).map((t) => (
            <button 
              key={t}
              onClick={() => onChange({...data, theme: {...data.theme, template: t}})}
              className={`flex flex-col items-center gap-2 group p-1 transition-all rounded-lg ${data.theme.template === t ? 'ring-2 ring-blue-500 bg-blue-50/50' : 'opacity-60 hover:opacity-100'}`}
            >
              <div className="w-full aspect-[3/4] bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden p-2 flex flex-col gap-1">
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
                {t === 'minimalist' ? 'Minimalista' : t === 'modern' ? 'Moderno' : t === 'classic' ? 'Clássico' : 'Criativo'}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-100">
          <div>
            <h2 className={sectionTitleClass}>Cor de Destaque</h2>
            <div className="flex flex-wrap gap-3">
              {PRESET_COLORS.map(color => (
                <button 
                  key={color}
                  onClick={() => onChange({...data, theme: {...data.theme, primaryColor: color}})}
                  className={`size-8 rounded-full transition-transform hover:scale-110 relative ${data.theme.primaryColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
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
                className="size-8 rounded-full overflow-hidden border-none p-0 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <h2 className={sectionTitleClass}>Família de Fonte</h2>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {(['sans', 'serif', 'mono'] as FontFamilyType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => onChange({...data, theme: {...data.theme, fontFamily: f}})}
                  className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all ${data.theme.fontFamily === f ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
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
           <h2 className="text-lg font-bold text-slate-900">Informações Pessoais</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className={labelClass}>Nome Completo</label>
            <input value={data.personal.fullName} onChange={(e) => updatePersonal('fullName', e.target.value)} className={inputClass} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className={labelClass}>Cargo</label>
            <input value={data.personal.jobTitle} onChange={(e) => updatePersonal('jobTitle', e.target.value)} className={inputClass} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className={labelClass}>E-mail</label>
            <input value={data.personal.email} onChange={(e) => updatePersonal('email', e.target.value)} className={inputClass} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className={labelClass}>Telefone</label>
            <input value={data.personal.phone} onChange={(e) => updatePersonal('phone', e.target.value)} className={inputClass} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className={labelClass}>Localização</label>
            <input value={data.personal.location} onChange={(e) => updatePersonal('location', e.target.value)} className={inputClass} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className={labelClass}>Site / Portfolio</label>
            <input value={data.personal.website} onChange={(e) => updatePersonal('website', e.target.value)} className={inputClass} />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Resumo Profissional</label>
            <textarea value={data.personal.summary} onChange={(e) => updatePersonal('summary', e.target.value)} className={`${inputClass} h-24 resize-none`} />
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
          <button onClick={addExperience} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">add</span> Adicionar
          </button>
        </div>
        <div className="space-y-6">
          {data.experiences.map((exp) => (
            <div key={exp.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50 relative group">
              <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>Cargo</label>
                  <input value={exp.position} onChange={(e) => updateExperience(exp.id, 'position', e.target.value)} className={inputClass} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>Empresa</label>
                  <input value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className={inputClass} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>Data de Início</label>
                  <input value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className={inputClass} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>Data de Término</label>
                  <input value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} className={inputClass} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Descrição</label>
                  <textarea value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} className={`${inputClass} h-20 resize-none`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Formação Acadêmica */}
      <section className={sectionClass}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">school</span>
            <h2 className="text-lg font-bold text-slate-900">Formação</h2>
          </div>
          <button onClick={addEducation} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">add</span> Adicionar
          </button>
        </div>
        <div className="space-y-6">
          {data.educations.map((edu) => (
            <div key={edu.id} className="p-4 rounded-lg border border-slate-100 bg-slate-50 relative group">
              <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelClass}>Curso / Grau</label>
                  <input value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className={inputClass} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Instituição</label>
                  <input value={edu.school} onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} className={inputClass} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>Início</label>
                  <input value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} className={inputClass} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>Término</label>
                  <input value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Competências */}
      <section className={sectionClass}>
        <div className="flex items-center gap-2 mb-2">
           <span className="material-symbols-outlined text-blue-600">psychology</span>
           <h2 className="text-lg font-bold text-slate-900">Habilidades</h2>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {data.skills.map((skill) => (
            <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold group transition-colors hover:bg-red-50 hover:text-red-700 cursor-pointer" onClick={() => removeSkill(skill)}>
              {skill}
              <span className="material-symbols-outlined text-[14px]">close</span>
            </span>
          ))}
        </div>
        <input 
          placeholder="Adicione uma habilidade e pressione Enter..." 
          className={inputClass}
          onKeyDown={addSkill}
        />
      </section>
    </div>
  );
};

export default Editor;
