// src/modules/contact/dto/create-contact.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { 
  IsEmail, 
  IsString, 
  IsOptional, 
  MinLength, 
  MaxLength,
  IsIn,
  IsNotEmpty 
} from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    description: 'Nome completo do aluno',
    example: 'João Silva',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'E-mail do aluno',
    example: 'joao@email.com',
  })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({
    description: 'WhatsApp do aluno (opcional)',
    example: '11999999999',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'WhatsApp deve ser uma string' })
  whatsapp?: string;

  @ApiProperty({
    description: 'Área de interesse do aluno',
    example: 'Tecnologia para terceira idade',
    enum: [
      'Tecnologia para terceira idade',
      'Matemática',
      'Programação',
      'Desenvolvimento Web',
      'Banco de Dados',
      'Outro'
    ]
  })
  @IsString({ message: 'Área de interesse deve ser uma string' })
  @IsIn([
    'Tecnologia para terceira idade',
    'Matemática',
    'Programação',
    'Desenvolvimento Web',
    'Banco de Dados',
    'Outro'
  ], { message: 'Área de interesse inválida' })
  interestArea: string;

  @ApiProperty({
    description: 'Mensagem do aluno',
    example: 'Quero aprender a usar o WhatsApp e fazer videochamadas',
  })
  @IsString({ message: 'Mensagem deve ser uma string' })
  @MinLength(10, { message: 'Mensagem deve ter pelo menos 10 caracteres' })
  @MaxLength(500, { message: 'Mensagem deve ter no máximo 500 caracteres' })
  message: string;

  @ApiProperty({
    description: 'Token gerado pelo reCAPTCHA v3 no frontend',
    example: '03AFcWeA7...',
  })
  @IsString({ message: 'Token reCAPTCHA deve ser uma string' })
  @IsNotEmpty({ message: 'Token reCAPTCHA é obrigatório' })
  recaptchaToken: string;
}