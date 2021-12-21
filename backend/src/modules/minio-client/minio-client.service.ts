import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { FileResponseDto } from '@modules/file-upload/dtos/';

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
    baseBucket: string = this.baseBucket,
  ) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
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
      url: `${this.configService.get(
        'MINIO_ENDPOINT',
      )}:${this.configService.get('MINIO_PORT')}/${this.configService.get(
        'MINIO_BUCKET',
      )}/${filename}`,
    };
  }

  async delete(objetName: string, baseBucket: string = this.baseBucket) {
    this.client.removeObject(baseBucket, objetName, function (err, res) {
      if (err)
        throw new HttpException(
          'Oops Something wrong happend',
          HttpStatus.BAD_REQUEST,
        );
    });
  }
}
