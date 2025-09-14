"use client"

import { cn } from "../../lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCallback, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cadastroSchema, type CadastroFormData } from '../../schemas/cadastroSchema';
import { cadastrarUsuario } from '../../services/user/cadastroService';
import { useRouter } from "next/navigation"
import { getErrorMessage } from '@/utils/formValidation';
import { ArrowLeft } from "lucide-react"
import { UserTypeSelector } from './UserTypeSelector';
import { PasswordRequirements } from './PasswordRequirements';
import { useToast } from '../../hooks/useToast';
import { getFieldValidationClass } from '../../utils/formValidation';

export function CadastroForm({
  className,
  inviteData,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { 
  inviteData?: any;
}) {
  const [cadastroError, setCadastroError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
      email: inviteData?.email || "",
      password: "",
      confirmPassword: "",
      role: inviteData ? "cliente" : undefined
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
      inviteToken: inviteData?.token
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
  }, [router, inviteData]);

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
            <p className="text-sm text-muted-foreground">
              Você foi convidado para se cadastrar como cliente
            </p>
          )}
        </CardHeader>
        <CardContent className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              {cadastroError && <span className="text-red-500 text-sm">{cadastroError}</span>}
              <div className="grid gap-6 md:grid-cols-2">
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

                {/* Campo Senha */}
                <div className="md:col-span-2 grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    className={getFieldValidationClassLocal("password")}
                    {...register("password")} 
                  />
                  <PasswordRequirements password={passwordValue || ""} />
                </div>

                {/* Campo Confirmar Senha */}
                <div className="md:col-span-2 grid gap-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    className={getFieldValidationClassLocal("confirmPassword")}
                    {...register("confirmPassword")} 
                  />
                  {errors.confirmPassword && touchedFields.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
                </div>

                {/* Seleção de Tipo de Usuário - só mostrar se não for convite */}
                {!inviteData && (
                  <div className="md:col-span-2">
                    <UserTypeSelector selectedRole={selectedRole} onChange={handleUserTypeChange} />
                    {errors.role && <span className="text-red-500 text-sm">{errors.role.message}</span>}
                  </div>
                )}

                {/* Botões */}
                <div className="md:col-span-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-secondary text-secondary-foreground" 
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
