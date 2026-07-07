import React, { useState, useRef } from 'react';
import { Cliente } from '../../types';
import { Check, X, FileText, Smartphone, Archive, RefreshCw } from 'lucide-react';

interface DocumentosTabProps {
  activeCliente: Cliente | null;
  onUpdateCliente: (cliente: Cliente) => void;
}

const DOCS_FIXOS = [
  'CARTEIRA DE IDENTIDADE / CNH',
  'CPF',
  'COMPROVANTE DE RESIDÊNCIA ATUALIZADO (OU DECLARAÇÃO VÁLIDA POR 3 MESES)',
  'CTPS (QUALIFICAÇÃO + PÁGINAS DE CONTRATOS A PARTIR DA PÁG 12)',
  'TÍTULO DE ELEITOR',
  'SENHA DO INSS/GOV',
  'FOTOS DA CASA',
  'DOCUMENTOS DO ESCRITÓRIO ASSINADOS'
];

const DOCS_RURAIS_BASE = [
  'Carteira do Sindicato Rural (caso seja filiada)',
  'Certidão de nascimento/casamento com a profissão rural mencionada',
  'Contrato de Empréstimo Rural (se houver)',
  'CAF (Cadastro de Atividade Familiar)',
  'PRONAF (Programa Nacional de Fortalecimento da Agricultura Familiar)',
  'ITR (Imposto Territorial Rural)',
  'INCRA (documentos de posse ou registro de imóvel rural)',
  'Carteira de Associação Rural (se fizer parte)',
  'Plano Funerário que conste endereço ou profissão rural',
  'Conta antiga da CEMIG que indique endereço rural',
  'Contrato Agrícola (caso tenha participado de algum)',
  'Certificado de Cursos Rurais (se tiver realizado)',
  'Certidão de Batismo que mencione endereço rural',
  'Carteira de Dizimista da igreja com endereço rural',
  'Prontuário Médico com informações de residência rural',
  'Cartão de Vacina com endereço rural',
  'Declaração Escolar de filhos que mencione endereço rural',
  'CadÚnico (caso esteja inscrita) ou documentos que indiquem endereço rural'
];

