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
// import { auth, createUserWithEmailAndPassword } from "../../../firebaseConfig";
// import { auth, provider, signInWithPopup, createUserWithEmailAndPassword } from "../../../firebaseConfig";
import { cadastrarUsuario } from '../../services/cadastro.service';
import { useRouter } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ModeToggle } from "../ui/modeToggle"

export function CadastroForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { register, handleSubmit, formState: { errors, isValid }, setValue, watch } = useForm({
    mode: "onChange"
  });

  const [cadastroError, setCadastroError] = useState<string | null>(null);
  const router = useRouter();

  const handleCadastroServer = useCallback(async (data: any) => {
    const isClient = data.role === "cliente";
    const cadastroData = {
      name: data.name,
      isClient,
      username: data.email,
      password: data.password
    };

    try {
      const user = await cadastrarUsuario(cadastroData);
      console.log("Usuário cadastrado:", user);
      setCadastroError(null);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        setCadastroError(error.response.data.error);
      } else {
        console.error("Erro no cadastro com email:", error);
        setCadastroError("Erro ao fazer cadastro. Tente novamente.");
      }
    }
  }, []);

  const handleVoltarLogin = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/');
  }, []);

  const isStrongPassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const selectedRole = watch("role");

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
      <div className="mt-2 ml-2">
        <ModeToggle />
      </div>
        <CardHeader className="text-center p-4">
          <CardTitle className="text-xl">AVOCUSS</CardTitle>
          <CardDescription>
            Cadastre-se com seu email ou faça cadastro com Google.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleCadastroServer)}>
            <div className="grid gap-6">
              {cadastroError && <span className="text-red-500 text-sm">{cadastroError}</span>}
              <div className="grid gap-6">
                <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="text">Nome</Label>
                    </div>
                    <Input id="name" type="text" {...register("name", { 
                      required: "Nome é obrigatório"
                    })} />
                    {errors.name && <span className="text-red-500 text-sm">{String(errors.name.message)}</span>}
                </div>
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
                <div className="grid gap-2 text-secondary-foreground">
                  <Label>Tipo de Usuário</Label>
                  <RadioGroup onValueChange={(value) => setValue("role", value)}>
                    <div className="flex gap-4">
                      <RadioGroupItem value="cliente" id="cliente" className="bg-secondary text-secondary-foreground"/>
                      <Label htmlFor="cliente">Cliente</Label>
                      <RadioGroupItem value="advogado" id="advogado" className="bg-secondary text-secondary-foreground"/>
                      <Label htmlFor="advogado">Advogado</Label>
                    </div>
                  </RadioGroup>
                  {errors.role && <span className="text-red-500 text-sm">{String(errors.role.message)}</span>}
                </div>
                <Button type="submit" className="w-full bg-secondary text-secondary-foreground" disabled={!isValid || !selectedRole}>
                  Cadastrar
                </Button>
                <Button variant="link" className="w-full mt-2 text-secondary-foreground" onClick={handleVoltarLogin}>
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
