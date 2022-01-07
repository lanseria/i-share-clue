import { UserResponseDto } from '@modules/admin/access/users/dtos';
import { ApiProperty } from '@nestjs/swagger';

export class TransfyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  objectName: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  creator: UserResponseDto;

  @ApiProperty()
  category: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  poster: string;

  @ApiProperty()
  createdAt: number;

  @ApiProperty()
  updatedAt: number;
}
