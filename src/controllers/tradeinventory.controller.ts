import { Router } from "express";

import * as tradeInventoryService from "~/services/tradeinventory.service";

const router = Router();

router
    .route("/:id")
    .get(tradeInventoryService.getTradeInventoryById)
    .put(tradeInventoryService.updateTradeInventory)
    .delete(tradeInventoryService.deleteTradeInventory);

router
    .route("/group/:id", )
    .get(tradeInventoryService.getTradeInventoryByGroupId)
    .delete(tradeInventoryService.deleteTradeInventoryByTradeGroupId)
router.post("/", tradeInventoryService.createTradeInventory);

export default router;
