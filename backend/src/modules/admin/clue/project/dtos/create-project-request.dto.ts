import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { ProjectLocation } from './location';

export class CreateProjectRequestDto {
  @IsNotEmpty()
  @MaxLength(100)
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

  @ApiProperty()
  location: ProjectLocation;
}
