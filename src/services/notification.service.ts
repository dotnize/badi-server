import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "~/db/drizzle";
import { notification } from "~/db/schema";

// GET /notification/user/:id   - req.params.id
export async function getNotificationByUserId(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object

        const userId = parseInt(req.params.id, 10); // Convert to number

        // Example: Check if userId is provided and is a valid number
        if (isNaN(userId)) {
            res.status(400).json({ error: true, message: "Invalid User ID." });
            return;
        }

        // Business logic: Retrieve notifications for the specified user
        const userNotifications = await db.query.notification.findMany({
            where: eq(notification.userId, userId),
        });

        res.status(200).json(userNotifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /notification/:id   - req.params.id
export async function getNotificationById(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// PUT /notification/:id   - req.params.id and req.body
export async function updateNotification(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        // validation examples:
        // - check if notification exists using id
        // - check if current session user owns the notification (compare req.session.userId and notification.userId)
        // then req.body should contain the new values for the update query
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// DELETE /notification/:id    - req.params.id
export async function deleteNotification(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        // validation examples:
        // - check if notification exists using id
        // - check if current session user owns the notification (compare req.session.userId and notification.userId)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}
