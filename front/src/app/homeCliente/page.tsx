"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ChatAvocuss } from "@/components/home/comum/chatAvocuss";
import { Input } from "@/components/ui/input";
import { NavbarWeb } from "@/components/comum/navbarWeb";
import { motion } from "framer-motion";

export default function HomeCliente() {
    const [chatOpen, setChatOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isMobile) {
        return (
            <div className="min-h-screen bg-background text-foreground" >
                {/* Navbar */}
                <nav className="w-full p-4 bg-secondary text-secondary-foreground flex justify-between items-center rounded-b-2xl">
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src="/avatar.jpg" alt="Mr. Augusto" />
                            <AvatarFallback>MA</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-lg font-bold">Mr. Augusto</h1>
                            <p className="text-xs text-secondary-foreground">Processos finalizados: 3</p>
                            <p className="text-xs text-secondary-foreground">Processos em andamento: 2</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" size="icon">📩</Button>
                        <Button variant="ghost" size="icon">⚙️</Button>
                    </div>
                </nav>

                <div className="min-h-fit-content">
                    {/* Carrossel */}
                    <section className="p-3">
                        <Carousel className="w-full">
                            <CarouselContent>
                                <CarouselItem style={{ backgroundImage: 'url(./bg-mobile.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                    <Card className=" bg-card shadow-md min-h-44" style={{ background: 'linear-gradient(90deg, var(--reverse), rgba(0,0,0,0) 100%)' }}>
                                        <CardHeader>
                                            <CardTitle>Como entrar com um processo?</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>Saiba os passos para abrir um processo com rapidez e segurança.</p>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                                <CarouselItem style={{ backgroundImage: 'url(./carrossel1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                    <Card className="bg-card shadow-md min-h-44" style={{ background: 'linear-gradient(90deg, var(--reverse), rgba(0,0,0,0) 100%)' }}>
                                        <CardHeader>
                                            <CardTitle>Consultoria especializada</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>Obtenha suporte jurídico com especialistas de confiança.</p>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            </CarouselContent>
                        </Carousel>
                    </section>
                    {/* Grid de Navegação */}
                    <section className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <Button variant="outline" className="flex flex-col items-center gap-2 p-4 bg-tertiary hover:bg-tertiary/80 transition-colors">
                                {/* <Home className="w-6 h-6 text-primary" /> */}
                                <span className="text-xs text-primary">Início</span>
                            </Button>
                            <Button variant="outline" className="flex flex-col items-center gap-2 p-4 bg-tertiary hover:bg-tertiary/80 transition-colors">
                                {/* <Gavel className="w-6 h-6 text-primary" /> */}
                                <span className="text-xs text-primary">Processos</span>
                            </Button>
                            <Button variant="outline" className="flex flex-col items-center gap-2 p-4 bg-tertiary hover:bg-tertiary/80 transition-colors">
                                {/* <FileText className="w-6 h-6 text-primary" /> */}
                                <span className="text-xs text-primary">Documentos</span>
                            </Button>
                            <Button variant="outline" className="flex flex-col items-center gap-2 p-4 bg-tertiary hover:bg-tertiary/80 transition-colors">
                                {/* <Users className="w-6 h-6 text-primary" /> */}
                                <span className="text-xs text-primary">Advogados</span>
                            </Button>
                            <Button variant="outline" className="flex flex-col items-center gap-2 p-4 bg-tertiary hover:bg-tertiary/80 transition-colors">
                                {/* <Briefcase className="w-6 h-6 text-primary" /> */}
                                <span className="text-xs text-primary">Serviços</span>
                            </Button>
                            <Button variant="outline" className="flex flex-col items-center gap-2 p-4 bg-tertiary hover:bg-tertiary/80 transition-colors">
                                {/* <Calendar className="w-6 h-6 text-primary" /> */}
                                <span className="text-xs text-primary">Agenda</span>
                            </Button>
                            <Button variant="outline" className="flex flex-col items-center gap-2 p-4 bg-tertiary hover:bg-tertiary/80 transition-colors">
                                {/* <MessageCircle className="w-6 h-6 text-primary" /> */}
                                <span className="text-xs text-primary">Chat</span>
                            </Button>
                            <Button variant="outline" className="flex flex-col items-center gap-2 p-4 bg-tertiary hover:bg-tertiary/80 transition-colors">
                                {/* <Library className="w-6 h-6 text-primary" /> */}
                                <span className="text-xs text-primary">Biblioteca</span>
                            </Button>
                        </div>
                    </section>
                    {/* Banner Assistente Virtual */}
                    <section className="p-6 flex flex-col">
                        <div className="flex items-center gap-2">
                            <img src="/mr-avocuss-mascote.png" alt="Assistente" className="w-24 h-24" />
                            <div className="flex flex-col gap-2 items-center">
                                <h2 className="text-xl font-bold text-secondary-foreground">Sr. Avocuss</h2>
                                <p className="text-center text-secondary-foreground">Sempre à sua disposição para dúvidas rápidas!</p>
                            </div>
                        </div>
                        <Button className="mt-2 bg-secondary text-secondary-foreground" onClick={() => setChatOpen(true)}>
                            Conversar com Sr. Avocuss
                        </Button>
                        <ChatAvocuss open={chatOpen} onOpenChange={setChatOpen} />
                    </section>
                </div>

                {/* Footer de Navegação */}
                <footer className="w-full fixed bottom-0 bg-secondary text-secondary-foreground flex justify-around p-3 rounded-t-2xl">
                    <Button variant="ghost">Nav1</Button>
                    <Button variant="ghost">Nav2</Button>
                    <Button variant="ghost">Nav3</Button>
                </footer>
            </div>
        );
    } else {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
                {/* Navbar */}
                <NavbarWeb />

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
                        <Button className="bg-primary text-primary-foreground px-8 py-4 text-lg hover:bg-primary/90 transition-colors">
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

                {/* Chat com IA */}
                <button
                    onClick={() => setChatOpen(true)}
                    className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                >
                    💬
                </button>
                <ChatAvocuss open={chatOpen} onOpenChange={setChatOpen} />
            </div>
        );
    }

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
