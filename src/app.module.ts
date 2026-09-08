import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ContactModule } from './modules/contact/contact.module';
import { HealthController } from './modules/health/health.controller';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    ContactModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}