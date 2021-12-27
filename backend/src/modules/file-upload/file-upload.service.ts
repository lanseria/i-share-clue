import { PaginationRequest } from '@common/interfaces';
import { Pagination } from '@helpers';
import { BufferedFile } from '@modules/minio-client/file.model';
import { MinioClientService } from '@modules/minio-client/minio-client.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
  constructor(private minioClientService: MinioClientService) {}
  deleteFile(names: string[]) {
    return this.minioClientService.deleteFile(names);
  }
  downloadFile(name: string) {
    return this.minioClientService.downloadFile(name);
  }
  /**
   * 获取图片分页
   */
  async getFilePage(pagination: PaginationRequest) {
    const [files, total] = await this.minioClientService.getFilesAndCount(
      pagination,
    );
    return Pagination.of(pagination, total, files);
  }
  /**
   * 上传文件
   * @param file 文件二进制
   * @returns
   */
  async uploadFile(file: BufferedFile) {
    let uploaded_file = await this.minioClientService.upload(file);
    return {
      id: uploaded_file.name,
      url: uploaded_file.url,
      status: 'finished',
      name: uploaded_file.name,
    };
  }
  /**
   * 上传图片
   * @param image 图片二进制
   * @returns
   */
  async uploadSingle(image: BufferedFile) {
    let uploaded_image = await this.minioClientService.upload(image, [
      'jpeg',
      'png',
    ]);
    return {
      image_url: uploaded_image.url,
      message: 'success',
    };
  }
}
