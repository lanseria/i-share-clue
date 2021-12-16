import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DefaultPagination } from '../interfaces/default-pagination.interface';

/**
 * Decorator intended for building a PaginationRequest object based on the query string parameters
 */
export const PaginationParams = createParamDecorator(
  (
    data: DefaultPagination = {
      defaultSkip: 0,
      defaultPage: 0,
      defaultLimit: 10,
      defaultOrder: {},
      maxAllowedSize: 20,
    },
    ctx: ExecutionContext,
  ) => {
    let {
      query: { skip, page, pageSize, orderBy, orderDirection, ...params },
    } = ctx.switchToHttp().getRequest();

    const {
      defaultSkip,
      defaultPage,
      defaultLimit,
      defaultOrder,
      maxAllowedSize,
    } = data;

    const order = orderBy ? orderBy : defaultOrder;

    pageSize = pageSize && pageSize > 0 ? +pageSize : defaultLimit;

    if (!skip) {
      if (page) {
        skip = (+page - 1) * +pageSize;
        skip = skip >= 0 ? skip : 0;
      } else {
        page = defaultPage;
        skip = defaultSkip;
      }
    } else {
      page = Math.floor(+skip / pageSize);
    }

    pageSize = +pageSize < +maxAllowedSize ? pageSize : maxAllowedSize;
    return Object.assign(data ? data : {}, {
      skip,
      page,
      limit: pageSize,
      order,
      params,
    });
  },
);
