import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { FileResponseDto } from '@modules/file-upload/dtos/';
import { Stream } from 'stream';

@Injectable()
export class MinioClientService {
  private readonly baseBucket = this.configService.get('MINIO_BUCKET');
  public get client() {
    return this.minio.client;
  }

  constructor(
    private readonly minio: MinioService,
    private readonly configService: ConfigService, // private logger = new Logger('MinioStorageService'),
  ) {}

  async deleteFile(names: string[], baseBucket: string = this.baseBucket) {
    const result = await Promise.allSettled<string>(
      names.map((name) => {
        return new Promise((resolve, reject) => {
          this.client.removeObject(baseBucket, name, function (err) {
            if (err) {
              reject(err);
            }
            resolve(`Removed the object: ${name}`);
          });
        });
      }),
    );
    return result;
  }

  downloadFile(
    name: string,
    baseBucket: string = this.baseBucket,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      let size = 0;
      let chunks: Buffer[] = [];
      this.client.getObject(baseBucket, name, (err, dataStream: Stream) => {
        if (err) {
          reject(err);
        }
        dataStream.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
          size += chunk.length;
        });
        dataStream.on('end', () => {
          let data: Buffer = null;
          switch (chunks.length) {
            case 0:
              data = Buffer.alloc(0);
              break;
            case 1:
              data = chunks[0];
              break;
            default:
              data = Buffer.alloc(size);
              for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
                let chunk = chunks[i];
                chunk.copy(data, pos);
                pos += chunk.length;
              }
              break;
          }
          resolve(data);
        });
        dataStream.on('error', (err) => {
          reject(err);
        });
      });
    });
  }

  public getFilesAndCount(
    pagination,
    baseBucket: string = this.baseBucket,
  ): Promise<[projectEntities: FileResponseDto[], totalFiles: number]> {
    let { skip, limit: take } = pagination;
    return new Promise((resolve, reject) => {
      const fileList: FileResponseDto[] = [];
      const stream = this.client.listObjects(baseBucket);
      let total = 0;
      stream.on('data', function (obj) {
        total++;
        if (skip) {
          skip--;
        } else if (fileList.length <= take) {
          fileList.push(obj);
        }
      });
      stream.on('error', function (err) {
        reject(err);
      });
      stream.on('end', function () {
        resolve([fileList, total]);
      });
    });
  }

  public getFileList(
    size = 10,
    baseBucket: string = this.baseBucket,
  ): Promise<FileResponseDto[] | Error> {
    return new Promise((resolve, reject) => {
      const fileList: FileResponseDto[] = [];
      const stream = this.client.listObjects(baseBucket);
      stream.on('data', function (obj) {
        if (fileList.length <= size) {
          fileList.push(obj);
        }
      });
      stream.on('error', function (err) {
        reject(err);
      });
      stream.on('end', function () {
        resolve(fileList);
      });
    });
  }

  public async upload(
    file: BufferedFile,
    inclues: string[] = [],
    baseBucket: string = this.baseBucket,
  ) {
    // console.log(inclues, file.mimetype);
    // 验证文件类型
    if (inclues.length) {
      let flag = false;
      let minetype = '';
      while ((minetype = inclues.pop())) {
        if (file.mimetype.includes(minetype)) {
          flag = true;
        }
      }
      if (!flag) {
        throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
      }
    }

    let temp_filename = Date.now().toString();
    let hashedFileName = crypto
      .createHash('md5')
      .update(temp_filename)
      .digest('hex');
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };
    let filename = hashedFileName + ext;
    const fileName: string = `${filename}`;
    const fileBuffer = file.buffer;
    // console.log(baseBucket, fileName, fileBuffer, file.size, metaData);
    this.client.putObject(
      baseBucket,
      fileName,
      fileBuffer,
      file.size,
      metaData,
      function (err, objInfo) {
        if (err) {
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST,
          );
        }
        // console.log('Success', objInfo);
      },
    );

    return {
      url: this.getFileUrl(filename),
      name: filename,
    };
  }

  async delete(objectName: string, baseBucket: string = this.baseBucket) {
    this.client.removeObject(baseBucket, objectName, function (err, res) {
      if (err)
        throw new HttpException(
          'Oops Something wrong happend',
          HttpStatus.BAD_REQUEST,
        );
    });
  }

  getFileUrl(objectName: string) {
    return `${this.configService.get(
      'MINIO_ENDPOINT',
    )}:${this.configService.get('MINIO_PORT')}/${this.configService.get(
      'MINIO_BUCKET',
    )}/${objectName}`;
  }
}
