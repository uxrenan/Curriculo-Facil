import React from 'react';
import { SavedResume } from '../types';

interface TemplatesListProps {
  templates: SavedResume[];
  onLoad: (template: SavedResume) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  isAuthenticated: boolean;
  onLoginClick: () => void;
}

const TemplatesList: React.FC<TemplatesListProps> = ({ 
  templates, 
  onLoad, 
  onDelete, 
  onBack, 
  isAuthenticated,
  onLoginClick 
}) => {
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 animate-fade-in flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-12 text-center space-y-8">
          <div className="size-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto rotate-3 shadow-lg shadow-blue-500/10">
            <span className="material-symbols-outlined text-4xl">folder_shared</span>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Salve seus currículos na nuvem</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Crie uma conta gratuita para salvar seus templates, editá-los de qualquer dispositivo e nunca perder seu progresso.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <button 
              onClick={onLoginClick}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/25 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">login</span>
              Entrar ou Criar Conta
            </button>
            
            <button 
              onClick={onBack}
              className="w-full py-4 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-colors text-sm"
            >
              Continuar como convidado
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-100">
             <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-slate-400 text-xl">cloud_done</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auto-save</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-slate-400 text-xl">devices</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Multi-device</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-slate-400 text-xl">security</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seguro</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Meus templates</h1>
            <p className="text-slate-500 text-sm">Visualize e gerencie seus currículos salvos.</p>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Voltar ao Editor
          </button>
        </div>

        {templates.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center space-y-4">
            <div className="size-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-4xl">folder_open</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Nenhum template salvo</h3>
              <p className="text-slate-500 text-sm">Seus currículos salvos aparecerão aqui para você editar depois.</p>
            </div>
            <button 
              onClick={onBack}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95"
            >
              Criar meu primeiro currículo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div 
                key={template.id}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all overflow-hidden flex flex-col"
              >
                <div className="p-5 flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 line-clamp-1">{template.name || 'Currículo sem nome'}</h3>
                      <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                        {template.data.theme.template} • Modificado em {formatDate(template.lastModified)}
                      </p>
                    </div>
                    <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">description</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 flex items-center gap-2">
                     <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '70%' }}></div>
                     </div>
                     <span className="text-[10px] font-bold text-slate-400">70%</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                  <button 
                    onClick={() => onLoad(template)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all active:scale-95"
                  >
                    Editar currículo
                  </button>
                  <button 
                    onClick={() => onDelete(template.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    title="Excluir"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesList;