"use client";

import { cn } from "../../lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useAuthStore, useProfileStore } from "@/store";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { loginSchema, resetPasswordSchema, type LoginFormData, type ResetPasswordData } from "../../schemas/loginSchema";
import { getFieldValidationClass } from "../../utils/formValidation";
import { useToast } from "@/hooks/useToast";
import { PrivacyPolicy } from "@/components/login/PrivacyPolicy";
import { ServiceTerms } from "@/components/login/ServiceTerms";
import { resetPasswordRequest } from "@/services/user/RedefinirSenhaService";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { register, handleSubmit, formState: { errors, isValid, touchedFields, dirtyFields } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange"
  });
  const { register: registerReset, handleSubmit: handleSubmitReset, formState: { errors: errorsReset, isValid: isValidReset, touchedFields: touchedFieldsReset, dirtyFields: dirtyFieldsReset } } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange"
  });
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);
  const [lastErrorShown, setLastErrorShown] = useState<string | null>(null);
  const router = useRouter();
  const { error: showErrorToast } = useToast();
  
  // Usar o useAuthStore para autenticação
  const { login, error: loginError, isAuthenticated, isLoading, setError } = useAuthStore();
  // Usar o useProfileStore para verificar o status do perfil
  const { checkProfileCompletion } = useProfileStore();

  const getFieldValidationClassLocal = (fieldName: string, isReset = false) => {
    const isTouched = isReset ? !!touchedFieldsReset[fieldName as keyof ResetPasswordData] : !!touchedFields[fieldName as keyof LoginFormData];
    const hasError = isReset ? !!errorsReset[fieldName as keyof ResetPasswordData] : !!errors[fieldName as keyof LoginFormData];
    const isDirty = isReset ? !!dirtyFieldsReset[fieldName as keyof ResetPasswordData] : !!dirtyFields[fieldName as keyof LoginFormData];
    
    return getFieldValidationClass(isTouched, hasError, isDirty);
  };

  // Redirecionar para a página principal se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      checkProfileCompletion();
      router.push("/");
    }
  }, [isAuthenticated, router, checkProfileCompletion]);

  // Mostrar toast de erro quando houver erro de login
  useEffect(() => {
    if (loginError && loginError !== lastErrorShown) {
      showErrorToast(loginError);
      setLastErrorShown(loginError);
    }
  }, [loginError, lastErrorShown, showErrorToast]);

  const handleLoginEmail = useCallback(async (data: LoginFormData) => {
    try {
      // Resetar último erro exibido para garantir que mensagens repetidas sejam mostradas novamente
      setLastErrorShown(null);

      // Usar a função login do useAuthStore
      await login({
        email: data.email,
        password: data.password
      });

      // O redirecionamento será feito pelo useEffect acima quando isAuthenticated mudar
    } catch (error) {
      // O erro já será gerenciado pelo useAuthStore
      console.error("Erro no login:", error);
    }
  }, [login]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleForgotPassword = useCallback(async (_data: ResetPasswordData) => {
    try {
      await resetPasswordRequest(_data.resetEmail);
      setResetEmailSent(true);
      setError(null);
    } catch (error) {
      console.error("Erro na recuperação de senha:", error);
      setResetEmailSent(false);
      setError("Erro ao enviar email de recuperação. Verifique o email e tente novamente.");
    }
  }, [setError]);

  const handleRegister = useCallback(() => {
    router.push("/cadastro");
  }, [router]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          className="absolute top-4 left-4" 
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">AVOCUSS</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLoginEmail)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className={getFieldValidationClassLocal("email")}
                  {...register("email")}
                />
                {errors.email && touchedFields.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                    onClick={() => document.getElementById("dialog-trigger")?.click()}
                  >
                    Esqueci minha senha
                  </Link>
                </div>
                <Input id="password" type="password" className={getFieldValidationClassLocal("password")} {...register("password")} />
                {errors.password && touchedFields.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
              </div>
              <Button 
                type="submit" 
                variant={"primary"} 
                disabled={!isValid || isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              <div className="text-center text-sm">
                Não possui conta?{" "}
                <Link
                  href="/cadastro"
                  className="underline underline-offset-4"
                  onClick={handleRegister}
                >
                  Cadastrar
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground">
        Ao clicar em Entrar você aceita nossos <ServiceTerms />{" "}
        e <PrivacyPolicy />.
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <button id="dialog-trigger" style={{ display: 'none' }}></button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recuperar Senha</DialogTitle>
            <DialogDescription>
              Digite seu email para enviar a solicitação de recuperação de senha.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitReset(handleForgotPassword)}>
            {resetEmailSent && <span className="text-green-500 text-sm">Email de recuperação enviado!</span>}
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="reset-email" className="sr-only">
                  Email
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="m@example.com"
                  className={getFieldValidationClassLocal("resetEmail", true)}
                  {...registerReset("resetEmail")}
                />
                {errorsReset.resetEmail && touchedFieldsReset.resetEmail && <span className="text-red-500 text-sm">{errorsReset.resetEmail.message}</span>}
              </div>
              <Button type="submit" size="sm" className="px-3 bg-secondary text-secondary-foreground" disabled={!isValidReset}>
                Enviar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}