import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDictRequestDto {
  @IsNotEmpty()
  @MaxLength(100)
  id: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: '字典名称',
  })
  name: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: '字典值',
  })
  value: string;

  @ApiProperty({
    example: null,
  })
  pid?: string;
}
