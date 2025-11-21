import { User, Scale, Check } from "lucide-react";
import { Label } from "@/components/ui/label";

type UserType = "cliente" | "advogado";

interface UserTypeSelectorProps {
  selectedRole: UserType | undefined;
  onChange: (type: UserType) => void;
}

export function UserTypeSelector({ selectedRole, onChange }: UserTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Tipo de Usuário</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div
          className={`relative border-2 rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 ${
            selectedRole === "cliente"
              ? "border-blue-600 bg-blue-50 shadow-lg ring-2 ring-blue-200"
              : "border-border hover:border-primary/50 hover:bg-primary/5"
          }`}
          onClick={() => onChange("cliente")}
        >
          {selectedRole === "cliente" && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          )}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              selectedRole === "cliente"
                ? "bg-blue-600 text-white"
                : "bg-primary/10 text-primary"
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
              ? "border-blue-600 bg-blue-50 shadow-lg ring-2 ring-blue-200"
              : "border-border hover:border-primary/50 hover:bg-primary/5"
          }`}
          onClick={() => onChange("advogado")}
        >
          {selectedRole === "advogado" && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          )}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              selectedRole === "advogado"
                ? "bg-blue-600 text-white"
                : "bg-primary/10 text-primary"
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


