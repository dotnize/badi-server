import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "~/db/drizzle";
import { user } from "~/db/schema";
import { User } from "~/lib/types";

// POST/create user is handled by auth service (register)

// GET /user/:id   - req.params.id
export async function getUserById(req: Request, res: Response) {
    try {
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid user ID." });
            return;
        }

        const id = parseInt(req.params.id);

        const userResult: User | undefined = await db.query.user.findFirst({
            where: eq(user.id, id),
        });

        if (!userResult) {
            res.status(400).json({ error: true, message: "User not found." });
            return;
        }

        res.status(200).json(userResult);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// PUT /user/:id   - req.params.id and req.body
export async function updateUser(req: Request, res: Response) {
    try {
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid user ID." });
            return;
        }

        // convert id param to number after validating
        const id = parseInt(req.params.id);

        const { email, firstName, lastName, gender, phoneNumber, avatarUrl, location } = req.body;

        if (
            !email ||
            !firstName ||
            !lastName ||
            !gender ||
            !phoneNumber ||
            !avatarUrl ||
            !location
        ) {
            res.status(400).json({ error: true, message: "Missing fields." });
            return;
        }

        const userId = req.session.userId;

        const currentUser: User | undefined = await db.query.user.findFirst({
            where: eq(user.id, id),
        });

        if (!currentUser) {
            res.status(404).json({ error: true, message: "User does not exist." });
            return;
        }

        if (currentUser.id !== userId) {
            res.status(403).json({ error: true, message: "You are not this user." });
            return;
        }
        await db
            .update(user)
            .set({
                email,
                firstName,
                lastName,
                gender,
                phoneNumber,
                avatarUrl,
                location,
            })
            .where(eq(user.id, id));

        const updatedUser: User = {
            ...currentUser,
            email,
            firstName,
            lastName,
            gender,
            phoneNumber,
            avatarUrl,
            location,
        };

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// DELETE /user/:id    - req.params.id
export async function deleteUser(req: Request, res: Response) {
    try {
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid user ID." });
            return;
        }

        // convert id param to number after validating
        const id = parseInt(req.params.id);

        const userId = req.session.userId;

        const currentUser: User | undefined = await db.query.user.findFirst({
            where: eq(user.id, id),
        });

        if (!currentUser) {
            res.status(404).json({ error: true, message: "User does not exist." });
            return;
        }
        if (currentUser.id !== userId) {
            res.status(403).json({ error: true, message: "You are not this user." });
            return;
        }
        await db.update(user).set({ isDeleted: true }).where(eq(user.id, userId));

        res.status(200).json(currentUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}
