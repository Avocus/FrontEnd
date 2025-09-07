import { z } from "zod";

export const profileSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido").optional(),
  cpf: z.string().min(11, "CPF inválido").optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  dataNascimento: z.string().optional(),
  fotoPerfil: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>; 