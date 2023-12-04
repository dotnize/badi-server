import { and, eq, or } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "~/db/drizzle";
import { chatRoom } from "~/db/schema";
import { ChatMessage, ChatRoom, Expand, User } from "~/lib/types";

// use this type below as response sa GET endpoints, for others use ChatRoom type only
type ChatRoomGet = Expand<
    ChatRoom & { lastMessagePreview: ChatMessage[]; member1: User; member2: User }
>;

// GET /chatroom/user/:id   - req.params.id
export async function getChatRoomByUserId(req: Request, res: Response) {
    try {
        const userId = parseInt(req.params.id);

        // Validate userId
        if (isNaN(userId)) {
            res.status(400).json({ error: true, message: "Invalid user ID." });
            return;
        }

        const resultChatRoom: ChatRoomGet[] = await db.query.chatRoom.findMany({
            where: or(eq(chatRoom.member1Id, userId), eq(chatRoom.member2Id, userId)),
            with: {
                lastMessagePreview: {
                    orderBy: (chatMessage, { desc }) => [desc(chatMessage.id)],
                    where: (chatMessage, { eq, and, isNull }) =>
                        and(eq(chatMessage.id, chatRoom.id), isNull(chatMessage.isDeleted)),
                    limit: 1,
                },
                member1: true,
                member2: true,
            },
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
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid chat room ID." });
            return;
        }

        const id = parseInt(req.params.id);

        const chatRoomResult: ChatRoomGet | undefined = await db.query.chatRoom.findFirst({
            where: eq(chatRoom.id, id),
            with: {
                lastMessagePreview: {
                    orderBy: (chatMessage, { desc }) => [desc(chatMessage.id)],
                    where: (chatMessage, { eq, and, isNull }) =>
                        and(eq(chatMessage.id, chatRoom.id), isNull(chatMessage.isDeleted)),
                    limit: 1,
                },
                member1: true,
                member2: true,
            },
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
        const { member1Id, member2Id } = req.body;

        // TODO: only accept "withUserId"
        // and req.session.userId for the other/current member
        // then assign them both to member1 and member2 ids

        if (!member1Id || !member2Id || isNaN(parseInt(member1Id)) || isNaN(parseInt(member2Id))) {
            res.status(400).json({ error: true, message: "Invalid user IDs." });
            return;
        }

        // search for existing chat room
        const existingChatRoom: ChatRoom | undefined = await db.query.chatRoom.findFirst({
            where: or(
                and(eq(chatRoom.member1Id, member1Id), eq(chatRoom.member2Id, member2Id)),
                and(eq(chatRoom.member1Id, member2Id), eq(chatRoom.member2Id, member1Id))
            ),
        });

        if (existingChatRoom) {
            res.status(200).json(existingChatRoom);
            return;
        }

        const insertResult = await db.insert(chatRoom).values({
            member1Id: parseInt(member1Id),
            member2Id: parseInt(member2Id),
        });

        const newChatRoom: ChatRoom = {
            id: insertResult[0].insertId,
            member1Id: parseInt(member1Id),
            member2Id: parseInt(member2Id),
        };

        res.status(201).json(newChatRoom);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// update & delete not necessary?
