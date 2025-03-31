import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog"
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"
import { Label } from "../ui/label"
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select"
import { Input } from "../ui/input"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Stepper, Step, StepLabel, StepContent, Checkbox } from "@mui/material"
import { DialogHeader } from "../ui/dialog"
import { Textarea } from "../ui/textarea"
import * as RadixSelect from "@radix-ui/react-select"

type ProcessData = {
    category: string
    title: string
    description: string
    isUrgent: boolean
    prefersOnline: "Sim" | "Não" | "Tanto Faz"
    contactMethod: string[]
    bestTime: string
}

export function NovoCaso() {
    const [open, setOpen] = useState(false)
    const [activeStep, setActiveStep] = useState(0)
    const [data, setData] = useState<ProcessData>({
        category: "",
        title: "",
        description: "",
        isUrgent: false,
        prefersOnline: "Tanto Faz",
        contactMethod: [],
        bestTime: "",
    })

    const categories = [
        "Civil",
        "Trabalhista",
        "Penal",
        "Família",
        "Empresarial",
        "Tributário",
        "Ambiental",
        "Outro",
    ]

    const contactMethods = [
        { id: "whatsapp", label: "WhatsApp" },
        { id: "email", label: "E-mail" },
        { id: "phone", label: "Telefone" },
    ]

    const handleNext = () => {
        setActiveStep((prev) => prev + 1)
    }

    const handleBack = () => {
        setActiveStep((prev) => prev - 1)
    }

    const handleSubmit = () => {
        console.log("Dados enviados:", JSON.stringify(data, null, 2))
        setOpen(false)
        setActiveStep(0)
        setData({
            category: "",
            title: "",
            description: "",
            isUrgent: false,
            prefersOnline: "Tanto Faz",
            contactMethod: [],
            bestTime: "",
        });
    }

    const handleInputChange = (field: keyof ProcessData, value: unknown) => {
        console.log(`Mudou ${field} para ${value}`)
        setData((prev) => ({ ...prev, [field]: value }))
        console.log("Dados atuais:", data)
    }

    const steps = [
        {
            label: "Tipo de Processo",
            description: "Informações básicas sobre o caso",
        },
        {
            label: "Descrição do Caso",
            description: "Detalhes sobre a situação",
        },
        {
            label: "Preferências",
            description: "Como prefere ser atendido",
        },
        {
            label: "Confirmação",
            description: "Revise e envie suas informações",
        },
    ]

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" className="w-full mb-5 text-primary-foreground bg-tertiary hover:bg-chart-1" size="lg">
                    Iniciar Novo Processo
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
            max-w-2xl 
            max-h-[90vh] 
            overflow-y-auto
          "
                >
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle className="text-2xl">Novo Processo Jurídico</DialogTitle>
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
                                                <div className="space-y-2" style={{ display: "flex", alignItems: "start", justifyContent: "start", flexDirection: "column" }}>
                                                    <Label htmlFor="category">Categoria do processo</Label>
                                                    <RadixSelect.Root
                                                        value={data.category}
                                                        onValueChange={(value) => handleInputChange("category", value)}
                                                    >
                                                        <SelectTrigger id="category" >
                                                            <SelectValue placeholder="Selecione uma categoria" />
                                                            <p>{data.category}</p>
                                                        </SelectTrigger>
                                                        <SelectContent
                                                            className="bg-primary p-2 h-32 overflow-y-auto z-40"
                                                            position="popper"
                                                        >
                                                            <RadixSelect.Viewport>
                                                                {categories.map((cat) => (
                                                                    <SelectItem key={cat} value={cat} className="my-1 cursor-pointer hover:bg-chart-1 p-1">
                                                                        {cat}
                                                                    </SelectItem>
                                                                ))}
                                                            </RadixSelect.Viewport>
                                                        </SelectContent>
                                                    </RadixSelect.Root>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="title">Título breve</Label>
                                                    <Input
                                                        id="title"
                                                        placeholder="Ex: Divórcio consensual"
                                                        value={data.title}
                                                        onChange={(e) => handleInputChange("title", e.target.value)}
                                                    />
                                                </div>

                                                <div className="flex justify-end pt-4">
                                                    <Button onClick={handleNext} disabled={!data.category || !data.title}>
                                                        Avançar
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {index === 1 && (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="description">Descrição do caso</Label>
                                                    <Textarea
                                                        id="description"
                                                        placeholder="Descreva sua situação com detalhes..."
                                                        className="min-h-[120px]"
                                                        value={data.description}
                                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Este caso é urgente?</Label>
                                                    <RadioGroup
                                                        value={data.isUrgent ? "Sim" : "Não"}
                                                        onValueChange={(value) => handleInputChange("isUrgent", value === "Sim")}
                                                        className="flex space-x-4"
                                                    >
                                                        <div
                                                            className={`flex items-center space-x-2 ${data.isUrgent ? "text-red-500" : ""
                                                                }`}
                                                        >
                                                            <RadioGroupItem value="Sim" id="urgent-yes" />
                                                            <Label htmlFor="urgent-yes">Sim</Label>
                                                        </div>
                                                        <div
                                                            className={`flex items-center space-x-2 ${!data.isUrgent ? "text-red-500" : ""
                                                                }`}
                                                        >
                                                            <RadioGroupItem value="Não" id="urgent-no" />
                                                            <Label htmlFor="urgent-no">Não</Label>
                                                        </div>
                                                    </RadioGroup>
                                                </div>

                                                <div className="flex justify-between pt-4">
                                                    <Button variant="outline" onClick={handleBack}>
                                                        Voltar
                                                    </Button>
                                                    <Button onClick={handleNext} disabled={!data.description}>
                                                        Avançar
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {index === 2 && (
                                            <div className="space-y-4">
                                                <div className="space-y-2" style={{ display: "flex", alignItems: "start", justifyContent: "start", flexDirection: "column" }}>
                                                    <Label>Prefere audiências online?</Label>
                                                    <RadixSelect.Root
                                                        value={data.prefersOnline}
                                                        onValueChange={(value) =>
                                                            handleInputChange("prefersOnline", value as "Sim" | "Não")
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione uma opção" />
                                                            <p>{data.prefersOnline}</p>
                                                        </SelectTrigger>

                                                        <SelectContent
                                                            className="bg-primary p-2 h-32 overflow-y-auto z-40"
                                                            position="popper"
                                                        >
                                                            <RadixSelect.Viewport>
                                                                <SelectItem value="Sim" className="my-1 cursor-pointer hover:bg-chart-1 p-1">Sim</SelectItem>
                                                                <SelectItem value="Não" className="my-1 cursor-pointer hover:bg-chart-1 p-1">Não</SelectItem>
                                                                <SelectItem value="Tanto faz" className="my-1 cursor-pointer hover:bg-chart-1 p-1">Tanto Faz</SelectItem>
                                                            </RadixSelect.Viewport>
                                                        </SelectContent>
                                                    </RadixSelect.Root>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Como prefere ser contatado?</Label>
                                                    <div className="space-y-2">
                                                        {contactMethods.map((method) => (
                                                            <div key={method.id} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    id={method.id}
                                                                    checked={data.contactMethod.includes(method.id)}
                                                                    onChange={(event) => {
                                                                        const checked = event.target.checked
                                                                        const newMethods = checked
                                                                            ? [...data.contactMethod, method.id]
                                                                            : data.contactMethod.filter((m) => m !== method.id)
                                                                        handleInputChange("contactMethod", newMethods)
                                                                    }}
                                                                />
                                                                <Label htmlFor={method.id}>{method.label}</Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-2" style={{ display: "flex", alignItems: "start", justifyContent: "start", flexDirection: "column" }}>
                                                    <Label>Melhor horário para contato</Label>
                                                    <RadixSelect.Root
                                                        value={data.bestTime}
                                                        onValueChange={(value) => handleInputChange("bestTime", value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione um horário" />
                                                            <p>{data.bestTime}</p>
                                                        </SelectTrigger>

                                                        <SelectContent
                                                            className="bg-primary p-2 h-32 overflow-y-auto z-40"
                                                            position="popper"
                                                        >
                                                            <RadixSelect.Viewport>
                                                                <SelectItem value="manha" className="my-1 cursor-pointer hover:bg-chart-1 p-1">Manhã (8h-12h)</SelectItem>
                                                                <SelectItem value="tarde" className="my-1 cursor-pointer hover:bg-chart-1 p-1">Tarde (13h-18h)</SelectItem>
                                                                <SelectItem value="noite" className="my-1 cursor-pointer hover:bg-chart-1 p-1">Noite (após 18h)</SelectItem>
                                                                <SelectItem value="qualquer" className="my-1 cursor-pointer hover:bg-chart-1 p-1">Qualquer horário</SelectItem>
                                                            </RadixSelect.Viewport>
                                                        </SelectContent>
                                                    </RadixSelect.Root>
                                                </div>

                                                <div className="flex justify-between pt-4">
                                                    <Button variant="outline" onClick={handleBack}>
                                                        Voltar
                                                    </Button>
                                                    <Button
                                                        onClick={handleNext}
                                                        disabled={data.contactMethod.length === 0 || !data.bestTime}
                                                    >
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
                                                                <p className="text-sm text-muted-foreground">Categoria</p>
                                                                <p>{data.category || "-"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Título</p>
                                                                <p>{data.title || "-"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Urgente</p>
                                                                <p>{data.isUrgent ? "Sim" : "Não"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Audiências online</p>
                                                                <p>{data.prefersOnline}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Contato preferido</p>
                                                                <p>
                                                                    {data.contactMethod.length > 0
                                                                        ? data.contactMethod
                                                                            .map((m) => {
                                                                                const method = contactMethods.find((cm) => cm.id === m)
                                                                                return method?.label
                                                                            })
                                                                            .join(", ")
                                                                        : "-"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Melhor horário</p>
                                                                <p>
                                                                    {data.bestTime === "manha"
                                                                        ? "Manhã (8h-12h)"
                                                                        : data.bestTime === "tarde"
                                                                            ? "Tarde (13h-18h)"
                                                                            : data.bestTime === "noite"
                                                                                ? "Noite (após 18h)"
                                                                                : data.bestTime === "qualquer"
                                                                                    ? "Qualquer horário"
                                                                                    : "-"}
                                                                </p>
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <p className="text-sm text-muted-foreground">Descrição</p>
                                                                <p className="whitespace-pre-line">{data.description || "-"}</p>
                                                            </div>
                                                        </div>
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
                                                        <Button variant={'secondary'} className="text-primary-foreground bg-tertiary hover:bg-chart-1" onClick={handleSubmit}>Confirmar e Enviar</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>
                        <div className="flex justify-center pt-4">
                            <Button variant="destructive" className="text-primary text-primary-foreground" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
