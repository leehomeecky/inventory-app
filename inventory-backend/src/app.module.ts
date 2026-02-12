import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoreModule } from './module/store/store.module';
import { ProductModule } from './module/product/product.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { MiscellaneousModule } from './module/miscellaneous/miscellaneous.module';
import { StorageModule } from './shared/config/storage/storage.module';
import { EnvModule } from './shared/config/env/env.module';
import { DbModule } from './shared/config/db/db.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    DbModule,
    EnvModule,
    StoreModule,
    ProductModule,
    StorageModule,
    MiscellaneousModule,

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
