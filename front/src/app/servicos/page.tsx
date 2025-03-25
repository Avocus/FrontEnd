"use client"

import { ServicosComum } from "@/components/servicos/ServicosComum";
import AuthGuard from "@/components/auth/AuthGuard";

export default function Servicos() {
    return (
        <AuthGuard>
            <ServicosComum />
        </AuthGuard>
    );
}