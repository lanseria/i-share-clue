import { ProjectLocation } from './location';

export class ProjectJsonDto {
  name: string;

  website: string;

  desc: string;

  category: string;

  region: string;

  location: ProjectLocation;

  createdAt: number;

  updatedAt: number;
}
