import { Router } from "express";

import * as wishService from "~/services/wish.service";

const router = Router();

router
    .route("/:id")
    .get(wishService.getWishById)
    .put(wishService.updateWish)
    .delete(wishService.deleteWish);

router.route("/").get(wishService.getAllWish).post(wishService.createWish);
router.get("/user/:id", wishService.getWishByUserId);

export default router;
