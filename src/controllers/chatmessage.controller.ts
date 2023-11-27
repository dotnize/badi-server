import { Router } from "express";

import * as chatMessageService from "~/services/chatmessage.service";

const router = Router();

router.get("/", chatMessageService.getChatMessageById);
router.get("/room/:id", chatMessageService.getChatMessageByRoomId);

// POST, UPDATE, and DELETE are handled by socket.io

export default router;
