import { z } from "zod";

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const addressSchema = z.object({
  rua: z.string().min(1, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(1, "Estado é obrigatório"),
  pais: z.string().min(1, "País é obrigatório"),
  cep: z.string().min(1, "CEP é obrigatório"),
  complemento: z.string().optional(),
});

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
  }),

  // Campos adicionais
  cpf: z.string().min(11, "CPF inválido"),
  oab: z.string().optional(),
  dateOfBirth: z.string().min(1, "Data de nascimento é obrigatória"),
  phone: z.string().min(8, "Telefone inválido"),
  address: addressSchema,
}).superRefine((data, ctx) => {
  // senha
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "As senhas não coincidem", path: ["confirmPassword"] });
  }

  // Se for advogado, OAB é obrigatório
  if (data.role === 'advogado' && (!data.oab || data.oab.trim().length === 0)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "OAB é obrigatória para advogados", path: ["oab"] });
  }
});

export type CadastroFormData = z.infer<typeof cadastroSchema>;
