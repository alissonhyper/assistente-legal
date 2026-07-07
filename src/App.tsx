import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ClientesTab from './components/tabs/ClientesTab';
import TranscricaoTab from './components/tabs/TranscricaoTab';
import DocumentosTab from './components/tabs/DocumentosTab';
import ContratosTab from './components/tabs/ContratosTab';
import FofocaTab from './components/tabs/FofocaTab';
import { Cliente, Tab } from './types';

export default function App() {
  // 1. Inicializando Clientes do LocalStorage (Começa zerado se não tiver nada salvo)
  const [clientes, setClientes] = useState<Cliente[]>(() => {
    const savedClientes = localStorage.getItem('@ReisMoraes:clientes');
    if (savedClientes) {
      return JSON.parse(savedClientes);
    }
    return []; // Array vazio: removemos os cadastros antigos!
  });

  // 2. Inicializando Cliente Ativo do LocalStorage
  const [activeClienteId, setActiveClienteId] = useState<string | null>(() => {
    const savedActiveId = localStorage.getItem('@ReisMoraes:activeClienteId');
    return savedActiveId ? JSON.parse(savedActiveId) : null;
  });

  // 3. Inicializando a Aba Ativa do LocalStorage (Pra voltar na mesma tela do F5)
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const savedTab = localStorage.getItem('@ReisMoraes:activeTab');
    return savedTab ? JSON.parse(savedTab) : 'clientes';
  });

  // 4. EFEITOS: Salvando os dados no LocalStorage em tempo real
  useEffect(() => {
    localStorage.setItem('@ReisMoraes:clientes', JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    localStorage.setItem('@ReisMoraes:activeClienteId', JSON.stringify(activeClienteId));
  }, [activeClienteId]);

  useEffect(() => {
    localStorage.setItem('@ReisMoraes:activeTab', JSON.stringify(activeTab));
  }, [activeTab]);


  // 5. Funções de Manipulação
  const handleAddCliente = (novoCliente: Cliente) => {
    setClientes([novoCliente, ...clientes]);
    setActiveClienteId(novoCliente.id); // Já seleciona automaticamente ao criar
  };

  const handleUpdateCliente = (clienteAtualizado: Cliente) => {
    setClientes(clientes.map(c => c.id === clienteAtualizado.id ? clienteAtualizado : c));
  };

  const handleDeleteCliente = (id: string) => {
    setClientes(clientes.filter(c => c.id !== id));
    if (activeClienteId === id) {
      setActiveClienteId(null);
    }
  };

  const activeCliente = clientes.find(c => c.id === activeClienteId) || null;

  const renderTab = () => {
    switch (activeTab) {
      case 'clientes':
        return (
          <ClientesTab
            clientes={clientes}
            activeClienteId={activeClienteId}
            onSelectCliente={(c) => setActiveClienteId(c.id)}
            onUpdateCliente={handleUpdateCliente}
            onAddCliente={handleAddCliente}
            onDeleteCliente={handleDeleteCliente}
            onDeselectCliente={() => setActiveClienteId(null)}
          />
        );
      case 'transcricao':
        return <TranscricaoTab />;
      case 'documentos':
        return <DocumentosTab activeCliente={activeCliente} onUpdateCliente={handleUpdateCliente} />;
      case 'contratos':
        return <ContratosTab activeCliente={activeCliente} onUpdateCliente={handleUpdateCliente} />;
      case 'fofoca':
        return <FofocaTab />;
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} activeCliente={activeCliente}>
      {renderTab()}
    </Layout>
  );
}