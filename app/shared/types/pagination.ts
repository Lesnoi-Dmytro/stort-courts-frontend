export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;

export type PaginatedRequest = {
  page: number;
  limit: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

/** Pagination params as sent in a query string; the backend applies defaults. */
export type PaginatedQueryDTO = Partial<PaginatedRequest>;
