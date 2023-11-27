import { Router } from "express";

import * as tradeTransactionService from "~/services/tradetransaction.service";

const router = Router();

router
    .route("/:id")
    .get(tradeTransactionService.getTradeTransactionById)
    .put(tradeTransactionService.updateTradeTransaction)
    .delete(tradeTransactionService.deleteTradeTransaction);

router.get("/group/:id", tradeTransactionService.getTradeTransactionByGroupId);
router.get("/inventory/:id", tradeTransactionService.getTradeTransactionByInventoryId);
router.post("/", tradeTransactionService.createTradeTransaction);

export default router;
