import { Prisma } from 'generated/prisma';

export interface PaginateOptions {
  page?: number;
  limit?: number;
  orderBy?: Record<string, 'asc' | 'desc'>;
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

export async function paginate<T>(
  model: {
    findMany: (args: Prisma.MovieFindManyArgs) => Promise<T[]>;
    count: (args: Prisma.MovieCountArgs) => Promise<number>;
  },
  options: {
    where?: Prisma.MovieWhereInput;
  } & PaginateOptions,
): Promise<PaginatedResponse<T>> {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const where = options.where ?? {};
  const orderBy = options.orderBy ?? { id: 'desc' };

  const [data, total] = await Promise.all([
    model.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
    }),
    model.count({ where }),
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
