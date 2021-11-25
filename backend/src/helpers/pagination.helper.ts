import { PaginationResponseDto } from '../common/dtos/pagination-response.dto';
import { PaginationRequest } from '../common/interfaces/pagination-request.interface';

export class Pagination {
  /**
   * Return pagination response
   * @param PaginationRequest {PaginationRequest}
   * @param total {number}
   * @param dtos {t[]}
   * @returns {PaginationResponseDto}
   */
  static of<T>(
    { limit, page, skip }: PaginationRequest,
    total: number,
    dtos: T[],
  ): PaginationResponseDto<T> {
    const pages = Math.floor(total / limit) + (total % limit > 0 ? 1 : 0);
    const current = +page > 0 ? +page : 1;
    const hasNext = current <= pages - 1;

    return {
      pages: pages,
      payloadSize: dtos.length,
      hasNext: hasNext,
      records: dtos,
      current: current,
      skippedRecords: skip,
      total: total,
    };
  }
}
