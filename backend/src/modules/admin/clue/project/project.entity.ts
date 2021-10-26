import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@database/entities';
import { UserEntity } from '@modules/admin/access/users/user.entity';

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

  @OneToOne(() => UserEntity)
  @JoinColumn()
  createor: UserEntity;

  constructor(user?: Partial<UserEntity>) {
    super();
    Object.assign(this, user);
  }
}
