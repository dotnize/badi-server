import { and, eq, isNull } from "drizzle-orm";
import type { DisconnectReason, Socket } from "socket.io";
import { db } from "~/db/drizzle";
import { chatMessage } from "~/db/schema";
import { ChatMessage } from "~/lib/types";
import { io } from "~/server";

export async function joinRoom(this: Socket, roomId: number) {
    try {
        await this.join(roomId.toString());

        const latestMessages: ChatMessage[] = await db.query.chatMessage.findMany({
            where: and(eq(chatMessage.chatRoomId, roomId), isNull(chatMessage.isDeleted)),
        });

        this.emit("latestMessages", latestMessages);
    } catch (err) {
        console.log(err);
    }
}

export async function leaveRoom(this: Socket, reason?: DisconnectReason, roomId?: number) {
    try {
        await this.leave(roomId ? roomId.toString() : Array.from(this.rooms)[1]);
    } catch (err) {
        console.log(err);
    }
}

export async function getLatestMessages(this: Socket) {
    try {
        const roomId = parseInt(Array.from(this.rooms)[1]);
        const sessionUserId = this.request.session.userId;

        if (!roomId || isNaN(roomId)) {
            console.log(
                `(warning) ${sessionUserId} attempted to getLatestMessages with no valid room id`
            );
            return;
        }

        const latestMessages: ChatMessage[] = await db.query.chatMessage.findMany({
            where: and(eq(chatMessage.chatRoomId, roomId), isNull(chatMessage.isDeleted)),
        });

        this.emit("latestMessages", latestMessages);
    } catch (err) {
        console.log(err);
    }
}

export async function chat(this: Socket, content: string) {
    try {
        const roomId = parseInt(Array.from(this.rooms)[1]);
        const sessionUserId = this.request.session.userId;

        if (!roomId || isNaN(roomId)) {
            console.log(`(warning) ${sessionUserId} attempted to chat with no valid room id`);
            return;
        }

        if (!content || content.length < 1) {
            console.log(
                `(warning) ${sessionUserId} attempted to chat in room ${roomId} with no content`
            );
            return;
        }

        const messageWithoutId: Omit<ChatMessage, "id"> = {
            senderId: sessionUserId,
            chatRoomId: roomId,
            content,
            timestamp: new Date(),
        };

        const insertResult = await db.insert(chatMessage).values(messageWithoutId);

        const newMessage: ChatMessage = {
            id: insertResult[0].insertId,
            ...messageWithoutId,
        };

        io.to(roomId.toString()).emit("chat", newMessage);
    } catch (err) {
        console.log(err);
    }
}

export async function deleteChat(this: Socket, messageId: number) {
    try {
        await db.update(chatMessage).set({ isDeleted: true }).where(eq(chatMessage.id, messageId));

        const roomId = parseInt(Array.from(this.rooms)[1]);
        const latestMessages: ChatMessage[] = await db.query.chatMessage.findMany({
            where: and(eq(chatMessage.chatRoomId, roomId), isNull(chatMessage.isDeleted)),
        });

        io.to(roomId.toString()).emit("latestMessages", latestMessages);
    } catch (err) {
        console.log(err);
    }
}