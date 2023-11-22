import { Module } from '@nestjs/common';
import { ScrapperModule } from './scrapper/scrapper.module';
import { InfoModule } from './info/info.module';

@Module({ imports: [ScrapperModule, InfoModule] })
export class ApiModule {}
