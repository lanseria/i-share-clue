import { IsAlphanumeric, IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../user-status.enum';

export class UpdateUserInfoDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @ApiProperty({
    example: 'jdoe',
  })
  username: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'John',
  })
  firstName: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'Doe',
  })
  lastName: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example:
      'https://wx3.sinaimg.cn/mw2000/bcbbf95bly8gvgek5ma9bj20n00n0769.jpg',
  })
  avatar: string;

  @IsEnum(UserStatus)
  @ApiProperty({
    example: UserStatus.Active,
  })
  status: UserStatus;
}
