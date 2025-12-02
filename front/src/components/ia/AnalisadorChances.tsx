"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, TrendingUp, AlertCircle, CheckCircle2, XCircle, Target, Lightbulb, AlertTriangle, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  analisarChancesProcesso, 
  gerarRelatorioAnalise,
  type AnaliseChances,
  type DadosAnalise 
} from "@/services/gemini/analiseChancesService";

export default function AnalisadorChances() {
  const [loading, setLoading] = useState(false);
  const [analise, setAnalise] = useState<AnaliseChances | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [descricaoCaso, setDescricaoCaso] = useState("");

  const handleAnalisar = async () => {
    if (!descricaoCaso.trim() || descricaoCaso.length < 50) {
      setErro("Descreva o caso com pelo menos 50 caracteres");
      return;
    }

    setErro(null);
    setAnalise(null);
    setLoading(true);

    try {
      const dadosAnalise: DadosAnalise = {
        tipoProcesso: "Análise Geral",
        descricao: descricaoCaso,
        provas: [],
      };
      const resultado = await analisarChancesProcesso(dadosAnalise);
      setAnalise(resultado);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao analisar caso");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadRelatorio = () => {
    if (analise) {
      const dadosAnalise: DadosAnalise = {
        tipoProcesso: "Análise Geral",
        descricao: descricaoCaso,
        provas: [],
      };
      const relatorio = gerarRelatorioAnalise(analise, dadosAnalise);
      const blob = new Blob([relatorio], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analise_chances_${new Date().toISOString().split("T")[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const getClassificacaoConfig = (classificacao: AnaliseChances['classificacao']) => {
    const configs: Record<AnaliseChances['classificacao'], { color: string; textColor: string; bgColor: string; label: string; emoji: string }> = {
      MUITO_BAIXA: { color: "bg-red-500", textColor: "text-red-700", bgColor: "bg-red-50", label: "Muito Baixa", emoji: "🔴" },
      BAIXA: { color: "bg-orange-500", textColor: "text-orange-700", bgColor: "bg-orange-50", label: "Baixa", emoji: "🟠" },
      MEDIA: { color: "bg-yellow-500", textColor: "text-yellow-700", bgColor: "bg-yellow-50", label: "Média", emoji: "🟡" },
      ALTA: { color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50", label: "Alta", emoji: "🟢" },
    };
    return configs[classificacao];
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-green-500/10 rounded-lg">
          <TrendingUp className="h-6 w-6 text-green-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Análise Preditiva de Chances</h1>
          <p className="text-muted-foreground">
            Avalie a probabilidade de sucesso do processo usando Inteligência Artificial
          </p>
        </div>
      </div>

      {/* Alertas */}
      {erro && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Formulário */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Descrição do Caso</CardTitle>
            <CardDescription>Forneça detalhes para análise preditiva</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="descricao">Descreva o caso completo *</Label>
              <Textarea
                id="descricao"
                value={descricaoCaso}
                onChange={(e) => setDescricaoCaso(e.target.value)}
                placeholder="Descreva o caso incluindo: tipo de ação, fatos principais, pedidos, legislação aplicável, jurisprudência conhecida, peculiaridades do caso..."
                rows={12}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Mínimo 50 caracteres. Quanto mais detalhes, melhor a análise.
              </p>
            </div>

            <Button variant={"primary"} onClick={handleAnalisar} disabled={loading} className="w-full" size="lg">
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

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Aviso:</strong> Esta análise é baseada em IA e não substitui a avaliação
                profissional de um advogado. Use como ferramenta de apoio à decisão.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="lg:col-span-3 space-y-6">
          {!analise && !loading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <Target className="h-20 w-20 mb-4 opacity-20" />
                <p className="text-lg font-medium">Aguardando análise</p>
                <p className="text-sm mt-2">Descreva o caso e clique em "Analisar Chances"</p>
              </CardContent>
            </Card>
          ) : loading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
                <p className="text-lg font-medium">Analisando o caso...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  A IA está processando as informações
                </p>
              </CardContent>
            </Card>
          ) : analise ? (
            <>
              {/* Gauge Principal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Probabilidade de Sucesso</span>
                    <Button variant="outline" size="sm" onClick={handleDownloadRelatorio}>
                      <FileText className="mr-2 h-4 w-4" />
                      Baixar Relatório
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Gauge Visual */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-32 h-32">
                        <svg className="transform -rotate-90 w-32 h-32">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${(analise.probabilidade / 100) * 352} 352`}
                            className={getClassificacaoConfig(analise.classificacao).color.replace('bg-', 'text-')}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold">{analise.probabilidade}%</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <Badge
                          className={`${getClassificacaoConfig(analise.classificacao).bgColor} ${getClassificacaoConfig(analise.classificacao).textColor} border-0 text-base px-4 py-2`}
                        >
                          {getClassificacaoConfig(analise.classificacao).emoji}{" "}
                          {getClassificacaoConfig(analise.classificacao).label}
                        </Badge>
                        <Progress
                          value={analise.probabilidade}
                          className="mt-4 h-3"
                        />
                      </div>
                    </div>

                    {/* Fundamentação */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Fundamentação
                      </h4>
                      <p className="text-sm text-muted-foreground">{analise.fundamentacao}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pontos Fortes e Fracos */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pontos Fortes */}
                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <CheckCircle2 className="h-5 w-5" />
                      Pontos Fortes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analise.pontosFortes.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhum ponto forte identificado</p>
                    ) : (
                      <ul className="space-y-2">
                        {analise.pontosFortes.map((ponto, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-green-600 font-bold mt-0.5">+</span>
                            <span>{ponto}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>

                {/* Pontos Fracos */}
                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <XCircle className="h-5 w-5" />
                      Pontos Fracos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analise.pontosFracos.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhum ponto fraco identificado</p>
                    ) : (
                      <ul className="space-y-2">
                        {analise.pontosFracos.map((ponto, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-red-600 font-bold mt-0.5">−</span>
                            <span>{ponto}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recomendações */}
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Lightbulb className="h-5 w-5" />
                    Recomendações
                  </CardTitle>
                  <CardDescription>Sugestões para melhorar as chances de sucesso</CardDescription>
                </CardHeader>
                <CardContent>
                  {analise.recomendacoes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma recomendação específica</p>
                  ) : (
                    <ul className="space-y-3">
                      {analise.recomendacoes.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-0.5">
                            {index + 1}
                          </Badge>
                          <span className="text-sm flex-1">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Riscos */}
              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <AlertTriangle className="h-5 w-5" />
                    Riscos Identificados
                  </CardTitle>
                  <CardDescription>Pontos de atenção e possíveis obstáculos</CardDescription>
                </CardHeader>
                <CardContent>
                  {analise.riscos.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum risco significativo identificado</p>
                  ) : (
                    <ul className="space-y-2">
                      {analise.riscos.map((risco, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                          <span>{risco}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Provas Necessárias */}
              {analise.provasNecessarias && analise.provasNecessarias.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Provas Necessárias</CardTitle>
                    <CardDescription>Documentos e evidências recomendadas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analise.provasNecessarias.map((prova: string, index: number) => (
                        <li key={index} className="text-sm border-l-2 border-primary pl-3 py-1">
                          {prova}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
