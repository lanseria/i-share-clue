import { BaseEntity } from '@database/entities';
import { Column, Entity, JoinTable, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({
  schema: 'admin',
  name: 'dicts',
})
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

  @ManyToOne(() => DictEntity, (dict) => dict.id)
  parent?: DictEntity;

  constructor(dict?: Partial<DictEntity>) {
    super();
    Object.assign(this, dict);
  }
}
