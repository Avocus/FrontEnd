"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GeradorPeticao from "@/components/ia/GeradorPeticao";
import AnalisadorChances from "@/components/ia/AnalisadorChances";
import ResumidorDocumento from "@/components/ia/ResumidorDocumento";
import CorretorJuridico from "@/components/ia/CorretorJuridico";
import { Sparkles, TrendingUp, FileText, Edit3, Zap } from "lucide-react";

export default function IAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            AVOCUSS IA+
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ferramentas de Inteligência Artificial para otimizar seu trabalho jurídico
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="peticao" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-1">
            <TabsTrigger value="peticao" className="flex flex-col items-center gap-2 py-3">
              <Sparkles className="h-5 w-5" />
              <div className="text-center">
                <div className="font-semibold">Petições</div>
                <div className="text-xs text-muted-foreground">Gere automaticamente</div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="analise" className="flex flex-col items-center gap-2 py-3">
              <TrendingUp className="h-5 w-5" />
              <div className="text-center">
                <div className="font-semibold">Análise</div>
                <div className="text-xs text-muted-foreground">Chances de sucesso</div>
              </div>
            </TabsTrigger>
            <TabsTrigger value="resumo" className="flex flex-col items-center gap-2 py-3">
              <FileText className="h-5 w-5" />
              <div className="text-center">
                <div className="font-semibold">Resumo</div>
                <div className="text-xs text-muted-foreground">Extraia informações</div>
              </div>
            </TabsTrigger>
            {/* <TabsTrigger value="corretor" className="flex flex-col items-center gap-2 py-3">
              <Edit3 className="h-5 w-5" />
              <div className="text-center">
                <div className="font-semibold">Corretor</div>
                <div className="text-xs text-muted-foreground">Melhore textos</div>
              </div>
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="peticao" className="mt-0">
            <GeradorPeticao />
          </TabsContent>

          <TabsContent value="analise" className="mt-0">
            <AnalisadorChances />
          </TabsContent>

          <TabsContent value="resumo" className="mt-0">
            <ResumidorDocumento />
          </TabsContent>

          <TabsContent value="corretor" className="mt-0">
            <CorretorJuridico />
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <Card className="mt-8 border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">ℹ️ Sobre estas ferramentas</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-2">
            <p>
              <strong>• Gerador de Petições:</strong> Cria petições iniciais completas seguindo as
              normas do CPC, incluindo qualificação das partes, fatos, fundamentos e pedidos.
            </p>
            <p>
              <strong>• Análise de Chances:</strong> Avalia a probabilidade de sucesso do processo
              com base em jurisprudência, legislação e peculiaridades do caso.
            </p>
            <p>
              <strong>• Resumidor de Documentos:</strong> Extrai automaticamente informações
              importantes como prazos, partes envolvidas, valores e ações necessárias.
            </p>
            {/* <p>
              <strong>• Corretor Jurídico:</strong> Identifica e corrige erros de gramática,
              terminologia jurídica, clareza e formatação em textos legais.
            </p> */}
            <p className="pt-2 border-t">
              ⚠️ <strong>Importante:</strong> Todas as ferramentas usam IA e seus resultados devem
              ser revisados por um profissional antes do uso. Não substituem a análise jurídica
              qualificada.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
