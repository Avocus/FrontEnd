import { User, Scale, Check } from "lucide-react";

type UserType = "cliente" | "advogado";

interface UserTypeSelectorProps {
  selectedRole: UserType | undefined;
  onChange: (type: UserType) => void;
}

export function UserTypeSelector({ selectedRole, onChange }: UserTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <span className="text-primary-foreground">Tipo de Usuário</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div
          className={`relative border-2 rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 ${
            selectedRole === "cliente"
              ? "border-secondary bg-primary shadow-lg ring-2 ring-primary"
              : "border-border hover:border-secondary"
          }`}
          onClick={() => onChange("cliente")}
        >
          {selectedRole === "cliente" && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-primary">
              <Check className="h-4 w-4 text-primary" />
            </div>
          )}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              selectedRole === "cliente"
                ? "bg-secondary text-primary"
                : "bg-primary text-secondary"
            }`}
          >
            <User className="h-6 w-6" />
          </div>
          <span
            className={`font-medium transition-colors ${
              selectedRole === "cliente" ? "text-foreground font-semibold" : "text-foreground"
            }`}
          >
            Cliente
          </span>
          <span className="text-sm text-foreground/70 text-center">
            Procuro assistência jurídica
          </span>
          {selectedRole === "cliente" && (
            <span className="text-xs font-semibold text-foreground">Selecionado</span>
          )}
        </div>

        <div
          className={`relative border-2 rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 ${
            selectedRole === "advogado"
              ? "border-secondary bg-primary shadow-lg ring-2 ring-primary"
              : "border-border hover:border-secondary"
          }`}
          onClick={() => onChange("advogado")}
        >
          {selectedRole === "advogado" && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-primary" />
            </div>
          )}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              selectedRole === "advogado"
                ? "bg-secondary text-primary"
                : "bg-primary text-secondary"
            }`}
          >
            <Scale className="h-6 w-6" />
          </div>
          <span
            className={`font-medium transition-colors ${
              selectedRole === "advogado" ? "text-foreground font-semibold" : "text-foreground"
            }`}
          >
            Advogado
          </span>
          <span className="text-sm text-foreground/70 text-center">
            Ofereço serviços jurídicos
          </span>
          {selectedRole === "advogado" && (
            <span className="text-xs font-semibold text-foreground">Selecionado</span>
          )}
        </div>
      </div>
    </div>
  );
}


