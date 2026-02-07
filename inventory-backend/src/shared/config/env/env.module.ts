import { Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  providers: [EnvService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: EnvService.validationSchema(),
    }),
  ],
})
export class EnvModule {}
