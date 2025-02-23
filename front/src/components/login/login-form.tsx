/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { auth, sendPasswordResetEmail } from "../../../firebaseConfig";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ServiceTerms } from "./serviceTerms";
import { PrivacyPolicy } from "./privacyPolicy";
import { useRouter } from "next/navigation";
import { loginWithEmailServer } from '../../services/login.service';
// import { loginWithEmail} from '../../services/login.service';
// import { loginWithEmail, loginWithGoogle } from '../../services/login.service';
// import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: "onChange"
  });
  const { register: registerReset, handleSubmit: handleSubmitReset, formState: { errors: errorsReset, isValid: isValidReset } } = useForm({
    mode: "onChange"
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);
  const router = useRouter();

  const handleLoginEmail = useCallback(async (data: any) => {
    try {
      const user = await loginWithEmailServer(data.email, data.password);
      console.log("Usuário logado:", user);
      sessionStorage.setItem("usuario", JSON.stringify(user));
      sessionStorage.setItem("token", user.data);
      router.push("/home");
      setLoginError(null);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        setLoginError(error.response.data.error);
      } else {
        console.error("Erro no login com email:", error);
        setLoginError("Erro ao fazer login. Tente novamente.");
      }
    }
  }, []);

  // const handleGoogleLogin = useCallback(async (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     const result = await signInWithPopup(auth, provider);
  //     const idToken = await result.user?.getIdToken();
  //     const accessToken = GoogleAuthProvider.credentialFromResult(result)?.idToken;

  //     if (idToken && accessToken) {
  //       const user = await loginWithGoogle(idToken, accessToken);
  //       console.log("Usuário logado com Google:", user);
  //     } else {
  //       console.error("Erro no login com Google: idToken ou accessToken está indefinido");
  //     }
  //   } catch (error: any) {
  //     if (error.response && error.response.data && error.response.data.error) {
  //       console.error("Erro no login com Google:", error.response.data.error);
  //     } else {
  //       console.error("Erro no login com Google:", error);
  //     }
  //   }
  // }, []);

  const handleForgotPassword = useCallback(async (data: any) => {
    try {
      await sendPasswordResetEmail(auth, data.resetEmail);
      setResetEmailSent(true);
      setLoginError(null);
    } catch (error: any) {
      console.error("Erro na recuperação de senha:", error);
      setLoginError("Erro ao enviar email de recuperação. Verifique o email e tente novamente.");
    }
  }, []);

  const handleRegister = useCallback(() => {
    router.push("/cadastro");
  }, [router]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
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
              {/*
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login com Google
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Ou continue com
                </span>
              </div>*/}
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
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                      onClick={() => document.getElementById("dialog-trigger")?.click()}
                    >
                      Esqueci minha senha
                    </a>
                  </div>
                  <Input id="password" type="password" {...register("password", { required: "Senha é obrigatória" })} />
                  {errors.password && <span className="text-red-500 text-sm">{String(errors.password.message)}</span>}
                </div>
                <Button type="submit" className="w-full bg-secondary text-secondary-foreground" disabled={!isValid}>
                  Entrar
                </Button>
              </div>
              <div className="text-center text-sm">
                Não possui conta?{" "}
                <a
                  href="#"
                  className="underline underline-offset-4"
                  onClick={handleRegister}
                >
                  Cadastrar
                </a>
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