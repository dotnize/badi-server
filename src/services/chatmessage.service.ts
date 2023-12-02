import { and, eq, isNull } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "~/db/drizzle";
import { chatMessage } from "~/db/schema";
import { ChatMessage } from "~/lib/types";

// GET /chatmessage/room/:id   - req.params.id
export async function getChatMessageByRoomId(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ error: true, message: "Invalid room ID." });
        }

        const roomMessages: ChatMessage[] = await db.query.chatMessage.findMany({
            where: and(eq(chatMessage.chatRoomId, parseInt(id)), isNull(chatMessage.isDeleted)),
        });

        res.status(200).json(roomMessages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /chatmessage/:id   - req.params.id
// ambot if necessary ba sad ni
export async function getChatMessageById(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ error: true, message: "Invalid message ID." });
        }

        const message: ChatMessage | undefined = await db.query.chatMessage.findFirst({
            where: and(eq(chatMessage.id, parseInt(id)), isNull(chatMessage.isDeleted)),
        });

        if (!message) {
            return res.status(404).json({ error: true, message: "Message not found." });
        }

        res.status(200).json(message);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// POST, UPDATE, and DELETE are handled by socket.io
