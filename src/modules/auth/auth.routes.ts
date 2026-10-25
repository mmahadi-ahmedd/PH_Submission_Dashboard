import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { authenticate } from "../../middlewares/auth";
import { loginSchema, signupSchema } from "./auth.schema";
import * as controller from "./auth.controller";

const router = Router();

router.post("/signup", validate(signupSchema), controller.signup);
router.post("/login", validate(loginSchema), controller.login);
router.get("/me", authenticate, controller.me);

export default router;