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

        return {
          type: 'postgres' as const,
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'professor'),
          password: String(configService.get('DB_PASSWORD', 'professor123')),
          database: configService.get('DB_DATABASE', 'professor_db'),
          entities: [Contact],
          synchronize: true,
          logging: !isProduction,
          ssl: isProduction ? { rejectUnauthorized: false } : false,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}