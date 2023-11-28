import { Router } from "express";

import * as ratingService from "~/services/rating.service";

const router = Router();

router
    .route("/:id")
    .get(ratingService.getRatingById)
    .put(ratingService.updateRating)
    .delete(ratingService.deleteRating);

router.post("/", ratingService.createRating);
router.get("/user/:id", ratingService.getRatingByUserId);

export default router;
