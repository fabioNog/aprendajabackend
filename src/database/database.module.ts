import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Contact } from '../modules/contact/entities/contact.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = {
          type: 'postgres' as const,
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'professor'),
          password: String(configService.get('DB_PASSWORD', 'professor123')),
          database: configService.get('DB_DATABASE', 'professor_db'),
          entities: [Contact],
          synchronize: true, // 👈 DEVE SER TRUE
          logging: true, // 👈 Ative para ver o SQL
          ssl: true,
          extra: {
            auth: 'password',
          },
        }; // 👈 Debug
        return config;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}