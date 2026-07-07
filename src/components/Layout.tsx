import React, { useState } from 'react';
import { Users, FileText, FileSignature, Zap, Menu, X } from 'lucide-react';
import { Tab, Cliente } from '../types';

interface LayoutProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  activeCliente: Cliente | null;
  children: React.ReactNode;
}

export default function Layout({ activeTab, setActiveTab, activeCliente, children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'clientes' as Tab, label: 'Clientes (Cadastro)', icon: Users },
    { id: 'transcricao' as Tab, label: 'Transcrição', icon: FileText },
    { id: 'documentos' as Tab, label: 'Documentos', icon: FileText },
    { id: 'contratos' as Tab, label: 'Contratos', icon: FileSignature },
    { id: 'fofoca' as Tab, label: 'Radar Jurídico', icon: Zap },
  ];

  const handleTabClick = (tabId: Tab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden select-none">
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Menu Lateral */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col 
        transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Scale size={24} className="text-blue-500" />
            REIS & MORAES
          </h1>
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="md:hidden text-slate-400 hover:text-white outline-none focus:outline-none active:outline-none shadow-none focus:shadow-none"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                // Adicionado reset forçado de bordas, outline e shadow direto na linha
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm 
                  outline-none focus:outline-none active:outline-none border-none focus:border-none ring-0 focus:ring-0 shadow-none focus:shadow-none select-none
                  ${isActive 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm' 
                    : 'hover:bg-slate-800/50 hover:text-slate-100'
                  }
                `}
                style={{ outline: 'none', boxShadow: 'none' }} // Bloqueio inline definitivo
              >
                <Icon size={18} className={isActive ? 'text-blue-500' : 'text-slate-500'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 text-[10px] text-slate-500 font-medium border-t border-slate-800">
          v1.0.0 - Hub Reis & Moraes
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 flex flex-col min-w-0">
        
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors outline-none focus:outline-none active:outline-none border-none"
              style={{ outline: 'none', boxShadow: 'none' }}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-sm font-bold text-slate-800 truncate">Hub Reis & Moraes</h2>
          </div>

          {activeCliente ? (
            <div className="flex items-center gap-3 ml-2 overflow-hidden">
              <span className="hidden sm:inline text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 truncate">
                Cliente Ativo: <span className="text-blue-600">{activeCliente.nome}</span> | CPF: {activeCliente.cpf}
              </span>
              <span className="sm:hidden text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 truncate max-w-[120px]">
                {activeCliente.nome.split(' ')[0]}
              </span>
            </div>
          ) : (
            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 truncate max-w-[120px]">
              Nenhum cliente
            </span>
          )}
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50 relative custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}

function Scale({ className, size }: { className?: string, size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
    </svg>
  );
}