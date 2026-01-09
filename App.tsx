
import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { INITIAL_DATA } from './constants';
import { ResumeData, Type } from './types';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiForm, setAiForm] = useState({ company: '', role: '', description: '' });

  useEffect(() => {
    if (data.personal.fullName) {
      document.title = `Curriculo - ${data.personal.fullName}`;
    } else {
      document.title = "CVfácil - Construtor de Currículos";
    }
  }, [data.personal.fullName]);

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
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // @ts-ignore - html2pdf está disponível globalmente via script tag
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
      
      {/* Container invisível para exportação */}
      <div className="fixed top-0 left-0 -z-50 pointer-events-none opacity-0 overflow-hidden" style={{ width: '210mm' }}>
        <Preview data={data} isExportVersion={true} />
      </div>

      {/* Navbar */}
      <header className="h-16 shrink-0 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-[12px]">
          <div className="text-blue-600">
            <svg viewBox="0 0 512 512" width="38" height="38" className="drop-shadow-sm">
              <path fill="currentColor" d="M140 40h240v64h64v320H140z" opacity=".15"/>
              <path fill="currentColor" d="M100 80h240v64h64v320H100z" opacity=".3"/>
              <rect x="60" y="120" width="300" height="360" rx="24" fill="currentColor"/>
              <text x="120" y="270" fill="white" fontFamily="Arial" fontWeight="900" fontSize="110">CV</text>
              <rect x="120" y="315" width="180" height="18" rx="9" fill="white"/>
              <rect x="120" y="355" width="180" height="18" rx="9" fill="white"/>
              <rect x="120" y="395" width="120" height="18" rx="9" fill="white"/>
            </svg>
          </div>
          <div>
            <h2 className="text-slate-900 font-bold text-2xl leading-none flex items-baseline font-geist tracking-tight">
              CV<span className="text-blue-600">fácil</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            Gerar com IA
          </button>
          
          <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold shadow-lg transition-all active:scale-95 ${
              isDownloading 
              ? 'bg-slate-400 text-white cursor-not-allowed' 
              : 'bg-blue-600 text-white shadow-blue-500/30 hover:bg-blue-700'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${isDownloading ? 'animate-spin' : ''}`}>
              {isDownloading ? 'sync' : 'download'}
            </span>
            {isDownloading ? 'Gerando...' : 'Baixar PDF'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50 border-r border-slate-200">
          <Editor data={data} onChange={setData} />
        </div>
        <div className="hidden lg:flex flex-1 bg-slate-200 overflow-y-auto justify-center p-12 relative custom-scrollbar">
          <div className="fixed top-20 right-12 z-20 flex flex-col gap-2">
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-300 shadow-sm">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Formato da Página</p>
               <p className="text-xs font-bold text-slate-800">A4 Padrão</p>
            </div>
          </div>
          <Preview data={data} />
        </div>
      </main>

      {/* IA Modal */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">auto_awesome</span>
                <h3 className="text-xl font-bold text-slate-900">Gerar com IA</h3>
              </div>
              <button onClick={() => setIsAIModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Empresa Alvo</label>
                <input 
                  type="text" 
                  value={aiForm.company}
                  onChange={(e) => setAiForm({...aiForm, company: e.target.value})}
                  placeholder="Ex: Google, Nubank, Freelancer..."
                  className="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Cargo Desejado</label>
                <input 
                  type="text" 
                  value={aiForm.role}
                  onChange={(e) => setAiForm({...aiForm, role: e.target.value})}
                  placeholder="Ex: Desenvolvedor Front-end Pleno"
                  className="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Descrição da Vaga</label>
                <textarea 
                  rows={4}
                  value={aiForm.description}
                  onChange={(e) => setAiForm({...aiForm, description: e.target.value})}
                  placeholder="Cole aqui os requisitos e responsabilidades da vaga..."
                  className="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm resize-none" 
                />
              </div>
              <p className="text-[10px] text-slate-500 italic">
                A IA irá reescrever seu resumo, experiências e habilidades para que fiquem alinhados com esta vaga específica.
              </p>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsAIModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800"
              >
                Cancelar
              </button>
              <button 
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    Otimizando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">auto_fix_high</span>
                    Otimizar Currículo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
