import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { AdminModule } from '@admin/admin.module';
import { AuthModule } from '@modules/auth/auth.module';
import { DatabaseModule } from '@database/database.module';
import { MinioClientModule } from './modules/minio-client/minio-client.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { TencentModule } from './modules/tencent/tencent.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const cfg = {
          redis: {
            host: config.get('REDIS_HOST'),
            port: +config.get('REDIS_PORT'),
          },
          name: 'transfy-queue',
        };
        return cfg;
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    MinioClientModule,
    FileUploadModule,
    TencentModule,
    AdminModule,
    AuthModule,
  ],
})
export class AppModule {
  static port: number;
  static apiVersion: string;
  static apiPrefix: string;

  constructor(private readonly configService: ConfigService) {
    AppModule.port = +this.configService.get('API_PORT');
    AppModule.apiVersion = this.configService.get('API_VERSION');
    AppModule.apiPrefix = this.configService.get('API_PREFIX');
  }
}
