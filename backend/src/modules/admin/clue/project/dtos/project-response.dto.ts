import { UserResponseDto } from '@modules/admin/access/users/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectLocation } from './location';

export class ProjectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  website: string;

  @ApiProperty()
  desc: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  region: string;

  @ApiProperty()
  creator: UserResponseDto;

  @ApiProperty()
  location: ProjectLocation;

  @ApiProperty()
  createdAt: number;

  @ApiProperty()
  updatedAt: number;
}
