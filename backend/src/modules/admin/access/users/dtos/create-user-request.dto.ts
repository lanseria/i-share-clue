import {
  ArrayNotEmpty,
  IsAlphanumeric,
  IsArray,
  IsInt,
  IsNotEmpty,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
export class CreateUserRequestDto {
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

  @Matches(passwordRegex, { message: 'Password too weak' })
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(6, 20)
  @ApiProperty({
    example: 'Hello123',
  })
  password: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example:
      'https://wx3.sinaimg.cn/mw2000/bcbbf95bly8gvgek5ma9bj20n00n0769.jpg',
  })
  avatar: string;

  @ApiProperty({ example: [1, 2] })
  @ArrayNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  permissions: number[];

  @ApiProperty({ example: [1, 2] })
  @ArrayNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  roles: number[];
}
