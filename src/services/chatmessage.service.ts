import type { Request, Response } from "express";

// GET /chatmessage/room/:id   - req.params.id
export async function getChatMessageByRoomId(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
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
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// POST, UPDATE, and DELETE are handled by socket.io
