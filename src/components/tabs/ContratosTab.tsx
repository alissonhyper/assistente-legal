import React, { useState } from 'react';
import { Cliente } from '../../types';
import { CheckSquare, Square, Send, FileSignature, MessageCircle, X, FileText, Copy, CheckCircle2 } from 'lucide-react';

interface ContratosTabProps {
  activeCliente: Cliente | null;
  onUpdateCliente?: (cliente: Cliente) => void;
}

export default function ContratosTab({ activeCliente, onUpdateCliente }: ContratosTabProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [copiado, setCopiado] = useState(false);

  if (!activeCliente) return null;

  const isAssinado = activeCliente.checkedDocs?.includes('DOCUMENTOS DO ESCRITÓRIO ASSINADOS');

  const toggleAssinado = () => {
    if (!onUpdateCliente) return;

    let newCheckedDocs = [...(activeCliente.checkedDocs || [])];
    
    if (isAssinado) {
      newCheckedDocs = newCheckedDocs.filter(d => d !== 'DOCUMENTOS DO ESCRITÓRIO ASSINADOS');
    } else {
      newCheckedDocs.push('DOCUMENTOS DO ESCRITÓRIO ASSINADOS');
    }

    onUpdateCliente({
      ...activeCliente,
      checkedDocs: newCheckedDocs
    });
  };

  const getPrimeiroNome = () => {
    return activeCliente.nome.split(' ')[0];
  };

  const mensagemPadrao = `Olá, ${getPrimeiroNome()}, tudo bem? 😊

Para darmos andamento ao seu caso com segurança (no INSS e na Justiça), precisamos que o(a) senhor(a) assine alguns documentos. Vou te explicar de forma bem simples:

✅ 1) Procuração (Judicial): autoriza o escritório e os advogados a te representarem no processo na Justiça (fazer pedidos, acompanhar, entrar com a ação etc.).
✅ 2) Contrato de Honorários: é o documento que formaliza nosso atendimento e deixa claro como funciona o serviço e os honorários, para não gerar dúvidas depois.
✅ 3) Declaração de Hipossuficiência: serve para pedir a Justiça Gratuita, ou seja, para o(a) senhor(a) não precisar pagar custas e taxas do processo.
✅ 4) Procuração Administrativa: autoriza a equipe a resolver e acompanhar tudo diretamente no INSS e outros órgãos, sem o(a) senhor(a) precisar ir pessoalmente.
✅ 5) Termos de Responsabilidade: confirmam que o(a) senhor(a) se compromete a avisar qualquer mudança importante (ex.: falecimento do segurado, mudança relevante), para evitar problemas.
✅ 6) Declaração de Autenticidade: confirma que os documentos entregues são verdadeiros e correspondem aos originais, para podermos usar no INSS e no processo.
✅ 7) Termo de Renúncia (Juizado Especial Federal): é necessário para o processo tramitar no Juizado, que costuma ser mais rápido. Ele renuncia somente ao que ultrapassar o limite do Juizado, apenas para permitir a distribuição (não perde seu direito).
✅ 8) Declaração de Residência: comprova seu endereço para fins do processo.

Esses documentos não trazem prejuízo para o(a) senhor(a) — eles são necessários para o processo andar corretamente e com mais rapidez. Qualquer dúvida, me chama que explico com calma.`;

  const copiarTexto = () => {
    navigator.clipboard.writeText(mensagemPadrao);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleEnviarWhatsApp = () => {
    setIsConfirmModalOpen(false);
    alert(`Redirecionando para o WhatsApp Web...\n\n(Nota para a banca: Na versão oficial, o sistema abrirá o WhatsApp da clínica/escritório enviando a mensagem direta para o número ${activeCliente.telefone})`);
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto w-full">
      
      {/* Botão de Check Principal (Mais clean) */}
      <button 
        onClick={toggleAssinado}
        className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300 mb-6 shadow-sm ${
          isAssinado 
            ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
            : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400'
        }`}
      >
        {isAssinado ? (
          <CheckSquare size={28} className="text-emerald-500" />
        ) : (
          <Square size={28} className="text-slate-400" />
        )}
        <span className="font-bold text-lg">
          {isAssinado ? 'Documentos assinados com sucesso!' : 'Cliente já assinou os documentos físicos ou via link digital'}
        </span>
      </button>

      {/* Bloco de Mensagem */}
      <div className={`flex-1 flex flex-col bg-white rounded-lg border shadow-sm overflow-hidden transition-all duration-500 ${
        isAssinado ? 'border-slate-200 opacity-60 grayscale' : 'border-slate-200'
      }`}>
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between text-slate-500">
          <div className="flex items-center gap-2">
            <FileText size={18} />
            <h3 className="text-xs font-bold tracking-wider uppercase">Mensagem de Explicação (WhatsApp)</h3>
          </div>
          
          <button 
            onClick={copiarTexto}
            disabled={isAssinado}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors bg-white px-2 py-1 rounded shadow-sm border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copiado ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copiado ? 'Copiado!' : 'Copiar Texto'}
          </button>
        </div>
        
        <div className="flex-1 p-6 relative">
          <textarea
            className="w-full h-full resize-none outline-none text-slate-600 leading-relaxed font-medium bg-transparent"
            value={mensagemPadrao}
            readOnly
          />
          {isAssinado && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 cursor-not-allowed">
              <div className="bg-white/90 px-4 py-2 rounded-full font-bold text-slate-500 shadow-sm border border-slate-200 flex items-center gap-2">
                <CheckSquare size={18} className="text-emerald-500"/> Etapa Concluída
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <button 
            onClick={() => setIsConfirmModalOpen(true)}
            disabled={isAssinado}
            className="w-full flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MessageCircle size={20} />
            Enviar Explicação via WhatsApp
          </button>
        </div>
      </div>

      {/* Modal de Confirmação do WhatsApp */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="bg-emerald-500 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Send size={20}/> Confirmar Envio
              </h3>
              <button onClick={() => setIsConfirmModalOpen(false)} className="hover:bg-emerald-600 p-1 rounded transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 bg-slate-50 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Enviar mensagem no número abaixo?</h4>
              <p className="text-2xl font-black text-emerald-600 tracking-wide bg-white py-3 rounded border border-emerald-100 shadow-sm">
                {activeCliente.telefone}
              </p>
            </div>

            <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-6 py-2.5 text-slate-500 font-semibold hover:bg-slate-100 rounded-lg transition-colors"
              >
                Não, cancelar
              </button>
              <button 
                onClick={handleEnviarWhatsApp}
                className="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors shadow-sm"
              >
                Sim, enviar!
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}