import { BaseEntity } from '@database/entities';
import { TransfyStatusKeyType } from '@global-enums/transfy.enum';
import { UserEntity } from '@modules/admin/access/users/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TransfyCategoryKeyType } from './dtos';

@Entity({ schema: 'admin', name: 'transfy' })
export class TransfyEntity extends BaseEntity {
  @PrimaryColumn({
    name: 'id',
    type: 'uuid',
    generated: 'uuid',
  })
  id?: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'object_name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  objectName: string;

  @Column({
    name: 'engine_model',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  engineModel: string;

  @Column({
    name: 'category',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  category: TransfyCategoryKeyType;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 100,
    nullable: false,
    default: 'to_be_identifying',
  })
  status: TransfyStatusKeyType;

  @Column({
    name: 'poster',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  poster: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  creator: UserEntity;
}
