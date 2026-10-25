import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { buildMeta } from "../../utils/pagination";
import { ListQuery, ReviewInput } from "./mentor.schema";

export async function listSubmissions(query: ListQuery) {
  const { page, limit, status, search } = query;

  const where: Prisma.SubmissionWhereInput = {
    ...(status && { status }),
    ...(search && { projectName: { contains: search, mode: "insensitive" } }),
  };

  const [items, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        student: { select: { id: true, name: true, email: true } },
        feedbacks: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { message: true, createdAt: true },
        },
      },
    }),
    prisma.submission.count({ where }),
  ]);

  return { items, meta: buildMeta(total, query) };
}

export async function reviewSubmission(
  submissionId: string,
  mentorId: string,
  input: ReviewInput
) {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.submission.updateMany({
      where: { id: submissionId, status: "PENDING" },
      data: { status: input.status },
    });

    if (updated.count === 0) {
      const exists = await tx.submission.findUnique({
        where: { id: submissionId },
        select: { id: true },
      });
      if (!exists) throw new AppError(404, "Submission not found");
      throw new AppError(409, "This submission has already been reviewed");
    }

    if (input.feedback) {
      await tx.feedback.create({
        data: { message: input.feedback, submissionId, mentorId },
      });
    }

    return tx.submission.findUniqueOrThrow({
      where: { id: submissionId },
      include: {
        student: { select: { id: true, name: true, email: true } },
        feedbacks: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
  });
}

export async function getStats() {
  const grouped = await prisma.submission.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const count = (s: string) => grouped.find((g) => g.status === s)?._count._all ?? 0;
  const pending = count("PENDING");
  const approved = count("APPROVED");
  const rejected = count("REJECTED");

  return { total: pending + approved + rejected, pending, approved, rejected };
}