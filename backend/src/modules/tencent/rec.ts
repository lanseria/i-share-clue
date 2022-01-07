import {
  CreateRecTaskResponse,
  DescribeTaskStatusResponse,
  TaskStatus,
} from 'tencentcloud-sdk-nodejs/tencentcloud/services/asr/v20190614/asr_models';
import { Asr } from './asr';
import { TencentOpt } from './tencent';

export class RecClient {
  private asrClient;
  constructor(tencentOpt: TencentOpt) {
    const asr = new Asr(tencentOpt, 'asr.tencentcloudapi.com');
    this.asrClient = asr.asr;
  }

  private createRecTask(url: string): Promise<CreateRecTaskResponse> {
    return new Promise((resolve, reject) => {
      this.asrClient
        .CreateRecTask({
          EngineModelType: '16k_zh_video',
          ChannelNum: 1,
          ResTextFormat: 2,
          SourceType: 0,
          Url: url,
          FilterPunc: 1,
        })
        .then(
          (data) => {
            resolve(data);
          },
          (err) => {
            reject(err);
          },
        );
    });
  }

  private describeTaskStatus(
    TaskId: number,
  ): Promise<DescribeTaskStatusResponse> {
    return new Promise((resolve, reject) => {
      this.asrClient
        .DescribeTaskStatus({
          TaskId,
        })
        .then(
          (data) => {
            resolve(data);
          },
          (err) => {
            reject(err);
          },
        );
    });
  }

  getDescResultData(Url: string): Promise<TaskStatus> {
    return new Promise(async (resolve, reject) => {
      const createResult = await this.createRecTask(Url);
      if (createResult.Data.TaskId) {
        const { TaskId } = createResult.Data;
        const timer = setInterval(async () => {
          const descResult = await this.describeTaskStatus(TaskId);
          const { StatusStr, Status } = descResult.Data;
          console.log(`识别结果查询响应：${StatusStr}`);
          if ([0, 1].includes(Status)) {
            // console.log('继续查询');
          } else {
            // 退出轮询
            clearInterval(timer);
            if (Status === 2) {
              console.log('执行成功');
              resolve(descResult.Data);
            } else {
              console.log('执行失败', Url, descResult);
              reject('执行失败');
            }
          }
        }, 5000);
      }
    });
  }
}
