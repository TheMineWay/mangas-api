import { MangaChapterInfo } from './manga-chapter-info.type';
import { MangaStatus } from './manga-status.enum';

export interface MangaInfo {
  code: string;
  name: string;
  synopsis: string;
  status: MangaStatus;
  categories: string[];
  language: string; // <- Language code
  coverUrl: string;

  // Written
  authors: string[];

  // Chapters
  chapters: MangaChapterInfo[];
}
