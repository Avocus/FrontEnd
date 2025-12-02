"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Sparkles, AlertCircle, CheckCircle2, FileText, Download, ArrowLeftRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  corrigirTextoJuridico, 
  gerarRelatorioCorrecoes,
  filtrarCorrecoesPorTipo,
  filtrarCorrecoesPorGravidade,
  obterCorTipoCorrecao,
  obterIconeTipoCorrecao,
  type CorrecaoTexto,
  type TipoCorrecao,
  type Correcao 
} from "@/services/gemini/corretorJuridicoService";

export default function CorretorJuridico() {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<CorrecaoTexto | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [textoOriginal, setTextoOriginal] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [visualizacao, setVisualizacao] = useState<"lado-a-lado" | "corrigido">("lado-a-lado");

  // Filtros
  const [tiposFiltrados, setTiposFiltrados] = useState<TipoCorrecao[]>([
    "GRAMATICA",
    "TERMO_JURIDICO",
    "CLAREZA",
    "FORMATACAO",
    "ESTILO",
  ]);
  const [gravidadesFiltradas, setGravidadesFiltradas] = useState<Correcao['gravidade'][]>([
    "CRITICA",
    "IMPORTANTE",
    "SUGESTAO",
  ]);

  const tiposDocumento = [
    "Petição Inicial",
    "Contestação",
    "Recurso",
    "Contrato",
    "Parecer",
    "Memorando",
    "Outro",
  ];

  const handleCorrigir = async () => {
    if (!textoOriginal.trim() || textoOriginal.length < 10) {
      setErro("Digite um texto com pelo menos 10 caracteres");
      return;
    }

    setErro(null);
    setSucesso(null);
    setResultado(null);
    setLoading(true);

    try {
      const correcao = await corrigirTextoJuridico(textoOriginal, tipoDocumento);
      setResultado(correcao);
      setSucesso(
        `Texto corrigido! Score: ${correcao.score.original}→${correcao.score.corrigido} (+${
          correcao.score.corrigido - correcao.score.original
        } pontos)`
      );
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao corrigir texto");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadRelatorio = () => {
    if (resultado) {
      const relatorio = gerarRelatorioCorrecoes(resultado);
      const blob = new Blob([relatorio], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `correcao_${new Date().toISOString().split("T")[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleCopiarCorrigido = () => {
    if (resultado) {
      navigator.clipboard.writeText(resultado.textoCorrigido);
      setSucesso("Texto corrigido copiado!");
    }
  };

  const toggleTipo = (tipo: TipoCorrecao) => {
    setTiposFiltrados((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  };

  const toggleGravidade = (gravidade: Correcao['gravidade']) => {
    setGravidadesFiltradas((prev) =>
      prev.includes(gravidade) ? prev.filter((g) => g !== gravidade) : [...prev, gravidade]
    );
  };

  const correcoesFiltradas = resultado
    ? filtrarCorrecoesPorGravidade(
        filtrarCorrecoesPorTipo(resultado.correcoes, tiposFiltrados),
        gravidadesFiltradas
      )
    : [];

  const getGravidadeBadge = (gravidade: Correcao['gravidade']) => {
    const configs = {
      CRITICA: { color: "bg-red-100 text-red-700 border-red-300", icon: "🔴" },
      IMPORTANTE: { color: "bg-yellow-100 text-yellow-700 border-yellow-300", icon: "🟡" },
      SUGESTAO: { color: "bg-blue-100 text-blue-700 border-blue-300", icon: "🔵" },
    };
    return configs[gravidade];
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-500/10 rounded-lg">
          <Sparkles className="h-6 w-6 text-purple-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Corretor de Linguagem Jurídica</h1>
          <p className="text-muted-foreground">
            Corrija gramática, terminologia e melhore a clareza de textos jurídicos com IA
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

      {sucesso && (
        <Alert className="border-green-500 bg-green-50 text-green-900">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertDescription>{sucesso}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Texto Original</CardTitle>
            <CardDescription>Digite ou cole o texto para correção</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Documento (Opcional)</Label>
              <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposDocumento.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="texto">Texto *</Label>
              <Textarea
                id="texto"
                value={textoOriginal}
                onChange={(e) => setTextoOriginal(e.target.value)}
                placeholder="Cole ou digite o texto jurídico aqui..."
                rows={16}
                className="resize-none font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                {textoOriginal.length} caracteres
              </p>
            </div>

            <Button variant={"primary"} onClick={handleCorrigir} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Corrigindo...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Corrigir Texto
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {!resultado && !loading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <FileText className="h-20 w-20 mb-4 opacity-20" />
                <p className="text-lg font-medium">Aguardando texto</p>
                <p className="text-sm mt-2">Digite ou cole um texto e clique em "Corrigir"</p>
              </CardContent>
            </Card>
          ) : loading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
                <p className="text-lg font-medium">Analisando texto...</p>
              </CardContent>
            </Card>
          ) : resultado ? (
            <>
              {/* Score e Ações */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Resultado da Correção</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopiarCorrigido}>
                        <FileText className="mr-2 h-4 w-4" />
                        Copiar
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownloadRelatorio}>
                        <Download className="mr-2 h-4 w-4" />
                        Relatório
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Score de Qualidade</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600">{resultado.score.original}</p>
                          <p className="text-xs text-muted-foreground">Original</p>
                        </div>
                        <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{resultado.score.corrigido}</p>
                          <p className="text-xs text-muted-foreground">Corrigido</p>
                        </div>
                        <Badge variant="outline" className="ml-4">
                          +{resultado.score.corrigido - resultado.score.original} pontos
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total de Correções</p>
                      <p className="text-3xl font-bold">{resultado.correcoes.length}</p>
                    </div>
                  </div>

                  {/* Toggle Visualização */}
                  <div className="flex gap-2">
                    <Button
                      variant={visualizacao === "lado-a-lado" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setVisualizacao("lado-a-lado")}
                    >
                      Lado a Lado
                    </Button>
                    <Button
                      variant={visualizacao === "corrigido" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setVisualizacao("corrigido")}
                    >
                      Apenas Corrigido
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Texto Comparativo */}
              <Card>
                <CardContent className="pt-6">
                  {visualizacao === "lado-a-lado" ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-red-700">Original</h4>
                        <div className="border rounded-lg p-4 bg-red-50/30 max-h-[400px] overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm font-mono">
                            {resultado.textoOriginal}
                          </pre>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-green-700">Corrigido</h4>
                        <div className="border rounded-lg p-4 bg-green-50/30 max-h-[400px] overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm font-mono">
                            {resultado.textoCorrigido}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-semibold mb-2 text-green-700">Texto Corrigido</h4>
                      <div className="border rounded-lg p-4 bg-green-50/30 max-h-[400px] overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm font-mono">
                          {resultado.textoCorrigido}
                        </pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Filtros */}
              <Card>
                <CardHeader>
                  <CardTitle>Filtros de Correções</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-3 block">Tipo de Correção</Label>
                    <div className="flex flex-wrap gap-2">
                      {(["GRAMATICA", "TERMO_JURIDICO", "CLAREZA", "FORMATACAO", "ESTILO"] as TipoCorrecao[]).map(
                        (tipo) => (
                          <div key={tipo} className="flex items-center space-x-2">
                            <Checkbox
                              id={tipo}
                              checked={tiposFiltrados.includes(tipo)}
                              onCheckedChange={() => toggleTipo(tipo)}
                            />
                            <label htmlFor={tipo} className="text-sm cursor-pointer flex items-center gap-1">
                              {obterIconeTipoCorrecao(tipo)} {tipo.replace("_", " ")}
                            </label>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Gravidade</Label>
                    <div className="flex gap-2">
                      {(["CRITICA", "IMPORTANTE", "SUGESTAO"] as Correcao['gravidade'][]).map((grav) => (
                        <div key={grav} className="flex items-center space-x-2">
                          <Checkbox
                            id={grav}
                            checked={gravidadesFiltradas.includes(grav)}
                            onCheckedChange={() => toggleGravidade(grav)}
                          />
                          <label htmlFor={grav} className="text-sm cursor-pointer">
                            {grav}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Correções */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Correções Detalhadas ({correcoesFiltradas.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {correcoesFiltradas.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Nenhuma correção corresponde aos filtros selecionados
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {correcoesFiltradas.map((correcao, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <span style={{ color: obterCorTipoCorrecao(correcao.tipo) }}>
                                {obterIconeTipoCorrecao(correcao.tipo)}
                              </span>
                              <Badge variant="outline">{correcao.tipo.replace("_", " ")}</Badge>
                              <Badge className={getGravidadeBadge(correcao.gravidade).color}>
                                {getGravidadeBadge(correcao.gravidade).icon} {correcao.gravidade}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mt-3">
                            <div className="bg-red-50 border border-red-200 rounded p-3">
                              <p className="text-xs font-semibold text-red-700 mb-1">Original:</p>
                              <p className="text-sm font-mono">{correcao.original}</p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded p-3">
                              <p className="text-xs font-semibold text-green-700 mb-1">Corrigido:</p>
                              <p className="text-sm font-mono">{correcao.corrigido}</p>
                            </div>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-2">
                            <p className="text-xs font-semibold text-blue-700 mb-1">💡 Explicação:</p>
                            <p className="text-sm">{correcao.explicacao}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Sugestões e Melhorias */}
              <div className="grid md:grid-cols-2 gap-6">
                {resultado.sugestoes.length > 0 && (
                  <Card className="border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-700">
                        <Sparkles className="h-5 w-5" />
                        Sugestões Gerais
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {resultado.sugestoes.map((sug, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-blue-600 mt-0.5">💡</span>
                            <span>{sug}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {resultado.melhorias.length > 0 && (
                  <Card className="border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="h-5 w-5" />
                        Melhorias Aplicadas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {resultado.melhorias.map((mel, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{mel}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Aviso */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Importante:</strong> As correções foram geradas por IA. Revise
                  cuidadosamente antes de aplicar, especialmente em documentos oficiais.
                </AlertDescription>
              </Alert>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
