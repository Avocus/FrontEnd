"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";


export function HomeWebCliente() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center">

            {/* Hero Section */}
            <section className="w-full h-[90vh] flex items-center justify-center bg-cover bg-center relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-black bg-opacity-50"
                    style={{ backgroundImage: 'url(./fachada.jpg)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
                />
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center text-white max-w-3xl px-4"
                >
                    <h1 className="text-6xl font-bold mb-6">Encontre a Melhor Assessoria Jurídica</h1>
                    <p className="text-xl mb-8">
                        Conecte-se com especialistas e tenha suporte personalizado para seus processos.
                    </p>
                    <Button className="bg-primary text-secondary-foreground px-8 py-4 text-lg hover:bg-primary/90 transition-colors">
                        Saiba Mais
                    </Button>
                </motion.div>
            </section>

            {/* Seção de Serviços */}
            <section className="py-20 px-6 max-w-7xl w-full">
                <h2 className="text-4xl font-bold text-center mb-12">Nossos Serviços</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <Card className="shadow-lg hover:shadow-xl transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-lg">{service.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Seção de Destaques */}
            <section className="w-full bg-secondary py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-12">Por que Escolher a Avocuss?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {highlights.map((highlight, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="bg-background p-6 rounded-lg shadow-md">
                                    <h3 className="text-2xl font-bold mb-4">{highlight.title}</h3>
                                    <p className="text-lg">{highlight.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Seção de Contato */}
            <section className="py-20 px-6 max-w-3xl w-full text-center">
                <h2 className="text-4xl font-bold mb-6">Fale Conosco</h2>
                <p className="text-xl mb-8">
                    Entre em contato para tirar dúvidas e conhecer mais sobre nossos serviços.
                </p>
                <div className="flex flex-col items-center gap-4">
                    <Input placeholder="Seu e-mail" className="w-full max-w-md" />
                    <Button className="bg-primary text-primary-foreground px-8 py-4 text-lg hover:bg-primary/90 transition-colors">
                        Enviar
                    </Button>
                </div>
            </section>
        </div>
    );
}


// Dados para a seção de serviços
const services = [
    {
        title: "Consultoria Especializada",
        description: "Assessoria jurídica com especialistas renomados.",
    },
    {
        title: "Documentação Segura",
        description: "Gerencie e armazene seus documentos com segurança.",
    },
    {
        title: "Suporte 24/7",
        description: "Tenha atendimento rápido sempre que precisar.",
    },
];

// Dados para a seção de destaques
const highlights = [
    {
        title: "Especialistas Qualificados",
        description: "Profissionais com vasta experiência no mercado jurídico.",
    },
    {
        title: "Tecnologia Avançada",
        description: "Soluções tecnológicas para facilitar sua vida.",
    },
    {
        title: "Atendimento Personalizado",
        description: "Serviços adaptados às suas necessidades.",
    },
    {
        title: "Segurança Garantida",
        description: "Proteção total dos seus dados e documentos.",
    },
];
