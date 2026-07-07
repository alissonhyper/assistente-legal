import React from 'react';
import { Tab, Cliente } from '../types';
import { Users, FileAudio, FileText, Briefcase, Scale, Zap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  activeCliente: Cliente | null;
}

export default function Layout({ children, activeTab, setActiveTab, activeCliente }: LayoutProps) {
  const tabs = [
    { id: 'clientes', label: 'Clientes (Cadastro)', icon: Users },
    { id: 'transcricao', label: 'Transcrição', icon: FileAudio },
    { id: 'documentos', label: 'Documentos', icon: FileText },
    { id: 'contratos', label: 'Contratos', icon: Briefcase },
    { id: 'fofoca', label: 'Radar Jurídico', icon: Zap },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#0f172a] text-white flex flex-col shrink-0">
        <div className="px-5 py-6 font-bold text-[1.1rem] tracking-[0.5px] border-b border-white/10 flex items-center gap-2">
          <Scale className="w-6 h-6 text-blue-400" />
          REIS & MORAES
        </div>
        <nav className="flex-1 py-4 flex flex-col">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors text-[0.9rem] border-l-4 ${
                  isActive ? 'bg-[#1e293b] border-blue-500 font-semibold text-white' : 'border-transparent text-slate-300 hover:bg-[#1e293b] hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto p-5 text-[10px] text-slate-500">
          v1.0.0 - Reis & Moraes
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-[60px] bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center">
            <span className="font-semibold text-[#0f172a]">Hub Reis & Moraes</span>
          </div>
          <div className="flex items-center text-[13px] text-slate-500">
            {activeTab !== 'clientes' && (
              activeCliente ? (
                <span><strong>Cliente:</strong> {activeCliente.nome} | <strong>CPF:</strong> {activeCliente.cpf}</span>
              ) : (
                <span>Nenhum cliente selecionado</span>
              )
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto p-6 relative flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
