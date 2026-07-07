import React, { useState, useEffect } from 'react';
import { RefreshCw, Scale, BookOpen, Landmark, FileText, Gavel, AlertCircle, Zap } from 'lucide-react';

const BANCO_DE_NOTICIAS = [
  { id: 1, tipo: 'NOVA LEI', titulo: 'Aprovada isenção de IR para novas doenças', resumo: 'Senado aprova ampliação do rol de doenças graves que garantem isenção de Imposto de Renda para aposentados e pensionistas. Texto vai à sanção presidencial.', icone: Landmark, cor: 'emerald' },
  { id: 2, tipo: 'IN DO INSS', titulo: 'IN 141/2024 altera regras de Perícia Documental', resumo: 'INSS publica nova instrução normativa dispensando perícia médica presencial para auxílio-doença (benefício por incapacidade temporária) em casos de fraturas com laudo conclusivo.', icone: FileText, cor: 'blue' },
  { id: 3, tipo: 'JURISPRUDÊNCIA', titulo: 'STF decide contra a Revisão da Vida Toda', resumo: 'Por 7 votos a 4, o Supremo Tribunal Federal derrubou a tese da Revisão da Vida Toda (Tema 1102), alterando o entendimento anterior e impactando milhares de processos parados.', icone: Scale, cor: 'purple' },
  { id: 4, tipo: 'DOUTRINA/PRINCÍPIOS', titulo: 'O Princípio do In Dubio Pro Misero', resumo: 'Artigo do Dr. Carlos Lupi destaca a aplicação do princípio "in dubio pro misero" no Direito Previdenciário para avaliação de provas materiais rurais fragilizadas pelo tempo.', icone: BookOpen, cor: 'amber' },
  { id: 5, tipo: 'NOVA LEI', titulo: 'Margem do Consignado Aumenta', resumo: 'Publicada lei que eleva a margem do crédito consignado para segurados do BPC/LOAS de 30% para 35%, com regras mais rígidas contra fraudes bancárias.', icone: Landmark, cor: 'emerald' },
  { id: 6, tipo: 'JURISPRUDÊNCIA', titulo: 'STJ fixa tese sobre EPI Eficaz (Tema 555)', resumo: 'O Superior Tribunal de Justiça determinou que o uso de Equipamento de Proteção Individual (EPI) não descaracteriza o tempo especial se houver ruído acima do limite de tolerância.', icone: Scale, cor: 'purple' },
  { id: 7, tipo: 'IN DO INSS', titulo: 'Cruzamento de Dados Rural', resumo: 'Nova portaria autoriza o INSS a deferir Aposentadoria Rural por Idade de forma automática através do cruzamento de dados do CadÚnico e notas fiscais eletrônicas.', icone: FileText, cor: 'blue' },
  { id: 8, tipo: 'DOUTRINA/PRINCÍPIOS', titulo: 'A Dignidade da Pessoa Humana no BPC', resumo: 'Análise doutrinária reforça que o critério de 1/4 do salário mínimo para o LOAS deve ser relativizado em prol do Princípio da Dignidade da Pessoa Humana e proteção do idoso.', icone: BookOpen, cor: 'amber' },
  { id: 9, tipo: 'JURISPRUDÊNCIA', titulo: 'TNU altera cômputo de período de graça', resumo: 'A Turma Nacional de Uniformização pacificou entendimento de que o período de graça deve ser estendido por mais 12 meses em casos de desemprego involuntário comprovado por qualquer meio.', icone: Scale, cor: 'purple' },
  { id: 10, tipo: 'NOVA LEI', titulo: 'Pensão por morte e cotas', resumo: 'Projeto de Lei propõe o retorno da cota de 100% da pensão por morte para viúvas com filhos menores, revertendo parte da Reforma da Previdência de 2019.', icone: Landmark, cor: 'emerald' },
  { id: 11, tipo: 'IN DO INSS', titulo: 'União Estável Post Mortem', resumo: 'Atualização no manual de benefícios exige pelo menos três provas documentais contemporâneas para o reconhecimento administrativo de união estável para pensão por morte.', icone: FileText, cor: 'blue' },
  { id: 12, tipo: 'DOUTRINA/PRINCÍPIOS', titulo: 'Princípio da Proteção Social', resumo: 'Estudo aponta como o rigor excessivo do INSS na análise de formulários PPP fere o Princípio da Proteção Social e o caráter alimentar dos benefícios por incapacidade.', icone: BookOpen, cor: 'amber' },
  { id: 13, tipo: 'JURISPRUDÊNCIA', titulo: 'TRF4: Trabalho Rural aos 10 anos', resumo: 'Tribunal Regional da 4ª Região reafirma possibilidade de cômputo de tempo de serviço rural em regime de economia familiar a partir dos 10 anos de idade para fins de aposentadoria.', icone: Scale, cor: 'purple' },
  { id: 14, tipo: 'NOVA LEI', titulo: 'Salário-Maternidade para Autônomas', resumo: 'Sancionada lei que isenta seguradas contribuintes individuais da carência de 10 meses para recebimento de salário-maternidade em caso de parto prematuro.', icone: Landmark, cor: 'emerald' },
  { id: 15, tipo: 'IN DO INSS', titulo: 'Fila do INSS e Bônus', resumo: 'Governo federal prorroga o programa de enfrentamento à fila do INSS, garantindo bônus de produtividade para servidores que analisarem processos com mais de 45 dias.', icone: FileText, cor: 'blue' },
  { id: 16, tipo: 'DOUTRINA/PRINCÍPIOS', titulo: 'Desaposentação e Direito Adquirido', resumo: 'Doutrina majoritária debate os impactos da proibição da desaposentação e as novas teses de revisão de benefícios para segurados que continuaram trabalhando e contribuindo.', icone: BookOpen, cor: 'amber' }
];

