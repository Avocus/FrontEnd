"use client";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Label } from "../ui/label";
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Stepper, Step, StepLabel, StepContent } from "@mui/material";
import { Textarea } from "../ui/textarea";
import * as RadixSelect from "@radix-ui/react-select";
import { Processo, ProcessoStep } from "@/types/entities/Processo";
import { DialogHeader } from "../ui/dialog";

type ProcessoData = {
    clienteId: string;
    clienteNome: string;
    categoria: string;
    titulo: string;
    descricao: string;
    isDraft: boolean;
    steps: ProcessoStep[];
};

export function CadastroProcessoAdvogado() {
    const [open, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [data, setData] = useState<ProcessoData>({
        clienteId: "",
        clienteNome: "",
        categoria: "",
        titulo: "",
        descricao: "",
        isDraft: true,
        steps: [
            { id: "1", titulo: "Análise Inicial", descricao: "Revisar documentos e entender o caso", status: "pending" },
            { id: "2", titulo: "Petição Inicial", descricao: "Elaborar e protocolar petição inicial", status: "pending" },
            { id: "3", titulo: "Audiência", descricao: "Participar da audiência inicial", status: "pending" },
        ],
    });

    const categorias = [
        "Civil",
        "Trabalhista",
        "Penal",
        "Família",
        "Empresarial",
        "Tributário",
        "Ambiental",
        "Outro",
    ];

    // Mock de clientes do advogado
    const clientes = [
        { id: "1", nome: "João Silva" },
        { id: "2", nome: "Maria Santos" },
        { id: "3", nome: "Pedro Oliveira" },
    ];

    const handleNext = () => {
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleSubmit = () => {
        console.log("Dados enviados:", JSON.stringify(data, null, 2));
        // Aqui seria a lógica para salvar no backend
        setOpen(false);
        setActiveStep(0);
        setData({
            clienteId: "",
            clienteNome: "",
            categoria: "",
            titulo: "",
            descricao: "",
            isDraft: true,
            steps: [
                { id: "1", titulo: "Análise Inicial", descricao: "Revisar documentos e entender o caso", status: "pending" },
                { id: "2", titulo: "Petição Inicial", descricao: "Elaborar e protocolar petição inicial", status: "pending" },
                { id: "3", titulo: "Audiência", descricao: "Participar da audiência inicial", status: "pending" },
            ],
        });
    };

    const handleInputChange = (field: keyof ProcessoData, value: unknown) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const handleClienteChange = (clienteId: string) => {
        const cliente = clientes.find(c => c.id === clienteId);
        setData((prev) => ({
            ...prev,
            clienteId,
            clienteNome: cliente?.nome || ""
        }));
    };

    const addStep = () => {
        const newStep: ProcessoStep = {
            id: Date.now().toString(),
            titulo: "",
            descricao: "",
            status: "pending",
        };
        setData((prev) => ({
            ...prev,
            steps: [...prev.steps, newStep]
        }));
    };

    const updateStep = (index: number, field: keyof ProcessoStep, value: string) => {
        const updatedSteps = [...data.steps];
        updatedSteps[index] = { ...updatedSteps[index], [field]: value };
        setData((prev) => ({ ...prev, steps: updatedSteps }));
    };

    const removeStep = (index: number) => {
        const updatedSteps = data.steps.filter((_, i) => i !== index);
        setData((prev) => ({ ...prev, steps: updatedSteps }));
    };

    const steps = [
        {
            label: "Selecionar Cliente",
            description: "Escolha o cliente para o processo",
        },
        {
            label: "Informações Básicas",
            description: "Categoria e detalhes do processo",
        },
        {
            label: "Definir Etapas",
            description: "Configure as etapas do processo",
        },
        {
            label: "Confirmação",
            description: "Revise e salve o processo",
        },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full mb-5 text-primary-foreground bg-tertiary hover:bg-chart-1" size="lg">
                    Criar Novo Processo
                </Button>
            </DialogTrigger>
            <DialogContent
                className="
          fixed 
          inset-0 
          z-50 
          flex 
          items-center 
          justify-center 
          bg-black/50 
          p-4
          sm:p-6
        "
            >
                <div
                    className="
            bg-background 
            rounded-lg 
            shadow-lg 
            w-full 
            max-w-4xl 
            max-h-[90vh] 
            overflow-y-auto
          "
                >
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle className="text-2xl">Cadastro de Processo Jurídico</DialogTitle>
                    </DialogHeader>

                    <div className="p-4">
                        <Stepper activeStep={activeStep} orientation="vertical" className="w-full text-primary-foreground">
                            {steps.map((step, index) => (
                                <Step key={step.label}>
                                    <StepLabel>
                                        <div className="flex flex-col text-secondary-foreground">
                                            <span className="text-sm font-medium">{step.label}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {step.description}
                                            </span>
                                        </div>
                                    </StepLabel>
                                    <StepContent>
                                        {index === 0 && (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="cliente">Selecionar Cliente</Label>
                                                    <RadixSelect.Root
                                                        value={data.clienteId}
                                                        onValueChange={handleClienteChange}
                                                    >
                                                        <SelectTrigger id="cliente">
                                                            <SelectValue placeholder="Selecione um cliente" />
                                                        </SelectTrigger>
                                                        <SelectContent
                                                            className="bg-primary p-2 h-32 overflow-y-auto z-40"
                                                            position="popper"
                                                        >
                                                            <RadixSelect.Viewport>
                                                                {clientes.map((cliente) => (
                                                                    <SelectItem key={cliente.id} value={cliente.id} className="my-1 cursor-pointer hover:bg-chart-1 p-1">
                                                                        {cliente.nome}
                                                                    </SelectItem>
                                                                ))}
                                                            </RadixSelect.Viewport>
                                                        </SelectContent>
                                                    </RadixSelect.Root>
                                                </div>

                                                <div className="flex justify-end pt-4">
                                                    <Button onClick={handleNext} disabled={!data.clienteId}>
                                                        Avançar
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {index === 1 && (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="categoria">Categoria do processo</Label>
                                                    <RadixSelect.Root
                                                        value={data.categoria}
                                                        onValueChange={(value) => handleInputChange("categoria", value)}
                                                    >
                                                        <SelectTrigger id="categoria">
                                                            <SelectValue placeholder="Selecione uma categoria" />
                                                        </SelectTrigger>
                                                        <SelectContent
                                                            className="bg-primary p-2 h-32 overflow-y-auto z-40"
                                                            position="popper"
                                                        >
                                                            <RadixSelect.Viewport>
                                                                {categorias.map((cat) => (
                                                                    <SelectItem key={cat} value={cat} className="my-1 cursor-pointer hover:bg-chart-1 p-1">
                                                                        {cat}
                                                                    </SelectItem>
                                                                ))}
                                                            </RadixSelect.Viewport>
                                                        </SelectContent>
                                                    </RadixSelect.Root>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="titulo">Título do Processo</Label>
                                                    <Input
                                                        id="titulo"
                                                        placeholder="Ex: Ação de Cobrança"
                                                        value={data.titulo}
                                                        onChange={(e) => handleInputChange("titulo", e.target.value)}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="descricao">Descrição do caso</Label>
                                                    <Textarea
                                                        id="descricao"
                                                        placeholder="Descreva os detalhes do caso..."
                                                        className="min-h-[120px]"
                                                        value={data.descricao}
                                                        onChange={(e) => handleInputChange("descricao", e.target.value)}
                                                    />
                                                </div>

                                                <div className="flex justify-between pt-4">
                                                    <Button variant="outline" onClick={handleBack}>
                                                        Voltar
                                                    </Button>
                                                    <Button onClick={handleNext} disabled={!data.categoria || !data.titulo}>
                                                        Avançar
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {index === 2 && (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <Label>Etapas do Processo</Label>
                                                    <Button onClick={addStep} variant="outline" size="sm">
                                                        Adicionar Etapa
                                                    </Button>
                                                </div>

                                                <div className="space-y-3">
                                                    {data.steps.map((stepItem, stepIndex) => (
                                                        <div key={stepItem.id} className="border rounded-lg p-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <Label>Título da Etapa</Label>
                                                                    <Input
                                                                        placeholder="Ex: Análise Inicial"
                                                                        value={stepItem.titulo}
                                                                        onChange={(e) => updateStep(stepIndex, "titulo", e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Data Prevista (opcional)</Label>
                                                                    <Input
                                                                        type="date"
                                                                        value={stepItem.dataPrevista || ""}
                                                                        onChange={(e) => updateStep(stepIndex, "dataPrevista", e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2 mt-4">
                                                                <Label>Descrição</Label>
                                                                <Textarea
                                                                    placeholder="Descreva a etapa..."
                                                                    value={stepItem.descricao}
                                                                    onChange={(e) => updateStep(stepIndex, "descricao", e.target.value)}
                                                                />
                                                            </div>
                                                            {data.steps.length > 1 && (
                                                                <div className="flex justify-end mt-4">
                                                                    <Button
                                                                        onClick={() => removeStep(stepIndex)}
                                                                        variant="destructive"
                                                                        size="sm"
                                                                    >
                                                                        Remover
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex justify-between pt-4">
                                                    <Button variant="outline" onClick={handleBack}>
                                                        Voltar
                                                    </Button>
                                                    <Button onClick={handleNext}>
                                                        Avançar
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {index === 3 && (
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <h4 className="font-medium">Resumo do Processo</h4>
                                                    <div className="rounded-lg border p-4">
                                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Cliente</p>
                                                                <p>{data.clienteNome || "-"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Categoria</p>
                                                                <p>{data.categoria || "-"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Título</p>
                                                                <p>{data.titulo || "-"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Tipo</p>
                                                                <p>Rascunho</p>
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <p className="text-sm text-muted-foreground">Descrição</p>
                                                                <p className="whitespace-pre-line">{data.descricao || "-"}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <h4 className="font-medium">Etapas Definidas</h4>
                                                    <div className="space-y-2">
                                                        {data.steps.map((stepItem, idx) => (
                                                            <div key={stepItem.id} className="border rounded p-3">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <p className="font-medium">{stepItem.titulo || `Etapa ${idx + 1}`}</p>
                                                                        <p className="text-sm text-muted-foreground">{stepItem.descricao}</p>
                                                                        {stepItem.dataPrevista && (
                                                                            <p className="text-xs text-muted-foreground">Data prevista: {stepItem.dataPrevista}</p>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                                        {stepItem.status === 'pending' ? 'Pendente' : stepItem.status === 'in_progress' ? 'Em Andamento' : 'Concluída'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col-reverse justify-between gap-2 pt-4 sm:flex-row">
                                                    <Button variant="outline" onClick={() => setActiveStep(0)}>
                                                        Editar todas as seções
                                                    </Button>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" onClick={handleBack}>
                                                            Voltar
                                                        </Button>
                                                        <Button variant={'secondary'} className="text-primary-foreground bg-tertiary hover:bg-chart-1" onClick={handleSubmit}>
                                                            Salvar como Rascunho
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                        <div className="flex justify-center pt-4">
                            <Button variant="destructive" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
