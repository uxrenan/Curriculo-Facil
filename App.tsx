
import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { INITIAL_DATA } from './constants';
import { ResumeData } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (data.personal.fullName) {
      document.title = `Curriculo - ${data.personal.fullName}`;
    } else {
      document.title = "Swift Resume Builder";
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

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      
      {/* Container invisível para exportação (garante renderização correta sem interferência da UI) */}
      <div className="fixed top-0 left-0 -z-50 pointer-events-none opacity-0 overflow-hidden" style={{ width: '210mm' }}>
        <Preview data={data} isExportVersion={true} />
      </div>

      {/* Navbar */}
      <header className="h-16 shrink-0 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined">description</span>
          </div>
          <div>
            <h2 className="text-slate-900 font-bold leading-none">SwiftResume</h2>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter mt-1">Construtor em Tempo Real</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
            <span className="material-symbols-outlined text-green-600 text-[18px]">cloud_done</span>
            <span className="text-xs font-bold text-green-700">Salvo no Navegador</span>
          </div>
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
        {/* Editor Panel */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50 border-r border-slate-200">
          <Editor data={data} onChange={setData} />
        </div>

        {/* Preview Panel (Visualização em tempo real) */}
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

      {/* Mobile Preview Toggle */}
      <button className="lg:hidden fixed bottom-6 right-6 size-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-20">
         <span className="material-symbols-outlined">visibility</span>
      </button>
    </div>
  );
};

export default App;