export default function FofocaTab() {
  const [noticiasAtuais, setNoticiasAtuais] = useState<typeof BANCO_DE_NOTICIAS>([]);
  const [isSearching, setIsSearching] = useState(false);

  const buscarNovasFofocas = () => {
    setIsSearching(true);
    setTimeout(() => {
      const embaralhado = [...BANCO_DE_NOTICIAS].sort(() => 0.5 - Math.random());
      setNoticiasAtuais(embaralhado.slice(0, 4));
      setIsSearching(false);
    }, 2000);
  };

  useEffect(() => {
    const embaralhado = [...BANCO_DE_NOTICIAS].sort(() => 0.5 - Math.random());
    setNoticiasAtuais(embaralhado.slice(0, 4));
  }, []);

  return (
    // O truque da tela cheia: Usamos margin negativa (-m-6 ou similar dependendo do pai)
    // Se o seu pai tiver p-6, o -m-6 anula ele e a imagem vai até a borda.
    // Lembre de trocar '/fundo.jpg' pelo nome exato da sua imagem na pasta public!
    <div className="absolute inset-0 bg-[url('/fundo.jpg')] bg-cover bg-center overflow-hidden flex flex-col">
      
      {/* Camada escura por cima da foto (Efeito Máscara mais limpo) */}
      <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[2px]"></div>

      {/* Conteúdo da Tela com padding interno */}
      <div className="relative z-10 flex flex-col h-full p-8">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6 mt-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-lg border border-white/20 backdrop-blur-md">
              <Gavel className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide">Radar Jurídico & Doutrina</h2>
              <p className="text-slate-400 text-sm mt-1">Sua pausa produtiva: Fique por dentro do que acontece nos tribunais.</p>
            </div>
          </div>
          
          <button 
            onClick={buscarNovasFofocas}
            disabled={isSearching}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-3 rounded-lg font-bold transition-all disabled:opacity-50 backdrop-blur-md shadow-lg"
          >
            <RefreshCw className={isSearching ? "animate-spin text-blue-400" : "text-slate-300"} size={20} />
            {isSearching ? 'Conectando aos Tribunais...' : 'Buscar Novas Atualizações'}
          </button>
        </div>

        {/* Grid de Notícias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-auto custom-scrollbar pr-2 pb-10 flex-1">
          
          {isSearching ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 h-48 animate-pulse flex flex-col justify-between backdrop-blur-sm">
                <div>
                  <div className="w-24 h-6 bg-white/10 rounded mb-4"></div>
                  <div className="w-3/4 h-5 bg-white/10 rounded mb-2"></div>
                  <div className="w-1/2 h-5 bg-white/10 rounded"></div>
                </div>
                <div className="w-full h-16 bg-white/5 rounded mt-4"></div>
              </div>
            ))
          ) : (
            <>
              {/* As 4 notícias sorteadas */}
              {noticiasAtuais.map((noticia) => {
                const Icon = noticia.icone;
                let colorClasses = "";
                if (noticia.cor === 'emerald') colorClasses = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
                if (noticia.cor === 'blue') colorClasses = "bg-blue-500/20 text-blue-300 border-blue-500/30";
                if (noticia.cor === 'purple') colorClasses = "bg-purple-500/20 text-purple-300 border-purple-500/30";
                if (noticia.cor === 'amber') colorClasses = "bg-amber-500/20 text-amber-300 border-amber-500/30";

                return (
                  <div key={noticia.id} className="bg-white/10 border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300 rounded-xl p-6 backdrop-blur-md shadow-xl flex flex-col group">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded border ${colorClasses}`}>
                        {noticia.tipo}
                      </span>
                      <Icon size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 leading-snug">
                      {noticia.titulo}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4 flex-1">
                      {noticia.resumo}
                    </p>
                    <div className="border-t border-white/10 pt-4 flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <AlertCircle size={14} /> Atualizado via Inteligência Artificial
                    </div>
                  </div>
                );
              })}

              {/* O NOVO QUADRADO MÁGICO (Animado e Full Width) */}
              <div className="md:col-span-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 rounded-xl p-6 backdrop-blur-md shadow-2xl flex items-center gap-5 cursor-pointer animate-[pulse_3s_ease-in-out_infinite] hover:animate-none transition-all group">
                <div className="p-4 bg-red-500/20 rounded-full border border-red-500/30 group-hover:bg-red-500/40 transition-colors">
                  <Zap className="text-red-400" size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider animate-bounce">
                      Plantão Urgente
                    </span>
                    <span className="text-red-300 text-xs font-semibold">Há 5 minutos</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Mudança drástica no Sistema do MEU INSS</h3>
                  <p className="text-red-200 text-sm leading-relaxed">
                    A Dataprev acaba de anunciar uma instabilidade nacional que afeta o protocolo de novos benefícios. Nossa IA sugere aguardar até as 14h para realizar novos envios e evitar travamentos na plataforma oficial.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}