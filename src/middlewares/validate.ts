import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { AppError } from "../utils/AppError";

export const validate =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      return next(new AppError(400, "Validation failed", details));
    }
    req.body = result.data;
    next();
  };