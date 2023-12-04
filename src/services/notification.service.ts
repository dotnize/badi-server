import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "~/db/drizzle";
import { notification } from "~/db/schema";
import type { Notification } from "~/lib/types";

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
        const notificationId = parseInt(req.params.id, 10); // Convert to number

        // Example: Check if notificationId is provided and is a valid number
        if (isNaN(notificationId)) {
            res.status(400).json({ error: true, message: "Invalid Notification ID." });
            return;
        }

        // Business logic: Retrieve a specific notification by ID
        const foundNotification = await db.query.notification.findFirst({
            where: eq(notification.id, notificationId),
        });

        if (!foundNotification) {
            res.status(404).json({ error: true, message: "Notification not found." });
            return;
        }

        res.status(200).json(foundNotification);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// PUT /notification/:id   - req.params.id and req.body
export async function updateNotification(req: Request, res: Response) {
    try {
        const notificationId = parseInt(req.params.id, 10);
        const updatedNotificationData: Partial<Notification> = req.body;

        if (isNaN(notificationId) || Object.keys(updatedNotificationData).length === 0) {
            res.status(400).json({ error: true, message: "Invalid request." });
            return;
        }

        // If is_deleted is included in the update, set it accordingly
        if ("is_deleted" in updatedNotificationData && updatedNotificationData["is_deleted"]) {
            await db
                .update(notification)
                .set({ isDeleted: true }) // Change to isDeleted
                .where(eq(notification.id, notificationId));
        } else {
            // Otherwise, update other fields
            await db
                .update(notification)
                .set(updatedNotificationData)
                .where(eq(notification.id, notificationId));
        }

        res.status(200).json({ success: true, message: "Notification updated successfully." });
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
        const notificationId = parseInt(req.params.id, 10); // Convert to number

        // Example: Check if notificationId is provided and is a valid number
        if (isNaN(notificationId)) {
            res.status(400).json({ error: true, message: "Invalid Notification ID." });
            return;
        }

        // Business logic: Delete the notification with the specified ID
        await db.delete(notification).where(eq(notification.id, notificationId));

        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}
