import { Controller, Get } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SWAGGER_API_KEY_NAME } from '../../constants/open-api/swagger.constants';
import { MangaServer } from 'src/types/manga/servers/manga-server.enum';
import { Language } from 'src/types/languages/language.enum';

@ApiSecurity(SWAGGER_API_KEY_NAME)
@ApiTags('Information')
@Controller('info')
export class InfoController {
  @Get('servers')
  async getInfo() {
    return [
      {
        code: MangaServer.MANGANELO,
        languages: [Language.en_US],
        homepage: 'https://m.manganelo.com/wwww',
      },
    ];
  }
}
