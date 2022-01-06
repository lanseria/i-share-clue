import { PaginationRequest } from '@common/interfaces';
import { EntityRepository, Repository } from 'typeorm';
import { TransfyEntity } from './transfy.entity';
import * as _ from 'lodash';

@EntityRepository(TransfyEntity)
export class TransfyRepository extends Repository<TransfyEntity> {
  getTransfysAndCount(
    pagination: PaginationRequest,
  ): Promise<[transfyEntities: TransfyEntity[], total: number]> {
    let {
      skip,
      limit: take,
      order,
      params: { name },
    } = pagination;
    let query = this.createQueryBuilder('t')
      .leftJoinAndSelect('t.creator', 'u')
      .skip(skip)
      .take(take);
    // Logger.log(pagination, this.constructor.toString().match(/\w+/g)[1]);
    if (!_.isEmpty(order)) {
      const orderIter = Object.keys(order).map((key) => {
        return [`t.${key}`, order[key]];
      });
      order = Object.fromEntries(orderIter);
      query = query.orderBy(order);
    } else {
      query = query.orderBy('t.createdAt', 'DESC');
    }
    if (name) {
      query.where(`u.name ILIKE :search`, { search: `%${name}%` });
    }

    return query.getManyAndCount();
  }
}
