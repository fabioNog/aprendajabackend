import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_APP_PASSWORD'),
      },
    });
  }

  async sendContactEmails(data: {
    name: string;
    email: string;
    whatsapp?: string;
    interestArea?: string;
    message: string;
  }): Promise<void> {
    const gmailUser = this.configService.get<string>('GMAIL_USER');

    if (!gmailUser) {
      throw new Error('GMAIL_USER não configurado.');
    }

    if (!this.configService.get<string>('GMAIL_APP_PASSWORD')) {
      throw new Error('GMAIL_APP_PASSWORD não configurado.');
    }

    // Estilos reutilizáveis para compatibilidade de e-mail
    const fontFamily =
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

    // 1. E-mail de confirmação para o CANDIDATO
    const candidateMail = {
      from: `"TeConta" <${gmailUser}>`,
      to: data.email,
      subject: 'Recebemos seu contato! - TeConta',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: ${fontFamily}; color: #1e293b;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background-color: #2563eb; padding: 32px 40px; text-align: left;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">TeConta</h1>
                    </td>
                  </tr>

                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 20px; font-weight: 600;">Olá, ${data.name}!</h2>
                      <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px; line-height: 1.6;">
                        Obrigado por entrar em contato conosco. Recebemos sua mensagem com sucesso e nossa equipe responderá em breve.
                      </p>

                      <!-- Resumo dos dados cadastrados -->
                      <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                        <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Resumo das Informações</p>
                        
                        <table width="100%" cellspacing="0" cellpadding="4" style="font-size: 14px; color: #334155;">
                          <tr>
                            <td style="padding: 4px 0; font-weight: 600; width: 140px;">Área de Interesse:</td>
                            <td style="padding: 4px 0;">${data.interestArea || 'Não informada'}</td>
                          </tr>
                          <tr>
                            <td style="padding: 4px 0; font-weight: 600;">WhatsApp:</td>
                            <td style="padding: 4px 0;">${data.whatsapp || 'Não informado'}</td>
                          </tr>
                        </table>
                      </div>

                      <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.6;">
                        Se você tiver alguma dúvida adicional, basta responder a este e-mail.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
                      <p style="margin: 0; color: #94a3b8; font-size: 13px;">
                        © ${new Date().getFullYear()} TeConta. Todos os direitos reservados.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    // 2. E-mail de notificação para o ADMIN
    const adminMail = {
      from: `"Formulário TeConta" <${gmailUser}>`,
      to: gmailUser,
      subject: `🚨 Novo lead cadastrado: ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: ${fontFamily}; color: #1e293b;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                  
                  <!-- Header Admin -->
                  <tr>
                    <td style="background-color: #0f172a; padding: 24px 40px; border-bottom: 3px solid #2563eb;">
                      <p style="margin: 0; color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">TeConta Admin</p>
                      <h1 style="margin: 4px 0 0 0; color: #ffffff; font-size: 20px; font-weight: 600;">Novo Contato do Site</h1>
                    </td>
                  </tr>

                  <!-- Body Admin -->
                  <tr>
                    <td style="padding: 32px 40px;">
                      
                      <!-- Card de Detalhes -->
                      <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                        <tr>
                          <td style="padding-bottom: 12px; border-bottom: 1px solid #f1f5f9;">
                            <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Nome</span>
                            <div style="font-size: 16px; font-weight: 600; color: #0f172a; margin-top: 2px;">${data.name}</div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                            <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">E-mail</span>
                            <div style="font-size: 15px; color: #2563eb; margin-top: 2px;">
                              <a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">${data.email}</a>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                            <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">WhatsApp</span>
                            <div style="font-size: 15px; color: #0f172a; margin-top: 2px;">
                              ${
                                data.whatsapp
                                  ? `<a href="https://wa.me/55${data.whatsapp.replace(/\D/g, '')}" target="_blank" style="color: #16a34a; font-weight: 600; text-decoration: none;">${data.whatsapp} ↗</a>`
                                  : 'Não informado'
                              }
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top: 12px;">
                            <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Área de Interesse</span>
                            <div style="font-size: 15px; color: #0f172a; margin-top: 2px;">
                              <span style="display: inline-block; background-color: #eff6ff; color: #1d4ed8; font-weight: 600; font-size: 13px; padding: 4px 10px; border-radius: 20px;">
                                ${data.interestArea || 'Não informada'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- Mensagem do Lead -->
                      <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 8px;">Mensagem</span>
                      <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; border-radius: 0 8px 8px 0; padding: 16px; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message}</div>

                    </td>
                  </tr>

                  <!-- Footer Admin -->
                  <tr>
                    <td style="background-color: #f8fafc; padding: 16px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
                      <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                        Notificação enviada automaticamente pelo sistema TeConta.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await Promise.all([
      this.transporter.sendMail(candidateMail),
      this.transporter.sendMail(adminMail),
    ]);

    this.logger.log(
      `📧 E-mails enviados com sucesso para ${data.email} e ${gmailUser}`,
    );
  }
}
