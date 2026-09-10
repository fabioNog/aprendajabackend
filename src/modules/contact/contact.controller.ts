import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ApiResponse } from '../../common/dto/response.dto';

@ApiTags('Contato')
@Controller('api/contact')
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar mensagem de contato',
    description: 'Envia uma mensagem de contato do site para o professor',
  })
  @ApiBody({ type: CreateContactDto })
  @SwaggerResponse({
    status: 200,
    description: 'Mensagem enviada com sucesso',
    type: ApiResponse,
  })
  @SwaggerResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async create(
    @Body() createContactDto: CreateContactDto,
  ): Promise<ApiResponse> {
    this.logger.log(
      `📨 Recebendo mensagem de contato de: ${createContactDto.name}`,
    );
    return this.contactService.create(createContactDto);
  }

  // Endpoint para debug (opcional)
  @Get()
  @ApiOperation({
    summary: 'Listar todas as mensagens (debug)',
    description:
      'Retorna todas as mensagens recebidas (apenas para desenvolvimento)',
  })
  @SwaggerResponse({
    status: 200,
    description: 'Lista de mensagens',
  })
  async findAll() {
    return this.contactService.findAll();
  }
}
