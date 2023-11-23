import { StreamableFile } from '@nestjs/common';
import { HTMLElement } from 'node-html-parser';
import { MangaChapter } from 'src/types/manga/chapter/manga-chapter.type';
import { MangaInfo } from 'src/types/manga/info/manga-info.type';

export interface IScrappingClient {
  getMangaInfoByCode(mangaCode: string): Promise<MangaInfo>;
  getChapterContentByMangaCodeAndChapterCode(
    mangaCode: string,
    chapterCode: string,
  ): Promise<MangaChapter>;
  getImageByUrl(url: string): Promise<StreamableFile>; // <- File stream

  // Basic
  getPageContent(url: string): Promise<HTMLElement>;
}
