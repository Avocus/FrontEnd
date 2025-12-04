import { z } from "zod";
import { Especialidade } from "@/types/enums";

export const profileSchema = z.object({
  id: z.string(),
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone deve estar no formato (XX) XXXXX-XXXX").optional(),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF deve estar no formato XXX.XXX.XXX-XX").optional(),
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
  oab: z.string().optional(),
  especialidades: z.array(z.nativeEnum(Especialidade)).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>; 