export default function DocumentosTab({ activeCliente, onUpdateCliente }: DocumentosTabProps) {
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!activeCliente) return null;

  if (activeCliente.beneficio === 'Ainda não definido') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <FileText size={64} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-700 mb-2">Benefício Não Definido</h2>
        <p className="text-slate-500 max-w-md">
          O checklist de documentos será gerado automaticamente assim que você definir o tipo de benefício deste cliente na aba de Cadastro.
        </p>
      </div>
    );
  }

  let docsDinamicos: string[] = [];
  const b = activeCliente.beneficio;

  if (b.includes('LOAS - Deficiente')) {
    docsDinamicos = ['Laudo médico', 'Receitas médicas', 'Relatórios (escolar/psicológico/fisioterapêutico)', 'Registro civil do grupo familiar', 'Nota fiscal e recibo de consulta/medicamentos', 'Cadastro Único', 'Carteira de trabalho do grupo familiar'];
  } else if (b.includes('LOAS - Idoso')) {
    docsDinamicos = ['Registro civil do grupo familiar', 'Cadastro Único', 'Carteira de trabalho do grupo familiar'];
  } else if (b.includes('Incapacidade - Urbano')) {
    docsDinamicos = ['Laudos médicos', 'Atestados médicos', 'Exames laboratoriais e de imagem'];
  } else if (b.includes('Maternidade - Urbano')) {
    docsDinamicos = ['Certidão de nascimento dos filhos'];
  } else if (b.includes('Tempo de Contribuição e Urbana')) {
    docsDinamicos = ['Carnês de contribuição', 'PPP (Perfil Profissiográfico Previdenciário)', 'Contratos de trabalho', 'Certidão de tempo de contribuição', 'Formulários de atividade especial'];
  } else if (b.includes('Pensão por Morte - Rural')) {
    docsDinamicos = ['CPF da pessoa falecida', 'Certidão de óbito', 'Certidão de casamento e/ou nascimento', 'Todas as carteiras de trabalho', 'Documentos de dependência financeira (Certidão de filho em comum, conta conjunta, etc.)', ...DOCS_RURAIS_BASE];
  } else if (b.includes('Incapacidade - Rural')) {
    docsDinamicos = ['Todos os exames (receitas, imagens e laudos)', 'Prontuário médico', ...DOCS_RURAIS_BASE];
  } else if (b.includes('Aposentadoria Rural')) {
    docsDinamicos = [...DOCS_RURAIS_BASE];
  } else if (b.includes('Maternidade - Rural')) {
    docsDinamicos = ['Certidão de nascimento dos filhos', 'Todas as carteiras de trabalho (pai e mãe)', 'Título de eleitor', ...DOCS_RURAIS_BASE];
  } else if (b.includes('Aposentadoria Híbrida')) {
    docsDinamicos = ['Carnês de contribuição', 'PPP', 'Contratos de trabalho', 'Certidão de tempo de contribuição', 'Formulários de atividade especial', ...DOCS_RURAIS_BASE];
  } else {
    if (b.includes('Pensão por Morte - Urbano')) {
       docsDinamicos = ['CPF da pessoa falecida', 'Certidão de óbito', 'Certidão de casamento e/ou nascimento', 'Documentos de dependência financeira'];
    }
  }

  const allDocs = [...DOCS_FIXOS, ...docsDinamicos];
  const checkedDocs = activeCliente.checkedDocs || [];
  const excludedDocs = activeCliente.excludedDocs || [];

  const totalValidos = allDocs.filter(d => !excludedDocs.includes(d)).length;
  const totalChecadosValidos = checkedDocs.filter(d => !excludedDocs.includes(d)).length;
  const progresso = totalValidos === 0 ? 100 : Math.round((totalChecadosValidos / totalValidos) * 100);

  const toggleCheck = (doc: string) => {
    if (excludedDocs.includes(doc)) return; 
    
    let newChecked = [...checkedDocs];
    if (newChecked.includes(doc)) {
      newChecked = newChecked.filter(d => d !== doc);
    } else {
      newChecked.push(doc);
    }
    
    const newTotalValidos = allDocs.filter(d => !excludedDocs.includes(d)).length;
    const newTotalChecados = newChecked.filter(d => !excludedDocs.includes(d)).length;
    const newProgresso = newTotalValidos === 0 ? 100 : Math.round((newTotalChecados / newTotalValidos) * 100);

    onUpdateCliente({ ...activeCliente, checkedDocs: newChecked, progresso: newProgresso });
  };

  const toggleExclude = (doc: string) => {
    let newExcluded = [...excludedDocs];
    let newChecked = [...checkedDocs];

    if (newExcluded.includes(doc)) {
      newExcluded = newExcluded.filter(d => d !== doc);
    } else {
      newExcluded.push(doc);
      newChecked = newChecked.filter(d => d !== doc);
    }

    const newTotalValidos = allDocs.filter(d => !newExcluded.includes(d)).length;
    const newTotalChecados = newChecked.filter(d => !newExcluded.includes(d)).length;
    const newProgresso = newTotalValidos === 0 ? 100 : Math.round((newTotalChecados / newTotalValidos) * 100);

    onUpdateCliente({ ...activeCliente, excludedDocs: newExcluded, checkedDocs: newChecked, progresso: newProgresso });
  };

  const docsFaltantes = allDocs.filter(d => !checkedDocs.includes(d) && !excludedDocs.includes(d));

  const formatWhatsAppMessage = () => {
    const firstName = activeCliente.nome.split(' ')[0];
    let msg = `Olá, ${firstName}! Tudo bem? 😊\n\nPara darmos andamento ao seu benefício, precisamos que nos envie fotos bem nítidas dos seguintes documentos:\n\n`;
    docsFaltantes.forEach(d => {
      msg += `🔸 ${d}\n`;
    });
    msg += `\nQualquer dúvida sobre algum deles, estou à disposição!`;
    return msg;
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-slate-50">
      
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <select 
            value={activeCliente.beneficio}
            onChange={(e) => onUpdateCliente({...activeCliente, beneficio: e.target.value, progresso: 0, checkedDocs: [], excludedDocs: []})}
            className="border border-slate-300 rounded px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 bg-slate-50"
          >
            <option value={activeCliente.beneficio}>{activeCliente.beneficio}</option>
          </select>
          <div className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded">
            Sugestão da IA: {activeCliente.beneficio}
          </div>
        </div>

        <div className={`px-4 py-2 rounded-md font-bold text-sm transition-colors border ${
          progresso === 100 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-orange-50 text-orange-700 border-orange-200'
        }`}>
          STATUS: {progresso}% Concluído
        </div>
      </div>

      <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
        <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-3">CHECKLIST DE DOCUMENTOS</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-24">
          {allDocs.map((doc, index) => {
            const isFixed = DOCS_FIXOS.includes(doc);
            const isRural = DOCS_RURAIS_BASE.includes(doc);
            const isChecked = checkedDocs.includes(doc);
            const isExcluded = excludedDocs.includes(doc);

            return (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 border rounded transition-all duration-200 ${
                  isExcluded 
                    ? 'bg-slate-100 border-slate-200 opacity-60 grayscale' 
                    : isChecked 
                      ? 'bg-blue-50/50 border-blue-200 shadow-sm' 
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div 
                  className={`flex items-center gap-3 flex-1 cursor-pointer ${isExcluded ? 'pointer-events-none' : ''}`}
                  onClick={() => toggleCheck(doc)}
                >
                  <div className={`w-5 h-5 flex flex-shrink-0 items-center justify-center rounded border transition-colors ${
                    isChecked 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-slate-300 bg-white'
                  }`}>
                    {isChecked && <Check size={14} strokeWidth={3} />}
                  </div>
                  <span className={`text-sm font-medium leading-tight ${
                    isExcluded ? 'text-slate-400 line-through' : 'text-slate-700'
                  }`}>
                    {doc}
                  </span>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {!isExcluded && isRural && (
                    <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">RURAL</span>
                  )}
                  
                  {!isFixed && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleExclude(doc); }}
                      className={`p-1 rounded flex-shrink-0 transition-colors ${
                        isExcluded 
                          ? 'text-blue-500 bg-blue-100 hover:bg-blue-200' 
                          : 'text-slate-300 hover:text-red-500 hover:bg-red-50'
                      }`}
                      title={isExcluded ? "Reativar documento" : "Marcar como Não Aplicável"}
                    >
                      {isExcluded ? <RefreshCw size={16} /> : <X size={16} />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <input 
          type="file" 
          multiple 
          accept="image/*,.pdf" 
          className="hidden" 
          ref={fileInputRef}
          onChange={() => alert("Arquivos selecionados! (No mundo real, isso enviaria os arquivos para a API do iLovePDF)")}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center py-3 rounded-lg transition-colors shadow-sm"
        >
          <span className="font-bold flex items-center gap-2"><Archive size={18}/> Processar Imagens e Zipar (iLovePDF)</span>
          <span className="text-xs font-medium text-blue-200">{activeCliente.cpf} - {activeCliente.nome.toUpperCase()}.zip | Retrato, Adaptado</span>
        </button>

        <button 
          onClick={() => setIsWhatsAppModalOpen(true)}
          disabled={docsFaltantes.length === 0}
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2 py-3 rounded-lg transition-colors font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Smartphone size={20} />
          {docsFaltantes.length === 0 ? 'Tudo Concluído!' : 'Solicitar Faltantes no WhatsApp'}
        </button>
      </div>

      {isWhatsAppModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-emerald-500 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Smartphone size={20}/> Mensagem para WhatsApp
              </h3>
              <button onClick={() => setIsWhatsAppModalOpen(false)} className="hover:bg-emerald-600 p-1 rounded transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-1 bg-slate-50">
              <textarea 
                className="w-full h-64 p-4 border border-slate-300 rounded-lg resize-none text-slate-700 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                defaultValue={formatWhatsAppMessage()}
              />
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsWhatsAppModalOpen(false)}
                className="px-5 py-2 text-slate-500 font-semibold hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(formatWhatsAppMessage());
                  alert("Mensagem copiada para a área de transferência!");
                  setIsWhatsAppModalOpen(false);
                }}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors shadow-sm"
              >
                Copiar e Abrir WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}