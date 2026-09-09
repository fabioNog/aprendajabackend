import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Contact } from '../modules/contact/entities/contact.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const databaseUrl = configService.get<string>('DATABASE_URL');

        // Se existir DATABASE_URL (injetada no Render), conecta direto via URL
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [Contact],
            synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
            logging: !isProduction,
            ssl: isProduction ? { rejectUnauthorized: false } : false,
          };
        }

        // Caso contrário, usa as variáveis individuais (desenvolvimento local)
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: Number(configService.get('DB_PORT', 5432)),
          username: configService.get<string>('DB_USERNAME', 'professor'),
          password: String(configService.get('DB_PASSWORD', 'professor123')),
          database: configService.get<string>('DB_DATABASE', 'professor_db'),
          entities: [Contact],
          synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
          logging: !isProduction,
          ssl: isProduction ? { rejectUnauthorized: false } : false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}