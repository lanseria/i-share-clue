import { ApiProperty } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty()
  name: string; //	对象名称。

  @ApiProperty()
  prefix: string; //对象名称的前缀。

  @ApiProperty()
  size: number; //对象的大小。

  @ApiProperty()
  etag: string; //对象的etag值。

  @ApiProperty()
  lastModified: Date; //最后修改时间。
}
