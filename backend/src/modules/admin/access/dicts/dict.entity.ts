import { BaseEntity } from '@database/entities';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity({
  schema: 'admin',
  name: 'dicts',
})
@Tree('nested-set')
export class DictEntity extends BaseEntity {
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
    name: 'value',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  value: string;

  @TreeParent()
  parent: DictEntity;

  @Column({ nullable: true })
  parentId: string;

  @TreeChildren()
  children: DictEntity[];

  constructor(dict?: Partial<DictEntity>) {
    super();
    Object.assign(this, dict);
  }
}
