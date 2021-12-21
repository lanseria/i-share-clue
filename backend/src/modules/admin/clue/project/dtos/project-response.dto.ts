import { UserResponseDto } from '@modules/admin/access/users/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectLocation } from './location';

export class ProjectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  desc: string;

  @ApiProperty()
  happenedAt: number;

  @ApiProperty()
  category: string;

  @ApiProperty()
  region: string;

  @ApiProperty()
  location: ProjectLocation;

  @ApiProperty()
  creator: UserResponseDto;

  @ApiProperty()
  website: string;

  @ApiProperty()
  createdAt: number;

  @ApiProperty()
  updatedAt: number;
}
