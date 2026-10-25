import { z } from "zod";

const normalizeRepoUrl = (url: string) =>
  url.trim().replace(/\/+$/, "").replace(/\.git$/i, "").toLowerCase();

const githubRepo = /^https:\/\/github\.com\/[a-z0-9_.-]+\/[a-z0-9_.-]+$/;

export const createSubmissionSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name must be at most 100 characters"),

  repoUrl: z
    .string()
    .trim()
    .url("Repo URL must be a valid URL")
    .transform(normalizeRepoUrl)
    .refine((v) => githubRepo.test(v), {
      message: "Repo URL must look like https://github.com/username/repository",
    }),

  liveLink: z
    .string()
    .trim()
    .url("Live link must be a valid URL")
    .refine((v) => /^https?:\/\//i.test(v), {
      message: "Live link must start with http:// or https://",
    }),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be at most 1000 characters"),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;