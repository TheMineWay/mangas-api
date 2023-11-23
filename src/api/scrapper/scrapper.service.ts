import { Injectable } from '@nestjs/common';
import { MangaServerClient } from 'src/clients/scrapping/manga-servers/manga-server.client';
import { MangaServer } from 'src/types/manga/servers/manga-server.enum';

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
}
