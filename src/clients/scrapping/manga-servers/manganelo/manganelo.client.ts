import { MangaChapter } from 'src/types/manga/chapter/manga-chapter.type';
import { IScrappingClient } from '../../scrapping-client.interface';

export class ManganeloClient implements IScrappingClient {
  async getMangaInfoByCode(mangaCode: string) {
    return {};
  }
  getChapterContentByMangaCodeAndChapterCode(
    mangaCode: string,
    chapterCode: string,
  ): Promise<MangaChapter> {
    throw new Error('Method not implemented.');
  }
  getChapterImageByUrl(url: string): Promise<never> {
    throw new Error('Method not implemented.');
  }
}
