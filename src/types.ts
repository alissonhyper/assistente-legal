export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  beneficio: string;
  progresso: number;
  checkedDocs: string[];
  excludedDocs?: string[]; // 'X'
  dataCriacao: string;
  dataAtualizacao: number;
}

export type Tab = 'clientes' | 'transcricao' | 'documentos' | 'contratos' | 'fofoca';