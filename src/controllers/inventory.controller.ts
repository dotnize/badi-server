import { Router } from "express";

import * as inventoryService from "~/services/inventory.service";

const router = Router();

router
    .route("/:id")
    .get(inventoryService.getInventoryById)
    .put(inventoryService.updateInventory)
    .delete(inventoryService.deleteInventory);

router.route("/").get(inventoryService.getAllInventory).post(inventoryService.createInventory);
router.get("/user/:id", inventoryService.getInventoryByUserId);

export default router;
