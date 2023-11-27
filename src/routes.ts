import { Router } from "express";

import authController from "./controllers/auth.controller";

const router = Router();

router.get("/", (_, res) => res.send("Hello World!"));

// All the routes linked to their controllers
router.use("/auth", authController);

export default router;
