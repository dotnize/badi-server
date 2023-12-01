import { eq, or } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "~/db/drizzle";
import { chatRoom, chatRoomRelations } from "~/db/schema";
import { ChatMessage, ChatRoom, Expand, User } from "~/lib/types";

// use this type below as response sa GET endpoints, for others use ChatRoom type only
type ChatRoomGet = Expand<
    ChatRoom & { lastMessagePreview: ChatMessage; member1: User; member2: User }
>;

// GET /chatroom/user/:id   - req.params.id
export async function getChatRoomByUserId(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        const userId = parseInt(req.params.id);

        // Validate userId
        if (isNaN(userId)) {
            res.status(400).json({ error: true, message: "Invalid user ID." });
            return;
        }
      
        const resultChatRoom: ChatRoomGet[] = await db.query.chatRoom.findMany({
            where: or(eq(chatRoom.member1Id, userId), eq(chatRoom.member2Id, userId)),
            with: { lastMessagePreview: true, member1: true, member2: true },
        });

        res.status(200).json(resultChatRoom);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /chatroom/:id   - req.params.id
export async function getChatRoomById(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid chat room ID." });
            return;
        }

        const id = parseInt(req.params.id);

        const chatRoomResult: ChatRoomGet | undefined = await db.query.chatRoom.findFirst({
            where: eq(chatRoom.id, id),
            with: { lastMessagePreview: true, member1: true, member2: true },
        });

        if (!chatRoomResult) {
            res.status(404).json({ error: true, message: "Chat room not found." });
            return;
        }

        res.status(200).json(chatRoomResult);    
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// POST /chatroom  - req.body (json body sa request)
export async function createChatRoom(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        const { member1Id, member2Id } = req.body;

        if (!member1Id || !member2Id || isNaN(parseInt(member1Id)) || isNaN(parseInt(member2Id))) {
            res.status(400).json({ error: true, message: "Invalid user IDs." });
            return;
        }

        const newChatRoom = await db.insert(chatRoom).values({
            member1Id: parseInt(member1Id),
            member2Id: parseInt(member2Id),
        });

        res.status(201).json(newChatRoom[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// update & delete not necessary?
