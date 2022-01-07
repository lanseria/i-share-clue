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

@Processor('transfy-queue')
export class TransfyConsumer {
  constructor(
    private minioClientService: MinioClientService,

    @InjectRepository(TransfyRepository)
    private transfyRepository: TransfyRepository,
  ) {}

  @Process('video-rec')
  async videoRec(job: Job<TransfyEntity>) {
    Logger.log('pending...', '视频封面输出任务');
    let transfyEntity = job.data;
    const jobId = job.id;
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
      Logger.log('success!!!', '视频封面输出任务');
    } catch (error) {
      Logger.error(error);
      transfyEntity.status = 'identify_failed';
      throw new InternalServerErrorException();
    } finally {
      await this.transfyRepository.save(transfyEntity);
    }
  }

  @Process('audio-rec')
  async audioRec(job: Job<TransfyEntity>) {
    Logger.log('pending...', '音频识别任务');
  }
}
