"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, FileIcon, MapPinIcon, MailIcon, PhoneIcon, Clock, User } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PerfilCliente } from "@/types/entities/Cliente";
import { getToken } from "@/utils/authUtils";

export function DadosUsuario() {
    const [profile, setProfile] = useState<PerfilCliente>({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        endereco: "",
        cidade: "",
        estado: "",
        dataNascimento: "",
        fotoPerfil: "",
        processosAtivos: 0,
        processosFinalizados: 0,
    });
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("informacoes");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                
                const token = getToken();
                
                if (!token) {
                  throw new Error('Usuário não autenticado');
                }
                
                const response = await fetch('/api/profile/dados-gerais', {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                });
                
                if (!response.ok) {
                  const errorData = await response.json().catch(() => ({}));
                  throw new Error(errorData.error || 'Erro ao carregar dados do perfil');
                }
                
                const responseData = await response.json();
                setProfile(responseData.data as PerfilCliente);
            } catch (err) {
                setError("Não foi possível carregar os dados do perfil");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const renderInformacoesTab = () => (
        <Card>
            <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Todos os seus dados cadastrais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                        <MailIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Email</p>
                            <p className="text-muted-foreground">{profile.email}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <PhoneIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Telefone</p>
                            <p className="text-muted-foreground">{profile.telefone || "Não informado"}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <CalendarIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Data de Nascimento</p>
                            <p className="text-muted-foreground">
                                {profile.dataNascimento 
                                    ? new Date(profile?.dataNascimento ?? Date.now()).toLocaleDateString('pt-BR') 
                                    : "Não informada"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">CPF</p>
                            <p className="text-muted-foreground">{profile.cpf || "Não informado"}</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Endereço</h3>
                    <div className="flex items-start gap-3">
                        <MapPinIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium">Localização</p>
                            <p className="text-muted-foreground">
                                {profile.endereco ? (
                                    `${profile.endereco}, ${profile.cidade} - ${profile.estado}`
                                ) : (
                                    "Endereço não informado"
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                    <Link href="/perfil/editar">Editar informações</Link>
                </Button>
            </CardFooter>
        </Card>
    );

    // Função para renderizar a tab de processos
    const renderProcessosTab = () => (
        <Card>
            <CardHeader>
                <CardTitle>Meus Processos</CardTitle>
                <CardDescription>Acompanhe todos os seus processos</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-5">
                    {cliente.processos.map((processo) => (
                        <div key={processo.id} className="flex items-center justify-between p-4 rounded-lg border">
                            <div>
                                <h3 className="font-medium">{processo.titulo}</h3>
                                <div className="flex items-center gap-1 mt-1">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{processo.data}</span>
                                </div>
                            </div>
                            <Badge variant={processo.status === "Ativo" ? "default" : "secondary"}>
                                {processo.status}
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full">Ver todos os processos</Button>
            </CardFooter>
        </Card>
    );

    // Função para renderizar a tab de documentos
    const renderDocumentosTab = () => (
        <Card>
            <CardHeader>
                <CardTitle>Meus Documentos</CardTitle>
                <CardDescription>Todos os documentos enviados</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {cliente.documentos.map((documento) => (
                        <div key={documento.id} className="flex items-center justify-between p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <FileIcon className="h-8 w-8 text-primary" />
                                <div>
                                    <h3 className="font-medium">{documento.nome}</h3>
                                    <p className="text-sm text-muted-foreground">Enviado via aplicativo</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">Visualizar</Button>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Enviar novo documento</Button>
                <Button variant="ghost">Ver todos</Button>
            </CardFooter>
        </Card>
    );

    // Função que seleciona a tab correta
    const renderTabContent = () => {
        switch (activeTab) {
            case "informacoes":
                return renderInformacoesTab();
            case "processos":
                return renderProcessosTab();
            case "documentos":
                return renderDocumentosTab();
            default:
                return null;
        }
    };

    // Função para renderizar o cabeçalho de perfil
    const renderProfileHeader = () => (
        <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary to-primary/60"></div>
            <CardContent className="-mt-16 pb-6">
                <div className="flex flex-col items-center">
                    <Avatar className="h-32 w-32 border-4 border-background">
                        <div className="h-full w-full flex items-center justify-center">
                            {profile.fotoPerfil ? (
                                <div className="relative h-full w-full">
                                    <Image
                                        src={profile.fotoPerfil} 
                                        alt={profile.nome} 
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="text-4xl bg-primary/10 h-full w-full flex items-center justify-center">
                                    {profile?.nome?.charAt(0) ?? ''}
                                </div>
                            )}
                        </div>
                    </Avatar>
                    <h2 className="mt-4 text-2xl font-bold">{profile.nome}</h2>
                    <p className="text-muted-foreground">Cliente</p>

                    <div className="flex gap-3 mt-6">
                        <Button size="sm" variant="outline" asChild>
                            <Link href="/perfil/editar">Editar Perfil</Link>
                        </Button>
                        <Button size="sm" variant="default">Mensagens</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    // Função para renderizar o card de estatísticas
    const renderEstastisticas = () => (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-primary/10">
                        <h3 className="font-medium text-muted-foreground">Processos Ativos</h3>
                        <p className="text-3xl font-bold">{profile.processosAtivos}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/10">
                        <h3 className="font-medium text-muted-foreground">Finalizados</h3>
                        <p className="text-3xl font-bold">{profile.processosFinalizados}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    // Função para renderizar as tabs
    const renderTabs = () => (
        <div className="flex border-b space-x-4">
            <button
                onClick={() => setActiveTab("informacoes")}
                className={`py-2 px-4 font-medium text-sm transition-colors ${activeTab === "informacoes" 
                    ? "border-b-2 border-primary text-primary" 
                    : "text-muted-foreground hover:text-foreground"}`}
            >
                Informações
            </button>
            <button
                onClick={() => setActiveTab("processos")}
                className={`py-2 px-4 font-medium text-sm transition-colors ${activeTab === "processos" 
                    ? "border-b-2 border-primary text-primary" 
                    : "text-muted-foreground hover:text-foreground"}`}
            >
                Processos
            </button>
            <button
                onClick={() => setActiveTab("documentos")}
                className={`py-2 px-4 font-medium text-sm transition-colors ${activeTab === "documentos" 
                    ? "border-b-2 border-primary text-primary" 
                    : "text-muted-foreground hover:text-foreground"}`}
            >
                Documentos
            </button>
        </div>
    );

    return (
        <div className="p-6 bg-background">
            {error && (
                <div className="mb-4 p-3 bg-destructive/20 text-destructive rounded-md">
                    {error}
                </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-6">
                {/* Seção de perfil/cabeçalho */}
                <div className="w-full md:w-1/3">
                    {renderProfileHeader()}
                    {renderEstastisticas()}
                </div>

                {/* Seção de informações */}
                <div className="w-full md:w-2/3">
                    {/* Tabs customizadas sem Radix */}
                    <div className="w-full">
                        {renderTabs()}
                        <div className="mt-4">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Dados mockados para visualização
const cliente = {
    processos: [
        { id: 1, titulo: "Caso XYZ", status: "Ativo", data: "01/10/2023" },
        { id: 2, titulo: "Caso ABC", status: "Finalizado", data: "15/09/2023" },
        { id: 3, titulo: "Caso DEF", status: "Ativo", data: "20/08/2023" },
    ],
    documentos: [
        { id: 1, nome: "RG", arquivo: "/documentos/rg.pdf" },
        { id: 2, nome: "CPF", arquivo: "/documentos/cpf.pdf" },
    ],
};