"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon,  MapPinIcon, MailIcon, PhoneIcon, User, Save, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getProfileData, updateProfileData, UserDadosDTO } from '@/services/user/profileService';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormData } from "@/schemas/profileSchema";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import toast from "react-hot-toast";
import { useProfileStore, useAuthStore, useProcessoStore } from "@/store";
import { ClienteProfile, AdvogadoProfile } from "@/types/entities/Profile";
import { StatusProcesso, getEspecialidadeLabel } from "@/types/enums";
import { Configs } from "@/components/perfil/configs";
import { updateClienteProfile } from "@/services/cliente/clienteService";
import { updateAdvogadoProfile } from "@/services/advogado/advogadoService";

export function DadosUsuario() {
    const { profile, isLoading: profileLoading, updateProfile: updateProfileStore } = useProfileStore();
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("informacoes");

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: profile as unknown as ClienteProfile
    });

    const isAdvogado = profile && 'oab' in profile;

    // processos da store (declarar antes de qualquer return condicional)
    const { processosCliente, processosAdvogado, carregarProcessosCliente, carregarProcessosAdvogado } = useProcessoStore();


    const fetchProfile = async () => {
        try {
            const perfilData: UserDadosDTO = await getProfileData();
            if (perfilData.advogado) {
                // É advogado
                const advogadoProfile: AdvogadoProfile = {
                    id: perfilData.advogado.id.toString(),
                    userId: perfilData.advogado.id.toString(),
                    nome: perfilData.advogado.nome,
                    email: perfilData.email,
                    telefone: perfilData.advogado.telefone,
                    cpf: perfilData.advogado.cpf,
                    dataNascimento: perfilData.advogado.dataNascimento,
                    rua: perfilData.endereco?.rua,
                    numero: perfilData.endereco?.numero,
                    complemento: perfilData.endereco?.complemento,
                    bairro: perfilData.endereco?.bairro,
                    cidade: perfilData.endereco?.cidade,
                    estado: perfilData.endereco?.estado,
                    cep: perfilData.endereco?.cep,
                    foto: undefined, // TODO: add fotoPerfil if available
                    oab: perfilData.advogado.oab,
                    bio: perfilData.advogado.bio,
                    especialidades: perfilData.advogado.especialidades,
                };
                
                updateProfileStore(advogadoProfile);

                form.reset({
                    id: advogadoProfile.id || "",
                    nome: advogadoProfile.nome || "",
                    email: advogadoProfile.email || "",
                    telefone: advogadoProfile.telefone || "",
                    cpf: advogadoProfile.cpf || "",
                    dataNascimento: advogadoProfile.dataNascimento || "",
                    rua: advogadoProfile.rua || "",
                    numero: advogadoProfile.numero || "",
                    complemento: advogadoProfile.complemento || "",
                    bairro: advogadoProfile.bairro || "",
                    cidade: advogadoProfile.cidade || "",
                    estado: advogadoProfile.estado || "",
                    cep: advogadoProfile.cep || "",
                    fotoPerfil: undefined
                });
            } else {
                // É cliente
                const clienteProfile: ClienteProfile = {
                    id: perfilData.cliente?.id?.toString() || '',
                    userId: perfilData.cliente?.id?.toString() || '',
                    nome: perfilData.nome,
                    email: perfilData.email,
                    telefone: perfilData.telefone,
                    cpf: perfilData.cpf,
                    dataNascimento: perfilData.dataNascimento,
                    rua: perfilData.endereco?.rua,
                    numero: perfilData.endereco?.numero,
                    complemento: perfilData.endereco?.complemento,
                    bairro: perfilData.endereco?.bairro,
                    cidade: perfilData.endereco?.cidade,
                    estado: perfilData.endereco?.estado,
                    cep: perfilData.endereco?.cep,
                    foto: undefined, // TODO: add fotoPerfil if available
                };
                
                updateProfileStore(clienteProfile);
                
                // Reset form with cliente data
                const formData = {
                    id: clienteProfile.id,
                    nome: perfilData.nome,
                    email: perfilData.email,
                    telefone: perfilData.telefone,
                    cpf: perfilData.cpf,
                    dataNascimento: perfilData.dataNascimento,
                    endereco: perfilData.endereco ? `${perfilData.endereco.numero || ''} ${perfilData.endereco.complemento || ''} ${perfilData.endereco.bairro || ''}`.trim() : '',
                    cidade: perfilData.endereco?.cidade || '',
                    estado: perfilData.endereco?.estado || '',
                    fotoPerfil: undefined,
                };
                form.reset(formData);
            }
        } catch (err) {
            setError("Não foi possível carregar os dados do perfil");
            console.error(err);
        }
    };

    async function updateCliente(data: ProfileFormData) {
        const payload = {
            id: data.id ?? "",
            nome: data.nome,
            telefone: data.telefone ?? "",
            cpf: data.cpf ?? "",
            dataNascimento: data.dataNascimento ?? "",
            endereco: {
                rua: data.rua ?? "",
                numero: data.numero ?? "",
                complemento: data.complemento ?? "",
                bairro: data.bairro ?? "",
                cidade: data.cidade ?? "",
                estado: data.estado ?? "",
                cep: data.cep ?? ""
            }
        };

        await updateClienteProfile(payload);
        return payload;
    }

    async function updateAdvogado(data: ProfileFormData) {
        const payload = {
            id: data.id ?? "",
            nome: data.nome ?? "",
            cpf: data.cpf ?? "",
            email: data.email ?? "",
            endereco: {
                rua: data.rua ?? "",
                numero: data.numero ?? "",
                complemento: data.complemento ?? "",
                bairro: data.bairro ?? "",
                cidade: data.cidade ?? "",
                estado: data.estado ?? "",
                cep: data.cep ?? ""
            },
            dadosContato: {
                telefone: data.telefone ?? ""
            },
            dataNascimento: data.dataNascimento ?? ""
        };

        await updateAdvogadoProfile(payload);
        return payload;
    }


    // Carregar processos quando o componente monta ou quando o tipo de perfil/usuário muda
    useEffect(() => {
        const carregar = async () => {
            if (!user) return;
            try {
                if (isAdvogado) {
                    await carregarProcessosAdvogado();
                } else {
                    await carregarProcessosCliente();
                }
            } catch (err) {
                console.error('Erro ao carregar processos na tela de perfil:', err);
            }
        };

        carregar();
    }, [user, isAdvogado, carregarProcessosCliente, carregarProcessosAdvogado]);

    const onSubmit = async (data: ProfileFormData) => {
    try {
        let updatedProfileData;

        if (isAdvogado) {

            updatedProfileData = await updateAdvogado(data);

            const updatedProfile: AdvogadoProfile = {
                ...(profile as AdvogadoProfile),
                nome: updatedProfileData.nome,
                email: updatedProfileData.email,
                telefone: updatedProfileData.dadosContato.telefone,
                cpf: updatedProfileData.cpf,
                dataNascimento: updatedProfileData.dataNascimento,
                rua: updatedProfileData.endereco.rua,
                numero: updatedProfileData.endereco.numero,
                complemento: updatedProfileData.endereco.complemento,
                bairro: updatedProfileData.endereco.bairro,
                cidade: updatedProfileData.endereco.cidade,
                estado: updatedProfileData.endereco.estado,
                cep: updatedProfileData.endereco.cep
            };

            updateProfileStore(updatedProfile);

        } else {
            updatedProfileData = await updateCliente(data);

            const updatedProfile: ClienteProfile = {
                id: user?.id || '',
                userId: user?.id || '',
                nome: updatedProfileData.nome,
                email: '',
                telefone: updatedProfileData.telefone,
                cpf: updatedProfileData.cpf,
                dataNascimento: updatedProfileData.dataNascimento,
                rua: updatedProfileData.endereco.rua,
                numero: updatedProfileData.endereco.numero,
                complemento: updatedProfileData.endereco.complemento,
                bairro: updatedProfileData.endereco.bairro,
                cidade: updatedProfileData.endereco.cidade,
                estado: updatedProfileData.endereco.estado,
                cep: updatedProfileData.endereco.cep
            };

            updateProfileStore(updatedProfile);
        }

        setIsEditing(false);
        toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
        console.error(error);
        toast.error("Erro ao atualizar perfil");
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

                            {isAdvogado && (
                                <div>
                                    <FormLabel>OAB</FormLabel>
                                    <div className="flex items-start gap-3 mt-2">
                                        <User className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                                        <p className="text-muted-foreground">{(profile as AdvogadoProfile).oab || "Não informado"}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {isAdvogado && (
                            <div className="pt-4 border-t">
                                <h3 className="text-lg font-medium mb-4">Informações Profissionais</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <FormLabel>Especialidades</FormLabel>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {(profile as AdvogadoProfile).especialidades?.map((esp, index) => (
                                                <Badge key={index} variant="outline">{getEspecialidadeLabel(esp)}</Badge>
                                            )) || <p className="text-muted-foreground">Nenhuma especialidade informada</p>}
                                        </div>
                                    </div>

                                    {(profile as AdvogadoProfile).bio && (
                                        <div>
                                            <FormLabel>Biografia</FormLabel>
                                            <p className="text-muted-foreground mt-2">{(profile as AdvogadoProfile).bio}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t">
                        <h3 className="text-lg font-medium mb-4">Endereço</h3>

                        {/* GRID PRINCIPAL */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* CEP */}
                            <FormField
                            control={form.control}
                            name="cep"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>CEP</FormLabel>
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

                            {/* Estado */}
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

                            {/* Cidade */}
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

                            {/* Bairro */}
                            <FormField
                            control={form.control}
                            name="bairro"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Bairro</FormLabel>
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

                            {/* Rua — ocupa 2 colunas */}
                            <FormField
                            control={form.control}
                            name="rua"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Rua</FormLabel>
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

                            {/* Número */}
                            <FormField
                            control={form.control}
                            name="numero"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Número</FormLabel>
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

                            {/* Complemento */}
                            <FormField
                            control={form.control}
                            name="complemento"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Complemento</FormLabel>
                                <FormControl>
                                    {isEditing ? (
                                    <Input {...field} />
                                    ) : (
                                    <p className="text-muted-foreground">{field.value || "—"}</p>
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
                                    <Button type="submit"variant={"primary"}>
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

    // Função que seleciona a tab correta
    const renderTabContent = () => {
        switch (activeTab) {
            case "informacoes":
                return renderInformacoesTab();
            case "configuracoes":
                return renderConfiguracoesTab();
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
                    <p className="text-muted-foreground">{isAdvogado ? 'Advogado' : 'Cliente'}</p>
                </div>
            </CardContent>
        </Card>
    );

    // Função para renderizar o card de estatísticas
    const renderEstastisticas = () => (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Estatísticas de Processos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {(() => {
                    const processos = isAdvogado ? processosAdvogado : processosCliente;
                    const total = processos?.length || 0;
                    const finalizados = (processos || []).filter(p => p.status === StatusProcesso.CONCLUIDO).length;

                    return (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-primary/10">
                                <h3 className="font-medium text-muted-foreground">Total</h3>
                                <p className="text-3xl font-bold">{total}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-primary/10">
                                <h3 className="font-medium text-muted-foreground">Finalizados</h3>
                                <p className="text-3xl font-bold">{finalizados}</p>
                            </div>
                        </div>
                    );
                })()}
            </CardContent>
        </Card>
    );

    const renderConfiguracoesTab = () => (
        <Configs />

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
            {/* <button
                onClick={() => setActiveTab("processos")}
                className={`py-2 px-4 font-medium text-sm transition-colors ${activeTab === "processos" 
                    ? "border-b-2 border-primary text-secondary" 
                    : "text-muted-foreground hover:text-foreground"}`}
            >
                Processos
            </button> */}
            <button
                onClick={() => setActiveTab("configuracoes")}
                className={`py-2 px-4 font-medium text-sm transition-colors ${activeTab === "configuracoes" 
                    ? "border-b-2 border-primary text-secondary" 
                    : "text-muted-foreground hover:text-foreground"}`}
            >
                Configurações
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