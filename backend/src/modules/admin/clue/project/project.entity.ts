import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '@database/entities';
import { UserEntity } from '@modules/admin/access/users/user.entity';
import { Point } from 'geojson';

@Entity({ schema: 'admin', name: 'project' })
export class ProjectEntity extends BaseEntity {
  @PrimaryColumn({ name: 'id', type: 'uuid', generated: 'uuid' })
  id?: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'website',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  website: string;

  @Column({
    name: 'desc',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  desc: string;

  @Column({
    name: 'category',
    type: 'varchar',
    nullable: false,
  })
  category: string;

  @Column({
    name: 'region',
    type: 'varchar',
    nullable: false,
  })
  region: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  createor: UserEntity;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point;

  constructor(project?: Partial<ProjectEntity>) {
    super();
    Object.assign(this, project);
  }
}
