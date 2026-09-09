// src/modules/contact/contact.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './entities/contact.entity';
import { ApiResponse } from '../../common/dto/response.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private configService: ConfigService,
  ) {}

  /**
   * Valida o token recebido com a API de verificação do Google reCAPTCHA v3
   */
  private async verifyRecaptcha(token: string): Promise<boolean> {
    const secretKey =
      this.configService.get<string>('RECAPTCHA_SECRET_KEY') ||
      process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      this.logger.error(
        '❌ RECAPTCHA_SECRET_KEY não foi configurada nas variáveis de ambiente!'
      );
      return false;
    }

    try {
      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      });

      const data = await response.json();

      // reCAPTCHA v3: verifica sucesso e score (>= 0.5 indica alta probabilidade de ser humano)
      return data.success && typeof data.score === 'number' && data.score >= 0.5;
    } catch (error) {
      this.logger.error(`❌ Erro ao comunicar com API do Google reCAPTCHA: ${error.message}`);
      return false;
    }
  }

  async create(createContactDto: CreateContactDto): Promise<ApiResponse> {
    try {
      const { recaptchaToken, ...contactData } = createContactDto;

      // 1. Validação do reCAPTCHA
      const isHuman = await this.verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        this.logger.warn(
          `⚠️ Envio de formulário bloqueado pelo reCAPTCHA: ${contactData.name} - ${contactData.email}`
        );
        return ApiResponse.error(
          'Falha na verificação de segurança. Tente novamente.',
          ['Atividade suspeita detectada ou token reCAPTCHA inválido.']
        );
      }

      this.logger.log(
        `📩 Nova mensagem de contato: ${contactData.name} - ${contactData.email}`
      );

      // 2. Salvar no banco de dados (sem o campo recaptchaToken)
      const contact = this.contactRepository.create({
        ...contactData,
        metadata: {
          source: 'website',
          userAgent: 'N/A', // Será preenchido depois com o user agent real
        },
      });

      const savedContact = await this.contactRepository.save(contact);

      this.logger.log(`✅ Contato salvo com ID: ${savedContact.id}`);

      // TODO: Implementar envio de e-mail

      return ApiResponse.success(
        '✅ Mensagem recebida com sucesso! Em breve entraremos em contato.',
        {
          id: savedContact.id,
          name: savedContact.name,
          email: savedContact.email,
          interestArea: savedContact.interestArea,
        }
      );
    } catch (error) {
      this.logger.error(`❌ Erro ao processar contato: ${error.message}`);
      return ApiResponse.error(
        'Erro ao processar sua mensagem. Tente novamente mais tarde.',
        [error.message]
      );
    }
  }

  async findAll(): Promise<Contact[]> {
    return this.contactRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Contact> {
    return this.contactRepository.findOne({ where: { id } });
  }

  async updateStatus(id: number, isProcessed: boolean): Promise<Contact> {
    await this.contactRepository.update(id, { isProcessed });
    return this.findOne(id);
  }
}