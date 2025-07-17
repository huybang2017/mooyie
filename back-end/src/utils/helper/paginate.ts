export interface PaginateOptions<TInclude = any, TSelect = any> {
  page?: number;
  limit?: number;
  orderBy?: Record<string, 'asc' | 'desc'>;
  include?: TInclude;
  select?: TSelect;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export async function paginate<
  T,
  TArgs extends {
    where?: any;
    include?: any;
    select?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  },
>(
  model: {
    findMany: (args: TArgs) => Promise<T[]>;
    count: (args: Pick<TArgs, 'where'>) => Promise<number>;
  },
  options: PaginateOptions<TArgs['include'], TArgs['select']> & {
    where?: TArgs['where'];
  },
): Promise<PaginatedResponse<T>> {
  const hasPagination =
    options.page !== undefined && options.limit !== undefined;

  const page = Number(options.page ?? 1);
  const limit = Number(options.limit ?? 0);
  const where = options.where ?? {};
  const orderBy = options.orderBy ?? { id: 'desc' };

  if (!hasPagination) {
    const data = await model.findMany({
      where,
      orderBy,
      include: options.include,
      select: options.select,
    } as TArgs);

    return {
      data,
      total: data.length,
      currentPage: 1,
      totalPages: 1,
      pageSize: data.length,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  const [data, total] = await Promise.all([
    model.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
      include: options.include,
    } as TArgs),
    model.count({ where } as Pick<TArgs, 'where'>),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    currentPage: page,
    totalPages,
    pageSize: limit,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
