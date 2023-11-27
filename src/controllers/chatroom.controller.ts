import { Router } from "express";

import * as chatRoomService from "~/services/chatroom.service";

const router = Router();

router.get("/:id", chatRoomService.getChatRoomById);
router.get("/user/:id", chatRoomService.getChatRoomByUserId);
router.post("/", chatRoomService.createChatRoom);

// update & delete not necessary?

export default router;
