"use client";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ServiceTerms() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Link href="#" className="underline underline-offset-4 hover:text-primary">
          Termos de Serviço
        </Link>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Termos de Serviço</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p><span>Última atualização:</span> 12/02/2025</p>

          <p>Bem-vindo ao <span>AVOCUSS</span>! Ao utilizar nossa plataforma, você concorda com estes Termos de Serviço. Leia-os atentamente antes de prosseguir.</p>

          <h2>1. Aceitação dos Termos</h2>
          <p>Ao criar uma conta ou utilizar nossos serviços, você confirma que leu, entendeu e concorda com estes <span>Termos de Serviço</span> e com nossa <span>Política de Privacidade</span>. Se você não concordar com estes termos, não utilize nossa plataforma.</p>

          <h2>2. Descrição do Serviço</h2>
          <p>O <span>AVOCUSS</span> é uma plataforma que conecta clientes a advogados, facilitando a gestão de processos jurídicos, a comunicação entre as partes e o acesso a informações jurídicas. O aplicativo também oferece ferramentas para envio de documentos, acompanhamento de casos e suporte via inteligência artificial.</p>

          <h2>3. Cadastro e Uso da Plataforma</h2>
          <ul>
            <li>Para utilizar nossos serviços, você deve criar uma conta fornecendo informações precisas e atualizadas.</li>
            <li>Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta.</li>
            <li>Menores de 18 anos não podem utilizar a plataforma sem o consentimento de um responsável legal.</li>
          </ul>

          <h2>4. Responsabilidades do Usuário</h2>
          <ul>
            <li>Você concorda em utilizar a plataforma apenas para fins legais e de acordo com estes Termos.</li>
            <li>É proibido usar a plataforma para enviar conteúdo ofensivo, fraudulento ou que viole direitos de terceiros.</li>
            <li>Você é responsável por todos os documentos e informações que enviar através da plataforma.</li>
          </ul>

          <h2>5. Propriedade Intelectual</h2>
          <p>Todo o conteúdo da plataforma (textos, imagens, logos, software) é protegido por direitos autorais e propriedade intelectual. Você não pode copiar, modificar ou distribuir esse conteúdo sem autorização prévia.</p>

          <h2>6. Limitação de Responsabilidade</h2>
          <ul>
            <li>O <span>AVOCUSS</span> atua como intermediário entre clientes e advogados, não sendo responsável pela qualidade dos serviços prestados pelos advogados.</li>
            <li>Não nos responsabilizamos por danos diretos, indiretos ou incidentais decorrentes do uso da plataforma.</li>
          </ul>

          <h2>7. Modificações nos Termos</h2>
          <p>Reservamos o direito de modificar estes Termos a qualquer momento. Alterações significativas serão comunicadas por e-mail ou através de notificações no aplicativo. O uso continuado da plataforma após as mudanças implica na aceitação dos novos termos.</p>

          <h2>8. Rescisão</h2>
          <p>Podemos suspender ou encerrar sua conta a qualquer momento, sem aviso prévio, caso você viole estes Termos ou pratique atividades fraudulentas.</p>

          <h2>9. Lei Aplicável</h2>
          <p>Estes Termos são regidos pelas leis do <span>Brasil</span> e quaisquer disputas serão resolvidas nos tribunais competentes dessa localidade.</p>

          <h2>10. Contato</h2>
          <p>Em caso de dúvidas sobre estes Termos, entre em contato conosco através de <span>avocuss@gmail.com</span>.</p>
        </DialogDescription>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
