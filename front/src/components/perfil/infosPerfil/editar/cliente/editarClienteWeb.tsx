import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getClienteProfile, updateClienteProfile } from "@/services/cliente/clienteService";
import { CalendarIcon, MapPin, Mail, Phone, User, Home, Building } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export function EditarClienteWeb() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pessoal");
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    email: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    fotoPerfil: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getClienteProfile();
        
        // Adaptação de dados do backend para o formulário
        const enderecoCompleto = data.endereco || "";
        const numeroParte = enderecoCompleto.match(/,\s*(\d+)/);
        const numero = numeroParte ? numeroParte[1] : "";
        
        setFormData({
          nome: data.nome || "",
          email: data.email || "",
          telefone: data.telefone || "",
          cpf: data.cpf || "",
          dataNascimento: data.dataNascimento || "",
          endereco: enderecoCompleto.replace(/,\s*\d+.*$/, "") || "",
          numero: numero,
          complemento: "",
          bairro: "",
          cidade: data.cidade || "",
          estado: data.estado || "",
          fotoPerfil: data.fotoPerfil || ""
        });
      } catch (err) {
        setError("Não foi possível carregar os dados do perfil");
        console.error(err);
        
        // Dados mockados para testes
        setFormData({
          nome: "João Silva",
          email: "joao.silva@example.com",
          telefone: "(11) 98765-4321",
          cpf: "123.456.789-00",
          dataNascimento: "1990-05-15",
          endereco: "Rua Exemplo",
          numero: "123",
          complemento: "Apto 45",
          bairro: "Centro",
          cidade: "São Paulo",
          estado: "SP",
          fotoPerfil: ""
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      
      // Formatação do endereço completo
      const enderecoCompleto = `${formData.endereco}, ${formData.numero}${formData.complemento ? `, ${formData.complemento}` : ''}${formData.bairro ? `, ${formData.bairro}` : ''}`;
      
      const dataToUpdate = {
        nome: formData.nome,
        telefone: formData.telefone,
        cpf: formData.cpf,
        dataNascimento: formData.dataNascimento,
        endereco: enderecoCompleto,
        cidade: formData.cidade,
        estado: formData.estado,
      };
      
      await updateClienteProfile(dataToUpdate);
      
      // Implementar feedback de sucesso aqui
      alert("Perfil atualizado com sucesso!");
      
      // Redirecionar para página do perfil
      router.push("/perfil");
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError("Não foi possível atualizar o perfil. Tente novamente.");
      
      // Implementar feedback de erro aqui
      alert("Erro ao atualizar o perfil. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "pessoal":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize seus dados de identificação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground shrink-0 mt-2" />
                  <div className="w-full">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input 
                      id="nome" 
                      name="nome" 
                      value={formData.nome} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-2" />
                  <div className="w-full">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email"
                      value={formData.email} 
                      onChange={handleChange} 
                      disabled 
                    />
                    <p className="text-xs text-muted-foreground mt-1">O e-mail não pode ser alterado</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-2" />
                  <div className="w-full">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input 
                      id="telefone" 
                      name="telefone" 
                      value={formData.telefone} 
                      onChange={handleChange} 
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-muted-foreground shrink-0 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                  </svg>
                  <div className="w-full">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input 
                      id="cpf" 
                      name="cpf" 
                      value={formData.cpf} 
                      onChange={handleChange} 
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-2" />
                  <div className="w-full">
                    <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                    <Input 
                      id="dataNascimento" 
                      name="dataNascimento" 
                      type="date" 
                      value={formData.dataNascimento} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case "endereco":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
              <CardDescription>Atualize suas informações de localização</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3">
                  <Home className="h-5 w-5 text-muted-foreground shrink-0 mt-2" />
                  <div className="w-full">
                    <Label htmlFor="endereco">Logradouro</Label>
                    <Input 
                      id="endereco" 
                      name="endereco" 
                      value={formData.endereco} 
                      onChange={handleChange} 
                      placeholder="Rua, Avenida, etc."
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-2" />
                    <div className="w-full">
                      <Label htmlFor="numero">Número</Label>
                      <Input 
                        id="numero" 
                        name="numero" 
                        value={formData.numero} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 pl-8">
                    <div className="w-full">
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input 
                        id="complemento" 
                        name="complemento" 
                        value={formData.complemento} 
                        onChange={handleChange} 
                        placeholder="Apto, Bloco, etc."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-2" />
                  <div className="w-full">
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input 
                      id="bairro" 
                      name="bairro" 
                      value={formData.bairro} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-muted-foreground shrink-0 mt-2" />
                    <div className="w-full">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input 
                        id="cidade" 
                        name="cidade" 
                        value={formData.cidade} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 pl-8">
                    <div className="w-full">
                      <Label htmlFor="estado">Estado</Label>
                      <Input 
                        id="estado" 
                        name="estado" 
                        value={formData.estado} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-background">
      {error && (
        <div className="mb-4 p-3 bg-destructive/20 text-destructive rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Editar Perfil</h1>
          <Button variant="outline" asChild>
            <Link href="/perfil">Voltar ao perfil</Link>
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Seção da foto e informações básicas */}
          <div className="w-full md:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Sua Foto</CardTitle>
                <CardDescription>Atualize sua foto de perfil</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="h-32 w-32 rounded-full border-4 border-background overflow-hidden mb-4">
                  {formData.fotoPerfil ? (
                    <img src={formData.fotoPerfil} alt={formData.nome} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary/10 text-4xl">
                      {formData.nome.charAt(0)}
                    </div>
                  )}
                </div>
                <Button className="w-full" variant="outline">Carregar nova foto</Button>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Dicas</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Mantenha seu perfil atualizado para garantir um melhor atendimento</p>
                <p>• Adicione um número de telefone para contato fácil</p>
                <p>• Seu CPF é usado apenas para identificação interna</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Seção com as informações de cadastro */}
          <div className="w-full md:w-2/3">
            {/* Tabs customizadas sem Radix */}
            <div className="w-full">
              <div className="flex border-b space-x-4">
                <button
                  onClick={() => setActiveTab("pessoal")}
                  className={`py-2 px-4 font-medium text-sm transition-colors ${activeTab === "pessoal" 
                    ? "border-b-2 border-primary text-primary" 
                    : "text-muted-foreground hover:text-foreground"}`}
                >
                  Dados Pessoais
                </button>
                <button
                  onClick={() => setActiveTab("endereco")}
                  className={`py-2 px-4 font-medium text-sm transition-colors ${activeTab === "endereco" 
                    ? "border-b-2 border-primary text-primary" 
                    : "text-muted-foreground hover:text-foreground"}`}
                >
                  Endereço
                </button>
              </div>
              <div className="mt-4">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-2 justify-end">
          <Button variant="outline" asChild>
            <Link href="/perfil">Cancelar</Link>
          </Button>
          <Button className="bg-primary" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></span>
                Salvando...
              </>
            ) : (
              "Salvar alterações"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}