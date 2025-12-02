"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Upload, Download, AlertCircle, Clock, Users, DollarSign, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  resumirDocumento, 
  extrairTextoArquivo,
  formatarResumoTexto,
  obterPrazosUrgentes,
  validarTamanhoDocumento,
  type ResumoDocumento 
} from "@/services/gemini/resumoDocumentoService";

export default function ResumidorDocumento() {
  const [loading, setLoading] = useState(false);
  const [resumo, setResumo] = useState<ResumoDocumento | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState<string>("");

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    setErro(null);
    setSucesso(null);
    setResumo(null);
    setNomeArquivo(arquivo.name);
    setLoading(true);

    try {
      // Extrair texto do arquivo
      const texto = await extrairTextoArquivo(arquivo);

      // Validar tamanho
      const validacao = validarTamanhoDocumento(texto);
      if (!validacao.valido) {
        setErro(validacao.erro || "Documento inválido");
        setLoading(false);
        return;
      }

      // Resumir
      const resultado = await resumirDocumento(texto);
      setResumo(resultado);
      setSucesso("Documento resumido com sucesso!");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao processar documento");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (resumo) {
      const texto = formatarResumoTexto(resumo);
      const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resumo_${nomeArquivo.replace(/\.[^/.]+$/, "")}_${new Date().toISOString().split("T")[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSucesso("Resumo baixado com sucesso!");
    }
  };

  const prazosUrgentes = resumo ? obterPrazosUrgentes(resumo) : [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-dashboard-card-yellow rounded-lg">
          <FileText className="h-6 w-6 text-dashboard-yellow-light" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Resumidor de Documentos</h1>
          <p className="text-muted-foreground">
            Extraia informações importantes de documentos jurídicos automaticamente
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
        <Alert className="border-dashboard-green bg-dashboard-card-green text-dashboard-green-light">
          <CheckCircle2 className="h-4 w-4 text-dashboard-green-light" />
          <AlertDescription>{sucesso}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Upload do Documento</CardTitle>
            <CardDescription>Envie um arquivo de texto para análise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <input
                type="file"
                accept=".txt"
                onChange={handleUpload}
                className="hidden"
                id="file-upload"
                disabled={loading}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {loading ? (
                  <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-dashboard-blue-light" />
                ) : (
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                )}
                <p className="text-sm font-medium">
                  {loading ? "Processando documento..." : "Clique para fazer upload"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Arquivos .txt (máx. 100.000 caracteres)
                </p>
              </label>
            </div>

            {nomeArquivo && (
              <div className="flex items-center gap-2 text-sm p-3 bg-muted rounded-lg">
                <FileText className="h-4 w-4" />
                <span className="flex-1 truncate">{nomeArquivo}</span>
              </div>
            )}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Formatos suportados:</strong> Atualmente apenas .txt
                <br />
                <strong>Em breve:</strong> PDF e DOCX
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="lg:col-span-2 space-y-6">
          {!resumo && !loading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <FileText className="h-20 w-20 mb-4 opacity-20" />
                <p className="text-lg font-medium">Aguardando documento</p>
                <p className="text-sm mt-2">Faça upload de um arquivo para começar</p>
              </CardContent>
            </Card>
          ) : loading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-16 w-16 animate-spin text-dashboard-blue-light mb-4" />
                <p className="text-lg font-medium">Analisando documento...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  A IA está extraindo as informações
                </p>
              </CardContent>
            </Card>
          ) : resumo ? (
            <>
              {/* Cards de Métricas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-dashboard-card-blue rounded-lg">
                        <FileText className="h-5 w-5 text-dashboard-blue-light" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{resumo.pontosChave.length}</p>
                        <p className="text-xs text-muted-foreground">Pontos-Chave</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-dashboard-card-orange rounded-lg">
                        <Clock className="h-5 w-5 text-dashboard-orange-light" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{resumo.prazosIdentificados.length}</p>
                        <p className="text-xs text-muted-foreground">Prazos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-dashboard-card-green rounded-lg">
                        <Users className="h-5 w-5 text-dashboard-green-light" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{resumo.partesEnvolvidas.length}</p>
                        <p className="text-xs text-muted-foreground">Partes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-dashboard-card-purple rounded-lg">
                        <DollarSign className="h-5 w-5 text-dashboard-purple-light" />
                      </div>
                      <div>
                        <p className="text-xl font-bold">
                          {resumo.valorCausa
                            ? `R$ ${(resumo.valorCausa).toFixed(2)}`
                            : "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">Valor da Causa</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Resumo Executivo */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Resumo Executivo</CardTitle>
                      {resumo.tipoDocumento && (
                        <Badge variant="outline" className="mt-2 bg-dashboard-card-green text-dashboard-green-light border-dashboard-green">
                          {resumo.tipoDocumento}
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Baixar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{resumo.resumoExecutivo}</p>
                </CardContent>
              </Card>

              {/* Prazos Urgentes */}
              {prazosUrgentes.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>⚠️ {prazosUrgentes.length} prazo(s) urgente(s) identificado(s)!</strong>
                  </AlertDescription>
                </Alert>
              )}

              {/* Prazos */}
              {resumo.prazosIdentificados.length > 0 && (
                <Card className="border-dashboard-orange">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-dashboard-orange-light" />
                      Prazos Identificados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {resumo.prazosIdentificados.map((prazo, index) => (
                        <div
                          key={index}
                            className={`flex items-start justify-between p-3 rounded-lg border ${
                            prazo.urgente ? "bg-dashboard-card-red border-dashboard-red" : "bg-muted"
                          }`}
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">{prazo.descricao}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {prazo.data && `Data: ${new Date(prazo.data).toLocaleDateString("pt-BR")}`}
                              {prazo.dias && ` • ${prazo.dias} dias`}
                            </p>
                          </div>
                          {prazo.urgente && (
                            <Badge variant="destructive" className="ml-2">
                              URGENTE
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pontos-Chave e Ações */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pontos-Chave</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resumo.pontosChave.map((ponto, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-dashboard-blue-light font-bold mt-0.5">•</span>
                          <span>{ponto}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ações Necessárias</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resumo.acoesNecessarias.map((acao, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-dashboard-green-light mt-0.5 flex-shrink-0" />
                          <span>{acao}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Partes Envolvidas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Partes Envolvidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {resumo.partesEnvolvidas.map((parte, index) => (
                      <Badge key={index} variant="outline">
                        {parte}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Observações */}
              {resumo.observacoes && resumo.observacoes.length > 0 && (
                <Card className="border-dashboard-yellow bg-dashboard-card-yellow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-dashboard-yellow-light">
                      <AlertCircle className="h-5 w-5" />
                      Observações Importantes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resumo.observacoes.map((obs, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-dashboard-yellow-light font-bold mt-0.5">⚠</span>
                          <span>{obs}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Aviso */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Importante:</strong> Este resumo foi gerado por IA e deve ser revisado.
                  Não substitui a leitura completa do documento original.
                </AlertDescription>
              </Alert>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
