/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { auth, provider, signInWithPopup, createUserWithEmailAndPassword } from "../../../firebaseConfig";
import { useRouter } from "next/navigation"

export function CadastroForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: "onChange"
  });

  const [cadastroError, setCadastroError] = useState<string | null>(null);
  const router = useRouter();

  const handleCadastroEmail = useCallback(async (data: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      console.log("Usuário cadastrado:", user);
      setCadastroError(null);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setCadastroError("Email já está em uso. Verifique se você já não tem uma conta.");
      } else {
        console.error("Erro no cadastro com email:", error);
        setCadastroError("Erro ao fazer cadastro. Tente novamente.");
      }
    }
  }, []);

  const handleVoltarLogin = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/login');
  }, []);

  const handleGoogleCadastro = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuário cadastrado:", user);
    } catch (error) {
      if ((error as any).code === 'auth/popup-closed-by-user') {
        console.log("O pop-up foi fechado pelo usuário antes de concluir o cadastro.");
      } else {
        console.error("Erro no cadastro com Google:", error);
      }
    }
  }, []);


  const isStrongPassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">AVOCUSS</CardTitle>
          <CardDescription>
            Cadastre-se com seu email ou faça cadastro com Google.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleCadastroEmail)}>
            <div className="grid gap-6">
              {cadastroError && <span className="text-red-500 text-sm">{cadastroError}</span>}
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full" onClick={handleGoogleCadastro}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Cadastro com Google
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Ou continue com
                </span>
              </div>
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
                  </div>
                  <Input id="password" type="password" {...register("password", { 
                    required: "Senha é obrigatória",
                    validate: value => isStrongPassword(value) || "Senha fraca. Deve conter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial."
                  })} />
                  {errors.password && <span className="text-red-500 text-sm">{String(errors.password.message)}</span>}
                </div>
                <Button type="submit" className="w-full" disabled={!isValid}>
                  Cadastrar
                </Button>
                <Button variant="link" className="w-full mt-2" onClick={handleVoltarLogin}>
                  Voltar ao Login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
