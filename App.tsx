import React, { useState, useEffect, useRef } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import CoverLetterModal from './components/CoverLetterModal';
import EasterEggGame from './components/EasterEggGame';
import { INITIAL_DATA } from './constants';
import { ResumeData } from './types';
import { GoogleGenAI, Type } from "@google/genai";

const App: React.FC = () => {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);
  const [isAIDropdownOpen, setIsAIDropdownOpen] = useState(false);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiForm, setAiForm] = useState({ company: '', role: '', description: '' });
  
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  // Mobile View Toggle: 'edit' or 'preview'
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    if (data.personal.fullName && data.personal.fullName.trim() !== '') {
      document.title = `Simplescurriculo | ${data.personal.fullName}`;
    } else {
      document.title = "Simplescurriculo - Gerador de currículos";
    }
  }, [data.personal.fullName]);

  // Handle outside clicks for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInsideTrigger = dropdownTriggerRef.current?.contains(target);
      const isClickInsideMenu = dropdownMenuRef.current?.contains(target);
      
      if (!isClickInsideTrigger && !isClickInsideMenu) {
        setIsAIDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    const nextCount = logoClickCount + 1;
    if (nextCount >= 3) {
      setIsEasterEggOpen(true);
      setLogoClickCount(0);
    } else {
      setLogoClickCount(nextCount);
      setTimeout(() => setLogoClickCount(0), 3000);
    }
  };

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    const element = document.getElementById('resume-export-target');
    if (!element) return;
    setIsDownloading(true);
    const fullNameSlug = data.personal.fullName.toLowerCase().trim().replace(/\s+/g, '-');
    const filename = `curriculo-${fullNameSlug || 'meu-curriculo'}.pdf`;
    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollX: 0, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    try {
      // @ts-ignore
      await window.html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!aiForm.role || !aiForm.description) {
      alert("Por favor, preencha o cargo e a descrição da vaga.");
      return;
    }
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Com base no cargo "${aiForm.role}" na empresa "${aiForm.company || 'não informada'}" 
        e na seguinte descrição de vaga: "${aiForm.description}".
        Otimize os seguintes dados do usuário para esta vaga específica:
        Nome Atual: ${data.personal.fullName}
        Resumo Atual: ${data.personal.summary}
        Experiências Atuais: ${JSON.stringify(data.experiences)}
        Habilidades Atuais: ${data.skills.join(', ')}
        Gere um novo resumo profissional, uma lista de experiências profissionais reescritas com foco em resultados relevantes para a vaga e uma lista de habilidades técnicas/comportamentais pertinentes.
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: "Você é um especialista em RH e recrutamento. Retorne os dados em formato JSON seguindo estritamente a estrutura solicitada.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              experiences: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    position: { type: Type.STRING },
                    company: { type: Type.STRING },
                    location: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["position", "company", "description"]
                }
              }
            },
            required: ["summary", "skills", "experiences"]
          }
        }
      });
      const result = JSON.parse(response.text);
      setData({
        ...data,
        personal: { ...data.personal, summary: result.summary, jobTitle: aiForm.role },
        skills: result.skills,
        experiences: result.experiences.map((exp: any, index: number) => ({
          ...exp,
          id: `ai-exp-${index}-${Date.now()}`,
          location: exp.location || 'Remoto',
          startDate: exp.startDate || 'Início',
          endDate: exp.endDate || 'Fim'
        }))
      });
      setIsAIModalOpen(false);
    } catch (error) {
      console.error("Erro na geração por IA:", error);
      alert("Ocorreu um erro ao gerar o currículo com IA. Verifique sua conexão ou tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      
      <div className="fixed top-0 left-0 -z-50 pointer-events-none opacity-0 overflow-hidden" style={{ width: '210mm' }}>
        <Preview data={data} isExportVersion={true} />
      </div>

      <header className="h-16 shrink-0 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between z-40 shadow-sm animate-fade-in relative">
        <div className="flex items-center gap-3 md:gap-6 shrink-0 animate-fade-in delay-100">
          <div 
            className="flex items-center gap-[8px] md:gap-[12px] cursor-help transition-transform active:scale-95 select-none"
            onClick={handleLogoClick}
          >
            <div className="text-blue-600">
              <svg viewBox="0 0 512 512" width="32" height="32" className="md:w-[38px] md:h-[38px] drop-shadow-sm">
                <path fill="currentColor" d="M140 40h240v64h64v320H140z" opacity=".15"/>
                <path fill="currentColor" d="M100 80h240v64h64v320H100z" opacity=".3"/>
                <rect x="60" y="120" width="300" height="360" rx="24" fill="currentColor"/>
                <text x="120" y="270" fill="white" fontFamily="Arial" fontWeight="900" fontSize="110">CV</text>
                <rect x="120" y="315" width="180" height="18" rx="9" fill="white"/>
                <rect x="120" y="355" width="180" height="18" rx="9" fill="white"/>
                <rect x="120" y="395" width="120" height="18" rx="9" fill="white"/>
              </svg>
            </div>
            <h2 className="text-slate-900 font-bold text-lg md:text-2xl leading-none flex items-baseline font-geist tracking-tight">
              Simples<span className="text-blue-600">curriculo</span>
            </h2>
          </div>
          <div className="hidden lg:block h-6 w-[1px] bg-slate-200"></div>
          <p className="hidden xl:block text-[11px] text-slate-500 font-medium">
            Desenvolvido por <a href="https://renansm.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold">Renan Marques</a>
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0 animate-fade-in delay-150">
          
          <div className="relative">
            <button 
              ref={dropdownTriggerRef}
              onClick={() => setIsAIDropdownOpen(!isAIDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm font-bold border transition-all active:scale-95 border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100"
            >
              <span className="material-symbols-outlined text-[18px] md:text-[20px]">auto_awesome</span>
              <span className="hidden sm:inline">Ferramentas de IA</span>
              <span className={`material-symbols-outlined text-[16px] transition-transform ${isAIDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </button>
            
            {isAIDropdownOpen && (
              <div 
                ref={dropdownMenuRef}
                className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <button 
                  onClick={() => { setIsAIModalOpen(true); setIsAIDropdownOpen(false); }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-blue-500">auto_fix_high</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Otimizar currículo</p>
                    <p className="text-[10px] text-slate-500">Ajuste seu CV para uma vaga específica</p>
                  </div>
                </button>
                <button 
                  onClick={() => { setIsCoverLetterModalOpen(true); setIsAIDropdownOpen(false); }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-blue-500">history_edu</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Gerar carta de apresentação</p>
                    <p className="text-[10px] text-slate-500">Crie uma introdução personalizada</p>
                  </div>
                </button>
                <button 
                  onClick={() => { setIsLinkedInModalOpen(true); setIsAIDropdownOpen(false); }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-blue-500">analytics</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Analisar LinkedIn</p>
                    <p className="text-[10px] text-slate-500">Dicas para seu perfil profissional</p>
                  </div>
                </button>
              </div>
            )}
          </div>
          
          <div className="hidden sm:block h-8 w-[1px] bg-slate-200 mx-1"></div>

          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            title="Baixar em PDF"
            className={`flex items-center gap-2 p-2 md:px-5 md:py-2 rounded-lg text-sm font-bold shadow-lg transition-all active:scale-95 ${
              isDownloading 
              ? 'bg-slate-400 text-white cursor-not-allowed' 
              : 'bg-blue-600 text-white shadow-blue-500/30 hover:bg-blue-700'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] md:text-[20px] ${isDownloading ? 'animate-spin' : ''}`}>
              {isDownloading ? 'sync' : 'download'}
            </span>
            <span className="hidden md:inline">{isDownloading ? 'Gerando...' : 'Baixar PDF'}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <div className={`flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-50 border-r border-slate-200 ${viewMode === 'preview' ? 'hidden lg:block' : 'block animate-fade-in-up delay-200'}`}>
          <Editor data={data} onChange={setData} />
        </div>
        <div className={`flex-1 bg-slate-200 overflow-y-auto flex justify-center items-start p-4 md:p-12 custom-scrollbar ${viewMode === 'edit' ? 'hidden lg:flex' : 'flex animate-fade-in delay-300'}`}>
          <div className="hidden xl:block fixed top-20 right-12 z-20 animate-fade-in delay-500">
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-300 shadow-sm">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Formato</p>
               <p className="text-xs font-bold text-slate-800">A4 Padrão</p>
            </div>
          </div>
          <Preview data={data} />
        </div>

        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex bg-white/90 backdrop-blur shadow-2xl rounded-full p-1 border border-slate-200 z-40 ring-1 ring-black/5 animate-fade-in-up delay-400">
           <button onClick={() => setViewMode('edit')} className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all ${viewMode === 'edit' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>
             <span className="material-symbols-outlined text-[18px]">edit</span> EDITOR
           </button>
           <button onClick={() => setViewMode('preview')} className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>
             <span className="material-symbols-outlined text-[18px]">visibility</span> PRÉVIA
           </button>
        </div>
      </main>

      <CoverLetterModal isOpen={isCoverLetterModalOpen} onClose={() => setIsCoverLetterModalOpen(false)} resumeData={data} />
      <EasterEggGame isOpen={isEasterEggOpen} onClose={() => setIsEasterEggOpen(false)} />

      {/* AI CV Optimization Modal */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">auto_fix_high</span>
                <h3 className="text-lg md:text-xl font-bold text-slate-900">Otimizar currículo</h3>
              </div>
              <button onClick={() => setIsAIModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Empresa Alvo</label>
                <input type="text" value={aiForm.company} onChange={(e) => setAiForm({...aiForm, company: e.target.value})} placeholder="Ex: Google, Nubank..." className="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Cargo Desejado</label>
                <input type="text" value={aiForm.role} onChange={(e) => setAiForm({...aiForm, role: e.target.value})} placeholder="Ex: Desenvolvedor Front-end" className="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Descrição da Vaga</label>
                <textarea rows={4} value={aiForm.description} onChange={(e) => setAiForm({...aiForm, description: e.target.value})} placeholder="Cole aqui os requisitos da vaga..." className="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm resize-none" />
              </div>
            </div>
            <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setIsAIModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800">Cancelar</button>
              <button onClick={handleGenerateAI} disabled={isGenerating} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50">
                {isGenerating ? <><span className="material-symbols-outlined animate-spin text-[18px]">sync</span> Otimizando...</> : <><span className="material-symbols-outlined text-[18px]">auto_fix_high</span> Otimizar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LinkedIn Analysis Placeholder Modal */}
      {isLinkedInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 text-center">
            <div className="p-8 space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl">analytics</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Analisar Perfil do LinkedIn</h3>
              <p className="text-slate-500 text-sm">Esta ferramenta ajudará você a identificar pontos de melhoria no seu perfil profissional para atrair mais recrutadores.</p>
              <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-xs font-medium text-left">
                <p>Em breve você poderá:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Importar dados do seu perfil</li>
                  <li>Avaliar seu "About me" e experiências</li>
                  <li>Obter sugestões de palavras-chave</li>
                </ul>
              </div>
              <button 
                onClick={() => setIsLinkedInModalOpen(false)}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;