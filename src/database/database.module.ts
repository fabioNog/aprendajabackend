import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Contact } from '../modules/contact/entities/contact.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'professor'),
        password: String(configService.get('DB_PASSWORD', 'professor123')), // Forçar string
        database: configService.get('DB_DATABASE', 'professor_db'),
        entities: [Contact],
        synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
        logging: configService.get('NODE_ENV') === 'development',
        // Configurações extras para evitar problemas de autenticação
        ssl: true,
        extra: {
          // Forçar autenticação com password
          auth: 'password',
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}