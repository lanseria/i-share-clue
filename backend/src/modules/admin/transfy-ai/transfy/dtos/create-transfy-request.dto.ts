import { EngineModelKeyType } from '@global-enums/transfy.enum';
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
    example: 'demo.mp4',
  })
  objectName: string;

  @IsNotEmpty()
  @IsIn(EngineModelKey)
  @ApiProperty({
    example: '16k_zh_video',
  })
  engineModel: EngineModelKeyType;

  @IsNotEmpty()
  @IsIn(TransfyCategoryKey)
  @ApiProperty({
    example: 'video',
  })
  category: TransfyCategoryKeyType;
}
