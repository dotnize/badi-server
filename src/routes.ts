import { Router } from "express";

import authController from "./controllers/auth.controller";
import inventoryController from "./controllers/inventory.controller";

const router = Router();

router.get("/", (_, res) => res.send("Hello World!"));

// All the routes linked to their controllers
router.use("/auth", authController);
router.use("/inventory", inventoryController);

export default router;
