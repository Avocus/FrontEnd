import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export function EditarAdvogadoWeb() {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    email: "",
    numeroOAB: "",
    areaAtuacao: "",
    formacao: "",
    nomeFaculdade: "",
    bio: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    console.log(formData);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Editar Advogado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Coluna 1 */}
            <div className="space-y-4">
              <div>
                <Label>Nome Completo</Label>
                <Input name="nomeCompleto" placeholder="Nome Completo" onChange={handleChange} />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input name="telefone" placeholder="Telefone" onChange={handleChange} />
              </div>
              <div>
                <Label>CPF</Label>
                <Input name="cpf" placeholder="CPF" onChange={handleChange} />
              </div>
              <div>
                <Label>Data de Nascimento</Label>
                <Input name="dataNascimento" type="date" onChange={handleChange} />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input name="email" placeholder="E-mail" onChange={handleChange} />
              </div>
              <div>
                <Label>Número da OAB</Label>
                <Input name="numeroOAB" placeholder="Número da OAB" onChange={handleChange} />
              </div>
              <div>
                <Label>Área de Atuação</Label>
                <Input name="areaAtuacao" placeholder="Área de Atuação" onChange={handleChange} />
              </div>
              <div>
                <Label>Formação</Label>
                <Input name="formacao" placeholder="Formação" onChange={handleChange} />
              </div>
            </div>
            

            {/* Coluna 2 */}
            <div className="space-y-4">
              <div>
                <Label>Nome da Faculdade</Label>
                <Input name="nomeFaculdade" placeholder="Nome da Faculdade" onChange={handleChange} />
              </div>
              <div>
                <Label>Bio</Label>
                <Input name="bio" placeholder="Bio" onChange={handleChange} />
              </div>
              <div>
                <Label>Logradouro</Label>
                <Input name="logradouro" placeholder="Logradouro" onChange={handleChange} />
              </div>
              <div>
                <Label>Número</Label>
                <Input name="numero" placeholder="Número" onChange={handleChange} />
              </div>
              <div>
                <Label>Complemento</Label>
                <Input name="complemento" placeholder="Complemento" onChange={handleChange} />
              </div>
              <div>
                <Label>Bairro</Label>
                <Input name="bairro" placeholder="Bairro" onChange={handleChange} />
              </div>
              <div>
                <Label>Cidade</Label>
                <Input name="cidade" placeholder="Cidade" onChange={handleChange} />
              </div>
              <div>
                <Label>Estado</Label>
                <Input name="estado" placeholder="Estado" onChange={handleChange} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Button className="w-full mt-4 bg-secondary text-secondary-foreground" onClick={handleSubmit}>Salvar</Button>
    </div>
  );
}