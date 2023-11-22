import { Controller, Get } from '@nestjs/common';

@Controller('info')
export class InfoController {
  @Get()
  async getInfo() {
    return {};
  }
}
