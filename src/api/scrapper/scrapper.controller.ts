import { Controller, Get, Param } from '@nestjs/common';
import { MangaServer } from 'src/types/manga/servers/manga-server.enum';
import { ScrapperService } from './scrapper.service';

@Controller('scrapper/:server')
export class ScrapperController {
  constructor(private readonly scrapperService: ScrapperService) {}

  @Get('manga/:mangaCode/info')
  async getMangaInfo(
    @Param('server') server: MangaServer,
    @Param('mangaCode') mangaCode: string,
  ) {
    return await this.scrapperService.getMangaInfoByCode(server, mangaCode);
  }

  @Get('manga/:mangaCode/chapter/:chapterCode/content')
  async getChapterContent(
    @Param('server') server: MangaServer,
    @Param('mangaCode') mangaCode: string,
    @Param('chapterCode') chapterCode: string,
  ) {
    return await this.scrapperService.getChapterContent(
      server,
      mangaCode,
      chapterCode,
    );
  }

  @Get('image/url/:imageUrl')
  async getImageByUrl(
    @Param('server') server: MangaServer,
    @Param('imageUrl') imageUrl: string,
  ) {
    return await this.scrapperService.getImageByUrl(server, imageUrl);
  }
}
