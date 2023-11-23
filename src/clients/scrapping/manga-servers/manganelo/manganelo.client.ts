import { MangaChapter } from 'src/types/manga/chapter/manga-chapter.type';
import { IScrappingClient } from '../../scrapping-client.interface';
import axios from 'axios';
import HTMLParser from 'node-html-parser';
import { MangaStatus } from 'src/types/manga/info/manga-status.enum';
import { MangaInfo } from 'src/types/manga/info/manga-info.type';
import { StreamableFile } from '@nestjs/common';

export class ManganeloClient implements IScrappingClient {
  private readonly baseUrl = 'https://chapmanganelo.com';

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

    const chapters = content
      .querySelectorAll(
        'div.panel-story-chapter-list > ul#row-content-chapter > li',
      )
      .map((node) => {
        const aNode = node.querySelector('a.chapter-name');
        const aSplitHref = aNode.attributes['href'].split('/');
        return {
          name: aNode.text,
          code: aSplitHref[aSplitHref.length - 1],
          number: +node.attributes['id'].split('-')[1],
        };
      });

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
      chapters,
    } satisfies MangaInfo;
  }
  async getChapterContentByMangaCodeAndChapterCode(
    mangaCode: string,
    chapterCode: string,
  ): Promise<MangaChapter> {
    const content = await this.getPageContent(
      `${this.baseUrl}/manga-${mangaCode}/${chapterCode}`,
    );

    return {
      images: content
        .querySelectorAll('div.container-chapter-reader > img')
        .map((node) => node.attributes['src']),
    };
  }
  async getImageByUrl(url: string) {
    try {
      const image = await axios.get(url, {
        responseType: 'stream',
        headers: {
          Accept: 'image/avif,image/webp,*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          DNT: 1,
          Referer: 'https://chapmanganelo.com/',
        },
      });
      return new StreamableFile(image.data);
    } catch (e) {
      console.log(e);
      throw e;
    }
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
