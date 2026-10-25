import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;

export function buildMeta(total: number, { page, limit }: PaginationQuery) {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
}