import { BaseEntity } from '@database/entities';
import {
  EngineModelKeyType,
  TransfyStatusKeyType,
} from '@global-enums/transfy.enum';
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
  /**
   * 项目名称
   */
  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;
  /**
   * 项目上传的音频或者视频等源文件
   */
  @Column({
    name: 'object_name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  objectName: string;
  /**
   * 将识别完的json原始内容文件(未处理)
   */
  @Column({
    name: 'rec_raw_json_object_name',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  recRawJsonObjectName?: string;
  /**
   * 将识别完的json内容处理后得到的文件
   */
  @Column({
    name: 'rec_res_json_object_name',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  recResJsonObjectName?: string;
  /**
   * 错误信息
   */
  @Column({
    name: 'error_detail',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  errorDetail?: string;
  /**
   * 识别引擎
   */
  @Column({
    name: 'engine_model',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  engineModel: EngineModelKeyType;
  /**
   * 项目类型
   */
  @Column({
    name: 'category',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  category: TransfyCategoryKeyType;
  /**
   * 项目状态
   */
  @Column({
    name: 'status',
    type: 'varchar',
    length: 100,
    nullable: false,
    default: 'to_be_identifying',
  })
  status: TransfyStatusKeyType;
  /**
   * 项目封面
   */
  @Column({
    name: 'poster',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  poster: string;
  /**
   * 创建人
   */
  @ManyToOne(() => UserEntity, (user) => user.transfys)
  creator: UserEntity;
}
