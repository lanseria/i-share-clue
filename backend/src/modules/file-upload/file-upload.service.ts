import { BufferedFile } from '@modules/minio-client/file.model';
import { MinioClientService } from '@modules/minio-client/minio-client.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
  constructor(private minioClientService: MinioClientService) {}
  async uploadSingle(image: BufferedFile) {
    let uploaded_image = await this.minioClientService.upload(image);
    return {
      image_url: uploaded_image.url,
      message: 'success',
    };
  }
}
