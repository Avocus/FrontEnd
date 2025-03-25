import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina classes do Tailwind CSS de forma eficiente, resolvendo conflitos
 * @param inputs Array de nomes de classes ou objetos condicionais
 * @returns String combinada de classes CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
