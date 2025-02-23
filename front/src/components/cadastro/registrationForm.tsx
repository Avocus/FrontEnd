"use client"

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pagination } from "./pagination";

interface RegistrationFormProps {
  userType: "client" | "lawyer";
}

interface FormData {
  nomeCompleto: string;
  telefone: string;
  cpf: string;
  dataNascimento: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  oab?: string;
  areaAtuacao?: string;
  formacao?: string;
  faculdade?: string;
  bio?: string;
}

export function RegistrationForm({ userType }: RegistrationFormProps) {
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>();
  const [step, setStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  const formData = watch();

  useEffect(() => {
    const requiredFields = getRequiredFieldsForStep(step);
    const isStepValid = requiredFields.every((field) => formData[field as keyof FormData] !== "");
    setIsNextDisabled(!isStepValid);
  }, [step, formData]);

  useEffect(() => {
    if (formData.cep?.length === 8) {
      fetch(`https://viacep.com.br/ws/${formData.cep}/json/`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.erro) {
            setValue("logradouro", data.logradouro);
            setValue("bairro", data.bairro);
            setValue("cidade", data.localidade);
            setValue("estado", data.uf);
          }
        });
    }
  }, [formData.cep, setValue]);

  const getRequiredFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ["nomeCompleto", "telefone", "cpf", "dataNascimento"];
      case 2:
        return ["cep", "logradouro", "numero", "bairro", "cidade", "estado"];
      case 3:
        return userType === "lawyer" ? ["oab", "areaAtuacao", "formacao", "faculdade"] : [];
      default:
        return [];
    }
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrevious = () => setStep((prev) => prev - 1);

  const onSubmit = (data: FormData) => {
    if (userType === "client") {
      delete data.oab;
      delete data.areaAtuacao;
      delete data.formacao;
      delete data.faculdade;
      delete data.bio;
    }
    console.log(JSON.stringify(data, null, 2));
    // Aqui você pode enviar o JSON para o backend
  };

  const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;

    return true;
  };

  const validateAge = (date: string) => {
    const birthDate = new Date(date);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age >= 18;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Cadastro de {userType === "client" ? "Cliente" : "Advogado"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Dados Pessoais</h2>
              <Controller
                name="nomeCompleto"
                control={control}
                rules={{ required: "Nome completo é obrigatório" }}
                render={({ field }) => <Input {...field} placeholder="Nome Completo" />}
              />
              {errors.nomeCompleto && <span>{errors.nomeCompleto.message}</span>}
              <Controller
                name="telefone"
                control={control}
                rules={{ required: "Telefone é obrigatório" }}
                render={({ field }) => <Input {...field} placeholder="Telefone" />}
              />
              {errors.telefone && <span>{errors.telefone.message}</span>}
              <Controller
                name="cpf"
                control={control}
                rules={{ required: "CPF é obrigatório", validate: validateCPF }}
                render={({ field }) => <Input {...field} placeholder="CPF" />}
              />
              {errors.cpf && <span>{errors.cpf.message}</span>}
              <Controller
                name="dataNascimento"
                control={control}
                rules={{ required: "Data de nascimento é obrigatória", validate: validateAge }}
                render={({ field }) => <Input {...field} type="date" placeholder="Data de Nascimento" />}
              />
              {errors.dataNascimento && <span>{errors.dataNascimento.message}</span>}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Endereço</h2>
              <Controller
                name="cep"
                control={control}
                rules={{ required: "CEP é obrigatório" }}
                render={({ field }) => <Input {...field} placeholder="CEP" />}
              />
              {errors.cep && <span>{errors.cep.message}</span>}
              <Controller
                name="logradouro"
                control={control}
                rules={{ required: "Logradouro é obrigatório" }}
                render={({ field }) => <Input {...field} placeholder="Logradouro" />}
              />
              {errors.logradouro && <span>{errors.logradouro.message}</span>}
              <Controller
                name="numero"
                control={control}
                rules={{ required: "Número é obrigatório" }}
                render={({ field }) => <Input {...field} placeholder="Número" />}
              />
              {errors.numero && <span>{errors.numero.message}</span>}
              <Controller
                name="complemento"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Complemento" />}
              />
              <Controller
                name="bairro"
                control={control}
                rules={{ required: "Bairro é obrigatório" }}
                render={({ field }) => <Input {...field} placeholder="Bairro" />}
              />
              {errors.bairro && <span>{errors.bairro.message}</span>}
              <Controller
                name="cidade"
                control={control}
                rules={{ required: "Cidade é obrigatória" }}
                render={({ field }) => <Input {...field} placeholder="Cidade" />}
              />
              {errors.cidade && <span>{errors.cidade.message}</span>}
              <Controller
                name="estado"
                control={control}
                rules={{ required: "Estado é obrigatório" }}
                render={({ field }) => (
                  <Select {...field} onValueChange={(value) => setValue("estado", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Adicione os estados brasileiros aqui */}
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      {/* ... */}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.estado && <span>{errors.estado.message}</span>}
            </div>
          )}

          {step === 3 && userType === "lawyer" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Informações Adicionais</h2>
              <Controller
                name="oab"
                control={control}
                rules={{ required: "Número da OAB é obrigatório" }}
                render={({ field }) => <Input {...field} placeholder="Número da OAB" />}
              />
              {errors.oab && <span>{errors.oab.message}</span>}
              <Controller
                name="areaAtuacao"
                control={control}
                rules={{ required: "Área de atuação é obrigatória" }}
                render={({ field }) => <Input {...field} placeholder="Área de Atuação" />}
              />
              {errors.areaAtuacao && <span>{errors.areaAtuacao.message}</span>}
              <Controller
                name="formacao"
                control={control}
                rules={{ required: "Formação é obrigatória" }}
                render={({ field }) => <Input {...field} placeholder="Formação" />}
              />
              {errors.formacao && <span>{errors.formacao.message}</span>}
              <Controller
                name="faculdade"
                control={control}
                rules={{ required: "Faculdade é obrigatória" }}
                render={({ field }) => <Input {...field} placeholder="Faculdade" />}
              />
              {errors.faculdade && <span>{errors.faculdade.message}</span>}
              <Controller
                name="bio"
                control={control}
                render={({ field }) => <Textarea {...field} placeholder="Bio" />}
              />
            </div>
          )}

          <Pagination currentStep={step} totalSteps={userType === "lawyer" ? 3 : 2} onNext={handleNext} onPrevious={handlePrevious} isNextDisabled={isNextDisabled} />

          {step === (userType === "lawyer" ? 3 : 2) && (
            <Button className="w-full mt-4" type="submit">
              Finalizar Cadastro
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}