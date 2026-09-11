import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      family: 4,
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_APP_PASSWORD'),
      },
    });
  }

  async sendContactEmails(data: {
    name: string;
    email: string;
    whatsapp: string;
    interestArea: string;
    message: string;
  }) {
    const gmailUser = this.configService.get<string>('GMAIL_USER');

    if (!gmailUser) {
      throw new Error('GMAIL_USER não configurado');
    }

    await this.transporter.sendMail({
      from: `"TeConta" <${gmailUser}>`,
      to: data.email,
      subject: 'Recebemos sua mensagem - TeConta',
      html: `
        <h2>Olá, ${data.name}!</h2>

        <p>Recebemos sua mensagem através do site TeConta.</p>

        <p><strong>Área de interesse:</strong> ${data.interestArea}</p>

        <p>
          Em breve entraremos em contato.
        </p>

        <p>Obrigado!</p>
      `,
    });

    await this.transporter.sendMail({
      from: `"TeConta" <${gmailUser}>`,
      to: gmailUser,
      subject: `Novo contato - ${data.name}`,
      html: `
        <h2>Novo contato recebido</h2>

        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>E-mail:</strong> ${data.email}</p>
        <p><strong>WhatsApp:</strong> ${data.whatsapp}</p>
        <p><strong>Área:</strong> ${data.interestArea}</p>

        <h3>Mensagem</h3>
        <p>${data.message}</p>
      `,
    });

    this.logger.log('📧 E-mails enviados com sucesso');
  }
}
