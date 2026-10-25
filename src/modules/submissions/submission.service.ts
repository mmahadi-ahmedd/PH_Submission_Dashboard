import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { buildMeta, PaginationQuery } from "../../utils/pagination";
import { CreateSubmissionInput } from "./submission.schema";

export async function createSubmission(studentId: string, data: CreateSubmissionInput) {
  try {
    return await prisma.submission.create({
      data: { ...data, studentId },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new AppError(409, "This repository has already been submitted");
    }
    throw err;
  }
}

export async function listMySubmissions(studentId: string, query: PaginationQuery) {
  const { page, limit } = query;
  const where = { studentId };

  const [items, total] = await Promise.all([
    prisma.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        feedbacks: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            message: true,
            createdAt: true,
            mentor: { select: { name: true } },
          },
        },
      },
    }),
    prisma.submission.count({ where }),
  ]);

  return { items, meta: buildMeta(total, query) };
}