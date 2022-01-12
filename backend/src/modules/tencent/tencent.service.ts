import { BufferedFile } from '@modules/minio-client/file.model';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TaskStatus } from 'tencentcloud-sdk-nodejs/tencentcloud/services/asr/v20190614/asr_models';
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

  public async recAudio(recOpt: RecOpt) {
    try {
      Logger.log('recOpt', '开始识别字幕');
      const taskStatusResult = await this.recClient.getDescResultData(recOpt);
      Logger.log('taskStatusResult', '识别并获取字幕成功');
      return taskStatusResult;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async genSliceSubtitles(taskStatusResult: TaskStatus) {
    try {
      Logger.log('recOpt', '开始智能分割字幕');
      const subtitles = new Subtitles(taskStatusResult);
      const sliceData = subtitles.buildSliceData();
      Logger.log('sliceData', '智能分割字幕成功');
      return sliceData;
    } catch (error) {
      throw new Error(error);
    }
  }
}
