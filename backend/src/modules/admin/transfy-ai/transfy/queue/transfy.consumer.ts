import { BufferedFile } from '@modules/minio-client/file.model';
import { MinioClientService } from '@modules/minio-client/minio-client.service';
import { Process, Processor } from '@nestjs/bull';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
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
  constructor(
    private minioClientService: MinioClientService,

    @InjectRepository(TransfyRepository)
    private transfyRepository: TransfyRepository,
  ) {}

  @Process('video-rec')
  async videoRec(job: Job<TransfyEntity>) {
    const jobId = job.id;
    Logger.log(PENDING, `${VIDEO_REC}[${jobId}]`);
    let transfyEntity = job.data;
    await this.generateVideoCover(transfyEntity);
    Logger.log(PENDING, `${VIDEO_REC}`);
  }

  @Process('audio-rec')
  async audioRec(job: Job<TransfyEntity>) {
    const jobId = job.id;
    Logger.log(PENDING, `${AUDIO_REC}[${jobId}]`);
    // TODO:
  }
  /**
   * 视频封面输出任务
   * @param transfyEntity
   */
  private async generateVideoCover(
    transfyEntity: TransfyEntity,
    CONTEXT = '视频封面输出任务',
  ) {
    Logger.log(PENDING, CONTEXT);
    try {
      const data = await this.minioClientService.downloadFile(
        transfyEntity.objectName,
      );
      const videoPath = await writeFileRetpath(transfyEntity.objectName, data);
      const coverPath = await Ffmpeg.generateCover(videoPath);
      const coverBufedFile = await readFileRetBufedFile(coverPath);
      const { url } = await this.minioClientService.upload(coverBufedFile);
      transfyEntity.poster = '//' + url;
      transfyEntity.status = 'to_be_proofread';
      Logger.log(SUCCESS, CONTEXT);
    } catch (error) {
      Logger.error(FAILED, CONTEXT);
      Logger.error(error);
      transfyEntity.status = 'identify_failed';
    } finally {
      await this.transfyRepository.save(transfyEntity);
    }
  }
}
