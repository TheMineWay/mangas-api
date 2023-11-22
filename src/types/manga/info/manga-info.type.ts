import { MangaChapterInfo } from './manga-chapter-info.type';
import { MangaStatus } from './manga-status.enum';

export interface MangaInfo {
  code: string;
  name: string;
  synopsis: string;
  status: MangaStatus;
  categories: string[];
  language: string; // <- Language code

  // Written
  authors: string[];
  lastUpdate: Date;

  // Chapters
  chapters: MangaChapterInfo[];
}
