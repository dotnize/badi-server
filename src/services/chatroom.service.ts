import type { Request, Response } from "express";
import { ChatMessage, ChatRoom, Expand, User } from "~/lib/types";

// use this type below as response sa GET endpoints, for others use ChatRoom type only
type ChatRoomGet = Expand<
    ChatRoom & { lastMessagePreview: ChatMessage; member1: User; member2: User }
>;

// GET /chatroom/user/:id   - req.params.id
export async function getChatRoomByUserId(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /chatroom/:id   - req.params.id
export async function getChatRoomById(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// POST /chatroom  - req.body (json body sa request)
export async function createChatRoom(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// update & delete not necessary?
