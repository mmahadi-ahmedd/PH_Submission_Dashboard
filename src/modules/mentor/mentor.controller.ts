import { Request, Response } from "express";
import * as mentorService from "./mentor.service";
import { listQuerySchema } from "./mentor.schema";

export async function list(req: Request, res: Response) {
  const query = listQuerySchema.parse(req.query);
  const { items, meta } = await mentorService.listSubmissions(query);
  res.json({ success: true, data: items, meta });
}

export async function review(req: Request, res: Response) {
  const submission = await mentorService.reviewSubmission(
    String(req.params.id),
    req.user!.id,
    req.body
  );
  res.json({ success: true, data: submission });
}

export async function stats(_req: Request, res: Response) {
  const data = await mentorService.getStats();
  res.json({ success: true, data });
}