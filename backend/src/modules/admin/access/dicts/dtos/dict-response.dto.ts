import { ApiProperty } from '@nestjs/swagger';

export class DictResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  parentId?: string;
}
