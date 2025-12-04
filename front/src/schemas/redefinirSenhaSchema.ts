import { z } from "zod";
import { PASSWORD_REGEX } from "./cadastroSchema"; // ajuste o caminho

export const redefinirSenhaSchema = z
  .object({
    password: z.string().refine(
      (value) => PASSWORD_REGEX.test(value),
      "Senha fraca. Deve conter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial."
    ),

    confirmPassword: z
      .string()
      .min(1, "Confirmação de senha é obrigatória"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
      });
    }
  });

export type RedefinirSenhaFormData = z.infer<typeof redefinirSenhaSchema>;
