import { Controller, Get, Param } from '@nestjs/common';
import { MangaServer } from 'src/types/manga/servers/manga-server.enum';
import { ScrapperService } from './scrapper.service';

@Controller('scrapper/:server')
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) {}

  @Get('info/:mangaCode')
  async getMangaInfo(
    @Param('server') server: MangaServer,
    @Param('mangaCode') mangaCode: string,
  ) {
    return await this.scrapperService.getMangaInfoByCode(server, mangaCode);
  }
}
