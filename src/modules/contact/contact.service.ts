import { Injectable, Logger } from '@nestjs/common';
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
  ) {}

  async create(createContactDto: CreateContactDto): Promise<ApiResponse> {
    try {
      this.logger.log(
        `📩 Nova mensagem de contato: ${createContactDto.name} - ${createContactDto.email}`
      );

      // Salvar no banco de dados
      const contact = this.contactRepository.create({
        ...createContactDto,
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