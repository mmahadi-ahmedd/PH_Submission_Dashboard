import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

export const listQuerySchema = paginationSchema.extend({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  search: z.string().trim().max(100).optional(),
});

export type ListQuery = z.infer<typeof listQuerySchema>;

export const reviewSchema = z
  .object({
    status: z.enum(["APPROVED", "REJECTED"], {
      message: "Status must be APPROVED or REJECTED",
    }),
    feedback: z.string().trim().max(1000, "Feedback is too long").optional(),
  })
  .refine((v) => v.status !== "REJECTED" || (v.feedback && v.feedback.length >= 5), {
    path: ["feedback"],
    message: "Please give feedback (at least 5 characters) when rejecting",
  });

export type ReviewInput = z.infer<typeof reviewSchema>;