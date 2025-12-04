"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, FileText, TrendingUp, Edit3, AlertCircle, Loader2 } from "lucide-react";
import { ProcessoAdvogado } from "@/types/entities";

// Importar serviços de IA
import { 
  gerarPeticaoInicial, 
  exportarPeticaoTexto,
  type DadosPeticao,
  type PeticaoGerada 
} from "@/services/gemini/peticaoService";

import {
  analisarChancesProcesso,
  gerarRelatorioAnalise,
  type DadosAnalise,
  type AnaliseChances
} from "@/services/gemini/analiseChancesService";

import {
  resumirDocumento,
  formatarResumoTexto,
  type ResumoDocumento
} from "@/services/gemini/resumoDocumentoService";

import {
  corrigirTextoJuridico,
  type CorrecaoTexto
} from "@/services/gemini/corretorJuridicoService";
import { getStatusProcessoLabel, getStatusUrgenciaLabel, getTipoProcessoLabel, TipoProcesso } from "@/types";
import { a } from "node_modules/framer-motion/dist/types.d-6pKw1mTI";

interface IAProcessoTabProps {
  processo: ProcessoAdvogado;
  documentos?: Array<{ id: string; nome: string; url: string; conteudo?: string }>;
}

export function IAProcessoTab({ processo, documentos = [] }: IAProcessoTabProps) {
  const [activeTab, setActiveTab] = useState<"peticao" | "analise" | "resumo" | "corretor">("peticao");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Estados para cada ferramenta
  const [peticaoGerada, setPeticaoGerada] = useState<PeticaoGerada | null>(null);
  const [analiseGerada, setAnaliseGerada] = useState<AnaliseChances | null>(null);
  const [resumoGerado, setResumoGerado] = useState<ResumoDocumento | null>(null);
  const [correcaoGerada, setCorrecaoGerada] = useState<CorrecaoTexto | null>(null);

  // Dados pré-preenchidos do processo
  const dadosPeticao: Partial<DadosPeticao> = {
    tipoProcesso: processo.tipoProcesso,
    partes: {
      autor: processo.cliente?.nome || "",
      autorQualificacao: `Cliente ID: ${processo.cliente?.id}`,
      reu: "", // Pegar dos detalhes se houver
      reuQualificacao: "",
    },
    fatos: processo.descricao || "",
    pedidos: [],
    valorCausa: undefined,
    documentos: documentos.map(d => d.nome),
    comarca: "",
    juizo: "",
  };

  const dadosAnalise: DadosAnalise = {
    tipoProcesso: processo.tipoProcesso,
    descricao: processo.descricao || "",
    provas: documentos.map(d => d.nome),
    testemunhas: 0,
    jurisprudenciasFavoraveis: false,
    contextoAdicional: `Status: ${processo.status}, Urgência: ${getStatusUrgenciaLabel(processo.urgencia)}`,
  };

  // Função para gerar petição usando dados do processo
  const handleGerarPeticao = async () => {
    setErro(null);
    setLoading(true);

    try {
      // Montar dados completos
      const dadosCompletos: DadosPeticao = {
        tipoProcesso: dadosPeticao.tipoProcesso || "",
        partes: dadosPeticao.partes!,
        fatos: dadosPeticao.fatos || "",
        fundamentacaoJuridica: "",
        pedidos: ["Procedência do pedido", "Condenação em custas e honorários"],
        valorCausa: 0,
        documentos: dadosPeticao.documentos || [],
        juizo: dadosPeticao.juizo,
        comarca: dadosPeticao.comarca,
      };

      const resultado = await gerarPeticaoInicial(dadosCompletos);
      setPeticaoGerada(resultado);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao gerar petição");
    } finally {
      setLoading(false);
    }
  };

  // Função para analisar chances
  const handleAnalisarChances = async () => {
    setErro(null);
    setLoading(true);

    try {
      const resultado = await analisarChancesProcesso(dadosAnalise);
      setAnaliseGerada(resultado);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao analisar chances");
    } finally {
      setLoading(false);
    }
  };

  // Função para resumir documento selecionado
  const handleResumirDocumento = async (documentoIndex: number) => {
    setErro(null);
    setLoading(true);

    try {
      const doc = documentos[documentoIndex];
      if (!doc.conteudo) {
        throw new Error("Documento sem conteúdo disponível");
      }

      const resultado = await resumirDocumento(doc.conteudo, processo.tipoProcesso);
      setResumoGerado(resultado);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao resumir documento");
    } finally {
      setLoading(false);
    }
  };

  const getClassificacaoConfig = (classificacao: AnaliseChances['classificacao']) => {
    const configs: Record<AnaliseChances['classificacao'], { color: string; label: string; emoji: string }> = {
      MUITO_BAIXA: { color: "bg-red-500", label: "Muito Baixa", emoji: "🔴" },
      BAIXA: { color: "bg-orange-500", label: "Baixa", emoji: "🟠" },
      MEDIA: { color: "bg-yellow-500", label: "Média", emoji: "🟡" },
      ALTA: { color: "bg-green-500", label: "Alta", emoji: "🟢" },
    };
    return configs[classificacao];
  };

  return (
    <div className="space-y-6">
      {/* Header com Info do Processo */}
      <div className="border-l-4 border-purple-500 pl-4 py-3 rounded-lg bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-950/30 dark:to-transparent mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <div>
            <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-400">Ferramentas de IA para este Processo</h3>
            <p className="text-sm text-muted-foreground">
              Use IA para gerar petições, analisar chances, resumir documentos e corrigir textos
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-muted-foreground mb-1">Tipo:</p>
            <p className="text-foreground font-medium">{getTipoProcessoLabel(processo.tipoProcesso)}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground mb-1">Cliente:</p>
            <p className="text-foreground font-medium">{processo.cliente?.nome}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground mb-1">Urgência:</p>
            <Badge variant="outline" className="capitalize">{getStatusUrgenciaLabel(processo.urgencia)}</Badge>
          </div>
          {/* <div>
            <p className="font-medium text-muted-foreground mb-1">Documentos:</p>
            <p className="text-foreground font-medium">{documentos.length} arquivo(s)</p>
          </div> */}
        </div>
      </div>

      {/* Alertas */}
      {erro && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}

      {/* Tabs de Ferramentas */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="peticao">
            <Sparkles className="h-4 w-4 mr-2" />
            Petição
          </TabsTrigger>
          <TabsTrigger value="analise">
            <TrendingUp className="h-4 w-4 mr-2" />
            Análise
          </TabsTrigger>
          {/* <TabsTrigger value="resumo">
            <FileText className="h-4 w-4 mr-2" />
            Resumo
          </TabsTrigger> */}
          {/* <TabsTrigger value="corretor">
            <Edit3 className="h-4 w-4 mr-2" />
            Corretor
          </TabsTrigger> */}
        </TabsList>

        {/* ABA: Gerador de Petição */}
        <TabsContent value="peticao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerar Petição Inicial</CardTitle>
              <CardDescription>
                Petição será gerada usando os dados deste processo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preview dos Dados */}
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h4 className="font-semibold mb-3 text-purple-700 dark:text-purple-400">Dados que serão usados:</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Tipo:</span>
                    <p className="text-foreground">{getTipoProcessoLabel(dadosPeticao.tipoProcesso as TipoProcesso)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Cliente:</span>
                    <p className="text-foreground">{dadosPeticao.partes?.autor}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-muted-foreground">Fatos:</span>
                    <p className="text-foreground line-clamp-2">{dadosPeticao.fatos}</p>
                  </div>
                  {/* <div>
                    <span className="font-medium text-muted-foreground">Documentos:</span>
                    <p className="text-foreground">{dadosPeticao.documentos?.length || 0} anexos</p>
                  </div> */}
                </div>
              </div>

              <Button 
                onClick={handleGerarPeticao} 
                disabled={loading}
                className="w-full"
                variant={"primary"}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Gerar Petição com IA
                  </>
                )}
              </Button>

              {peticaoGerada && (
                <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-purple-700 dark:text-purple-400 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Petição Gerada
                    </h4>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-950"
                      onClick={() => {
                        const texto = exportarPeticaoTexto(peticaoGerada);
                        navigator.clipboard.writeText(texto);
                      }}
                    >
                      Copiar
                    </Button>
                  </div>
                  <pre className="text-sm whitespace-pre-wrap bg-white dark:bg-background p-4 rounded border max-h-96 overflow-y-auto">
                    {exportarPeticaoTexto(peticaoGerada)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: Análise de Chances */}
        <TabsContent value="analise" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analisar Chances de Sucesso</CardTitle>
              <CardDescription>
                Análise preditiva baseada nos dados do processo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preview dos Dados */}
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h4 className="font-semibold mb-3 text-blue-700 dark:text-blue-400">Dados da análise:</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Tipo:</span>
                    <p className="text-foreground">{getTipoProcessoLabel(dadosAnalise.tipoProcesso as TipoProcesso)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Status:</span>
                    <p className="text-foreground">{getStatusProcessoLabel(processo.status)}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-muted-foreground">Descrição:</span>
                    <p className="text-foreground line-clamp-2">{dadosAnalise.descricao}</p>
                  </div>
                  {/* <div>
                    <span className="font-medium text-muted-foreground">Provas:</span>
                    <p className="text-foreground">{dadosAnalise.provas.length} documento(s)</p>
                  </div> */}
                </div>
              </div>

              <Button 
                onClick={handleAnalisarChances} 
                disabled={loading}
                className="w-full"
                variant={"primary"}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Analisar Chances
                  </>
                )}
              </Button>

              {analiseGerada && (
                <div className="space-y-4">
                  {/* Probabilidade */}
                  <div className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Chance de Sucesso</p>
                      <p className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        {analiseGerada.probabilidade}%
                      </p>
                      <Badge className={`${getClassificacaoConfig(analiseGerada.classificacao).color} text-white px-4 py-1`}>
                        {getClassificacaoConfig(analiseGerada.classificacao).emoji} {getClassificacaoConfig(analiseGerada.classificacao).label}
                      </Badge>
                    </div>
                  </div>

                  {/* Pontos Fortes e Fracos */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border-l-4 border-green-500 pl-4 py-3 bg-white dark:bg-background rounded-lg">
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                        <span className="text-xl">✅</span>
                        Pontos Fortes
                      </h4>
                      <ul className="space-y-2 text-sm">
                        {analiseGerada.pontosFortes && analiseGerada.pontosFortes.length === 0 && (
                          <li className="text-muted-foreground">Nenhum ponto forte identificado.</li>
                        )}
                        {analiseGerada.pontosFortes.map((p, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-l-4 border-red-500 pl-4 py-3 bg-white dark:bg-background rounded-lg">
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                        <span className="text-xl">❌</span>
                        Pontos Fracos
                      </h4>
                      <ul className="space-y-2 text-sm">
                        {analiseGerada.pontosFracos && analiseGerada.pontosFracos.length === 0 && (
                          <li className="text-muted-foreground">Nenhum ponto fraco identificado.</li>
                        )}
                        {analiseGerada.pontosFracos.map((p, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recomendações */}
                  <div className="border-l-4 border-amber-500 pl-4 py-3 bg-white dark:bg-background rounded-lg">
                    <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-3 flex items-center gap-2">
                      <span className="text-xl">💡</span>
                      Recomendações
                    </h4>
                    <ul className="space-y-3 text-sm">
                      {analiseGerada.recomendacoes.length === 0 && (
                        <li className="text-muted-foreground">Nenhuma recomendação identificada.</li>
                      )}
                      {analiseGerada.recomendacoes.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="font-semibold text-amber-600 dark:text-amber-500 min-w-[1.5rem]">{i + 1}.</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: Resumo de Documentos */}
        {/* <TabsContent value="resumo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumir Documentos do Processo</CardTitle>
              <CardDescription>
                Selecione um documento para gerar resumo automático
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {documentos.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Nenhum documento disponível neste processo. Faça upload na aba &quot;Documentos&quot;.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground">Selecione um documento:</h4>
                    <div className="grid gap-2">
                      {documentos.map((doc, index) => (
                        <button
                          key={doc.id}
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent hover:border-primary transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleResumirDocumento(index)}
                          disabled={loading || !doc.conteudo}
                        >
                          <FileText className="h-5 w-5 text-primary shrink-0" />
                          <span className="text-sm font-medium">{doc.nome}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {resumoGerado && (
                    <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background space-y-4">
                      <h4 className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Resumo Gerado
                      </h4>

                      <div className="border-l-4 border-green-500 pl-4 py-2">
                        <h5 className="font-semibold mb-2 text-sm text-muted-foreground">Resumo Executivo</h5>
                        <p className="text-sm leading-relaxed">{resumoGerado.resumoExecutivo}</p>
                      </div>

                      <div className="border-l-4 border-blue-500 pl-4 py-2">
                        <h5 className="font-semibold mb-2 text-sm text-muted-foreground">Pontos-Chave</h5>
                        <ul className="space-y-2 text-sm">
                          {resumoGerado.pontosChave.map((p, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5">•</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {resumoGerado.prazosIdentificados.length > 0 && (
                        <div className="border-l-4 border-red-500 pl-4 py-2">
                          <h5 className="font-semibold mb-2 text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                            <span>⏰</span>
                            Prazos Identificados
                          </h5>
                          <ul className="space-y-2 text-sm">
                            {resumoGerado.prazosIdentificados.map((p, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className={p.urgente ? "text-red-600 font-bold" : "text-gray-500"}>
                                  {p.urgente ? "🔴" : "•"}
                                </span>
                                <span className={p.urgente ? "font-semibold text-red-600" : ""}>
                                  {p.descricao}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* ABA: Corretor */}
        {/* <TabsContent value="corretor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Corretor de Linguagem Jurídica</CardTitle>
              <CardDescription>
                Para usar o corretor, acesse a ferramenta completa no menu &quot;IA Generativa&quot;
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  O corretor jurídico está disponível como ferramenta standalone.
                  Copie seu texto, vá em &quot;IA Generativa&quot; no menu e cole na aba &quot;Corretor&quot;.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>

      {/* Footer com Aviso */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>Importante:</strong> Estas ferramentas usam IA e devem ser revisadas por um
          profissional antes do uso. Os resultados são gerados com base nos dados do processo.
        </AlertDescription>
      </Alert>
    </div>
  );
}
