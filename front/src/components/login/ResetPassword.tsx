"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    redefinirSenhaSchema,
    type RedefinirSenhaFormData
} from "@/schemas/redefinirSenhaSchema";
import { PasswordRequirements } from "@/components/cadastro/PasswordRequirements";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { useState } from "react";
import { getFieldValidationClass } from "@/utils/formValidation";
import { resetPassword } from "@/services/user/RedefinirSenhaService";
import { da } from "date-fns/locale";

export default function ResetPassword({ token }: { token: string }) {
    const router = useRouter();
    const { success, error: showError } = useToast();
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");


    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields, dirtyFields },
        watch,
        getValues,
        trigger
    } = useForm<RedefinirSenhaFormData>({
        resolver: zodResolver(redefinirSenhaSchema),
        mode: "onChange",
    });

    const passwordValue = watch("password");

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValid = await trigger();

        if (!isValid) {
            return;
        }
        const { password } = getValues();
        setLoading(true);
        setSubmitError("");

        try {
            await resetPassword({ token, password: password});

            success("Senha redefinida com sucesso!");
            router.push("/login");

        } catch {
            setSubmitError("Não foi possível redefinir a senha. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const getFieldValidationClassLocal = (fieldName: "password" | "confirmPassword") => {
        const isTouched = touchedFields[fieldName];
        const hasError = errors[fieldName];
        const isDirty = dirtyFields[fieldName];

        if (fieldName === "confirmPassword") {
            const passwordValue = watch("password");
            const confirmValue = watch("confirmPassword");

            const passwordTouched = touchedFields.password;
            const confirmTouched = touchedFields.confirmPassword;

            if (!passwordTouched || !confirmTouched) return "";

            const matches = confirmValue === passwordValue && confirmValue.length > 0;

            if (hasError || !matches) {
                return "border-red-500 focus:border-red-500";
            }

            if (matches) {
                return "border-green-500 focus:border-green-500";
            }

            return "";
        }

        return getFieldValidationClass(!!isTouched, !!hasError, !!isDirty);
    };

    return (
        <Card className="w-full max-w-md">
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
                    Redefinir Senha
                </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
                <form onSubmit={(e) => onSubmit(e)} className="flex flex-col gap-6">
                {submitError && (
                    <span className="text-red-500 text-sm text-center mt-2">
                        {submitError}
                    </span>
                )}

                    {/* Senha */}
                    <div className="flex flex-col gap-2 relative">
                        <Label htmlFor="password">Nova Senha</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPass ? "text" : "password"}
                                className={getFieldValidationClassLocal("password") + " pr-10"}
                                {...register("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <PasswordRequirements password={passwordValue || ""} />
                    </div>

                    {/* Confirmar Senha */}
                    <div className="flex flex-col gap-2 relative">
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
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {errors.confirmPassword && touchedFields.confirmPassword && (
                            <span className="text-red-500 text-sm">
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </div>

                    <Button disabled={loading} type="submit" className="w-full">
                        {loading ? "Salvando..." : "Redefinir Senha"}
                    </Button>

                </form>
            </CardContent>
        </Card>
    );
}
