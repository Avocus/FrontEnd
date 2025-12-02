"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Download, Copy, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  gerarPeticaoInicial, 
  exportarPeticaoTexto, 
  validarDadosPeticao,
  type DadosPeticao,
  type PeticaoGerada 
} from "@/services/gemini/peticaoService";

export default function GeradorPeticao() {
  const [loading, setLoading] = useState(false);
  const [peticaoGerada, setPeticaoGerada] = useState<PeticaoGerada | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Estado do formulário
  const [dados, setDados] = useState<DadosPeticao>({
    tipoProcesso: "",
    partes: {
      autor: "",
      autorQualificacao: "",
      reu: "",
      reuQualificacao: "",
    },
    fatos: "",
    fundamentacaoJuridica: "",
    pedidos: [""],
    valorCausa: undefined,
    documentos: [],
    juizo: "",
    comarca: "",
  });

  const tiposAcao = [
    "Ação de Cobrança",
    "Ação de Indenização por Danos Morais",
    "Ação de Indenização por Danos Materiais",
    "Ação de Rescisão Contratual",
    "Ação de Despejo",
    "Ação Revisional de Contrato",
    "Ação de Consignação em Pagamento",
    "Ação Declaratória",
    "Ação de Obrigação de Fazer",
    "Ação de Obrigação de Não Fazer",
    "Ação Trabalhista",
    "Outro",
  ];

  const handleGerarPeticao = async () => {
    setErro(null);
    setSucesso(null);
    setPeticaoGerada(null);

    // Validar dados
    const validacao = validarDadosPeticao(dados);
    if (!validacao.valido) {
      setErro(validacao.erros?.join(", ") || "Dados inválidos");
      return;
    }

    setLoading(true);

    try {
      const resultado = await gerarPeticaoInicial(dados);
      setPeticaoGerada(resultado);
      setSucesso("Petição gerada com sucesso! Revise o conteúdo antes de usar.");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao gerar petição");
    } finally {
      setLoading(false);
    }
  };

  const handleCopiar = () => {
    if (peticaoGerada) {
      const texto = exportarPeticaoTexto(peticaoGerada);
      navigator.clipboard.writeText(texto);
      setSucesso("Petição copiada para a área de transferência!");
    }
  };

  const handleDownload = () => {
    if (peticaoGerada) {
      const texto = exportarPeticaoTexto(peticaoGerada);
      const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `peticao_${dados.tipoProcesso.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSucesso("Petição baixada com sucesso!");
    }
  };

  const adicionarPedido = () => {
    setDados({ ...dados, pedidos: [...dados.pedidos, ""] });
  };

  const removerPedido = (index: number) => {
    const novosPedidos = dados.pedidos.filter((_, i) => i !== index);
    setDados({ ...dados, pedidos: novosPedidos });
  };

  const atualizarPedido = (index: number, valor: string) => {
    const novosPedidos = [...dados.pedidos];
    novosPedidos[index] = valor;
    setDados({ ...dados, pedidos: novosPedidos });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-violet-500/10 rounded-lg">
          <Sparkles className="h-6 w-6 text-violet-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Gerador de Petições com IA</h1>
          <p className="text-muted-foreground">
            Gere petições iniciais completas automaticamente usando Inteligência Artificial
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle>Dados da Petição</CardTitle>
            <CardDescription>Preencha os dados para gerar a petição inicial</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tipo de Ação */}
            <div className="space-y-2">
              <Label htmlFor="tipoAcao">Tipo de Ação *</Label>
              <Select
                value={dados.tipoProcesso}
                onValueChange={(value) => setDados({ ...dados, tipoProcesso: value })}
              >
                <SelectTrigger id="tipoAcao">
                  <SelectValue placeholder="Selecione o tipo de ação" />
                </SelectTrigger>
                <SelectContent>
                  {tiposAcao.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dados do Autor */}
            <div className="space-y-4 border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-blue-700">Autor (Cliente)</h3>
              <div className="space-y-2">
                <Label htmlFor="autorNome">Nome Completo *</Label>
                <Input
                  id="autorNome"
                  value={dados.partes.autor}
                  onChange={(e) =>
                    setDados({ ...dados, partes: { ...dados.partes, autor: e.target.value } })
                  }
                  placeholder="Nome completo do autor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="autorCpf">CPF/CNPJ *</Label>
                <Input
                  id="autorCpf"
                  value={dados.partes.autorQualificacao.split(',')[0] || ''}
                  onChange={(e) =>
                    setDados({ ...dados, partes: { ...dados.partes, autorQualificacao: e.target.value } })
                  }
                  placeholder="CPF/CNPJ, endereço completo, profissão"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="autorQualificacao">Qualificação Completa *</Label>
                <Textarea
                  id="autorQualificacao"
                  value={dados.partes.autorQualificacao}
                  onChange={(e) =>
                    setDados({ ...dados, partes: { ...dados.partes, autorQualificacao: e.target.value } })
                  }
                  placeholder="CPF/CNPJ, endereço completo, profissão..."
                  rows={3}
                />
              </div>
            </div>

            {/* Dados do Réu */}
            <div className="space-y-4 border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-red-700">Réu</h3>
              <div className="space-y-2">
                <Label htmlFor="reuNome">Nome/Razão Social *</Label>
                <Input
                  id="reuNome"
                  value={dados.partes.reu}
                  onChange={(e) =>
                    setDados({ ...dados, partes: { ...dados.partes, reu: e.target.value } })
                  }
                  placeholder="Nome completo ou razão social do réu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reuQualificacao">Qualificação Completa *</Label>
                <Textarea
                  id="reuQualificacao"
                  value={dados.partes.reuQualificacao}
                  onChange={(e) =>
                    setDados({ ...dados, partes: { ...dados.partes, reuQualificacao: e.target.value } })
                  }
                  placeholder="CPF/CNPJ, endereço completo..."
                  rows={3}
                />
              </div>
            </div>

            {/* Comarca e Vara */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="comarca">Comarca</Label>
                <Input
                  id="comarca"
                  value={dados.comarca || ""}
                  onChange={(e) => setDados({ ...dados, comarca: e.target.value })}
                  placeholder="Ex: São Paulo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="juizo">Juízo</Label>
                <Input
                  id="juizo"
                  value={dados.juizo || ""}
                  onChange={(e) => setDados({ ...dados, juizo: e.target.value })}
                  placeholder="Ex: 1ª Vara Cível"
                />
              </div>
            </div>

            {/* Fatos */}
            <div className="space-y-2">
              <Label htmlFor="fatos">Fatos (Narrativa) *</Label>
              <Textarea
                id="fatos"
                value={dados.fatos}
                onChange={(e) => setDados({ ...dados, fatos: e.target.value })}
                placeholder="Descreva os fatos relevantes do caso de forma clara e cronológica..."
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Mínimo 50 caracteres. Seja claro e objetivo.
              </p>
            </div>

            {/* Fundamentos Jurídicos */}
            <div className="space-y-2">
              <Label htmlFor="fundamentos">Fundamentos Jurídicos (Opcional)</Label>
              <Textarea
                id="fundamentos"
                value={dados.fundamentacaoJuridica || ""}
                onChange={(e) => setDados({ ...dados, fundamentacaoJuridica: e.target.value })}
                placeholder="Artigos de lei, jurisprudência, doutrina... A IA também pode sugerir."
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Pedidos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Pedidos *</Label>
                <Button type="button" variant="outline" size="sm" onClick={adicionarPedido}>
                  + Adicionar Pedido
                </Button>
              </div>
              {dados.pedidos.map((pedido, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={pedido}
                    onChange={(e) => atualizarPedido(index, e.target.value)}
                    placeholder={`Pedido ${index + 1}`}
                  />
                  {dados.pedidos.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removerPedido(index)}
                    >
                      ✕
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Valor da Causa */}
            <div className="space-y-2">
              <Label htmlFor="valorCausa">Valor da Causa (R$)</Label>
              <Input
                id="valorCausa"
                type="number"
                step="0.01"
                value={dados.valorCausa || ""}
                onChange={(e) =>
                  setDados({ ...dados, valorCausa: parseFloat(e.target.value) || undefined })
                }
                placeholder="0,00"
              />
            </div>

            {/* Botão Gerar */}
            <Button variant={"primary"} onClick={handleGerarPeticao} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando Petição...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar Petição com IA
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="lg:sticky lg:top-6 h-fit">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Preview da Petição</CardTitle>
                <CardDescription>
                  {peticaoGerada ? "Petição gerada com sucesso" : "Aguardando geração..."}
                </CardDescription>
              </div>
              {peticaoGerada && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Pronto
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!peticaoGerada ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <FileText className="h-16 w-16 mb-4 opacity-20" />
                <p>Preencha o formulário e clique em &quot;Gerar Petição&quot;</p>
                <p className="text-sm mt-2">A IA criará uma petição inicial completa</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Ações */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopiar} className="flex-1">
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload} className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar .txt
                  </Button>
                </div>

                {/* Conteúdo */}
                <div className="border rounded-lg p-4 bg-muted/30 max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {exportarPeticaoTexto(peticaoGerada)}
                  </pre>
                </div>

                {/* Aviso */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Importante:</strong> Esta petição foi gerada por IA e deve ser
                    cuidadosamente revisada por um advogado antes do uso. Verifique todos os dados,
                    fundamentos e adequação ao caso concreto.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
