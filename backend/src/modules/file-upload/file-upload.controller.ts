import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from '@modules/minio-client/file.model';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationRequest } from '@common/interfaces';
import { PaginationParams } from '@common/decorators';
import { PaginationResponseDto } from '@common/dtos';
import { FileResponseDto } from './dtos';

@ApiTags('FileUpload')
@Controller({
  path: 'file-upload',
  version: '1',
})
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}
  @Delete('/delete')
  deleteFile(@Body() names: string[]) {
    return this.fileUploadService.deleteFile(names);
  }
  @Get('/download/:name')
  downloadFile(@Param('name') name: string) {
    return this.fileUploadService.downloadFile(name);
  }
  /**
   * 获取文件分页
   * @returns
   */
  @ApiOperation({
    description: '文件管理分页',
  })
  @Get('page')
  async getFilePage(
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<FileResponseDto>> {
    return this.fileUploadService.getFilePage(pagination);
  }
  /**
   * 上传图片
   * @param image 图片二进制
   * @returns
   */
  @ApiOperation({ description: '图片文件上传' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('single')
  @UseInterceptors(FileInterceptor('image'))
  async uploadSingle(@UploadedFile() image: BufferedFile) {
    // console.log(image);
    return await this.fileUploadService.uploadSingle(image);
  }
}
