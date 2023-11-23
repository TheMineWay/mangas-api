import { Controller, Get } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SWAGGER_API_KEY_NAME } from '../../constants/open-api/swagger.constants';

@ApiSecurity(SWAGGER_API_KEY_NAME)
@ApiTags('Information')
@Controller('info')
export class InfoController {
  @Get()
  async getInfo() {
    return {};
  }
}
