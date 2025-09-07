import { Check, X } from "lucide-react";
import { useMemo } from "react";

interface PasswordRequirementsProps {
  password: string;
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements = useMemo(() => [
    {
      label: "Pelo menos 8 caracteres",
      met: password.length >= 8,
    },
    {
      label: "Uma letra maiúscula",
      met: /[A-Z]/.test(password),
    },
    {
      label: "Uma letra minúscula",
      met: /[a-z]/.test(password),
    },
    {
      label: "Um número",
      met: /\d/.test(password),
    },
    {
      label: "Um caractere especial (@$!%*?&)",
      met: /[@$!%*?&]/.test(password),
    },
  ], [password]);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <p className="text-sm text-muted-foreground mb-2">Requisitos da senha:</p>
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          {req.met ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <X className="h-4 w-4 text-red-500" />
          )}
          <span className={req.met ? "text-green-700" : "text-red-700"}>
            {req.label}
          </span>
        </div>
      ))}
    </div>
  );
}
