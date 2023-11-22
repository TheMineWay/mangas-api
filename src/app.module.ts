import { Module } from '@nestjs/common';
import { ApiKeysModule } from 'nestjs-api-keys';
import { getEnv } from './utils/config/get-env';
import { ApiPermissions } from './constants/permissions/api-permissions.enum';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    ApiKeysModule.registerAsync(async () => {
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
  providers: [],
})
export class AppModule {}
