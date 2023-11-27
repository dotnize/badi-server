import { Router } from "express";

import * as authService from "~/services/auth.service";

const router = Router();

router.get("/", authService.getCurrentSession);
router.post("/login", authService.login);
router.post("/register", authService.register);
router.post("/logout", authService.logout);

export default router;
