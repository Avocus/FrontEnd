"use client";

import { cn } from "../../lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { auth, sendPasswordResetEmail } from "../../../firebaseConfig";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ServiceTerms } from "./serviceTerms";
import { PrivacyPolicy } from "./privacyPolicy";
import { useRouter } from "next/navigation";
import { useAuthStore, useProfileStore } from "@/store";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface LoginData {
  email: string;
  password: string;
}

interface ResetPasswordData {
  resetEmail: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginData>({
    mode: "onChange"
  });
  const { register: registerReset, handleSubmit: handleSubmitReset, formState: { errors: errorsReset, isValid: isValidReset } } = useForm<ResetPasswordData>({
    mode: "onChange"
  });
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);
  const router = useRouter();
  
  // Usar o useAuthStore para autenticação
  const { login, error: loginError, isAuthenticated, isLoading, setError } = useAuthStore();
  // Usar o useProfileStore para verificar o status do perfil
  const { checkProfileCompletion } = useProfileStore();

  // Redirecionar para a página principal se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      checkProfileCompletion();
      router.push("/home");
    }
  }, [isAuthenticated, router, checkProfileCompletion]);

  const handleLoginEmail = useCallback(async (data: LoginData) => {
    try {
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

  const handleForgotPassword = useCallback(async (data: ResetPasswordData) => {
    try {
      await sendPasswordResetEmail(auth, data.resetEmail);
      setResetEmailSent(true);
      setError(null); // Limpar erros anteriores
    } catch (error) {
      console.error("Erro na recuperação de senha:", error);
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
          <CardDescription>
            Faça login com sua conta Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLoginEmail)}>
            <div className="grid gap-6">
              {loginError && <span className="text-red-500 text-sm">{loginError}</span>}
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email", { required: "Email é obrigatório", pattern: { value: /^\S+@\S+$/i, message: "Email inválido" } })}
                  />
                  {errors.email && <span className="text-red-500 text-sm">{String(errors.email.message)}</span>}
                </div>
                <div className="grid gap-2">
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
                  <Input id="password" type="password" {...register("password", { required: "Senha é obrigatória" })} />
                  {errors.password && <span className="text-red-500 text-sm">{String(errors.password.message)}</span>}
                </div>
                <div className="grid gap-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-secondary text-secondary-foreground" 
                    disabled={!isValid || isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </div>
              </div>
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
                  {...registerReset("resetEmail", { required: "Email é obrigatório", pattern: { value: /^\S+@\S+$/i, message: "Email inválido" } })}
                />
                {errorsReset.resetEmail && <span className="text-red-500 text-sm">{String(errorsReset.resetEmail.message)}</span>}
              </div>
              <Button type="submit" size="sm" className="px-3 bg-secondary text-secondary-foreground" disabled={!isValidReset}>
                Enviar
              </Button>
            </div>
          </form>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Fechar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}