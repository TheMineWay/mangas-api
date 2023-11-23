import { Injectable } from '@nestjs/common';
import { MangaServerClient } from '../../clients/scrapping/manga-servers/manga-server.client';
import { MangaExploreFiltersDTO } from '../../dtos/manga/explore/manga-explore-filters.dto';
import { MangaServer } from '../../types/manga/servers/manga-server.enum';

@Injectable()
export class ScrapperService {
  async getMangaInfoByCode(server: MangaServer, mangaCode: string) {
    return await MangaServerClient.fromServerCode(server).getMangaInfoByCode(
      mangaCode,
    );
  }

  async getChapterContent(
    server: MangaServer,
    mangaCode: string,
    chapterCode: string,
  ) {
    return await MangaServerClient.fromServerCode(
      server,
    ).getChapterContentByMangaCodeAndChapterCode(mangaCode, chapterCode);
  }

  async getImageByUrl(server: MangaServer, imageUrl: string) {
    return await MangaServerClient.fromServerCode(server).getImageByUrl(
      imageUrl,
    );
  }

  async exploreCatalog(server: MangaServer, filters: MangaExploreFiltersDTO) {
    return await MangaServerClient.fromServerCode(server).exploreCatalog(
      filters,
    );
  }
}
