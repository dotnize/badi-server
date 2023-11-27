import { Router } from "express";

import * as contractService from "~/services/contract.service";

const router = Router();

router
    .route("/:id")
    .get(contractService.getContractById)
    .put(contractService.updateContract)
    .delete(contractService.deleteContract);

router.get("/tradegroup/:id", contractService.getContractByTradeGroupId);
router.post("/", contractService.createContract);

export default router;
