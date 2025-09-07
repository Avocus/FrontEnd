import { z } from "zod";

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const cadastroSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().refine(
    value => PASSWORD_REGEX.test(value),
    "Senha fraca. Deve conter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial."
  ),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  role: z.enum(["cliente", "advogado"], {
    required_error: "Selecione o tipo de usuário",
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type CadastroFormData = z.infer<typeof cadastroSchema>;
