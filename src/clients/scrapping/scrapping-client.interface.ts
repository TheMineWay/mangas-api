import { MangaChapter } from 'src/types/manga/chapter/manga-chapter.type';
import { MangaInfo } from 'src/types/manga/info/manga-info.type';

export interface IScrappingClient {
  getMangaInfoByCode(mangaCode: string): Promise<MangaInfo>;
  getChapterContentByMangaCodeAndChapterCode(
    mangaCode: string,
    chapterCode: string,
  ): Promise<MangaChapter>;
  getChapterImageByUrl(url: string): Promise<never>; // <- File stream
}
