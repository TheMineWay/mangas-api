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
      `${this.BASE_URL}/library/manga/${mangaCode}`,
    );

    const infoContainer = content.querySelector(
      'section.element > header > section.element-header-content > div.container > div.row',
    );

    const rawStatus = infoContainer.querySelector('span.book-status').text;

    const chapters = content
      .querySelectorAll(
        'main.element-body div#chapters > ul.list-group li.list-group-item.upload-link',
      )
      .reverse()
      .map((node, i) => {
        const chapterUrl = node
          .querySelector(
            'li.list-group-item div.text-right > a.btn.btn-default.btn-sm',
          )
          .attributes['href'].split('/');

        return {
          name: node
            .querySelector('h4 a.btn-collapse')
            .childNodes[1].text.trim(),
          code: chapterUrl[chapterUrl.length - 1],
          number: i + 1,
        };
      });

    return {
      code: mangaCode,
      name: infoContainer
        .querySelector(
          'div.element-header-content-text > h1.element-title.my-2',
        )
        .firstChild.text.trim(),
      language: Language.es_ES,
      authors: content
        .querySelectorAll(
          'div.row > div.col-12 > div.row > div.col-6.col-sm-4.col-md-3 > div.card > div.card-body > a > h5.card-title',
        )
        .filter(
          (node) =>
            node.parentNode.querySelector('p.card-text').text === 'Autor',
        )
        .map((node) => node.text.trim()),
      status:
        rawStatus === 'Finalizado'
          ? MangaStatus.COMPLETED
          : MangaStatus.ONGOING,
      categories: infoContainer
        .querySelectorAll('h6 > a.badge.badge-primary')
        .map(({ text }) => text),
      coverUrl: infoContainer.querySelector('div > img.book-thumbnail')
        .attributes['src'],
      synopsis: infoContainer.querySelector('div > p.element-description').text,
      chapters,
    } satisfies MangaInfo;
  }
  async getChapterContentByMangaCodeAndChapterCode(
    _: string, // Manga code is not required when using this manga server
    chapterCode: string,
  ): Promise<MangaChapter> {
    const content = await this.getPageContent(
      `${this.BASE_URL}/view_uploads/${chapterCode}`,
    );

    const splitChapterUrl = content
      .querySelector('div.OUTBRAIN')
      .attributes['data-src'].split('/');
    const realChapterCode = splitChapterUrl[splitChapterUrl.length - 2];

    const cascadeContent = await this.getPageContent(
      `${this.BASE_URL}/viewer/${realChapterCode}/cascade`,
    );

    return {
      images: cascadeContent
        .querySelectorAll('div#main-container > div.img-container > img')
        .map((node) => node.attributes['data-src']),
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
        const aNode = node.querySelector('a');
        const thumbNode = aNode.querySelector('div.thumbnail');

        const splitANode = aNode.attributes['href'].split('/');

        return {
          name: thumbNode.querySelector('div.thumbnail-title > h4').text,
          coverUrl: thumbNode.querySelector('style').text.split("'")[1],
          code: splitANode.splice(splitANode.length - 2).join('/'),
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
