import { PaginationRequest } from '@common/interfaces';
import { EntityRepository, Repository } from 'typeorm';
import { DictEntity } from './dict.entity';

@EntityRepository(DictEntity)
export class DictsRepository extends Repository<DictEntity> {
  getDictsAndCount(
    pagination: PaginationRequest,
  ): Promise<[dictEntities: DictEntity[], totalDicts: number]> {
    const {
      skip,
      limit: take,
      order,
      params: { name },
    } = pagination;
    const query = this.createQueryBuilder('u')
      // .innerJoinAndSelect('u.roles', 'r')
      // .leftJoinAndSelect('u.permissions', 'p')
      .skip(skip)
      .take(take)
      .orderBy(order);

    if (name) {
      query.where(
        `
            u.name ILIKE :search
            `,
        { search: `%${name}%` },
      );
    }

    return query.getManyAndCount();
  }
}
