import { PaginationRequest } from '@common/interfaces';
import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { DictEntity } from './dict.entity';

@EntityRepository(DictEntity)
export class DictsRepository extends Repository<DictEntity> {
  // TODO: 合并分页统一逻辑
  getDictsAndCount(
    pagination: PaginationRequest,
  ): Promise<[dictEntities: DictEntity[], totalDicts: number]> {
    const {
      skip,
      limit: take,
      order,
      params: { name, pid },
    } = pagination;
    const query = this.createQueryBuilder('u')
      // .innerJoinAndSelect('u.roles', 'r')
      // .leftJoinAndSelect('u.permissions', 'p')
      .skip(skip)
      .take(take)
      .orderBy(order);

    if (name) {
      query.where(`u.name ILIKE :search`, { search: `%${name}%` });
    }
    if (pid) {
      query.where(`u.parentId = :pid`, { pid: pid });
    } else {
      query.where({
        parentId: null,
      });
    } // 回传上面API所组出來的Raw SQL, debug用
    // const sql = query.getSql();
    // Logger.log(sql);
    return query.getManyAndCount();
  }
}
