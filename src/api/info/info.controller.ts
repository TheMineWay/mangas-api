import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Information')
@Controller('info')
export class InfoController {
  @Get()
  async getInfo() {
    return {};
  }
}
