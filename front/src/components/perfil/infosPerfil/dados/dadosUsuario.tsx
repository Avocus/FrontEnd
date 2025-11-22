/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, FileIcon, MapPinIcon, MailIcon, PhoneIcon, Clock, User, Save, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import Link from "next/link";
import { getProfileData, updateProfileData } from '@/services/user/profileService';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormData } from "@/schemas/profileSchema";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import toast from "react-hot-toast";

export function DadosUsuario() {
    const { profile, isLoading: profileLoading, updateProfile: updateProfileStore } = useProfileStore();
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("informacoes");

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: profile as unknown as PerfilCliente
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const perfilData = await getProfileData();
                
                const clienteProfile: ClienteProfile = {
                    id: user?.id || '',
                    userId: user?.id || '',
                    nome: perfilData.nome,
                    email: perfilData.email,
                    telefone: perfilData.telefone,
                    cpf: perfilData.cpf,
                    dataNascimento: perfilData.dataNascimento,
                    endereco: perfilData.endereco,
                    cidade: perfilData.cidade,
                    estado: perfilData.estado,
                    foto: perfilData.fotoPerfil,
                };
                
                updateProfileStore(clienteProfile);
                form.reset(perfilData);
            } catch (err) {
                setError("Não foi possível carregar os dados do perfil");
                console.error(err);
            }
        };

        fetchProfile();
    }, [updateProfileStore, form, user]);

    const onSubmit = async (data: ProfileFormData) => {
        try {
            const updatedProfileData = await updateProfileData(data);

            const updatedProfile: ClienteProfile = {
                id: user?.id || '',
                userId: user?.id || '',
                nome: updatedProfileData.nome,
                email: updatedProfileData.email,
                telefone: updatedProfileData.telefone,
                cpf: updatedProfileData.cpf,
                dataNascimento: updatedProfileData.dataNascimento,
                endereco: updatedProfileData.endereco,
                cidade: updatedProfileData.cidade,
                estado: updatedProfileData.estado,
                foto: updatedProfileData.fotoPerfil,
            };
            
            updateProfileStore(updatedProfile);
            setIsEditing(false);
            toast.success('Perfil atualizado com sucesso!');
        } catch (error) {
            toast.error('Erro ao atualizar perfil');
            console.error(error);
        }
    };

    if (profileLoading) {
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            {isEditing ? (
                                                <Input {...field} />
                                            ) : (
                                                <div className="flex items-start gap-3">
                                                    <MailIcon className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                                                    <p className="text-muted-foreground">{field.value}</p>
                                                </div>
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="telefone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefone</FormLabel>
                                        <FormControl>
                                            {isEditing ? (
                                                <Input {...field} />
                                            ) : (
                                                <div className="flex items-start gap-3">
                                                    <PhoneIcon className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                                                    <p className="text-muted-foreground">{field.value || "Não informado"}</p>
                                                </div>
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dataNascimento"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Nascimento</FormLabel>
                                        <FormControl>
                                            {isEditing ? (
                                                <Input type="date" {...field} />
                                            ) : (
                                                <div className="flex items-start gap-3">
                                                    <CalendarIcon className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                                                    <p className="text-muted-foreground">
                                                        {field.value 
                                                            ? new Date(field.value).toLocaleDateString('pt-BR') 
                                                            : "Não informada"}
                                                    </p>
                                                </div>
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="cpf"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CPF</FormLabel>
                                        <FormControl>
                                            {isEditing ? (
                                                <Input {...field} />
                                            ) : (
                                                <div className="flex items-start gap-3">
                                                    <User className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                                                    <p className="text-muted-foreground">{field.value || "Não informado"}</p>
                                                </div>
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="pt-4 border-t">
                            <h3 className="text-lg font-medium mb-4">Endereço</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="endereco"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Endereço</FormLabel>
                                            <FormControl>
                                                {isEditing ? (
                                                    <Input {...field} />
                                                ) : (
                                                    <div className="flex items-start gap-3">
                                                        <MapPinIcon className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                                                        <p className="text-muted-foreground">{field.value || "Não informado"}</p>
                                                    </div>
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="cidade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cidade</FormLabel>
                                            <FormControl>
                                                {isEditing ? (
                                                    <Input {...field} />
                                                ) : (
                                                    <p className="text-muted-foreground">{field.value || "Não informada"}</p>
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="estado"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estado</FormLabel>
                                            <FormControl>
                                                {isEditing ? (
                                                    <Input {...field} />
                                                ) : (
                                                    <p className="text-muted-foreground">{field.value || "Não informado"}</p>
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <CardFooter className="flex justify-end gap-2 p-0">
                            {isEditing ? (
                                <>
                                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                        <X className="h-4 w-4 mr-2" />
                                        Cancelar
                                    </Button>
                                    <Button type="submit">
                                        <Save className="h-4 w-4 mr-2" />
                                        Salvar
                                    </Button>
                                </>
                            ) : (
                                <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
                                    Editar informações
                                </Button>
                            )}
                        </CardFooter>
                    </form>
                </Form>
            </CardContent>
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
                    {profile && (profile as any).processos && (profile as any).processos.map((processo: any) => (
                        <div key={processo.id} className="flex items-center justify-between p-4 rounded-lg border">
                            <div>
                                <h3 className="font-medium">{processo.titulo}</h3>
                                <div className="flex items-center gap-1 mt-1">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{processo.data}</span>
                                </div>
                            </div>
                            <Badge variant={processo.status === "Ativo" ? "outline" : "default"}>
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
                    {profile!.documentos.map((documento: { id: Key | null | undefined; nome: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                        <div key={documento.id} className="flex items-center justify-between p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <FileIcon className="h-8 w-8 text-secondary" />
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
            <div className="h-24 bg-gradient-to-r from-primary to-primary/60"></div>
            <CardContent className="-mt-16 pb-6">
                <div className="flex flex-col items-center">
                    <Avatar className="h-32 w-32 border-4 border-background">
                        <div className="h-full w-full flex items-center justify-center">
                            {profile?.fotoPerfil ? (
                                <div className="relative h-full w-full">
                                    <Image
                                        src={profile.fotoPerfil} 
                                        alt={profile?.nome || 'Usuário'} 
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="text-4xl bg-primary/10 h-full w-full flex items-center justify-center">
                                    {profile?.nome?.charAt(0) ?? '?'}
                                </div>
                            )}
                        </div>
                    </Avatar>
                    <h2 className="mt-3 text-2xl font-bold">{profile?.nome || 'Usuário'}</h2>
                    <p className="text-muted-foreground">Cliente</p>

                    <div className="flex gap-3 mt-4">
                        <Button size="sm" variant="outline" asChild>
                            <Link href="/perfil/editar">Editar Perfil</Link>
                        </Button>
                        <Button size="sm" variant="outline">Mensagens</Button>
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
                        <p className="text-3xl font-bold">{profile?.processosAtivos || 0}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/10">
                        <h3 className="font-medium text-muted-foreground">Finalizados</h3>
                        <p className="text-3xl font-bold">{profile?.processosFinalizados || 0}</p>
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
                    ? "border-b-2 border-primary text-secondary" 
                    : "text-muted-foreground hover:text-foreground"}`}
            >
                Informações
            </button>
            <button
                onClick={() => setActiveTab("processos")}
                className={`py-2 px-4 font-medium text-sm transition-colors ${activeTab === "processos" 
                    ? "border-b-2 border-primary text-secondary" 
                    : "text-muted-foreground hover:text-foreground"}`}
            >
                Processos
            </button>
            <button
                onClick={() => setActiveTab("documentos")}
                className={`py-2 px-4 font-medium text-sm transition-colors ${activeTab === "documentos" 
                    ? "border-b-2 border-primary text-secondary" 
                    : "text-muted-foreground hover:text-foreground"}`}
            >
                Documentos
            </button>
        </div>
    );

    return (
        <div className="p-3 pt-0 bg-background">
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