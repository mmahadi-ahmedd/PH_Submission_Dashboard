import { Request, Response } from "express";
import * as submissionService from "./submission.service";
import { paginationSchema } from "../../utils/pagination";

export async function create(req: Request, res: Response) {
  const submission = await submissionService.createSubmission(req.user!.id, req.body);
  res.status(201).json({ success: true, data: submission });
}

export async function listMine(req: Request, res: Response) {
  const query = paginationSchema.parse(req.query);
  const { items, meta } = await submissionService.listMySubmissions(req.user!.id, query);
  res.json({ success: true, data: items, meta });
}