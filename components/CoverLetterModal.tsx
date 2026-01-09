
import React, { useState } from 'react';
import { ResumeData, CoverLetterForm, ToneType } from '../types';
import { GoogleGenAI } from "@google/genai";

interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
}

const CoverLetterModal: React.FC<CoverLetterModalProps> = ({ isOpen, onClose, resumeData }) => {
  const [form, setForm] = useState<CoverLetterForm>({
    jobRole: '',
    companyName: '',
    tone: 'Professional',
    highlight: ''
  });
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!form.jobRole) {
      alert("Por favor, informe ao menos o cargo da vaga.");
      return;
    }

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Gere uma carta de apresentação profissional com base nos seguintes dados:
        
        DADOS DO CURRÍCULO:
        Nome: ${resumeData.personal.fullName}
        Cargo Atual/Objetivo: ${resumeData.personal.jobTitle}
        Resumo: ${resumeData.personal.summary}
        Experiências: ${resumeData.experiences.map(e => `${e.position} na ${e.company}`).join(', ')}
        Habilidades: ${resumeData.skills.join(', ')}
        
        DADOS DA VAGA ALVO:
        Cargo: ${form.jobRole}
        Empresa: ${form.companyName || 'Empresa Confidencial'}
        Tom de voz: ${form.tone}
        Destaque desejado: ${form.highlight}
        
        A carta deve ser estruturada em:
        1. Saudação
        2. Introdução impactante mencionando a vaga
        3. Desenvolvimento conectando as experiências do currículo com os desafios da vaga
        4. Parágrafo sobre habilidades e o destaque solicitado
        5. Encerramento com chamada para ação (entrevista)
        6. Assinatura
        
        Retorne APENAS o texto da carta de apresentação.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      setGeneratedText(response.text || '');
    } catch (error) {
      console.error("Erro ao gerar carta:", error);
      alert("Erro ao conectar com a IA. Verifique sua conexão.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    alert("Texto copiado para a área de transferência!");
  };

  const handleDownloadPDF = async () => {
    if (!generatedText) return;
    setIsExporting(true);

    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 40px; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="font-size: 24px; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-bottom: 30px;">Carta de Apresentação</h1>
        <div style="white-space: pre-wrap;">${generatedText}</div>
        <div style="margin-top: 50px; border-top: 1px solid #eee; pt-10px; font-size: 12px; color: #666;">
          Gerado por CVfácil - ${resumeData.personal.fullName}
        </div>
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `carta-apresentacao-${resumeData.personal.fullName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // @ts-ignore
      await window.html2pdf().set(opt).from(element).save();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Painel Esquerdo: Configuração */}
        <div className="w-full md:w-1/3 border-r border-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-50 bg-slate-50 flex justify-between items-center shrink-0">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">description</span>
              Carta de Apresentação
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
            {/* Aviso Importante */}
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-3">
              <span className="material-symbols-outlined text-amber-600 text-[20px] shrink-0">info</span>
              <p className="text-[11px] text-amber-800 leading-tight">
                <strong>Importante:</strong> Certifique-se de preencher seu currículo antes. A IA utiliza suas experiências e habilidades para redigir uma carta personalizada.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Cargo da Vaga *</label>
              <input 
                type="text" 
                value={form.jobRole}
                onChange={(e) => setForm({...form, jobRole: e.target.value})}
                placeholder="Ex: Designer de Produto"
                className="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nome da Empresa</label>
              <input 
                type="text" 
                value={form.companyName}
                onChange={(e) => setForm({...form, companyName: e.target.value})}
                placeholder="Ex: Google"
                className="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Tom de Escrita</label>
              <select 
                value={form.tone}
                onChange={(e) => setForm({...form, tone: e.target.value as ToneType})}
                className="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="Professional">Profissional</option>
                <option value="Formal">Formal</option>
                <option value="Friendly">Amigável</option>
                <option value="Objective">Objetivo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">O que destacar? (Opcional)</label>
              <textarea 
                rows={3}
                value={form.highlight}
                onChange={(e) => setForm({...form, highlight: e.target.value})}
                placeholder="Ex: Minha experiência com metodologias ágeis..."
                className="w-full rounded-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm resize-none" 
              />
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <span className="material-symbols-outlined animate-spin">sync</span>
                  Escrevendo...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">auto_fix_high</span>
                  {generatedText ? 'Regerar Carta' : 'Gerar Carta'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Painel Direito: Resultado */}
        <div className="hidden md:flex flex-1 flex-col bg-slate-50">
          <div className="p-6 border-b border-slate-100 bg-white flex justify-between items-center shrink-0">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Prévia da Carta</p>
            <div className="flex gap-2">
              {generatedText && (
                <>
                  <button onClick={handleCopy} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Copiar Texto">
                    <span className="material-symbols-outlined">content_copy</span>
                  </button>
                  <button onClick={handleDownloadPDF} disabled={isExporting} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Baixar PDF">
                    <span className={`material-symbols-outlined ${isExporting ? 'animate-spin' : ''}`}>
                      {isExporting ? 'sync' : 'picture_as_pdf'}
                    </span>
                  </button>
                </>
              )}
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-8 overflow-hidden flex flex-col">
            {generatedText ? (
              <textarea 
                value={generatedText}
                onChange={(e) => setGeneratedText(e.target.value)}
                className="flex-1 w-full p-8 rounded-xl border-slate-200 focus:ring-0 focus:border-slate-200 shadow-sm resize-none text-slate-700 leading-relaxed font-serif text-lg bg-white custom-scrollbar"
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4 border-2 border-dashed border-slate-200 rounded-xl m-4">
                <span className="material-symbols-outlined text-6xl">edit_note</span>
                <p className="font-medium">Sua carta de apresentação aparecerá aqui.</p>
                <p className="text-xs max-w-[200px] text-center">Preencha seu currículo, informe os dados da vaga ao lado e clique em gerar.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CoverLetterModal;
