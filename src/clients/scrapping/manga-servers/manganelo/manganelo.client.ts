import { MangaChapter } from '../../../../types/manga/chapter/manga-chapter.type';
import { IScrappingClient } from '../../scrapping-client.interface';
import axios from 'axios';
import HTMLParser from 'node-html-parser';
import { MangaStatus } from '../../../../types/manga/info/manga-status.enum';
import { MangaInfo } from '../../../../types/manga/info/manga-info.type';
import { NotFoundException, StreamableFile } from '@nestjs/common';
import { MangaExploreInfo } from '../../../../types/manga/explore/manga-explore-info.type';
import { MangaExploreFiltersDTO } from '../../../../dtos/manga/explore/manga-explore-filters.dto';
import { Language } from '../../../../types/languages/language.enum';

export class ManganeloClient implements IScrappingClient {
  private readonly BASE_URL = 'https://chapmanganelo.com';

  async getMangaInfoByCode(mangaCode: string) {
    const urls = ['https://chapmanganelo.com', 'https://m.manganelo.com'];
    for (const url of urls) {
      const content = await this.getPageContent(
        `${url}/manga-${encodeURIComponent(mangaCode)}`,
      );

      if (content.querySelector('div.panel-not-found > p')) continue;

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
            name: aNode.text.trim(),
            code: aSplitHref[aSplitHref.length - 1],
            number: +node.attributes['id'].split('-')[1],
          };
        });

      return {
        code: mangaCode,
        name: infoContainer
          .querySelector('div.story-info-right > h1')
          .text.trim(),
        language: Language.en_US,
        authors: processedInfoTable
          .find(({ label }) => label.includes('Author'))
          ?.valueNode.querySelectorAll('a')
          .map(({ text }) => text.trim()),
        status:
          rawStatus === 'Completed'
            ? MangaStatus.COMPLETED
            : MangaStatus.ONGOING,
        categories: processedInfoTable
          .find(({ label }) => label.includes('Genres'))
          .valueNode.querySelectorAll('a')
          .map(({ text }) => text.trim()),
        coverUrl: infoContainer.querySelector(
          'span.info-image > img.img-loading',
        ).attributes['src'],
        synopsis: infoContainer
          .querySelector(
            'div.panel-story-info-description#panel-story-info-description',
          )
          .text.trim(),
        chapters,
      } satisfies MangaInfo;
    }

    throw new NotFoundException();
  }
  async getChapterContentByMangaCodeAndChapterCode(
    mangaCode: string,
    chapterCode: string,
  ): Promise<MangaChapter> {
    const content = await this.getPageContent(
      `${this.BASE_URL}/manga-${encodeURIComponent(
        mangaCode,
      )}/${encodeURIComponent(chapterCode)}`,
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

  async exploreCatalog(
    filters: MangaExploreFiltersDTO,
  ): Promise<MangaExploreInfo> {
    const content = await this.getPageContent(
      `https://m.manganelo.com/search/story/${encodeURIComponent(
        filters.name.replaceAll(' ', '_'),
      )}?page=${filters.page ?? 1}`,
    );

    const resultNodes = content.querySelectorAll(
      'div.panel-search-story > div',
    );

    const countNode = content.querySelector(
      'div.panel-page-number > div.group-qty > a',
    );

    return {
      books: resultNodes.map((node) => {
        const rNode = node.querySelector('div.item-right');
        const aLink = node.querySelector('a.item-img');

        const mangaPageLink = aLink.attributes['href'].split('/');

        return {
          name: rNode.querySelector('h3 > a').text.trim(),
          coverUrl: aLink.querySelector('img').attributes['src'],
          code: mangaPageLink[mangaPageLink.length - 1].substring(6),
        };
      }),
      count: countNode ? +countNode.text.split(' : ')[1] : resultNodes.length,
    };
  }

  async getPageContent(url: string) {
    const data = await axios.get<string>(url, {
      headers: {
        referer: url,
        DNT: 1,
      },
    });

    return HTMLParser(data.data);
  }
}
