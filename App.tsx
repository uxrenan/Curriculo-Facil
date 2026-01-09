
import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { INITIAL_DATA } from './constants';
import { ResumeData } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);

  // Atualiza o título do documento para que o nome do arquivo PDF seja o nome do usuário
  useEffect(() => {
    if (data.personal.fullName) {
      document.title = `Curriculo - ${data.personal.fullName}`;
    } else {
      document.title = "Swift Resume Builder";
    }
  }, [data.personal.fullName]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      
      {/* Elemento Invisível na Tela, Visível apenas na Impressão */}
      <div className="print-only">
        <Preview data={data} isPrintVersion={true} />
      </div>

      {/* Navbar - Desabilitada na Impressão */}
      <header className="no-print h-16 shrink-0 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10">
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
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Baixar PDF
          </button>
        </div>
      </header>

      {/* Main Content - Desabilitado na Impressão */}
      <main className="flex-1 flex overflow-hidden no-print">
        {/* Editor Panel */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50 border-r border-slate-200">
          <Editor data={data} onChange={setData} />
        </div>

        {/* Preview Panel (UI Only) */}
        <div className="hidden lg:flex flex-1 bg-slate-200 overflow-y-auto justify-center p-12 relative">
          <div className="fixed top-20 right-12 z-20 flex flex-col gap-2">
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-300 shadow-sm">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Formato da Página</p>
               <p className="text-xs font-bold text-slate-800">A4 Padrão</p>
            </div>
          </div>
          <Preview data={data} />
        </div>
      </main>

      {/* Mobile Preview Toggle (Floating Button) */}
      <button className="lg:hidden fixed bottom-6 right-6 no-print size-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform">
         <span className="material-symbols-outlined">visibility</span>
      </button>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Font Family Helpers */
        .font-serif { font-family: 'Lora', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
};

export default App;
