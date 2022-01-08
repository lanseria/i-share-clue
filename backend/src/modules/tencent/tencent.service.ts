import { BufferedFile } from '@modules/minio-client/file.model';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { writeJson } from 'src/helpers/write';
import { CosClient } from './cos';
import { RecClient, RecOpt } from './rec';
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
    this.cosClient = new CosClient(this.tencentOpt, Logger.log);
    this.recClient = new RecClient(this.tencentOpt, Logger.log);
  }

  public async uploadToCOS(bufferedFile: BufferedFile) {
    try {
      Logger.log(JSON.stringify(this.tencentOpt));
      const uploadRes = await this.cosClient.uploadFile(bufferedFile);
      const getRes = await this.cosClient.getObjectUrl(
        bufferedFile.originalname,
      );
      if (/2\d\d/.test(uploadRes.statusCode.toString())) {
        Logger.log(getRes.Url, '上传 COS 对象成功');
        return getRes;
      } else {
        Logger.error(uploadRes);
        throw new Error('上传 COS 对象失败');
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  public async recAudioAndGenData(recOpt: RecOpt) {
    try {
      Logger.log(JSON.stringify(recOpt), '开始识别字幕');
      const taskStatusResult = await this.recClient.getDescResultData(recOpt);
      const subtitles = new Subtitles(taskStatusResult);
      const sliceData = subtitles.buildSliceData();
      const subtitlesRawJsonPath = await writeJson(
        sliceData,
        `data/${recOpt.Name}`,
      );
      Logger.log(subtitlesRawJsonPath, '写入JSON成功');
      return subtitlesRawJsonPath;
    } catch (error) {
      throw new Error(error);
    }
  }
}
