import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EditarClienteMobile() {
  const [selectedSection, setSelectedSection] = useState<"personal" | "address">("personal");
  const [personalData, setPersonalData] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    email: ""
  });
  const [addressData, setAddressData] = useState({
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: ""
  });

  const handleSavePersonal = () => {
    console.log("Dados Pessoais:", personalData);
  };

  const handleSaveAddress = () => {
    console.log("Endereço:", addressData);
  };

  return (
    <div className="p-4">
      <Select onValueChange={(value: "personal" | "address") => setSelectedSection(value)}>
        <SelectTrigger className="w-full mb-4">
          <SelectValue placeholder="Selecione uma seção" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="personal">Informações Pessoais</SelectItem>
          <SelectItem value="address">Endereço</SelectItem>
        </SelectContent>
      </Select>

      {selectedSection === "personal" && (
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Nome Completo</Label>
                <Input placeholder="Nome Completo" value={personalData.nome} onChange={(e) => setPersonalData({ ...personalData, nome: e.target.value })} />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input placeholder="Telefone" value={personalData.telefone} onChange={(e) => setPersonalData({ ...personalData, telefone: e.target.value })} />
              </div>
              <div>
                <Label>CPF</Label>
                <Input placeholder="CPF" value={personalData.cpf} onChange={(e) => setPersonalData({ ...personalData, cpf: e.target.value })} />
              </div>
              <div>
                <Label>Data de Nascimento</Label>
                <Input type="date" value={personalData.dataNascimento} onChange={(e) => setPersonalData({ ...personalData, dataNascimento: e.target.value })} />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input placeholder="E-mail" value={personalData.email} onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })} />
              </div>
            </div>
          </CardContent>
          <Button className="w-full mt-4 bg-secondary text-secondary-foreground" onClick={handleSavePersonal}>Salvar</Button>
        </Card>
      )}

      {selectedSection === "address" && (
        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Logradouro</Label>
                <Input placeholder="Logradouro" value={addressData.logradouro} onChange={(e) => setAddressData({ ...addressData, logradouro: e.target.value })} />
              </div>
              <div>
                <Label>Número</Label>
                <Input placeholder="Número" value={addressData.numero} onChange={(e) => setAddressData({ ...addressData, numero: e.target.value })} />
              </div>
              <div>
                <Label>Complemento</Label>
                <Input placeholder="Complemento" value={addressData.complemento} onChange={(e) => setAddressData({ ...addressData, complemento: e.target.value })} />
              </div>
              <div>
                <Label>Bairro</Label>
                <Input placeholder="Bairro" value={addressData.bairro} onChange={(e) => setAddressData({ ...addressData, bairro: e.target.value })} />
              </div>
              <div>
                <Label>Cidade</Label>
                <Input placeholder="Cidade" value={addressData.cidade} onChange={(e) => setAddressData({ ...addressData, cidade: e.target.value })} />
              </div>
              <div>
                <Label>Estado</Label>
                <Input placeholder="Estado" value={addressData.estado} onChange={(e) => setAddressData({ ...addressData, estado: e.target.value })} />
              </div>
            </div>
          </CardContent>
          <Button className="w-full mt-4 bg-secondary text-secondary-foreground" onClick={handleSaveAddress}>Salvar</Button>
        </Card>
      )}
    </div>
  );
}