import type { Request, Response } from "express";

// suggestion for the GET endpoints response:
// - include the latest "chatmessage" for the chatroom, para mapreview ang last message sa convo list UI

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
