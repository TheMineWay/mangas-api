import { MangaChapter } from 'src/types/manga/chapter/manga-chapter.type';
import { IScrappingClient } from '../../scrapping-client.interface';
import axios from 'axios';
import HTMLParser from 'node-html-parser';
import { MangaStatus } from 'src/types/manga/info/manga-status.enum';
import { MangaInfo } from 'src/types/manga/info/manga-info.type';

export class ManganeloClient implements IScrappingClient {
  private readonly baseUrl = 'https://chapmanganelo.com/';

  async getMangaInfoByCode(mangaCode: string) {
    const content = await this.getPageContent(
      `${this.baseUrl}/manga-${mangaCode}`,
    );

    const infoContainer = content.querySelector(
      'div.container.container-main > div.container-main-left > div.panel-story-info',
    );

    const infoTable = infoContainer.querySelectorAll(
      'table.variations-tableInfo > tbody > tr',
    );

    const processedInfoTable = infoTable.map((row) => ({
      label: row.querySelector('td.table-label').childNodes[1].text,
      valueNode: row.querySelector('td.table-value'),
    }));

    const rawStatus = processedInfoTable.find(({ label }) =>
      label.includes('Status'),
    ).valueNode.text;

    return {
      code: mangaCode,
      name: infoContainer.querySelector('div.story-info-right > h1').text,
      language: 'en_US',
      authors: processedInfoTable
        .find(({ label }) => label.includes('Author'))
        ?.valueNode.querySelectorAll('a')
        .map(({ text }) => text),
      status:
        rawStatus === 'Completed' ? MangaStatus.COMPLETED : MangaStatus.ONGOING,
      categories: processedInfoTable
        .find(({ label }) => label.includes('Genres'))
        .valueNode.querySelectorAll('a')
        .map(({ text }) => text),
      synopsis: infoContainer.querySelector(
        'div.panel-story-info-description#panel-story-info-description',
      ).text,
      lastUpdate: new Date(),
      chapters: [],
    } satisfies MangaInfo;
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

  async getPageContent(url: string) {
    const data = await axios.get<string>(url, {
      headers: {
        referer: 'https://m.manganelo.com/',
        DNT: 1,
        Host: 'chapmanganelo.com',
      },
    });

    return HTMLParser(data.data);
  }
}
