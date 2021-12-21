import { ProjectLocation } from './location';

export class ProjectJsonDto {
  name: string;

  desc: string;

  happenedAt: number;

  category: string;

  region: string;

  location: ProjectLocation;

  website: string;

  createdAt: number;

  updatedAt: number;
}
