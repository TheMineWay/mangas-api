import { Module } from '@nestjs/common';
import { ScrapperController } from './scrapper.controller';

@Module({
  controllers: [ScrapperController],
})
export class ScrapperModule {}
