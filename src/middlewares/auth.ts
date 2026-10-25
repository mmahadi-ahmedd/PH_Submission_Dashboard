import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { verifyToken } from "../utils/jwt";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError(401, "Authentication required"));
  }

  try {
    const payload = verifyToken(header.split(" ")[1]);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}

export const authorize =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError(401, "Authentication required"));
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "You do not have permission to do this"));
    }
    next();
  };