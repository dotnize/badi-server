import { Router } from "express";

import authController from "./controllers/auth.controller";
import chatMessageController from "./controllers/chatmessage.controller";
import chatRoomController from "./controllers/chatroom.controller";
import contractController from "./controllers/contract.controller";
import inventoryController from "./controllers/inventory.controller";
import notificationController from "./controllers/notification.controller";
import tradeGroupController from "./controllers/tradegroup.controller";
import tradeInventoryController from "./controllers/tradeinventory.controller";
import tradeTransactionController from "./controllers/tradetransaction.controller";
import userController from "./controllers/user.controller";
import wishController from "./controllers/wish.controller";

const router = Router();
router.get("/", (_, res) => res.send("Hello World!")); // sample

// All the routes linked to their controllers
router.use("/auth", authController);
router.use("/chatmessage", chatMessageController);
router.use("/chatroom", chatRoomController);
router.use("/contract", contractController);
router.use("/inventory", inventoryController);
router.use("/notification", notificationController);
router.use("/tradegroup", tradeGroupController);
router.use("/tradeinventory", tradeInventoryController);
router.use("/tradetransaction", tradeTransactionController);
router.use("/user", userController);
router.use("/wish", wishController);

export default router;
