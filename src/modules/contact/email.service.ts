import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import dns from 'node:dns';

// Prioriza IPv4 para evitar problemas de conectividade IPv6
// em ambientes como o Render.
dns.setDefaultResultOrder('ipv4first');

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const gmailUser = this.configService.get<string>('GMAIL_USER');

    const gmailPassword = this.configService.get<string>('GMAIL_APP_PASSWORD');

    if (!gmailUser) {
      throw new Error(
        'GMAIL_USER não foi configurado nas variáveis de ambiente.',
      );
    }

    if (!gmailPassword) {
      throw new Error(
        'GMAIL_APP_PASSWORD não foi configurado nas variáveis de ambiente.',
      );
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,

      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    });

    this.logger.log('📧 Serviço de e-mail SMTP configurado');
  }

  /**
   * Envia e-mail de confirmação para quem preencheu o formulário
   * e uma notificação para o administrador.
   */
  async sendContactEmails(data: {
    name: string;
    email: string;
    whatsapp: string;
    interestArea: string;
    message: string;
  }): Promise<void> {
    const gmailUser = this.configService.get<string>('GMAIL_USER');

    if (!gmailUser) {
      throw new Error('GMAIL_USER não configurado.');
    }

    try {
      this.logger.log(`📤 Enviando e-mail de confirmação para: ${data.email}`);

      // ============================================================
      // 1. E-MAIL PARA A PESSOA QUE ENVIOU O FORMULÁRIO
      // ============================================================

      await this.transporter.sendMail({
        from: `"TeConta" <${gmailUser}>`,
        to: data.email,
        subject: 'Recebemos sua mensagem - TeConta',

        html: `
          <!DOCTYPE html>
          <html lang="pt-BR">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>TeConta - Mensagem recebida</title>
            </head>

            <body style="
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
              font-family: Arial, Helvetica, sans-serif;
            ">

              <div style="
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
              ">

                <div style="
                  padding: 30px;
                  background-color: #003F84;
                  color: #ffffff;
                  text-align: center;
                ">
                  <h1 style="margin: 0;">
                    TeConta
                  </h1>

                  <p style="margin: 10px 0 0;">
                    Matemática e Tecnologia
                  </p>
                </div>

                <div style="padding: 30px;">

                  <h2>
                    Olá, ${this.escapeHtml(data.name)}!
                  </h2>

                  <p>
                    Recebemos sua mensagem através do nosso site.
                  </p>

                  <p>
                    Obrigado pelo seu interesse. Em breve entraremos
                    em contato.
                  </p>

                  <hr style="
                    border: 0;
                    border-top: 1px solid #eeeeee;
                    margin: 25px 0;
                  ">

                  <h3>
                    Dados enviados
                  </h3>

                  <p>
                    <strong>Área de interesse:</strong>
                    ${this.escapeHtml(data.interestArea)}
                  </p>

                  <p>
                    <strong>WhatsApp:</strong>
                    ${this.escapeHtml(data.whatsapp)}
                  </p>

                  <p>
                    <strong>Mensagem:</strong>
                  </p>

                  <p style="
                    background-color: #f8f8f8;
                    padding: 15px;
                    border-radius: 6px;
                  ">
                    ${this.escapeHtml(data.message)}
                  </p>

                </div>

                <div style="
                  padding: 20px;
                  background-color: #f5f5f5;
                  text-align: center;
                  font-size: 12px;
                  color: #777777;
                ">
                  Este é um e-mail automático. Por favor, não responda
                  diretamente a esta mensagem.
                </div>

              </div>

            </body>
          </html>
        `,
      });

      this.logger.log(`✅ E-mail de confirmação enviado para: ${data.email}`);

      // ============================================================
      // 2. E-MAIL PARA O ADMINISTRADOR
      // ============================================================

      this.logger.log(`📤 Enviando notificação para: ${gmailUser}`);

      await this.transporter.sendMail({
        from: `"TeConta" <${gmailUser}>`,
        to: gmailUser,
        replyTo: data.email,

        subject: `Novo contato - ${data.name}`,

        html: `
          <!DOCTYPE html>
          <html lang="pt-BR">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Novo contato - TeConta</title>
            </head>

            <body style="
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
              font-family: Arial, Helvetica, sans-serif;
            ">

              <div style="
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
              ">

                <div style="
                  padding: 30px;
                  background-color: #003F84;
                  color: #ffffff;
                ">
                  <h1 style="margin: 0;">
                    Novo contato recebido
                  </h1>

                  <p style="margin-bottom: 0;">
                    TeConta
                  </p>
                </div>

                <div style="padding: 30px;">

                  <h2>
                    Dados do contato
                  </h2>

                  <p>
                    <strong>Nome:</strong>
                    ${this.escapeHtml(data.name)}
                  </p>

                  <p>
                    <strong>E-mail:</strong>
                    ${this.escapeHtml(data.email)}
                  </p>

                  <p>
                    <strong>WhatsApp:</strong>
                    ${this.escapeHtml(data.whatsapp)}
                  </p>

                  <p>
                    <strong>Área de interesse:</strong>
                    ${this.escapeHtml(data.interestArea)}
                  </p>

                  <hr style="
                    border: 0;
                    border-top: 1px solid #eeeeee;
                    margin: 25px 0;
                  ">

                  <h3>
                    Mensagem
                  </h3>

                  <div style="
                    background-color: #f8f8f8;
                    padding: 20px;
                    border-radius: 6px;
                  ">
                    ${this.escapeHtml(data.message)}
                  </div>

                </div>

                <div style="
                  padding: 20px;
                  background-color: #f5f5f5;
                  text-align: center;
                  font-size: 12px;
                  color: #777777;
                ">
                  Mensagem enviada através do formulário de contato
                  do site TeConta.
                </div>

              </div>

            </body>
          </html>
        `,
      });

      this.logger.log('✅ Notificação de novo contato enviada com sucesso');
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro desconhecido ao enviar e-mail';

      this.logger.error(`❌ Erro ao enviar e-mail: ${errorMessage}`);

      throw error;
    }
  }

  /**
   * Escapa caracteres HTML para evitar que dados do formulário
   * sejam interpretados como HTML dentro do e-mail.
   */
  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
