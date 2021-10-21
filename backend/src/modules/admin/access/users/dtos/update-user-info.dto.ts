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

  @IsEnum(UserStatus)
  @ApiProperty({
    example: UserStatus.Active,
  })
  status: UserStatus;
}
