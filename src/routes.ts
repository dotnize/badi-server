import { Router } from "express";

const router = Router();

router.get("/", (_, res) => res.send("Hello World!"));

// All the routes linked to their controllers
//router.use("/users"); // TODO

export default router;
