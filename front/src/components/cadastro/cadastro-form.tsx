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
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { cadastrarUsuario } from '../../services/user/cadastroService';
import { useRouter } from "next/navigation"
import { User, Scale } from "lucide-react"

// Esquema de validação com Zod
const cadastroSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().refine(
    value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value), 
    "Senha fraca. Deve conter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial."
  ),
  role: z.enum(["cliente", "advogado"], {
    required_error: "Selecione o tipo de usuário",
  })
});

// Tipo inferido do esquema Zod
type CadastroFormData = z.infer<typeof cadastroSchema>;

export function CadastroForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [cadastroError, setCadastroError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    }
  });

  const selectedRole = watch("role");

  const handleUserTypeChange = (type: string) => {
    setValue("role", type === "client" ? "cliente" : "advogado", { shouldValidate: true });
  };

  const onSubmit = useCallback(async (data: CadastroFormData) => {
    const cadastroData = {
      name: data.name,
      client: data.role === "cliente",
      username: data.email,
      password: data.password
    };

    try {
      await cadastrarUsuario(cadastroData);
      setCadastroError(null);
      router.push('/login');
    } catch (error: any) {
      if (error.response?.data?.error) {
        setCadastroError(error.response.data.error);
      } else {
        console.error("Erro no cadastro:", error);
        setCadastroError("Erro ao fazer cadastro. Tente novamente.");
      }
    }
  }, [router]);

  const handleVoltarLogin = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/');
  }, [router]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center p-4">
          <CardTitle className="text-xl">AVOCUSS</CardTitle>
          <CardDescription>
            Cadastre-se com seu email ou faça cadastro com Google.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              {cadastroError && <span className="text-red-500 text-sm">{cadastroError}</span>}
              <div className="grid gap-6">
                {/* Campo Nome */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    {...register("name")} 
                  />
                  {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                </div>

                {/* Campo Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email")}
                  />
                  {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>

                {/* Campo Senha */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    {...register("password")} 
                  />
                  {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                </div>

                {/* Seleção de Tipo de Usuário */}
                <div className="space-y-2">
                  <Label>Tipo de Usuário</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div
                      className={`border rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                        selectedRole === "cliente"
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleUserTypeChange("client")}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <span className="font-medium">Cliente</span>
                      <span className="text-sm text-muted-foreground text-center">Procuro assistência jurídica</span>
                    </div>

                    <div
                      className={`border rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${
                        selectedRole === "advogado"
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleUserTypeChange("lawyer")}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Scale className="h-6 w-6 text-primary" />
                      </div>
                      <span className="font-medium">Advogado</span>
                      <span className="text-sm text-muted-foreground text-center">Ofereço serviços jurídicos</span>
                    </div>
                  </div>
                  {errors.role && <span className="text-red-500 text-sm">{errors.role.message}</span>}
                </div>

                {/* Botões */}
                <Button 
                  type="submit" 
                  className="w-full bg-secondary text-secondary-foreground" 
                  disabled={!isValid}
                >
                  Cadastrar
                </Button>
                <Button 
                  variant="link" 
                  className="w-full text-secondary-foreground" 
                  onClick={handleVoltarLogin}
                >
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
