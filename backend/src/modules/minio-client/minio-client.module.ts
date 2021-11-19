import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';
import { MinioClientService } from './minio-client.service';

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const cfg = {
          endPoint: config.get('MINIO_ENDPOINT'),
          port: +config.get('MINIO_PORT'),
          useSSL: false,
          accessKey: config.get('MINIO_ACCESSKEY'),
          secretKey: config.get('MINIO_SECRETKEY'),
        };
        console.log(cfg);
        return cfg;
      },
      inject: [ConfigService],
    }),
  ],

  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}
