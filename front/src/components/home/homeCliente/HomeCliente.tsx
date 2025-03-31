"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Calendar, Book, Briefcase, Video } from "lucide-react";
import { useResponsive } from "@/hooks/useResponsive";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useLayout } from "@/contexts/LayoutContext";
// import { ChatAvocuss } from "../../comum/chatAvocuss";
// import { Dialog } from "@/components/ui/dialog";

export function HomeCliente() {

    const { updateConfig } = useLayout();

    const { updateAuth } = useAuth();
    useEffect(() => {
        updateAuth({
            requireAuth: true,
            redirectTo: "/login"
        });
    }, [updateAuth]);

    useEffect(() => {
        updateConfig({
            showNavbar: true,
            showSidebar: false,
            showFooter: true
        });
    }, [updateConfig]);


    const { isMobile } = useResponsive();

    if (isMobile) {
        return <AuthGuard>
                <MobileView />
               </AuthGuard>
    }

    return <AuthGuard>
             <DesktopView />
           </AuthGuard>
}

function DesktopView() {
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
                    <Button variant="default">
                        Saiba Mais
                    </Button>
                </motion.div>
            </section>

            {/* Serviços */}
            <section className="py-20 px-4 w-full max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">Nossos Serviços</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Oferecemos uma ampla gama de serviços jurídicos personalizados para suas necessidades.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="bg-card shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                        <CardHeader>
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Briefcase className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle>Consultoria Jurídica</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Acesso a advogados especializados para orientação em questões jurídicas diversas.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                        <CardHeader>
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Book className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle>Documentação Legal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Preparação e revisão de documentos, contratos e acordos legais.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                        <CardHeader>
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Calendar className="w-8 h-8 text-primary" />
                            </div>
                            <CardTitle>Acompanhamento Processual</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Monitoramento e gestão de processos judiciais em andamento.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Pesquisa de Advogados */}
            <section className="py-20 px-4 w-full bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Encontre um Advogado</h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Busque por especialidade, localização ou nome para encontrar o profissional ideal para seu caso.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
                        <Input placeholder="Especialidade ou área de atuação" className="flex-1" />
                        <Input placeholder="Localização" className="flex-1" />
                        <Button variant="default" className="w-full md:w-auto">Buscar</Button>
                    </div>
                </div>
            </section>

            {/* Depoimentos */}
            <section className="py-20 px-4 w-full max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">O Que Nossos Clientes Dizem</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Veja a experiência de quem já utilizou nossos serviços e encontrou a solução jurídica ideal.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card className="bg-card shadow-md">
                        <CardContent className="pt-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                                    <span className="text-primary font-bold">MS</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Maria Silva</h3>
                                    <p className="text-sm text-muted-foreground">Cliente desde 2021</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground">
                                &apos;Encontrei o advogado perfeito para meu caso através da plataforma. O processo foi rápido e o atendimento excelente!&apos;
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card shadow-md">
                        <CardContent className="pt-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                                    <span className="text-primary font-bold">JP</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold">João Paulo</h3>
                                    <p className="text-sm text-muted-foreground">Cliente desde 2022</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground">
                                &apos;A consultoria jurídica me ajudou a resolver questões que pareciam impossíveis. Recomendo fortemente.&apos;
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card shadow-md">
                        <CardContent className="pt-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                                    <span className="text-primary font-bold">CA</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Carolina Almeida</h3>
                                    <p className="text-sm text-muted-foreground">Cliente desde 2020</p>
                                </div>
                            </div>
                            <p className="text-muted-foreground">
                                &apos;O acompanhamento processual foi essencial para o sucesso do meu caso. Sempre me mantiveram informada sobre cada etapa.&apos;
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}

function MobileView() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % 2); // Alterna entre 0 e 1 (número de itens do carrossel)
        }, 3000); // 1 segundo

        return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    }, []);

    return (
        <div className="min-h-fit-content bg-background text-foreground">
            <div>
                {/* Carrossel */}
                <section className="p-3">
                    <Carousel className="w-full">
                        <CarouselContent className="min-h-48 max-h-48">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                            >
                                {activeIndex === 0 && (
                                    <CarouselItem>
                                        <Card className=" bg-card shadow-md text-slate-800" style={{ backgroundImage: 'url(./carroussel-neutro.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                            <CardHeader>
                                                <CardTitle>Como entrar com um processo?</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p>Saiba os passos para abrir um processo com rapidez e segurança.</p>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                )}
                                {activeIndex === 1 && (
                                    <CarouselItem>
                                        <Card className=" bg-card shadow-md text-slate-800" style={{ backgroundImage: 'url(./carroussel-neutro-2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                            <CardHeader>
                                                <CardTitle>Encontre um advogado</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p>Busque profissionais por especialidade e localização.</p>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                )}
                            </motion.div>
                        </CarouselContent>
                    </Carousel>
                </section>

                {/* Menu de serviços */}
                <section className="p-3 mb-4">
                    <h2 className="text-lg font-bold mb-2">Serviços</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Card className="bg-card shadow-md">
                            <CardContent className="p-4 flex flex-col items-center justify-center min-h-24">
                                <Briefcase className="w-6 h-6 mb-2 text-secondary" />
                                <div className="text-sm font-medium text-center">Consultoria Jurídica</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card shadow-md">
                            <CardContent className="p-4 flex flex-col items-center justify-center min-h-24">
                                <Book className="w-6 h-6 mb-2 text-secondary" />
                                <div className="text-sm font-medium text-center">Biblioteca</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card shadow-md">
                            <CardContent className="p-4 flex flex-col items-center justify-center min-h-24">
                                <Calendar className="w-6 h-6 mb-2 text-secondary" />
                                <div className="text-sm font-medium text-center">Acompanhamento</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card shadow-md">
                            <CardContent className="p-4 flex flex-col items-center justify-center min-h-24">
                                <Video className="w-6 h-6 mb-2 text-secondary" />
                                <div className="text-sm font-medium text-center">Videoteca</div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Chat flutuante */}
                {/* {chatOpen ? (
                    <Dialog open={chatOpen} onOpenChange={setChatOpen}>
                        <ChatAvocuss open={chatOpen} onOpenChange={setChatOpen} />
                    </Dialog>
                ) : (
                    <Button
                        onClick={() => setChatOpen(true)}
                        className="fixed bottom-20 right-4 rounded-full w-14 h-14 bg-primary shadow-lg"
                    >
                        💬
                    </Button>
                )} */}

            </div>
        </div>
    );
}