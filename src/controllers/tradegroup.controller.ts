import { Router } from "express";

import * as tradeGroupService from "~/services/tradegroup.service";

const router = Router();

router
    .route("/:id")
    .get(tradeGroupService.getTradeGroupById)
    .put(tradeGroupService.updateTradeGroup)
    .delete(tradeGroupService.deleteTradeGroup);

router.get("/user/:id", tradeGroupService.getTradeGroupByUserId);
router.post("/", tradeGroupService.createTradeGroup);
router.put("/swap/:id", tradeGroupService.updateUserIdInTradeGroup);


export default router;
