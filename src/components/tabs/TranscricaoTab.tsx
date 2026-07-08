import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, UploadCloud, Sparkles, RefreshCw, Building2, Smartphone, MapPin, ChevronLeft, ChevronRight, Copy, CheckCircle2, Trash2 } from 'lucide-react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type Canal = 'escritorio' | 'whatsapp' | 'externo';

export default function TranscricaoTab() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcricao, setTranscricao] = useState('');
  
  const [canalAtivo, setCanalAtivo] = useState<Canal>('escritorio');
  const [isGerando, setIsGerando] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [resumos, setResumos] = useState<string[]>([]);
  const [resumoAtualIndex, setResumoAtualIndex] = useState(0);
  const [copiado, setCopiado] = useState(false);
  
  const [ultimoTextoResumido, setUltimoTextoResumido] = useState('');

  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'pt-BR';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript.trim() + '.\n\n';
          }
        }
        if (finalTranscript) {
          setTranscricao((prev) => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if(transcricao !== '') setTranscricao((prev) => prev + '\n');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const limparTela = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
    setTranscricao('');
    setResumos([]);
    setResumoAtualIndex(0);
    setUltimoTextoResumido('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        
        let textoSimulado = "";
        if (canalAtivo === 'escritorio') {
          textoSimulado = "— Sempre trabalhei em terra dos outros. O serviço que faço é no plantio e na colheita mesmo. Já tem mais de sete anos que tô nessa mesma fazenda trabalhando. A gente planta milho, feijão e mandioca. Nunca mexi com essas coisas de política não, nem fui conselheiro tutelar, e também nunca tive comércio no meu nome. Nem prefeitura, nem Estado nuca trabalhei. Agora, sobre trabalhar fora da roça... bem, antes dos anos 2000, eu fui pra Belo Horizonte tentar uma vida melhor. Fiquei um tempo lá, inclusive meu único filho nasceu em BH. Lá eu tive a carteira de trabalho assinada. Não sei se isso vai me atrapalhar agora...\n\n— Contrato de comodato no papel eu não tenho não, é tudo no combinado de boca. O que eu colho, eu divido com o dono da terra. Mas ele é gente boa, já me deu até a cópia dos documentos da terra dele pra eu trazer aqui.\n\n— Moro com quem? Eu moro com a minha irmã, Maria de Jesus, e trabalho com ela também. Ela já é até aposentada como rural. Meu filho mesmo é só aquele de BH, foi criado pra lá.\n\n— Dos papéis que tenho, eu trouxe os documentos da terra e minha identidade, só isso ta bom não?\n\n— Não tem problema não. Assim que eu chegar em casa eu tiro uma foto e mando no WhatsApp pra vocês. Fico então esperando a senhora mandar o áudio dizendo se aquele meu trabalho de carteira assinada lá atrás vai dar algum problema, tá bom? Muito obrigado pela atenção.";
        } else if (canalAtivo === 'whatsapp') {
          textoSimulado = "Áudio processado (WhatsApp):\n[Áudio 1] Oi doutora, tudo bem? Aqui é a Dona Maria.\n[Áudio 2] Doutora, eu tô te mandando as fotos dos meus documentos aí no WhatsApp, a minha certidão de casamento e umas notas fiscais antigas de quando eu plantava feijão.\n[Áudio 3] Eu queria ver se tem como dar entrada na aposentadoria rural, eu fiz 55 anos mês passado e a coluna não aguenta mais...";
        } else if (canalAtivo === 'externo') {
          textoSimulado = "Áudio processado (Diligência Externa):\nRelatório de inspeção in loco. Data: 07 de Julho. Chegamos à Fazenda Boa Esperança, localizada no km 42 da rodovia estadual, propriedade de difícil acesso, estrada de terra batida. Fomos recebidos pela senhora Joana da Silva, 58 anos. A cliente relata que labora em regime de economia familiar há 35 anos ininterruptos, cultivando milho, feijão, mandioca e criando aves para subsistência e pequena venda do excedente. \n\nO esposo, Sr. Antônio, faleceu há 5 anos e era o titular do PRONAF e do cadastro no sindicato rural, porém a Sra. Joana continuou a atividade agrícola sozinha desde então. Solicitamos a documentação e ela apresentou notas fiscais de produtor rural esparsas dos anos de 2015 a 2024, além de contratos de meação antigos e o ITR da terra, que possui 12 hectares. \n\nA residência é extremamente simples, de alvenaria sem reboco, e constatamos que não possui energia elétrica regular (utiliza ligação clandestina, 'gato'). Registrei fotografias do local, das mãos calejadas da segurada, das ferramentas de trabalho (enxada, foice) e da lavoura atual de milho. Conversamos com dois vizinhos confrontantes, Sr. José e Dona Raimunda, que confirmaram a posse e o trabalho contínuo da Sra. Joana nas terras. \n\nA procuração judicial e os contratos de honorários foram assinados presencialmente na mesa da cozinha da cliente. Verificamos que o CadÚnico dela consta como desatualizado desde 2021. Será necessário agendar uma perícia socioeconômica e organizar a prova testemunhal. Fim do relatório.";
        }

        setTranscricao((prev) => (prev ? prev + '\n\n' + textoSimulado : textoSimulado));
      }, 1500);
    }
  };

  const simularIA = (melhorar: boolean = false) => {
    setIsGerando(true);
    
    setTimeout(() => {
      let novoResumo = '';
      const isNovoTexto = transcricao !== ultimoTextoResumido;

      const resumosEscritorio = [
        "Relato Completo de Atendimento (Escritório):\nO cliente busca orientações sobre aposentadoria rural e relata labor contínuo há mais de sete anos na mesma fazenda, cultivando milho, feijão e mandioca. Informa que não possui contrato de comodato formalizado em papel, tratando-se de parceria de meeiro apalavrada (divide a colheita com o dono da terra). O grupo familiar é composto por ele e sua irmã, Maria de Jesus, com quem reside e trabalha, sendo ela já aposentada pelo regime rural. O cliente declarou expressamente nunca ter exercido mandato político, cargo público ou possuído comércio.\n\nO ponto de maior atenção no caso é um vínculo urbano formal (carteira assinada) na cidade de Belo Horizonte, constituído antes do ano 2000, época em que também teve seu único filho (que permaneceu na capital).\n\nDocumentação apresentada presencialmente: RG e cópia dos documentos da terra (fornecidos pelo proprietário). Restou acordado que o cliente enviará os demais documentos via WhatsApp e aguardará o retorno do escritório, via áudio, com o parecer jurídico sobre o impacto do vínculo urbano em seu pedido.",
        
        "Resumo Estruturado para ADVBOX:\n• Perfil e Atividade: Trabalhador rural em terras de terceiros há mais de 7 anos. Cultiva milho, feijão e mandioca. Regime de comodato verbal (meeiro).\n• Grupo Familiar: Reside e labora com a irmã (já aposentada rural). Possui um filho residente em BH.\n• Histórico Profissional: Nega atividades políticas, públicas ou empresariais. Possui registro CLT anterior aos anos 2000 em Belo Horizonte.\n• Documentação Física: Entregou cópia do RG e documentos da propriedade rural. Restante será enviado via WhatsApp.\n• Ação Requerida (Pendência): Analisar o impacto do vínculo CLT antigo na aposentadoria rural e enviar áudio explicativo/parecer ao cliente via WhatsApp confirmando a viabilidade do caso.",
        
        "Ficha de Triagem Rápida - Aposentadoria Rural:\nCliente atua como meeiro (comodato verbal) há mais de 7 anos e trabalha junto com a irmã (já aposentada rural). Negou possuir vínculos políticos ou empresariais.\n\n⚠️ PONTO DE ATENÇÃO: Possui registro em carteira assinada em Belo Horizonte antes dos anos 2000. O único filho nasceu e reside lá.\n\n📄 STATUS DOS DOCUMENTOS: Deixou RG e docs da terra físicos no escritório. Restante pendente de envio pelo cliente via WhatsApp.\n\n🎯 PRÓXIMO PASSO DA EQUIPE: Avaliar se a CTPS urbana inviabiliza o benefício e gravar áudio no WhatsApp dando o retorno jurídico ao cliente."
      ];

      const resumosWhatsapp = [
        "Atendimento via WhatsApp. Cliente (Dona Maria) pretende requerer aposentadoria rural, informando ter completado 55 anos. Enviou fotos da certidão de casamento e notas fiscais antigas de produção de feijão. Alega problemas de saúde (coluna). Iniciada a análise preliminar da documentação enviada.",
        "Recebimento de documentos via WhatsApp (Dona Maria, 55 anos). Demanda principal: Aposentadoria por Idade Rural. Anexou fotografias de certidão de casamento e notas fiscais rurais referentes ao plantio de feijão. Relata incapacidade física devido a dores na coluna. A equipe aguardará o retorno da análise jurídica para orientar a cliente.",
        "Interação via WhatsApp. Segurada Dona Maria (55 anos) solicita análise para aposentadoria rural. Encaminhou imagens de notas de produtor (feijão) e certidão de casamento civil. Menciona desgaste físico na coluna. Documentos salvos na pasta da cliente para avaliação de viabilidade do benefício rural."
      ];

      const resumosExterno = [
        "Diligência externa realizada na Fazenda Boa Esperança (07/07). Cliente Joana da Silva (58 anos), agricultora familiar há 35 anos. Viúva há 5 anos; o esposo era o titular do PRONAF, mas ela deu continuidade exclusiva ao labor rural (cultivo de milho, feijão e mandioca). Apresentou notas fiscais (2015-2024), ITR (12 hectares) e contratos de meação. Registradas fotografias in loco das ferramentas, lavoura e residência (sem energia regular). Testemunhas (vizinhos) confirmaram a atividade. Contratos assinados presencialmente. Ações imediatas: orientar a atualização do CadÚnico (vencido desde 2021) e estruturar a prova testemunhal para futura perícia.",
        "Relatório de visita externa (Sra. Joana da Silva, 58 anos). Comprovação de labor rural em regime de economia familiar ininterrupto por 35 anos. Assumiu integralmente a atividade após o óbito do esposo (antigo titular do PRONAF). Possui farta prova material (notas 2015-2024, ITR, contratos). Diligência confirmou a realidade rústica do local e colheu assinaturas nos documentos de representação. Será necessário regularizar o CadÚnico da segurada e preparar a justificação administrativa com os vizinhos confrontantes.",
        "Inspeção in loco - Fazenda Boa Esperança. Segurada Joana da Silva, 58 anos. Atividade rural em regime de economia familiar confirmada visualmente e por vizinhos. Produção de subsistência (milho, feijão, mandioca) continuada após óbito do marido há 5 anos. Recolhidas notas de produtor (2015-2024) e ITR. Residência precária, sem luz oficial. Assinou procuração e contrato de honorários no local. Próximos passos: Atualização de CadÚnico (inativo desde 2021) e agendamento de justificação administrativa/perícia."
      ];

      let arrayAtual = resumosEscritorio;
      if (canalAtivo === 'whatsapp') arrayAtual = resumosWhatsapp;
      if (canalAtivo === 'externo') arrayAtual = resumosExterno;

      // Simplificando a checagem para pegar sempre nosso resumo focado
      if (isNovoTexto || !melhorar) {
        novoResumo = arrayAtual[0];
      } else {
        const proximoIndice = resumos.length % 3;
        novoResumo = arrayAtual[proximoIndice];
      }

      if (isNovoTexto || !melhorar) {
        setResumos([novoResumo]);
        setResumoAtualIndex(0);
        setUltimoTextoResumido(transcricao);
      } else {
        const novosResumos = [...resumos, novoResumo];
        setResumos(novosResumos);
        setResumoAtualIndex(novosResumos.length - 1);
      }
      
      setIsGerando(false);
    }, 1500);
  };

  const copiarResumo = () => {
    if (resumos[resumoAtualIndex]) {
      navigator.clipboard.writeText(resumos[resumoAtualIndex]);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const canais = [
    { id: 'escritorio', label: 'Escritório', icon: Building2 },
    { id: 'whatsapp', label: 'WhatsApp', icon: Smartphone },
    { id: 'externo', label: 'Externo', icon: MapPin }
  ];

  const hasTextoModificado = transcricao !== ultimoTextoResumido;

  return (
    <div className="h-full flex flex-col gap-6">
      
      <div className="flex gap-4">
        <button
          onClick={toggleRecording}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-lg font-bold text-lg transition-all ${
            isRecording
              ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
          }`}
        >
          {isRecording ? <Square size={24} fill="currentColor" /> : <Mic size={24} />}
          {isRecording ? 'Parar Gravação' : 'Gravar Áudio'}
        </button>

        <div className="flex-1">
          <input 
            type="file" 
            accept="audio/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full h-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 hover:border-blue-400 hover:text-blue-500 transition-colors bg-white disabled:opacity-50"
          >
            {isUploading ? (
              <RefreshCw className="animate-spin text-blue-500" />
            ) : (
              <UploadCloud size={24} />
            )}
            <span className="font-semibold text-sm">
              {isUploading ? 'Processando áudio com IA...' : 'Anexar arquivo de Áudio'}
            </span>
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        
        <div className="flex-1 flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden relative">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider">TRANSCRIÇÃO MANUAL OU POR VOZ</h3>
            
            <div className="flex items-center gap-3">
              {hasTextoModificado && resumos.length > 0 && transcricao.length > 0 && (
                <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Texto alterado. Atualize o resumo.
                </span>
              )}
              <button 
                onClick={limparTela}
                title="Limpar toda a tela"
                className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 text-xs font-semibold"
              >
                <Trash2 size={14} /> Limpar Tela
              </button>
            </div>
          </div>
          <textarea
            className="flex-1 w-full p-4 resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-slate-700 leading-relaxed"
            placeholder="Clique em gravar, anexe um áudio ou digite o relato do cliente aqui..."
            value={transcricao}
            onChange={(e) => setTranscricao(e.target.value)}
          />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3">
            <h3 className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 uppercase">Canal de Origem da IA</h3>
            <div className="flex gap-2">
              {canais.map(c => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCanalAtivo(c.id as Canal)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-semibold transition-colors border ${
                      canalAtivo === c.id 
                        ? 'bg-blue-50 border-blue-300 text-blue-700' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={16} />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100 shadow-sm flex flex-col flex-1 overflow-hidden relative">
            <div className="px-4 py-3 flex justify-between items-center border-b border-blue-100 bg-white/50">
              <h3 className="text-xs font-bold text-blue-800 tracking-wider flex items-center gap-1">
                <Sparkles size={14} /> RESUMO INTELIGENTE ADVBOX
              </h3>
              
              {resumos.length > 0 && (
                <button 
                  onClick={copiarResumo}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors bg-white px-2 py-1 rounded shadow-sm border border-slate-200"
                >
                  {copiado ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  {copiado ? 'Copiado!' : 'Copiar Resumo'}
                </button>
              )}
            </div>
            
            <div className="flex-1 p-4 relative">
              {isGerando ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-500 bg-white/50 backdrop-blur-sm z-10">
                  <RefreshCw className="animate-spin mb-2" size={24} />
                  <span className="font-semibold text-sm">Processando com IA...</span>
                </div>
              ) : null}

              {resumos.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center italic px-8">
                  Preencha a transcrição ao lado e clique em "Extrair Resumo" para a IA gerar o texto padronizado.
                </div>
              ) : (
                <textarea
                  className="w-full h-full bg-transparent resize-none outline-none text-slate-800 font-medium leading-relaxed"
                  value={resumos[resumoAtualIndex]}
                  onChange={(e) => {
                    const novosResumos = [...resumos];
                    novosResumos[resumoAtualIndex] = e.target.value;
                    setResumos(novosResumos);
                  }}
                />
              )}
            </div>

            <div className="p-3 bg-white border-t border-blue-100 flex items-center justify-between">
              
              <div className="flex items-center gap-2">
                {resumos.length > 0 && !hasTextoModificado ? (
                  <button 
                    onClick={() => simularIA(true)}
                    disabled={isGerando || resumos.length >= 3}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded font-semibold text-sm transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={14} /> Melhorar Resumo
                  </button>
                ) : (
                  <button 
                    onClick={() => simularIA(false)}
                    disabled={isGerando || !transcricao}
                    className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded font-bold text-sm transition-colors disabled:opacity-50 shadow-sm"
                  >
                    <Sparkles size={16} /> {resumos.length > 0 ? 'Atualizar Resumo' : 'Extrair Resumo'}
                  </button>
                )}
              </div>

              {resumos.length > 1 && !hasTextoModificado && (
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-full border border-slate-200">
                  <button 
                    disabled={resumoAtualIndex === 0}
                    onClick={() => setResumoAtualIndex(prev => prev - 1)}
                    className="hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-500 p-1"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="min-w-[30px] text-center">
                    {resumoAtualIndex + 1} <span className="text-slate-300 font-normal">/</span> {resumos.length}
                  </span>
                  <button 
                    disabled={resumoAtualIndex === resumos.length - 1}
                    onClick={() => setResumoAtualIndex(prev => prev + 1)}
                    className="hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-500 p-1"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}