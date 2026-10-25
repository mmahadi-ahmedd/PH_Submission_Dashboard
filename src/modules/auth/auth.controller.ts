import { Request, Response } from "express";
import * as authService from "./auth.service";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

export async function signup(req: Request, res: Response) {
  const data = await authService.signup(req.body);
  res.status(201).json({ success: true, data });
}

export async function login(req: Request, res: Response) {
  const data = await authService.login(req.body);
  res.json({ success: true, data });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, name: true, email: true, role: true },
  });
  if (!user) throw new AppError(404, "User not found");
  res.json({ success: true, data: user });
}