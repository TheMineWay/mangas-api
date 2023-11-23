import { StreamableFile } from '@nestjs/common';
import { HTMLElement } from 'node-html-parser';
import { MangaExploreFiltersDTO } from '../../dtos/manga/explore/manga-explore-filters.dto';
import { MangaChapter } from '../../types/manga/chapter/manga-chapter.type';
import { MangaExploreInfo } from '../../types/manga/explore/manga-explore-info.type';
import { MangaInfo } from '../../types/manga/info/manga-info.type';

export interface IScrappingClient {
  getMangaInfoByCode(mangaCode: string): Promise<MangaInfo>;
  getChapterContentByMangaCodeAndChapterCode(
    mangaCode: string,
    chapterCode: string,
  ): Promise<MangaChapter>;
  getImageByUrl(url: string): Promise<StreamableFile>; // <- File stream

  // Explore catalog
  exploreCatalog(filters: MangaExploreFiltersDTO): Promise<MangaExploreInfo>;

  // Basic
  getPageContent(url: string): Promise<HTMLElement>;
}
