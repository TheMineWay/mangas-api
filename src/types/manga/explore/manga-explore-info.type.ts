export interface MangaExploreInfo {
  books: {
    name: string;
    code: string;
    coverUrl: string;
  }[];

  // Pagination
  count: number;
}
