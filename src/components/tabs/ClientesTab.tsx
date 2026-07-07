import React, { useState } from 'react';
import { Cliente } from '../../types';
import { Search, Edit2, ArrowUpDown, Trash2, UserX, Clock } from 'lucide-react';

interface ClientesTabProps {
  clientes: Cliente[];
  activeClienteId: string | null;
  onSelectCliente: (cliente: Cliente) => void;
  onUpdateCliente: (cliente: Cliente) => void;
  onAddCliente: (cliente: Cliente) => void;
  onDeleteCliente: (id: string) => void;
  onDeselectCliente: () => void;
}

const BENEFICIOS_MODAL = [
  'Ainda não definido',
  'LOAS - Deficiente',
  'LOAS - Idoso',
  'Benefício por incapacidade - Urbano',
  'Benefício por incapacidade - Rural',
  'Salário-Maternidade - Urbano',
  'Salário-Maternidade - Rural',
  'Pensão por Morte - Urbano',
  'Pensão por Morte - Rural',
  'Aposentadoria por Tempo de Contribuição e Urbana',
  'Aposentadoria Rural',
  'Aposentadoria Híbrida'
];

export default function ClientesTab({ clientes, activeClienteId, onSelectCliente, onUpdateCliente, onAddCliente, onDeleteCliente, onDeselectCliente }: ClientesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBeneficio, setFilterBeneficio] = useState('Todos');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  
  const [sortConfig, setSortConfig] = useState<{ key: keyof Cliente, direction: 'asc' | 'desc' } | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create'|'edit'>('create');
  const [editingCliente, setEditingCliente] = useState<Partial<Cliente>>({});

  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleOpenModal = (mode: 'create'|'edit', cliente?: Cliente) => {
    setModalMode(mode);
    setEditingCliente(cliente ? { ...cliente } : { beneficio: BENEFICIOS_MODAL[0] });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCliente.nome || !editingCliente.cpf || !editingCliente.telefone) return;
    
    if (modalMode === 'create') {
      onAddCliente({
        id: Date.now().toString(),
        nome: editingCliente.nome,
        cpf: editingCliente.cpf,
        telefone: editingCliente.telefone,
        beneficio: editingCliente.beneficio || BENEFICIOS_MODAL[0],
        progresso: 0,
        checkedDocs: [],
        excludedDocs: [],
        dataCriacao: new Date().toLocaleDateString('pt-BR'),
        dataAtualizacao: Date.now()
      } as Cliente);
    } else if (modalMode === 'edit' && editingCliente.id) {
      const originalCliente = clientes.find(c => c.id === editingCliente.id);
      let newProgresso = editingCliente.progresso;
      let newCheckedDocs = editingCliente.checkedDocs;
      
      if (originalCliente && originalCliente.beneficio !== editingCliente.beneficio) {
        newProgresso = 0;
        newCheckedDocs = [];
      }

      onUpdateCliente({
        ...editingCliente,
        progresso: newProgresso,
        checkedDocs: newCheckedDocs
      } as Cliente);
    }
    setIsModalOpen(false);
  };

  const requestSort = (key: keyof Cliente) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredClientes = clientes.filter(c => {
    const matchSearch = c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.cpf.includes(searchTerm);
    const matchBeneficio = filterBeneficio === 'Todos' || c.beneficio.includes(filterBeneficio);
    return matchSearch && matchBeneficio;
  });

  const sortedClientes = [...filteredClientes].sort((a, b) => {
    if (!sortConfig) {
      // Proteção contra undefined para o TypeScript
      const timeA = a.dataAtualizacao ? a.dataAtualizacao : 0;
      const timeB = b.dataAtualizacao ? b.dataAtualizacao : 0;
      return timeB - timeA;
    }
    const { key, direction } = sortConfig;
    
    // Proteção contra undefined nas chaves dinâmicas
    const valA = a[key] !== undefined ? a[key] : '';
    const valB = b[key] !== undefined ? b[key] : '';
    
    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleRow = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  const activeClienteObj = clientes.find(c => c.id === activeClienteId);

  return (
    <div className="h-full flex flex-col relative">
      {activeClienteObj && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between items-center shadow-sm">
          <div className="text-sm text-blue-800">
            <span className="font-semibold">Atendimento em Andamento:</span> {activeClienteObj.nome} (CPF: {activeClienteObj.cpf})
          </div>
          <button 
            onClick={onDeselectCliente}
            className="flex items-center gap-1 text-sm bg-white border border-blue-300 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100 font-semibold transition-colors"
          >
            <UserX size={16} /> Encerrar Atendimento Atual
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[1.25rem] font-bold text-slate-900">Cadastro de Clientes</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500 w-[200px]"
            />
          </div>
          
          <select 
            className="px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500 bg-white"
            value={filterBeneficio}
            onChange={e => setFilterBeneficio(e.target.value)}
          >
            <option value="Todos">Todos os Benefícios</option>
            <option value="Ainda não definido">Ainda não definido</option>
            <option value="Aposentadoria">Aposentadoria</option>
            <option value="Incapacidade">Incapacidade</option>
            <option value="LOAS">LOAS</option>
            <option value="Maternidade">Maternidade</option>
            <option value="Pensão">Pensão</option>
            <option value="Rural">Rural</option>
            <option value="Urbano">Urbano</option>
          </select>

          <button 
            onClick={() => handleOpenModal('create')}
            className="bg-emerald-500 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-emerald-600 transition-colors ml-2"
          >
            + Novo Cliente
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-slate-200 flex flex-col flex-1 overflow-hidden">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 w-10 text-center">
                  <button
                    onClick={() => setSortConfig(null)}
                    title="Ordenar por Recentes (Padrão)"
                    className={`transition-colors duration-200 ${!sortConfig ? 'text-blue-600' : 'text-slate-400 hover:text-blue-500'}`}
                  >
                    <Clock size={16} />
                  </button>
                </th>
                <th 
                  className="px-4 py-3 font-bold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors group"
                  onClick={() => requestSort('nome')}
                >
                  <div className="flex items-center gap-1">
                    Nome Completo 
                    <ArrowUpDown size={14} className={`transition-colors ${sortConfig?.key === 'nome' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'}`}/>
                  </div>
                </th>
                <th className="px-4 py-3 font-bold text-slate-700">CPF</th>
                <th 
                  className="px-4 py-3 font-bold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors group"
                  onClick={() => requestSort('beneficio')}
                >
                  <div className="flex items-center gap-1">
                    Benefício 
                    <ArrowUpDown size={14} className={`transition-colors ${sortConfig?.key === 'beneficio' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'}`}/>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 font-bold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors group"
                  onClick={() => requestSort('progresso')}
                >
                  <div className="flex items-center gap-1">
                    Progresso Docs 
                    <ArrowUpDown size={14} className={`transition-colors ${sortConfig?.key === 'progresso' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'}`}/>
                  </div>
                </th>
                <th className="px-4 py-3 font-bold text-slate-700 w-[140px]">Ação</th>
              </tr>
            </thead>
            <tbody>
              {sortedClientes.map((cliente) => (
                <React.Fragment key={cliente.id}>
                  <tr className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${expandedRowId === cliente.id ? 'bg-slate-50' : ''}`}>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleRow(cliente.id)} className="text-slate-400 hover:text-blue-600 transition-colors">
                        <Search size={18} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-800 font-medium">{cliente.nome}</td>
                    <td className="px-4 py-3 text-slate-500">{cliente.cpf}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-[11px] font-bold ${
                        cliente.beneficio === 'Ainda não definido' ? 'bg-slate-200 text-slate-700' :
                        cliente.beneficio.includes('Rural') ? 'bg-amber-100 text-amber-800' : 
                        cliente.beneficio.includes('LOAS') ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {cliente.beneficio}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden w-24">
                          <div 
                            className={`h-full ${cliente.progresso === 100 ? 'bg-emerald-500' : 'bg-orange-400'}`} 
                            style={{ width: `${cliente.progresso || 0}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">{Math.round(cliente.progresso || 0)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onSelectCliente(cliente)}
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded font-semibold text-xs transition-colors"
                        >
                          Selecionar
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleOpenModal('edit', cliente); }}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {expandedRowId === cliente.id && (
                    <tr className="bg-slate-50/80 border-b border-slate-200">
                      <td colSpan={6} className="px-8 py-4">
                        <div className="grid grid-cols-2 gap-6 bg-white p-4 rounded border border-slate-200 shadow-sm">
                          <div>
                            <h4 className="font-bold text-slate-800 mb-2 border-b pb-1">Detalhes do Cliente</h4>
                            <p className="text-sm text-slate-600 mb-1"><span className="font-semibold text-slate-700">Nome:</span> {cliente.nome}</p>
                            <p className="text-sm text-slate-600 mb-1"><span className="font-semibold text-slate-700">CPF:</span> {cliente.cpf}</p>
                            <p className="text-sm text-slate-600 mb-1"><span className="font-semibold text-slate-700">WhatsApp:</span> {cliente.telefone}</p>
                            <p className="text-sm text-slate-600 mb-1"><span className="font-semibold text-slate-700">Benefício Foco:</span> {cliente.beneficio}</p>
                            <p className="text-sm text-slate-600"><span className="font-semibold text-slate-700">Data de Cadastro:</span> {cliente.dataCriacao}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 mb-2 border-b pb-1">Resumo de Documentos</h4>
                            <p className="text-sm text-slate-600 mb-2">
                              Progresso atual: <span className="font-bold text-blue-600">{Math.round(cliente.progresso || 0)}%</span>
                            </p>
                            {cliente.checkedDocs && cliente.checkedDocs.length > 0 ? (
                              <p className="text-xs text-slate-500 bg-slate-100 p-2 rounded">
                                <span className="font-semibold">Docs já coletados:</span> {cliente.checkedDocs.length} iten(s). Vá até a aba 'Documentos' para ver a lista de pendências e o checklist completo.
                              </p>
                            ) : (
                              <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded font-medium">
                                Nenhum documento marcado ainda.
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {sortedClientes.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">
                {modalMode === 'create' ? 'Novo Cliente' : 'Editar Cliente'}
              </h3>
              {modalMode === 'edit' && (
                <button 
                  type="button"
                  onClick={() => {
                    if(window.confirm('Tem certeza que deseja apagar este cliente? Esta ação não pode ser desfeita.')) {
                      onDeleteCliente(editingCliente.id!);
                      setIsModalOpen(false);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-semibold transition-colors bg-red-50 px-2 py-1 rounded"
                >
                  <Trash2 size={16} /> Apagar
                </button>
              )}
            </div>
            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-slate-300 rounded p-2 focus:border-blue-500 outline-none uppercase"
                  value={editingCliente.nome || ''}
                  onChange={e => setEditingCliente({...editingCliente, nome: e.target.value.toUpperCase()})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">CPF</label>
                <input 
                  type="text" 
                  required
                  maxLength={14}
                  placeholder="000.000.000-00"
                  className="w-full border border-slate-300 rounded p-2 focus:border-blue-500 outline-none"
                  value={editingCliente.cpf || ''}
                  onChange={e => setEditingCliente({...editingCliente, cpf: maskCPF(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">WhatsApp (Telefone)</label>
                <input 
                  type="text" 
                  required
                  maxLength={15}
                  placeholder="(00) 00000-0000"
                  className="w-full border border-slate-300 rounded p-2 focus:border-blue-500 outline-none"
                  value={editingCliente.telefone || ''}
                  onChange={e => setEditingCliente({...editingCliente, telefone: maskPhone(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo de Benefício</label>
                <select 
                  className="w-full border border-slate-300 rounded p-2 focus:border-blue-500 outline-none"
                  value={editingCliente.beneficio || ''}
                  onChange={e => setEditingCliente({...editingCliente, beneficio: e.target.value})}
                >
                  {BENEFICIOS_MODAL.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              
              <div className="pt-4 flex justify-between items-center border-t mt-6">
                <div className="text-xs text-slate-400 font-medium">
                  {modalMode === 'edit' ? `Cadastrado em: ${editingCliente.dataCriacao}` : 'Novo Cadastro'}
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={!editingCliente.cpf || editingCliente.cpf.length < 14 || !editingCliente.telefone || editingCliente.telefone.length < 14}
                    className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}