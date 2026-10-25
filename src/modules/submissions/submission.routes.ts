import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { submissionLimiter } from "../../middlewares/rateLimiter";
import { createSubmissionSchema } from "./submission.schema";
import * as controller from "./submission.controller";

const router = Router();

router.use(authenticate, authorize("STUDENT"));

router.post("/", submissionLimiter, validate(createSubmissionSchema), controller.create);
router.get("/mine", controller.listMine);

export default router;