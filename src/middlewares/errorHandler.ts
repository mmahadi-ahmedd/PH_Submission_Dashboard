import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { ZodError } from "zod";

export function notFound(_req: Request, res: Response) {
    res.status(404).json({ success: false, message: "Route not found" });
}

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        });
    }
    
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.details,
        });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        return res.status(409).json({ success: false, message: "Already exists" });
    }

    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
}
