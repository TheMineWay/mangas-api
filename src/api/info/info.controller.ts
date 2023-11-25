import { Controller, Get } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SWAGGER_API_KEY_NAME } from '../../constants/open-api/swagger.constants';
import { InfoService } from './info.service';

@ApiSecurity(SWAGGER_API_KEY_NAME)
@ApiTags('Information')
@Controller('info')
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Get('servers')
  async getInfo() {
    return this.infoService.getMangaServers();
  }
}
