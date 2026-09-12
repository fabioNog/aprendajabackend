import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ContactModule } from './modules/contact/contact.module';
import { HealthController } from './modules/health/health.controller';
import configuration from './config/configuration';
import { ResendModule } from 'nest-resend'; // 👈 importa

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 👇 Registra o Resend globalmente, lendo a chave do .env
    ResendModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>('RESEND_API_KEY'),
      }),
    }),

    DatabaseModule,
    ContactModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
