import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Saúde')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Verificar status da API',
    description: 'Retorna o status atual da API e informações do sistema',
  })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'professor-api',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
