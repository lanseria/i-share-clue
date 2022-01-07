import { BufferedFile } from '@modules/minio-client/file.model';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { writeJson } from 'src/helpers/write';
import { CosClient } from './cos';
import { RecClient } from './rec';
import { Subtitles } from './subtitles';
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
  constructor(private readonly configService: ConfigService) {
    this.cosClient = new CosClient(this.tencentOpt);
    this.recClient = new RecClient(this.tencentOpt);
  }

  public async uploadToCOS(bufferedFile: BufferedFile) {
    try {
      const uploadRes = await this.cosClient.uploadFile(bufferedFile);
      const getRes = await this.cosClient.getObjectUrl(
        bufferedFile.originalname,
      );
      if (!uploadRes.statusCode) {
        Logger.log(getRes.Url, '上传 COS 对象成功');
        return getRes;
      } else {
        throw new Error('上传 COS 对象失败');
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  public async recAudioAndGenData(url: string) {
    try {
      Logger.log(url, '开始识别字幕');
      const taskStatusResult = await this.recClient.getDescResultData(url);
      await writeJson(taskStatusResult, 'data/descResult');
      const subtitles = new Subtitles('data/descResult.json');
      const sliceData = subtitles.buildSliceData();
      await writeJson(sliceData, 'data/sliceData');
      Logger.log('data/sliceData.json', '写入JSON成功');
    } catch (error) {
      throw new Error(error);
    }
  }
}
