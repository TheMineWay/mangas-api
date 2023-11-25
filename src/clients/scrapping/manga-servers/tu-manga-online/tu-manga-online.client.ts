import { MangaChapter } from '../../../../types/manga/chapter/manga-chapter.type';
import { IScrappingClient } from '../../scrapping-client.interface';
import axios from 'axios';
import HTMLParser from 'node-html-parser';
import { MangaStatus } from '../../../../types/manga/info/manga-status.enum';
import { MangaInfo } from '../../../../types/manga/info/manga-info.type';
import { StreamableFile } from '@nestjs/common';
import { MangaExploreInfo } from '../../../../types/manga/explore/manga-explore-info.type';
import { MangaExploreFiltersDTO } from '../../../../dtos/manga/explore/manga-explore-filters.dto';
import { Language } from '../../../../types/languages/language.enum';

export class TuMangaOnlineClient implements IScrappingClient {
  private readonly BASE_URL = 'https://visortmo.com';

  async getMangaInfoByCode(mangaCode: string) {
    const content = await this.getPageContent(
      `${this.BASE_URL}/manga-${mangaCode}`,
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
        'div.panel-story-chapter-list > ul.row-content-chapter > li',
      )
      .reverse()
      .map((node, i) => {
        const aNode = node.querySelector('a.chapter-name');
        const aSplitHref = aNode.attributes['href'].split('/');

        return {
          name: aNode.text,
          code: aSplitHref[aSplitHref.length - 1],
          number: i + 1,
        };
      });

    return {
      code: mangaCode,
      name: infoContainer.querySelector('div.story-info-right > h1').text,
      language: Language.en_US,
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
      coverUrl: infoContainer.querySelector('span.info-image > img.img-loading')
        .attributes['src'],
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
      `${this.BASE_URL}/manga-${mangaCode}/${chapterCode}`,
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
          Referer: 'https://chapmanganato.com/',
        },
      });
      return new StreamableFile(image.data);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async exploreCatalog(
    filters: MangaExploreFiltersDTO,
  ): Promise<MangaExploreInfo> {
    const content = await this.getPageContent(
      `${this.BASE_URL}/library?_pg=1&title=${filters.name.replaceAll(
        ' ',
        '+',
      )}`,
    );

    const resultNodes = content.querySelectorAll(
      'main.container-fluid > div.row > div.col-12.col-lg-8.col-xl-9 > div.row > div.element',
    );

    return {
      books: resultNodes.map((node) => {
        const thumbNode = node.querySelector('a > div.thumbnail');

        return {
          name: thumbNode.querySelector('div.thumbnail-title > h4').text,
          coverUrl: thumbNode.querySelector('style').text,
          code: node.attributes['data-identifier'],
        };
      }),
      count: resultNodes.length,
    };
  }

  async getPageContent(url: string) {
    const data = await axios.get<string>(url, {
      headers: {
        referer: url,
      },
    });

    return HTMLParser(data.data);
  }
}
