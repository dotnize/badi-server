import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "~/db/drizzle";
import { rating } from "~/db/schema";
import { Expand, Rating, User } from "~/lib/types";

// use this type below as response sa GET endpoints, for others use Rating type only
type RatingGet = Expand<Rating & { fromUser: User }>;

// GET /rating/user/:id   - req.params.id
export async function getRatingByUserId(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        const userId = req.params.id;

        if(!userId || isNaN(parseInt(userId))){
            res.status(400).json({ error: true, message: "Invalid user ID." });
            return;
        }

        const resultRatings: RatingGet[] = await db.query.rating.findMany({
            where: eq(rating.toUserId, parseInt(userId)),
            with: { fromUser: true },
        });

        res.status(200).json(resultRatings);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /rating/:id   - req.params.id
export async function getRatingById(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
            const ratingId = req.params.id;

            if (!ratingId || isNaN(parseInt(ratingId))) {
                res.status(400).json({ error: true, message: "Invalid rating ID." });
                return;
            }

            const resultRating: RatingGet | undefined = await db.query.rating.findFirst({
                where: eq(rating.id, parseInt(ratingId)),
                with: { fromUser: true },
            });

            if (resultRating) {
                res.status(200).json(resultRating);
            } else {
                res.status(404).json({ error: true, message: "Rating not found." });
            }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// POST /rating  - req.body (json body sa request)
export async function createRating(req: Request, res: Response) {
    try {
        const { toUserId, amount, description } = req.body;

        if (!toUserId || !amount) {
            res.status(400).json({ error: true, message: "toUserId and amount are required." });
            return;
        }

        const fromUserId = 1; 

        const insertResult = await db.insert(rating).values({
            toUserId,
            fromUserId,
            amount,
            description,
            timestamp: new Date(),
            isDeleted: null,
        });

        const id = insertResult[0].insertId;

        const newRating: Rating = {
            id,
            toUserId,
            fromUserId,
            amount,
            description,
            timestamp: new Date(),
            isDeleted: null,
        };

        res.status(201).json(newRating);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// PUT /rating/:id   - req.params.id and req.body
export async function updateRating(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        // validation examples:
        // - check if rating exists using id
        // - check if current session user created the rating (rating.fromUserId)
        // then req.body should contain the new values for the update query
            const ratingId = req.params.id;

            if (!ratingId || isNaN(parseInt(ratingId))) {
                res.status(400).json({ error: true, message: "Invalid rating ID." });
                return;
            }

            const { amount, description } = req.body;

            if (!amount) {
                res.status(400).json({ error: true, message: "amount is required." });
                return;
            }

            const fromUserId = 1;

            const currentRating: Rating | undefined = await db.query.rating.findFirst({
                where: eq(rating.id, parseInt(ratingId)),
            });

            if (!currentRating) {
                res.status(404).json({ error: true, message: "Rating does not exist." });
                return;
            }

            if (currentRating.fromUserId !== fromUserId) {
                res.status(403).json({ error: true, message: "You do not own this rating." });
                return;
            }

            await db
                .update(rating)
                .set({ amount, description })
                .where(eq(rating.id, parseInt(ratingId)));

            const updatedRating: Rating = {
                ...currentRating,
                amount,
                description,
            };

            res.status(200).json(updatedRating);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// DELETE /rating/:id    - req.params.id
export async function deleteRating(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        // validation examples:
        // - check if rating exists using id
        // - check if current session user created the rating (rating.fromUserId)
        const ratingId = req.params.id;

        if (!ratingId || isNaN(parseInt(ratingId))) {
            res.status(400).json({ error: true, message: "Invalid rating ID." });
            return;
        }

        const fromUserId = 1;

        const currentRating: RatingGet | undefined = await db.query.rating.findFirst({
            where: eq(rating.id, parseInt(ratingId)),
            with: { fromUser: true },
        });

        if (!currentRating) {
            res.status(404).json({ error: true, message: "Rating does not exist." });
            return;
        }

        if (currentRating.fromUser.id !== fromUserId) {
            res.status(403).json({ error: true, message: "You do not own this rating." });
            return;
        }

        await db.delete(rating).where(eq(rating.id, parseInt(ratingId)));

        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}
