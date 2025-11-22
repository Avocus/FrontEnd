"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, FileText, Search, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLayout } from "@/contexts/LayoutContext";
import { ModalBuscaCliente } from "@/components/casos/ModalBuscaCliente";
import { StatusProcesso, TipoProcesso } from "@/types/enums";
import { ClienteLista } from "@/types/entities/Cliente";
import { criarProcesso, CriarProcessoRequest } from "@/services/processo/processoService";
import toast from "react-hot-toast";

type ProcessoData = {
    clienteId: string;
    clienteNome: string;
    tipoProcesso: TipoProcesso | "";
    titulo: string;
    descricao: string;
    status: StatusProcesso;
};

export default function NovoProcessoPage() {
    const { updateConfig } = useLayout();
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        // Redirect clients away from this page
        if (user && user.client) {
            router.push('/casos');
        }
    }, [user, router]);

    const [isModalBuscaOpen, setIsModalBuscaOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<ProcessoData>({
        clienteId: "",
        clienteNome: "",
        tipoProcesso: "",
        titulo: "",
        descricao: "",
        status: StatusProcesso.RASCUNHO,
    });

    useEffect(() => {
        updateConfig({
            showNavbar: true,
            showSidebar: true,
            showFooter: true
        });
    }, [updateConfig]);

    // Don't render if user is a client
    if (user && user.client) {
        return null;
    }

    const handleInputChange = (field: keyof ProcessoData, value: string) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const handleClienteSelect = (cliente: ClienteLista) => {
        setData((prev) => ({
            ...prev,
            clienteId: cliente.id,
            clienteNome: cliente.nome
        }));
    };

    const handleSave = async () => {
        if (!isFormValid) return;

        setIsLoading(true);
        try {
            const processoData: CriarProcessoRequest = {
                clienteId: data.clienteId,
                tipoProcesso: data.tipoProcesso,
                titulo: data.titulo,
                descricao: data.descricao,
                status: data.status
            };

            await criarProcesso(processoData);
            toast.success("Processo criado com sucesso!");
            router.push("/casos");
        } catch (error) {
            console.error("Erro ao criar processo:", error);
            toast.error("Erro ao criar processo. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = data.clienteId && data.tipoProcesso && data.titulo;

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
                                    {data.clienteId ? (
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <User className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{data.clienteNome}</div>
                                                    <div className="text-sm text-muted-foreground">Cliente selecionado</div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setIsModalBuscaOpen(true)}
                                            >
                                                Alterar
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            className="w-full h-12 border-dashed"
                                            onClick={() => setIsModalBuscaOpen(true)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Search className="h-4 w-4" />
                                                <span>Buscar Cliente</span>
                                            </div>
                                        </Button>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tipoProcesso">Tipo do Processo *</Label>
                                    <Select value={data.tipoProcesso} onValueChange={(value) => handleInputChange("tipoProcesso", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(TipoProcesso).map((tipo) => (
                                                <SelectItem key={tipo} value={tipo}>
                                                    {tipo}
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
                                    <Label className="text-sm font-medium">Tipo do Processo</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {data.tipoProcesso || "Não selecionado"}
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
                                    <Badge variant="outline">{data.status}</Badge>
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
                                disabled={!isFormValid || isLoading}
                                className="flex-1"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                )}
                                {isLoading ? "Salvando..." : "Salvar Rascunho"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Busca de Cliente */}
            <ModalBuscaCliente
                isOpen={isModalBuscaOpen}
                onOpenChange={setIsModalBuscaOpen}
                onClienteSelect={handleClienteSelect}
            />
        </div>
    );
}
