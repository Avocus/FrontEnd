import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { EmailRequest } from '@/types/api';

const resend = new Resend(process.env.RESEND_API_KEY);

type NotificacaoEmailData = {
  success: boolean;
  message: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NotificacaoEmailData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    const { para, titulo, dataEvento, descricao, localizacao }: EmailRequest = req.body;

    if (!para || !titulo || !dataEvento) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: para, titulo, dataEvento'
      });
    }

    const dataFormatada = new Date(dataEvento).toLocaleString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Criar o HTML do e-mail
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          🗓️ Lembrete de Evento
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-top: 0;">${titulo}</h3>
          <p style="color: #4b5563; margin: 10px 0;">
            <strong>📅 Data e Hora:</strong> ${dataFormatada}
          </p>
          ${descricao ? `<p style="color: #4b5563; margin: 10px 0;"><strong>📝 Descrição:</strong> ${descricao}</p>` : ''}
          ${localizacao ? `<p style="color: #4b5563; margin: 10px 0;"><strong>📍 Local:</strong> ${localizacao}</p>` : ''}
        </div>
        
        <div style="background-color: #dbeafe; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
          <p style="color: #1e40af; margin: 0; font-size: 14px;">
            Este é um lembrete automático do sistema Avoccus. Não responda a este e-mail.
          </p>
        </div>
      </div>
    `;

    try {
      // Enviar e-mail usando Resend
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: [para],
        subject: `🗓️ Lembrete: ${titulo}`,
        html: htmlContent,
      });

      if (error) {
        console.error('Erro do Resend:', error);
        return res.status(500).json({
          success: false,
          message: 'Erro ao enviar e-mail',
          error: error.message
        });
      }

      return res.status(200).json({
        success: true,
        message: `E-mail de notificação enviado com sucesso para ${para}`
      });

    } catch (emailError) {
      console.error('Erro ao enviar e-mail:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Erro ao enviar e-mail',
        error: emailError instanceof Error ? emailError.message : 'Erro desconhecido'
      });
    }

  } catch (error) {
    console.error('Erro ao processar notificação:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}
