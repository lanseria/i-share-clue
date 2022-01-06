import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { QueueModule } from './modules/queue/queue.module';
import { AdminModule } from '@admin/admin.module';
import { AuthModule } from '@modules/auth/auth.module';
import { DatabaseModule } from '@database/database.module';
import { MinioClientModule } from './modules/minio-client/minio-client.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    QueueModule,
    DatabaseModule,
    AdminModule,
    AuthModule,
    MinioClientModule,
    FileUploadModule,
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
