import { cn } from "../../lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCallback, useState, useEffect, type FocusEvent } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cadastroSchema, type CadastroFormData } from '../../schemas/cadastroSchema';
import { cadastrarUsuario } from '../../services/user/cadastroService';
import { useRouter } from "next/navigation"
import { getErrorMessage } from '@/utils/formValidation';
import { ArrowLeft, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react"
import { UserTypeSelector } from './UserTypeSelector';
import { PasswordRequirements } from './PasswordRequirements';
import { useToast } from '../../hooks/useToast';
import { getFieldValidationClass } from '../../utils/formValidation';
import { TIPOS_PROCESSO, TipoProcesso, ESPECIALIDADES, Especialidade } from '../../constants/processo';
import { getEspecialidadeLabel } from '../../types/enums';

type InviteData = { isInvite: boolean; token: string } | null;

export function CadastroForm({
  className,
  inviteData,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { 
  inviteData?: InviteData;
}) {
  const [cadastroError, setCadastroError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [cepLoading, setCepLoading] = useState(false);
  const { success, error: showError } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields, dirtyFields },
    setValue,
    watch,
    trigger
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: inviteData ? "cliente" : undefined,
      cpf: "",
      oab: "",
      dateOfBirth: "",
      telefone: "",
      address: {
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        pais: "",
        cep: "",
        complemento: "",
      },
      bio: "",
      especialidades: [],
      dadosContato: {
        site: "",
        instagram: "",
        facebook: "",
        linkedin: "",
        youtube: "",
        twitter: "",
        telefone: "",
      }
    }
  });

  useEffect(() => {
    if (inviteData?.isInvite) {
      setValue("role", "cliente");
    }
  }, [inviteData, setValue]);

  const selectedRole = inviteData?.isInvite ? "cliente" : watch("role");
  const passwordValue = watch("password");
  const totalSteps = selectedRole === 'advogado' ? 3 : 2;
  const especialidadesValue = watch("especialidades") || [];

  const handleEspecialidadeChange = (tipo: string, checked: boolean) => {
    const current = especialidadesValue;
    if (checked) {
      setValue("especialidades", [...current, tipo as Especialidade]);
    } else {
      setValue("especialidades", current.filter((e: string) => e !== tipo));
    }
  };

  const getFieldValidationClassLocal = (fieldName: keyof CadastroFormData) => {
    const isTouched = touchedFields[fieldName];
    const hasError = errors[fieldName];
    const isDirty = dirtyFields[fieldName];
    
    if (fieldName === 'confirmPassword') {
      const passwordValue = watch("password");
      const confirmValue = watch("confirmPassword");
      const confirmTouched = touchedFields.confirmPassword;
      const passwordTouched = touchedFields.password;
      
      if (!confirmTouched || !passwordTouched) return "";
      
      const matches = confirmValue === passwordValue && confirmValue.length > 0;
      
      if (hasError || !matches) return "border-red-500 focus:border-red-500";
      if (matches) return "border-green-500 focus:border-green-500";
      
      return "";
    }
    
    if (fieldName === 'role' && inviteData?.isInvite) {
      return "";
    }
    
    return getFieldValidationClass(!!isTouched, !!hasError, !!isDirty);
  };

  const handleUserTypeChange = (type: "cliente" | "advogado") => {
    setValue("role", type, { shouldValidate: true });
  };

  const handleNext = async () => {
    const isValid = await trigger(getFieldsForStep(currentStep));
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof CadastroFormData)[] => {
    switch (step) {
      case 1:
        return ["name", "email", "password", "confirmPassword", "role"];
      case 2:
        return ["cpf", "dateOfBirth", "telefone", "address"];
      case 3:
        return selectedRole === 'advogado' ? ["oab", "bio", "especialidades", "dadosContato"] : [];
      default:
        return [];
    }
  };

  const handleCepBlur = async (rawCep?: string) => {
    const cep = (rawCep || "").replace(/\D/g, "");
    if (!cep || cep.length !== 8) return;

    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!res.ok) {
        showError("Erro ao buscar CEP");
        return;
      }

      const data = await res.json();
      if (data.erro) {
        showError("CEP não encontrado");
        return;
      }

      // Preencher campos do endereço com base na resposta
      setValue("address.rua", data.logradouro || "");
      setValue("address.bairro", data.bairro || "");
      setValue("address.cidade", data.localidade || "");
      setValue("address.estado", data.uf || "");
      setValue("address.complemento", data.complemento || "");
      setValue("address.pais", "Brasil");
    } catch (err) {
      showError("Erro ao consultar CEP");
      console.error("Erro ao consultar CEP:", err);
    } finally {
      setCepLoading(false);
    }
  };

  const onSubmit = useCallback(async (data: CadastroFormData) => {
    setIsLoading(true);
    
    const finalData = inviteData 
      ? { ...data, role: "cliente" as const }
      : data;

    const cadastroData = {
      name: finalData.name,
      client: finalData.role === "cliente",
      username: finalData.email,
      password: finalData.password,
      inviteToken: inviteData?.token,
      cpf: finalData.cpf,
      oab: finalData.oab,
      dateOfBirth: finalData.dateOfBirth,
      telefone: finalData.telefone,
      address: finalData.address ? {
        logradouro: finalData.address.rua,
        numero: finalData.address.numero,
        complemento: finalData.address.complemento,
        bairro: finalData.address.bairro,
        cidade: finalData.address.cidade,
        estado: finalData.address.estado,
        cep: finalData.address.cep,
      } : undefined,
      bio: finalData.bio,
      especialidades: finalData.especialidades,
      dadosContato: finalData.dadosContato,
    };

    try {
      await cadastrarUsuario(cadastroData);
      setCadastroError(null);
      success("Cadastro realizado com sucesso!");
      router.push('/login');
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "Erro ao fazer cadastro. Tente novamente.");
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [inviteData, success, router, showError]);

  return (
    <div className={cn("flex flex-col w-full", className)} {...props}>
      <Card>
        <CardHeader className="text-center p-4">
          <CardTitle className="text-xl mb-5">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              className="absolute left-4 top-4"
              onClick={() => router.push("/login")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>  
            <span>
              {inviteData?.isInvite ? "Cadastro de Cliente" : "AVOCUSS"}
            </span>
          </CardTitle>
          {inviteData?.isInvite && (
            <p className="text-sm text-foreground/80">
              Você foi convidado para se cadastrar como cliente
            </p>
          )}
        </CardHeader>
        {!inviteData?.isInvite && (
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i + 1 === currentStep ? 'bg-gray-300' : 'bg-primary'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              {cadastroError && <span className="text-red-500 text-sm">{cadastroError}</span>}
              
              {/* Step 1: Account Information */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-6">
                  {/* Seleção de Tipo de Usuário - só mostrar se não for convite */}
                  {!inviteData && (
                    <div>
                      <UserTypeSelector selectedRole={selectedRole} onChange={handleUserTypeChange} />
                      {errors.role && <span className="text-red-500 text-sm">{errors.role.message}</span>}
                    </div>
                  )}

                  {/* Campo Nome */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input 
                      id="name" 
                      type="text" 
                      className={getFieldValidationClassLocal("name")}
                      {...register("name")} 
                    />
                    <div className="min-h-[20px]">
                      {errors.name && touchedFields.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                    </div>
                  </div>

                  {/* Campo Email */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      className={getFieldValidationClassLocal("email")}
                      {...register("email")}
                    />
                    <div className="min-h-[20px]">
                      {errors.email && touchedFields.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    </div>
                  </div>

                  {/* Campo Senha */}
                  <div className="flex flex-col gap-2 relative">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className={getFieldValidationClassLocal("password") + " pr-10"}
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <PasswordRequirements password={passwordValue || ""} />
                  </div>

                  {/* Campo Confirmar Senha */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        className={getFieldValidationClassLocal("confirmPassword") + " pr-10"}
                        {...register("confirmPassword")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {errors.confirmPassword && touchedFields.confirmPassword && (
                      <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <div className="flex flex-col gap-6">
                  {/* Campos adicionais: CPF, Data de Nascimento, Telefone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input id="cpf" type="text" {...register("cpf")} />
                      <div className="min-h-[20px]">
                        {errors.cpf && <span className="text-red-500 text-sm">{errors.cpf.message}</span>}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                      <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                      <div className="min-h-[20px]">
                        {errors.dateOfBirth && <span className="text-red-500 text-sm">{errors.dateOfBirth.message}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" type="tel" {...register("telefone")} />
                    <div className="min-h-[20px]">
                      {errors.telefone && <span className="text-red-500 text-sm">{errors.telefone.message}</span>}
                    </div>
                  </div>

                  {/* Endereço completo */}
                  <div className="flex flex-col gap-4">
                    <Label>Endereço</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="address.cep">CEP {cepLoading && <span className="text-sm text-foreground/60">(Buscando...)</span>}</Label>
                        <Input id="address.cep" type="text" {...register("address.cep", { onBlur: (e: FocusEvent<HTMLInputElement>) => handleCepBlur(e.target.value) })} />
                        <div className="min-h-[20px]">{errors.address?.cep && <span className="text-red-500 text-sm">{errors.address?.cep.message}</span>}</div>
                      </div>

                      <div className="flex flex-col gap-2 col-span-2">
                        <Label htmlFor="address.rua">Rua</Label>
                        <Input id="address.rua" type="text" {...register("address.rua")} />
                        <div className="min-h-[20px]">{errors.address?.rua && <span className="text-red-500 text-sm">{errors.address?.rua.message}</span>}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="address.numero">Número</Label>
                        <Input id="address.numero" type="text" {...register("address.numero")} />
                        <div className="min-h-[20px]">{errors.address?.numero && <span className="text-red-500 text-sm">{errors.address?.numero.message}</span>}</div>
                      </div>

                      <div className="flex flex-col gap-2 col-span-2">
                        <Label htmlFor="address.bairro">Bairro</Label>
                        <Input id="address.bairro" type="text" {...register("address.bairro")} />
                        <div className="min-h-[20px]">{errors.address?.bairro && <span className="text-red-500 text-sm">{errors.address?.bairro.message}</span>}</div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="address.estado">Estado</Label>
                        <Input id="address.estado" type="text" {...register("address.estado")} />
                        <div className="min-h-[20px]">{errors.address?.estado && <span className="text-red-500 text-sm">{errors.address?.estado.message}</span>}</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="address.cidade">Cidade</Label>
                      <Input id="address.cidade" type="text" {...register("address.cidade")} />
                      <div className="min-h-[20px]">{errors.address?.cidade && <span className="text-red-500 text-sm">{errors.address?.cidade.message}</span>}</div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="address.complemento">Complemento</Label>
                      <Input id="address.complemento" type="text" {...register("address.complemento")} />
                      <div className="min-h-[20px]">{errors.address?.complemento && <span className="text-red-500 text-sm">{errors.address?.complemento.message}</span>}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Professional Information (only for advogado) */}
              {currentStep === 3 && selectedRole === 'advogado' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="oab">OAB</Label>
                    <Input id="oab" type="text" {...register("oab")} />
                    <div className="min-h-[20px]">
                      {errors.oab && <span className="text-red-500 text-sm">{errors.oab.message}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea id="bio" {...register("bio")} placeholder="Conte um pouco sobre você..." />
                    <div className="min-h-[20px]">
                      {errors.bio && <span className="text-red-500 text-sm">{errors.bio.message}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Especialidades</Label>
                    <div className="flex flex-col gap-2">
                      {ESPECIALIDADES.map((tipo) => (
                        <div key={tipo} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`especialidade-${tipo}`}
                            checked={especialidadesValue.includes(tipo)}
                            onChange={(e) => handleEspecialidadeChange(tipo, e.target.checked)}
                            className="h-4 w-4"
                          />
                          <Label htmlFor={`especialidade-${tipo}`}>{getEspecialidadeLabel(tipo)}</Label>
                        </div>
                      ))}
                    </div>
                    <div className="min-h-[20px]">
                      {errors.especialidades && <span className="text-red-500 text-sm">{errors.especialidades.message}</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Label>Dados de Contato</Label>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="dadosContato.site">Site</Label>
                        <Input id="dadosContato.site" type="url" {...register("dadosContato.site")} />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="dadosContato.instagram">Instagram</Label>
                        <Input id="dadosContato.instagram" type="text" {...register("dadosContato.instagram")} />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="dadosContato.facebook">Facebook</Label>
                        <Input id="dadosContato.facebook" type="text" {...register("dadosContato.facebook")} />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="dadosContato.linkedin">LinkedIn</Label>
                        <Input id="dadosContato.linkedin" type="text" {...register("dadosContato.linkedin")} />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="dadosContato.youtube">YouTube</Label>
                        <Input id="dadosContato.youtube" type="text" {...register("dadosContato.youtube")} />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="dadosContato.twitter">Twitter</Label>
                        <Input id="dadosContato.twitter" type="text" {...register("dadosContato.twitter")} />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="dadosContato.telefone">Telefone Profissional</Label>
                        <Input id="dadosContato.telefone" type="tel" {...register("dadosContato.telefone")} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                {currentStep > 1 && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>
                )}
                
                <div className="flex-1" />
                
                {currentStep < totalSteps ? (
                  <Button 
                    type="button" 
                    onClick={handleNext}
                    variant={"primary"}
                  >
                    Próximo
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    className="bg-secondary text-white hover:bg-gray-300 hover:text-secondary-foreground transition-colors duration-200"
                    disabled={!isValid || isLoading}
                  >
                    {isLoading ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
