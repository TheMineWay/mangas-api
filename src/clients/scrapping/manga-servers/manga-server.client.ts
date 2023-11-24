import { MangaServer } from '../../../types/manga/servers/manga-server.enum';
import { IScrappingClient } from '../scrapping-client.interface';
import { ManganatoClient } from './manganato/manganato.client';
import { ManganeloClient } from './manganelo/manganelo.client';
import { InternalServerErrorException } from '@nestjs/common';

export class MangaServerClient {
  private constructor(private readonly scrappingClient: IScrappingClient) {}

  public static fromServerCode(server: MangaServer) {
    switch (server) {
      case MangaServer.MANGANELO:
        return new ManganeloClient();
      case MangaServer.MANGANATO:
        return new ManganatoClient();
    }
    throw new InternalServerErrorException();
  }

  async getMangaInfoByCode(mangaCode: string) {
    return await this.scrappingClient.getMangaInfoByCode(mangaCode);
  }
  async getChapterContentByMangaCodeAndChapterCode(
    mangaCode: string,
    chapterCode: string,
  ) {
    return await this.scrappingClient.getChapterContentByMangaCodeAndChapterCode(
      mangaCode,
      chapterCode,
    );
  }
  async getChapterImageByUrl(url: string) {
    return await this.scrappingClient.getImageByUrl(url);
  }
}
