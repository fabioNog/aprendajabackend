import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const port = configService.get('port') || 3001;
  const frontendUrl = configService.get('frontendUrl');

  // Lista de origens permitidas
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://aprendajaold.vercel.app',
    'https://aprendajaold.vercel.app/',
    // Se tiver domínio customizado, adicione aqui
    // 'https://seudominio.com',
  ];

  // CORS
  app.enableCors({
    origin: (origin, callback) => {
      // Permitir requisições sem origin (como Postman/Insomnia)
      if (!origin) {
        callback(null, true);
        return;
      }
      
      // Verificar se a origem é permitida
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        logger.warn(`❌ CORS bloqueado para: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
  });

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      validateCustomDecorators: true,
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Professor API')
    .setDescription(`
      API para o site do professor de Matemática e Tecnologia.
      
      ## Endpoints disponíveis:
      - **Contato**: Envio de mensagens do site
      - **Health**: Verificação de status da API
      
      ## Como usar:
      1. Use o endpoint /api/contact para enviar mensagens
      2. Consulte a documentação interativa abaixo
    `)
    .setVersion('1.0')
    .addTag('Contato', '📩 Endpoint para envio de mensagens de contato')
    .addTag('Saúde', '🏥 Endpoint para verificar status da API')
    .addServer(`http://localhost:${port}`, 'Servidor Local')
    .addServer('https://aprendaja-backend.onrender.com', 'Servidor Produção')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      operationsSorter: 'alpha',
      tagsSorter: 'alpha',
    },
  });

  // Iniciar servidor
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Servidor rodando em http://localhost:${port}`);
  logger.log(`📚 Documentação Swagger em http://localhost:${port}/api/docs`);
  logger.log(`🌐 CORS habilitado para: ${allowedOrigins.join(', ')}`);
  logger.log(`🔧 Ambiente: ${configService.get('environment')}`);
}

bootstrap();