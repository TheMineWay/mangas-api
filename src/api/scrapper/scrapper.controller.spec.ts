import { MangaServer } from '../../types/manga/servers/manga-server.enum';
import { ScrapperController } from './scrapper.controller';
import { ScrapperService } from './scrapper.service';

describe('ScrapperController', () => {
  let scrapperService: ScrapperService;
  let scrapperController: ScrapperController;

  beforeEach(() => {
    scrapperService = new ScrapperService();
    scrapperController = new ScrapperController(scrapperService);
  });

  describe('Get chapter content', () => {
    it('Should return an array of images (string)', async () => {
      const result = { images: ['imageUrl'] };
      jest
        .spyOn(scrapperService, 'getChapterContent')
        .mockImplementation(async () => result);

      expect(
        await scrapperController.getChapterContent(
          MangaServer.MANGANELO,
          'bv96541',
          'chapter-1',
        ),
      ).toBe(result);
    });
  });
});
