import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CosClient } from './cos';
import { RecClient } from './rec';
import { TencentOpt } from './tencent';

@Injectable()
export class TencentService {
  private readonly tencentOpt: TencentOpt = {
    SecretId: this.configService.get('TENCENT_SECRET_ID'),
    SecretKey: this.configService.get('TENCENT_SECRET_KEY'),
    Bucket: this.configService.get('TENCENT_COS_BUCKET'),
    Region: this.configService.get('TENCENT_COS_REGION'),
  };
  private readonly cosClient: CosClient;
  private readonly recClient: RecClient;
  constructor(
    private readonly configService: ConfigService,
    private logger = new Logger('TencentService'),
  ) {
    this.cosClient = new CosClient(this.tencentOpt);
    this.recClient = new RecClient(this.tencentOpt);
  }
}
