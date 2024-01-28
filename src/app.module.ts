import { Module } from '@nestjs/common';
import { ApiKeyGuard, ApiKeysModule } from 'nestjs-api-keys';
import { getEnv } from './utils/config/get-env';
import { ApiPermissions } from './constants/permissions/api-permissions.enum';
import { ApiModule } from './api/api.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ApiKeysModule.registerAsync(async () => {
      require('dotenv').config();
      const { apiKeys: keys } = getEnv();
      return {
        apiKeys: [
          {
            name: 'API KEYS',
            keys,
            permissions: [ApiPermissions.USE],
          },
        ],
      };
    }),
    ApiModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard({ permissions: [ApiPermissions.USE] }),
    },
  ],
})
export class AppModule {}
