import { Router } from "express";
import { authenticate, authorize } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { reviewSchema } from "./mentor.schema";
import * as controller from "./mentor.controller";

const router = Router();

router.use(authenticate, authorize("MENTOR"));

router.get("/submissions", controller.list);
router.patch("/submissions/:id/review", validate(reviewSchema), controller.review);
router.get("/stats", controller.stats);

export default router;