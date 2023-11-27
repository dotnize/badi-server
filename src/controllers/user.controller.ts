import { Router } from "express";

import * as userService from "~/services/user.service";

const router = Router();

// POST/create user is handled by auth controller (register)

router
    .route("/:id")
    .get(userService.getUserById)
    .put(userService.updateUser)
    .delete(userService.deleteUser);

//router.get("/", userService.getAllUser); // unnecessary?

export default router;
