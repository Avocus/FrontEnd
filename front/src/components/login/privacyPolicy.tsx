"use client";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PrivacyPolicy() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Link href="#" className="underline underline-offset-4 hover:text-primary">
          Política de Privacidade
        </Link>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Política de Privacidade</DialogTitle>
        </DialogHeader>
        <DialogDescription>
        <p><span>Última atualização:</span> 12/02/2025</p>

<p>No <span>AVOCUSS</span>, levamos a privacidade dos nossos usuários a sério. Esta <span>Política de Privacidade</span> explica como coletamos, usamos e protegemos suas informações pessoais.</p>

<h2>1. Informações Coletadas</h2>
<p>Coletamos os seguintes tipos de informações:</p>
<ul>
  <li><span>Informações Pessoais:</span> Nome, e-mail, telefone, endereço e outras informações fornecidas durante o cadastro.</li>
  <li><span>Dados de Uso:</span> Informações sobre como você interage com a plataforma, como páginas visitadas e funcionalidades utilizadas.</li>
  <li><span>Documentos e Arquivos:</span> Fotos, vídeos, áudios e outros documentos enviados por você.</li>
  <li><span>Dados de Localização:</span> Caso você permita, coletamos sua localização para conectar você a advogados próximos.</li>
</ul>

<h2>2. Uso das Informações</h2>
<p>Utilizamos suas informações para:</p>
<ul>
  <li>Fornecer e melhorar nossos serviços.</li>
  <li>Facilitar a comunicação entre clientes e advogados.</li>
  <li>Personalizar sua experiência na plataforma.</li>
  <li>Enviar notificações, atualizações e informações relevantes.</li>
  <li>Cumprir obrigações legais e regulatórias.</li>
</ul>

<h2>3. Compartilhamento de Informações</h2>
<p>Suas informações podem ser compartilhadas com:</p>
<ul>
  <li><span>Advogados:</span> Para que possam prestar os serviços solicitados.</li>
  <li><span>Parceiros de Negócios:</span> Empresas que nos ajudam a operar a plataforma (ex: hospedagem de dados).</li>
  <li><span>Autoridades Legais:</span> Quando exigido por lei ou para proteger nossos direitos.</li>
</ul>

<h2>4. Segurança dos Dados</h2>
<p>Implementamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração ou destruição. No entanto, nenhum sistema é 100% seguro, e não podemos garantir segurança absoluta.</p>

<h2>5. Retenção de Dados</h2>
<p>Mantemos suas informações pelo tempo necessário para cumprir os fins descritos nesta política, a menos que a lei exija um período maior.</p>

<h2>6. Seus Direitos</h2>
<p>Você tem o direito de:</p>
<ul>
  <li>Acessar, corrigir ou excluir suas informações pessoais.</li>
  <li>Revogar o consentimento para o uso de seus dados.</li>
  <li>Solicitar a portabilidade de seus dados para outra plataforma.</li>
  <li>Opor-se ao uso de suas informações para fins de marketing.</li>
</ul>

<h2>7. Cookies e Tecnologias Semelhantes</h2>
<p>Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência na plataforma. Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.</p>

<h2>8. Alterações na Política</h2>
<p>Podemos atualizar esta <span>Política de Privacidade</span> periodicamente. Alterações significativas serão comunicadas por e-mail ou através de notificações no aplicativo.</p>

<h2>9. Contato</h2>
<p>Para exercer seus direitos ou esclarecer dúvidas sobre esta Política, entre em contato conosco através de <span>avocuss@gmail.com</span>.</p>
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
