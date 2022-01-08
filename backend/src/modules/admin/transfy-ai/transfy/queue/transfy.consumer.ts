import { BufferedFile } from '@modules/minio-client/file.model';
import { MinioClientService } from '@modules/minio-client/minio-client.service';
import { TencentService } from '@modules/tencent/tencent.service';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Bull, { Job } from 'bull';
import { readFileRetBufedFile } from 'src/helpers/read';
import { writeFileRetpath } from 'src/helpers/write';
import { TransfyEntity } from '../transfy.entity';
import { TransfyRepository } from '../transfy.repository';
import { Ffmpeg } from './ffmpeg';

const SUCCESS = 'SUCCESS!';
const PENDING = 'PENDING...';
const FAILED = 'FAILED!!!';

const VIDEO_REC = '视频识别任务';
const AUDIO_REC = '音频识别任务';

@Processor('transfy-queue')
export class TransfyConsumer {
  private transfyEntity: TransfyEntity;
  private jobId: Bull.JobId;
  constructor(
    private minioClientService: MinioClientService,
    private tencentService: TencentService,
    @InjectRepository(TransfyRepository)
    private transfyRepository: TransfyRepository,
  ) {}

  @Process('video-rec')
  async videoRec(job: Job<TransfyEntity>) {
    this.jobId = job.id;
    this.log(PENDING, VIDEO_REC);
    // 赋值变量
    this.transfyEntity = job.data;
    // 生成视频封面
    const videoPath = await this.generateVideoCover();
    // 分离音视频文件
    const audioBufedFile = await this.sliceVideoAudio(videoPath);
    // 上传至COS进行识别
    const subtitlesRawJsonPath = await this.uploadAudioAndRec(audioBufedFile);
    // 上传本地 Minio 进行保存并存 objectName 至实体
    await this.uploadRecFile(subtitlesRawJsonPath);
    this.log(SUCCESS, VIDEO_REC);
    try {
      this.transfyEntity.status = 'to_be_proofread';
    } catch (error) {
      Logger.error(error);
    } finally {
      await this.transfyRepository.save(this.transfyEntity);
    }
  }

  @Process('audio-rec')
  async audioRec(job: Job<TransfyEntity>) {
    this.jobId = job.id;
    this.log(PENDING, AUDIO_REC);
    // 上传至COS进行识别
    // await this.uploadAudioAndRec();
    this.log(SUCCESS, AUDIO_REC);
  }
  /**
   * RecJsonFile 上传并保存
   * @param subtitlesRawJsonPath RecJsonFile 上传并保存
   */
  private async uploadRecFile(
    subtitlesRawJsonPath: string,
    CONTEXT = 'RecJsonFile上传并保存',
  ) {
    this.log(PENDING, CONTEXT);
    try {
      this.log(subtitlesRawJsonPath, CONTEXT);
      const res = await this.minioClientService.upload(
        await readFileRetBufedFile(subtitlesRawJsonPath),
      );
      this.transfyEntity.recResJsonObjectName = res.name;
      this.log(SUCCESS, CONTEXT);
    } catch (error) {
      Logger.error(error);
      this.error(CONTEXT, error);
    } finally {
      await this.transfyRepository.save(this.transfyEntity);
    }
  }
  /**
   * 上传至COS进行识别
   */
  private async uploadAudioAndRec(
    audioBufedFile: BufferedFile,
    CONTEXT = '上传至COS进行识别',
  ) {
    try {
      this.log(PENDING, CONTEXT);
      const getRes = await this.tencentService.uploadToCOS(audioBufedFile);
      const subtitlesRawJsonPath = await this.tencentService.recAudioAndGenData(
        {
          Name: this.transfyEntity.objectName,
          Url: getRes.Url,
          EngineModelType: this.transfyEntity.engineModel,
        },
      );
      this.log(SUCCESS, CONTEXT);
      return subtitlesRawJsonPath;
    } catch (error) {
      Logger.error(error);
      this.error(CONTEXT, error);
    } finally {
      await this.transfyRepository.save(this.transfyEntity);
    }
  }
  /**
   * 分离音视频文件
   * @param videoPath
   * @param CONTEXT
   * @returns
   */
  private async sliceVideoAudio(videoPath: string, CONTEXT = '分离音视频文件') {
    this.log(PENDING, CONTEXT);
    try {
      const audioPath = await Ffmpeg.extractVideoAudio(videoPath);
      const audioBufedFile = await readFileRetBufedFile(audioPath);
      this.log(SUCCESS, CONTEXT);
      return audioBufedFile;
    } catch (error) {
      this.log(FAILED, CONTEXT);
      Logger.error(error);
      this.error(CONTEXT, error);
    } finally {
      await this.transfyRepository.save(this.transfyEntity);
    }
  }
  /**
   * 视频封面输出任务
   * @param transfyEntity
   * @param CONTEXT
   */
  private async generateVideoCover(CONTEXT = '视频封面输出任务') {
    this.log(PENDING, CONTEXT);
    try {
      const data = await this.minioClientService.downloadFile(
        this.transfyEntity.objectName,
      );
      const videoPath = await writeFileRetpath(
        this.transfyEntity.objectName,
        data,
      );
      const coverPath = await Ffmpeg.generateCover(videoPath);
      const coverBufedFile = await readFileRetBufedFile(coverPath);
      const { url } = await this.minioClientService.upload(coverBufedFile);
      this.transfyEntity.poster = '//' + url;
      this.log(SUCCESS, CONTEXT);
      return videoPath;
    } catch (error) {
      this.log(FAILED, CONTEXT);
      Logger.error(error);
      this.error(CONTEXT, error);
    } finally {
      await this.transfyRepository.save(this.transfyEntity);
    }
  }
  private log(message: string, Context) {
    Logger.log(message, `${Context}[${this.jobId}]`);
  }
  private error(CONTEXT: string, error: any) {
    this.transfyEntity.errorDetail = `[${CONTEXT}]: ${JSON.stringify(error)}`;
    this.transfyEntity.status = 'identify_failed';
  }
}
