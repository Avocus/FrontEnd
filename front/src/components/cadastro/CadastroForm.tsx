"use client"

import { cn } from "../../lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCallback, useState, useEffect, type FocusEvent } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cadastroSchema, type CadastroFormData } from '../../schemas/cadastroSchema';
import { cadastrarUsuario } from '../../services/user/cadastroService';
import { useRouter } from "next/navigation"
import { getErrorMessage } from '@/utils/formValidation';
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { UserTypeSelector } from './UserTypeSelector';
import { PasswordRequirements } from './PasswordRequirements';
import { useToast } from '../../hooks/useToast';
import { getFieldValidationClass } from '../../utils/formValidation';

type InviteData = { isInvite: boolean; token: string } | null;

export function CadastroForm({
  className,
  inviteData,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { 
  inviteData?: InviteData;
}) {
  const [cadastroError, setCadastroError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const { success, error: showError } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields, dirtyFields },
    setValue,
    watch
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: inviteData ? "cliente" : undefined,
      cpf: "",
      oab: "",
      dateOfBirth: "",
      phone: "",
      address: {
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        pais: "",
        cep: "",
        complemento: "",
      }
    }
  });

  useEffect(() => {
    if (inviteData?.isInvite) {
      setValue("role", "cliente");
    }
  }, [inviteData, setValue]);

  const selectedRole = inviteData?.isInvite ? "cliente" : watch("role");
  const passwordValue = watch("password");

  const getFieldValidationClassLocal = (fieldName: keyof CadastroFormData) => {
    const isTouched = touchedFields[fieldName];
    const hasError = errors[fieldName];
    const isDirty = dirtyFields[fieldName];
    
    if (fieldName === 'confirmPassword') {
      const passwordValue = watch("password");
      const confirmValue = watch("confirmPassword");
      const confirmTouched = touchedFields.confirmPassword;
      const passwordTouched = touchedFields.password;
      
      if (!confirmTouched || !passwordTouched) return "";
      
      const matches = confirmValue === passwordValue && confirmValue.length > 0;
      
      if (hasError || !matches) return "border-red-500 focus:border-red-500";
      if (matches) return "border-green-500 focus:border-green-500";
      
      return "";
    }
    
    if (fieldName === 'role' && inviteData?.isInvite) {
      return "";
    }
    
    return getFieldValidationClass(!!isTouched, !!hasError, !!isDirty);
  };

  const handleUserTypeChange = (type: "cliente" | "advogado") => {
    setValue("role", type, { shouldValidate: true });
  };

  const handleCepBlur = async (rawCep?: string) => {
    const cep = (rawCep || "").replace(/\D/g, "");
    if (!cep || cep.length !== 8) return;

    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!res.ok) {
        showError("Erro ao buscar CEP");
        return;
      }

      const data = await res.json();
      if (data.erro) {
        showError("CEP não encontrado");
        return;
      }

      // Preencher campos do endereço com base na resposta
      setValue("address.rua", data.logradouro || "");
      setValue("address.bairro", data.bairro || "");
      setValue("address.cidade", data.localidade || "");
      setValue("address.estado", data.uf || "");
      setValue("address.complemento", data.complemento || "");
      setValue("address.pais", "Brasil");
    } catch (err) {
      showError("Erro ao consultar CEP");
      console.error("Erro ao consultar CEP:", err);
    } finally {
      setCepLoading(false);
    }
  };

  const onSubmit = useCallback(async (data: CadastroFormData) => {
    setIsLoading(true);
    
    const finalData = inviteData 
      ? { ...data, role: "cliente" as const }
      : data;

    const cadastroData = {
      name: finalData.name,
      client: finalData.role === "cliente",
      username: finalData.email,
      password: finalData.password,
      inviteToken: inviteData?.token,
      cpf: finalData.cpf,
      oab: finalData.oab,
      dateOfBirth: finalData.dateOfBirth,
      phone: finalData.phone,
      address: finalData.address,
    };

    try {
      await cadastrarUsuario(cadastroData);
      setCadastroError(null);
      success("Cadastro realizado com sucesso!");
      router.push('/login');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "Erro ao fazer cadastro. Tente novamente.");
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [inviteData, success, router, showError]);

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <Card>
        <CardHeader className="text-center p-4">
          <CardTitle className="text-xl mb-5">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              className="absolute left-4 top-4"
              onClick={() => router.push("/login")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>  
            <span>
              {inviteData?.isInvite ? "Cadastro de Cliente" : "AVOCUSS"}
            </span>
          </CardTitle>
          {inviteData?.isInvite && (
            <p className="text-sm text-foreground/80">
              Você foi convidado para se cadastrar como cliente
            </p>
          )}
        </CardHeader>
        <CardContent className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              {cadastroError && <span className="text-red-500 text-sm">{cadastroError}</span>}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Seleção de Tipo de Usuário - só mostrar se não for convite */}
                {!inviteData && (
                  <div className="md:col-span-2">
                    <UserTypeSelector selectedRole={selectedRole} onChange={handleUserTypeChange} />
                    {errors.role && <span className="text-red-500 text-sm">{errors.role.message}</span>}
                  </div>
                )}

                {/* Campo Nome */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    className={getFieldValidationClassLocal("name")}
                    {...register("name")} 
                  />
                  <div className="min-h-[20px]">
                    {errors.name && touchedFields.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                  </div>
                </div>

                {/* Campo Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className={getFieldValidationClassLocal("email")}
                    {...register("email")}
                  />
                  <div className="min-h-[20px]">
                    {errors.email && touchedFields.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                  </div>
                </div>

                {/* Campos adicionais: CPF, OAB (condicional), Data de Nascimento, Telefone */}
                <div className="grid gap-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" type="text" {...register("cpf")} />
                  <div className="min-h-[20px]">
                    {errors.cpf && <span className="text-red-500 text-sm">{errors.cpf.message}</span>}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                  <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                  <div className="min-h-[20px]">
                    {errors.dateOfBirth && <span className="text-red-500 text-sm">{errors.dateOfBirth.message}</span>}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" type="tel" {...register("phone")} />
                  <div className="min-h-[20px]">
                    {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                  </div>
                </div>

                {(!inviteData ? selectedRole : "cliente") === "advogado" && (
                  <div className="grid gap-2">
                    <Label htmlFor="oab">OAB</Label>
                    <Input id="oab" type="text" {...register("oab")} />
                    <div className="min-h-[20px]">
                      {errors.oab && <span className="text-red-500 text-sm">{errors.oab.message}</span>}
                    </div>
                  </div>
                )}

                {/* Endereço completo - ocupa duas colunas */}
                <div className="md:col-span-2 grid gap-4">
                  <Label>Endereço</Label>
                  <div className="grid gap-2 md:grid-cols-3">
                    <div className="grid gap-2">
                      <Label htmlFor="address.cep">CEP {cepLoading && <span className="text-sm text-foreground/60">(Buscando...)</span>}</Label>
                      <Input id="address.cep" type="text" {...register("address.cep", { onBlur: (e: FocusEvent<HTMLInputElement>) => handleCepBlur(e.target.value) })} />
                      <div className="min-h-[20px]">{errors.address?.cep && <span className="text-red-500 text-sm">{errors.address?.cep.message}</span>}</div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address.rua">Rua</Label>
                      <Input id="address.rua" type="text" {...register("address.rua")} />
                      <div className="min-h-[20px]">{errors.address?.rua && <span className="text-red-500 text-sm">{errors.address?.rua.message}</span>}</div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address.numero">Número</Label>
                      <Input id="address.numero" type="text" {...register("address.numero")} />
                      <div className="min-h-[20px]">{errors.address?.numero && <span className="text-red-500 text-sm">{errors.address?.numero.message}</span>}</div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address.bairro">Bairro</Label>
                      <Input id="address.bairro" type="text" {...register("address.bairro")} />
                      <div className="min-h-[20px]">{errors.address?.bairro && <span className="text-red-500 text-sm">{errors.address?.bairro.message}</span>}</div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address.cidade">Cidade</Label>
                      <Input id="address.cidade" type="text" {...register("address.cidade")} />
                      <div className="min-h-[20px]">{errors.address?.cidade && <span className="text-red-500 text-sm">{errors.address?.cidade.message}</span>}</div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address.estado">Estado</Label>
                      <Input id="address.estado" type="text" {...register("address.estado")} />
                      <div className="min-h-[20px]">{errors.address?.estado && <span className="text-red-500 text-sm">{errors.address?.estado.message}</span>}</div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="address.complemento">Complemento</Label>
                      <Input id="address.complemento" type="text" {...register("address.complemento")} />
                      <div className="min-h-[20px]">{errors.address?.complemento && <span className="text-red-500 text-sm">{errors.address?.complemento.message}</span>}</div>
                    </div>
                  </div>
                </div>

                {/* Campo Senha */}
                <div className="md:col-span-2 grid gap-2 relative">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"} // alterna entre texto e senha
                      className={getFieldValidationClassLocal("password") + " pr-10"} // padding direito pro ícone não sobrepor texto
                      {...register("password")}
                    />
                    {/* Botão de mostrar/ocultar */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <PasswordRequirements password={passwordValue || ""} />
                </div>

                {/* Campo Confirmar Senha */}
                <div className="md:col-span-2 grid gap-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      className={getFieldValidationClassLocal("confirmPassword") + " pr-10"}
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {errors.confirmPassword && touchedFields.confirmPassword && (
                    <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
                  )}
                </div>

                {/* Botões */}
                <div className="md:col-span-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-secondary text-white hover:bg-gray-300 hover:text-secondary-foreground transition-colors duration-200"
                    disabled={!isValid || isLoading}
                  >
                    {isLoading ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </div>

              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
