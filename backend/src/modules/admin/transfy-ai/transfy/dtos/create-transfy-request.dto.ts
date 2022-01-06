import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, MaxLength } from 'class-validator';
import {
  EngineModelKey,
  TransfyCategoryKey,
  TransfyCategoryKeyType,
} from './index';

export class CreateTransfyRequestDto {
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: '骁龙888如何压制',
  })
  name: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'http://localhost:9000/demo.mp4',
  })
  url: string;

  @IsNotEmpty()
  @IsIn(EngineModelKey)
  @ApiProperty({
    example: '16k_zh_video',
  })
  engineModel: string;

  @IsNotEmpty()
  @IsIn(TransfyCategoryKey)
  @ApiProperty({
    example: 'video',
  })
  category: TransfyCategoryKeyType;
}
