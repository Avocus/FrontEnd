'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Gavel, Users, FileText, MessageCircle, Calendar, Library, Briefcase, Clock, Shield, UserCheck, Zap } from 'lucide-react';
import Image from 'next/image';
import { useLayout } from "@/contexts/LayoutContext";
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';

export default function Home() {
  const { updateConfig } = useLayout();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/home');
      return;
    }
    updateConfig({
      showNavbar: true,
      showSidebar: false,
      showFooter: true
    });
  }, [updateConfig, router, isAuthenticated]);

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            src="./legal-bg2.mp4"
            autoPlay
            loop
            muted
            className="object-cover w-full h-full"
          />
        </div>
        <div
          className="absolute inset-0 bg-black/50 z-10"
          style={{ backgroundColor: 'var(--filter-bg)', mixBlendMode: 'multiply' }}
        ></div>


        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-secondary-foreground mb-6"
          >
            Revolucione sua Experiência Jurídica
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-secondary-foreground/90 mb-8 max-w-3xl"
          >
            Conectamos clientes e advogados com tecnologia inteligente e segurança.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-4"
          >
            <Button className="bg-primary hover:bg-white/10 px-8 py-6 text-lg text-secondary-foreground" onClick={() => router.push("/login")}>
              Comece Agora
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Soluções Completas</h2>
          <p className="text-xl text-muted-foreground">
            Tudo que você precisa em uma única plataforma
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="bg-secondary p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <feature.icon className="text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-tertiary">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Como Funciona</h2>
            <p className="text-xl text-muted-foreground">
              Simples, rápido e eficiente
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className="bg-primary text-secondary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      <section className="py-20 px-8 max-w-7xl mx-auto bg-secondary/10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Seu Assistente Jurídico Pessoal</h2>
          <p className="text-xl text-muted-foreground">
            Tudo que você precisa para resolver questões legais com facilidade
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clientBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-tertiary h-full hover:shadow-lg transition-all duration-300 border-primary/20">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="bg-primary p-3 rounded-lg">
                    <benefit.icon className="text-secondary-foreground w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle>{benefit.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {benefit.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {benefit.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Zap className="text-secondary-foreground w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Seção Vantagens para Advogados */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Seu ERP Jurídico Completo</h2>
          <p className="text-xl text-muted-foreground">
            Ferramentas profissionais para otimizar sua prática jurídica
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
          {lawyerBenefits.map((benefit, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-background rounded-xl border p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-6 ">
                <div className="bg-tertiary p-3 rounded-lg">
                  <benefit.icon className="text-secondary-foreground w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground mt-1">{benefit.subtitle}</p>
                </div>
              </div>
              <div className="space-y-4">
                {benefit.features.map((feature, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="bg-secondary/50 rounded-full p-1 h-fit mt-0.5">
                      <UserCheck className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

            {/* Testimonials */}
            <section className="py-20 px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">O que dizem sobre nós</h2>
          <p className="text-xl text-muted-foreground">
            Depoimentos de quem já usa nossa plataforma
          </p>
        </motion.div>

        <Carousel className="w-full max-w-4xl mx-auto ">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <Card className="p-8 bg-tertiary">
                  <CardContent className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-secondary mb-6 overflow-hidden relative">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-lg italic mb-6">&quot;{testimonial.quote}&quot;</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    </div>
  );
}
const features = [
  {
    icon: Gavel,
    title: "Gestão de Processos",
    description: "Controle completo de prazos, documentos e comunicação com clientes."
  },
  {
    icon: Users,
    title: "Conexão Inteligente",
    description: "Encontre o advogado perfeito ou clientes qualificados com nosso sistema de matching."
  },
  {
    icon: FileText,
    title: "Documentos Seguros",
    description: "Armazene e compartilhe documentos com segurança."
  },
  {
    icon: MessageCircle,
    title: "Chat Integrado",
    description: "Comunicação direta entre clientes e advogados na plataforma."
  },
  {
    icon: Calendar,
    title: "Agenda Inteligente",
    description: "Organize audiências, prazos e compromissos em um calendário integrado."
  },
  {
    icon: Library,
    title: "Biblioteca Jurídica",
    description: "Acesso a conteúdos exclusivos e materiais de consulta."
  }
];

const steps = [
  {
    title: "Cadastro",
    description: "Crie sua conta em menos de 2 minutos."
  },
  {
    title: "Plataforma",
    description: "Aproveite todos os recursos disponíveis."
  },
  {
    title: "Conexão",
    description: "Encontre profissionais ou clientes ideais."
  },
  {
    title: "Gestão",
    description: "Acompanhe tudo em tempo real na plataforma."
  }
];

const testimonials = [
  {
    name: "Dr. Ana Silva",
    role: "Advogada Trabalhista",
    quote: "A plataforma revolucionou minha produtividade. Consigo gerenciar todos os processos em um só lugar e ainda captar novos clientes qualificados.",
    avatar: "/avatar-advogada.webp"
  },
  {
    name: "Carlos Mendes",
    role: "Cliente",
    quote: "Finalmente encontrei um advogado que realmente entende do meu caso. A plataforma tornou tudo tão simples e transparente!",
    avatar: "/avatar-cliente.webp"
  },
  {
    name: "Dra. Mariana Oliveira",
    role: "Advogada de Família",
    quote: "As ferramentas de gestão de tempo e documentos me poupam horas de trabalho burocrático. Recomendo para todos os colegas!",
    avatar: "/avatar-advogada2.webp"
  }
];

// Benefícios para Clientes
const clientBenefits = [
  {
    icon: Shield,
    title: "Proteção Jurídica",
    description: "Tenha sempre um advogado à disposição quando precisar",
    features: [
      "Acesso rápido a profissionais especializados",
      "Suporte 24/7 para emergências",
      "Cobertura para diversas áreas do direito"
    ]
  },
  {
    icon: Clock,
    title: "Economize Tempo",
    description: "Resolva questões jurídicas sem sair de casa",
    features: [
      "Agendamento online de consultas",
      "Envio digital de documentos",
      "Acompanhamento em tempo real dos processos"
    ]
  },
  {
    icon: FileText,
    title: "Transparência Total",
    description: "Controle completo sobre seus processos",
    features: [
      "Notificações sobre prazos importantes",
      "Histórico completo das movimentações",
    ]
  }
];

// Benefícios para Advogados
const lawyerBenefits = [
  {
    icon: Briefcase,
    title: "Gestão de Escritório",
    subtitle: "Tudo organizado em um só lugar",
    features: [
      {
        title: "Controle de Processos",
        description: "Visualize prazos, andamentos e documentos de todos os processos"
      },
      {
        title: "Automatização de Rotinas",
        description: "Petições automáticas, IA jurídica e alertas inteligentes"
      }
    ]
  },
  {
    icon: Users,
    title: "Ferramentas de Produtividade",
    subtitle: "Otimize seu tempo e aumente seus resultados",
    features: [
      {
        title: "Captação de Clientes",
        description: "Perfil profissional visível para potenciais clientes"
      },
      {
        title: "Agenda Integrada",
        description: "Agenda avançada para gerenciar audiências, prazos e compromissos"
      }
    ]
  }
];