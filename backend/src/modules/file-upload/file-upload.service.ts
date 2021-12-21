import { BufferedFile } from '@modules/minio-client/file.model';
import { MinioClientService } from '@modules/minio-client/minio-client.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
  constructor(private minioClientService: MinioClientService) {}
  /**
   * 获取图片分页
   */
  async getFilePage() {
    const fileList = await this.minioClientService.getFileList();
    return fileList;
    // throw new Error('Method not implemented.');
  }
  /**
   * 上传图片
   * @param image 图片二进制
   * @returns
   */
  async uploadSingle(image: BufferedFile) {
    let uploaded_image = await this.minioClientService.upload(image);
    return {
      image_url: uploaded_image.url,
      message: 'success',
    };
  }
}
