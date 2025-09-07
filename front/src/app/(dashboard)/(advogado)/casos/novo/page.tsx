"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, FileText } from "lucide-react";
import Link from "next/link";
import { useLayout } from "@/contexts/LayoutContext";

type ProcessoData = {
    clienteId: string;
    clienteNome: string;
    categoria: string;
    titulo: string;
    descricao: string;
    isDraft: boolean;
};

export default function NovoProcessoPage() {
    const { updateConfig } = useLayout();
    const [data, setData] = useState<ProcessoData>({
        clienteId: "",
        clienteNome: "",
        categoria: "",
        titulo: "",
        descricao: "",
        isDraft: true,
    });

    useEffect(() => {
        updateConfig({
            showNavbar: true,
            showSidebar: true,
            showFooter: true
        });
    }, [updateConfig]);

    const categorias = [
        "Civil",
        "Trabalhista",
        "Penal",
        "Família",
        "Empresarial",
        "Tributário",
        "Ambiental",
        "Outro",
    ];

    // Mock de clientes do advogado
    const clientes = [
        { id: "1", nome: "João Silva" },
        { id: "2", nome: "Maria Santos" },
        { id: "3", nome: "Pedro Oliveira" },
    ];

    const handleInputChange = (field: keyof ProcessoData, value: string) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const handleClienteChange = (clienteId: string) => {
        const cliente = clientes.find(c => c.id === clienteId);
        setData((prev) => ({
            ...prev,
            clienteId,
            clienteNome: cliente?.nome || ""
        }));
    };

    const handleSave = () => {
        console.log("Salvando rascunho:", data);
        // Aqui seria a lógica para salvar no backend
        // Por enquanto, apenas log
    };

    const isFormValid = data.clienteId && data.categoria && data.titulo;

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto">
                {/* Header */}
                <Link href="/casos" className="mb-6 inline-block">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar
                    </Button>
                </Link>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Novo Processo</h1>
                            <p className="text-muted-foreground">Crie um rascunho do processo jurídico</p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="px-3 py-1">
                        <FileText className="h-3 w-3 mr-1" />
                        Rascunho
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulário Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações Básicas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cliente">Cliente *</Label>
                                    <Select value={data.clienteId} onValueChange={handleClienteChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um cliente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clientes.map((cliente) => (
                                                <SelectItem key={cliente.id} value={cliente.id}>
                                                    {cliente.nome}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="categoria">Categoria do Processo *</Label>
                                    <Select value={data.categoria} onValueChange={(value) => handleInputChange("categoria", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione uma categoria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categorias.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="titulo">Título do Processo *</Label>
                                    <Input
                                        id="titulo"
                                        placeholder="Ex: Ação de Cobrança"
                                        value={data.titulo}
                                        onChange={(e) => handleInputChange("titulo", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="descricao">Descrição do Caso</Label>
                                    <Textarea
                                        id="descricao"
                                        placeholder="Descreva os detalhes do caso..."
                                        className="min-h-[120px]"
                                        value={data.descricao}
                                        onChange={(e) => handleInputChange("descricao", e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar com Resumo */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Resumo</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium">Cliente</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {data.clienteNome || "Não selecionado"}
                                    </p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium">Categoria</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {data.categoria || "Não selecionada"}
                                    </p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium">Título</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {data.titulo || "Não informado"}
                                    </p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium">Status</Label>
                                    <Badge variant="outline">Rascunho</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Próximos Passos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                                        <div>
                                            <p className="font-medium">Análise Inicial</p>
                                            <p className="text-muted-foreground">Revisar documentos e entender o caso</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                                        <div>
                                            <p className="font-medium text-muted-foreground">Petição Inicial</p>
                                            <p className="text-muted-foreground">Elaborar e protocolar petição inicial</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                                        <div>
                                            <p className="font-medium text-muted-foreground">Audiência</p>
                                            <p className="text-muted-foreground">Participar da audiência inicial</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-3">
                            <Button
                                onClick={handleSave}
                                disabled={!isFormValid}
                                className="flex-1"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Salvar Rascunho
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
