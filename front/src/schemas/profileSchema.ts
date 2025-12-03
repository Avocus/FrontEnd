import { z } from "zod";

export const profileSchema = z.object({
  id: z.string(),
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido").optional(),
  cpf: z.string().min(11, "CPF inválido").optional(),
  rua: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  dataNascimento: z.string().optional(),
  fotoPerfil: z.string().optional(),
  isAdvogado: z.boolean().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>; 