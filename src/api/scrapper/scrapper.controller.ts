import { Controller, Get, Param, Query } from '@nestjs/common';
import { MangaServer } from '../../types/manga/servers/manga-server.enum';
import { ScrapperService } from './scrapper.service';
import { MangaExploreFiltersDTO } from '../../dtos/manga/explore/manga-explore-filters.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SWAGGER_API_KEY_NAME } from '../../constants/open-api/swagger.constants';

@ApiSecurity(SWAGGER_API_KEY_NAME)
@ApiTags('Scrapper')
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

  @Get('explore')
  async exploreCatalog(
    @Param('server') server: MangaServer,
    @Query() filters: MangaExploreFiltersDTO,
  ) {
    return await this.scrapperService.exploreCatalog(server, filters);
  }
}
