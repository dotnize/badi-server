import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "~/db/drizzle";
import { wish } from "~/db/schema";
import { Expand, User, Wish } from "~/lib/types";

// for the GET endpoints, we should include the referenced User objects for the response (based on the frontend's types)

// use this type below as response sa GET endpoints, for others use Wish type only
type WishGet = Expand<Wish & { user: User }>;

// GET /wish
export async function getAllWish(req: Request, res: Response) {
    try {
        // WishGet type so the referenced User object is included (for the frontend UI)
        const resultWishes: WishGet[] = await db.query.wish.findMany({ with: { user: true } });
        res.status(200).json(resultWishes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /wish/user/:id   - req.params.id
export async function getWishByUserId(req: Request, res: Response) {
    try {
        // make sure id param is a valid number
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid user ID." });
            return;
        }

        // convert id param to number after validating
        const userId = parseInt(req.params.id);

        // get wishes by user id
        const resultWishes: WishGet[] = await db.query.wish.findMany({
            where: eq(wish.userId, userId),
            with: { user: true },
        });

        // respond with result array
        res.status(200).json(resultWishes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /wish/:id   - req.params.id
export async function getWishById(req: Request, res: Response) {
    try {
        // make sure id param is a valid number
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid wish ID." });
            return;
        }

        // convert id param to number after validating
        const id = parseInt(req.params.id);

        // get wish by id, and it's possibly nonexistent (undefined type)
        const wishResult: WishGet | undefined = await db.query.wish.findFirst({
            where: eq(wish.id, id),
            with: { user: true },
        });

        // if type is undefined
        if (!wishResult) {
            res.status(404).json({ error: true, message: "Wish does not exist." });
            return;
        }

        // respond with result object
        res.status(200).json(wishResult);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// POST /wish  - req.body (json body sa request)
export async function createWish(req: Request, res: Response) {
    try {
        // destructure the request json body
        const { name, type, keywords, description, imageUrls } = req.body;

        // make sure all fields are present
        if (!name || !type || !keywords || !description || !imageUrls) {
            res.status(400).json({ error: true, message: "Missing fields." });
            return;
        }

        //const userId = req.session.user.id;
        // TODO: temporary, no auth/sessions for now para dali itest
        const userId = 1;

        // insert to db
        const insertResult = await db
            .insert(wish)
            .values({ name, type, keywords, description, imageUrls, userId });

        // get new id of inserted row
        const id = insertResult[0].insertId;

        // structure the new wish object to prepare for response
        const newWish: Wish = { id, name, type, keywords, description, imageUrls, userId };

        // respond with the new wish object
        res.status(201).json(newWish);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// PUT /wish/:id   - req.params.id and req.body
export async function updateWish(req: Request, res: Response) {
    try {
        // make sure id param is a valid number
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid wish ID." });
            return;
        }

        // convert id param to number after validating
        const id = parseInt(req.params.id);

        // destructure the request json body
        const { name, type, keywords, description, imageUrls } = req.body;

        // make sure all fields are present (can be same fields as POST)
        if (!name || !type || !keywords || !description || !imageUrls) {
            res.status(400).json({ error: true, message: "Missing fields." });
            return;
        }

        //const userId = req.session.user.id;
        // TODO: temporary, no auth/sessions for now para dali itest
        const userId = 1;

        // find the wish to update
        const currentWish: Wish | undefined = await db.query.wish.findFirst({
            where: eq(wish.id, id),
        });

        // if undefined/nonexistent
        if (!currentWish) {
            res.status(404).json({ error: true, message: "Wish does not exist." });
            return;
        }

        // check if current session user owns the wish
        if (currentWish.userId !== userId) {
            res.status(403).json({ error: true, message: "You do not own this wish." });
            return;
        }

        // apply updates to db
        await db
            .update(wish)
            .set({ name, type, keywords, description, imageUrls })
            .where(eq(wish.id, id));

        // structure the updated wish object to prepare for response
        const updatedWish: Wish = { ...currentWish, name, type, keywords, description, imageUrls };

        // respond with the new wish object
        res.status(200).json(updatedWish);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// DELETE /wish/:id    - req.params.id
export async function deleteWish(req: Request, res: Response) {
    console.log("invaded");
    try {
        // make sure id param is a valid number
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid wish ID." });
            return;
        }

        // convert id param to number after validating
        const id = parseInt(req.params.id);

        //const userId = req.session.user.id;
        // TODO: temporary, no auth/sessions for now para dali itest
        const userId = 1;

        // find the wish to delete
        const currentWish: Wish | undefined = await db.query.wish.findFirst({
            where: eq(wish.id, id),
        });

        // if undefined/nonexistent
        if (!currentWish) {
            res.status(404).json({ error: true, message: "Wish does not exist." });
            return;
        }

        // check if current session user owns the wish
        if (currentWish.userId !== userId) {
            res.status(403).json({ error: true, message: "You do not own this wish." });
            return;
        }

        // goodbye philippines
        await db.delete(wish).where(eq(wish.id, id));

        // respond with the deleted wish object
        res.status(200).json(currentWish);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}
