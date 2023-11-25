import { Injectable } from '@nestjs/common';
import { MangaServer } from '../../types/manga/servers/manga-server.enum';
import { Language } from '../../types/languages/language.enum';

@Injectable()
export class InfoService {
  getMangaServers() {
    return [
      {
        code: MangaServer.MANGANELO,
        languages: [Language.en_US],
        homepage: 'https://m.manganelo.com/wwww',
      },
      {
        code: MangaServer.MANGANATO,
        languages: [Language.en_US],
        homepage: 'https://manganato.com',
      },
      {
        code: MangaServer.TU_MANGA_ONLINE,
        languages: [Language.es_ES],
        homepage: 'https://visortmo.com',
      },
    ] satisfies {
      code: MangaServer;
      languages: Language[];
      homepage: string;
    }[];
  }
}
