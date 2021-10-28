import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateProjectRequestDto {
  @IsNotEmpty()
  @MaxLength(100)
  @IsAlphanumeric()
  @ApiProperty({
    example: '如何打到车',
  })
  name: string;

  @ApiProperty({
    example: 'http://127.0.0.0.1',
  })
  website: string;

  @ApiProperty({
    example: '先叫辆车',
  })
  desc: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  region: string;

  @IsNotEmpty()
  @ApiProperty()
  creatorId: string;
}
