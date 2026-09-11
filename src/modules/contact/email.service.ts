import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private transporter;

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

  // restante do código...
}
