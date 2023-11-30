import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "~/db/drizzle";
import { inventory } from "~/db/schema";
import { Expand, Inventory, User } from "~/lib/types";

// for the GET endpoints, we should include the referenced User objects for the response (based on the frontend's types)

// use this type below as response sa GET endpoints, for others use Inventory type only
type InventoryGet = Expand<Inventory & { user: User }>;

// GET /inventory
export async function getAllInventory(req: Request, res: Response) {
    try {
        // TODO business logic, then respond using "res" object
        const resultInventory: InventoryGet[] = await db.query.inventory.findMany({
            with: { user: true },
        });
        res.status(200).json(resultInventory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /inventory/user/:id   - req.params.id
export async function getInventoryByUserId(req: Request, res: Response) {
    try {
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid user ID." });
            return;
        }

        const userId = parseInt(req.params.id);

        const resultInventory: InventoryGet[] = await db.query.inventory.findMany({
            where: eq(inventory.userId, userId),
            with: { user: true },
        });

        res.status(200).json(resultInventory);
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /inventory/:id   - req.params.id
export async function getInventoryById(req: Request, res: Response) {
    try {
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid inventory ID." });
            return;
        }

        const userId = parseInt(req.params.id);

        const resultInventory: InventoryGet | undefined = await db.query.inventory.findFirst({
            where: eq(inventory.id, userId),
            with: { user: true },
        });

        res.status(200).json(resultInventory);
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// POST /inventory  - req.body (json body sa request)
export async function createInventory(req: Request, res: Response) {
    try {
        const { name, type, keywords, location, description, imageUrls, preferredOffer } = req.body;
        //object destructuring, if its object it does not need to be in order/arranged
        if (
            !name ||
            !type ||
            !keywords ||
            !description ||
            !imageUrls ||
            !preferredOffer ||
            !location
        ) {
            res.status(400).json({ error: true, message: "Missing fields." });
            return;
        }
        const userId = 1;

        const insertResult = await db.insert(inventory).values({
            name,
            type,
            keywords,
            location,
            description,
            imageUrls,
            preferredOffer,
            userId,
        });

        const id = insertResult[0].insertId;

        const newInventory: Inventory = {
            id,
            name,
            type,
            keywords,
            location,
            description,
            imageUrls,
            preferredOffer,
            userId,
        };
        res.status(201).json(newInventory);
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// PUT /inventory/:id   - req.params.id and req.body
export async function updateInventory(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        // validation examples:
        // - check if inventory exists using id
        // - check if current session user owns the inventory (compare req.session.user.id and inventory.userId)
        // then req.body should contain the new values for the update query
        // make sure id param is a valid number
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid inventory ID." });
            return;
        }

        // convert id param to number after validating
        const id = parseInt(req.params.id);

        // destructure the request json body
        const { name, type, location, preferredOffer, keywords, description, imageUrls } = req.body;

        // make sure all fields are present (can be same fields as POST)
        if (
            !name ||
            !type ||
            !keywords ||
            !description ||
            !imageUrls ||
            !location ||
            !preferredOffer
        ) {
            res.status(400).json({ error: true, message: "Missing fields." });
            return;
        }

        //const userId = req.session.user.id;
        // TODO: temporary, no auth/sessions for now para dali itest
        const userId = 1;

        // find the wish to update
        const currentInventory: Inventory | undefined = await db.query.inventory.findFirst({
            where: eq(inventory.id, id),
        });

        // if undefined/nonexistent
        if (!currentInventory) {
            res.status(404).json({ error: true, message: "Inventory does not exist." });
            return;
        }

        // check if current session user owns the wish
        if (currentInventory.userId !== userId) {
            res.status(403).json({ error: true, message: "You do not own this inventory." });
            return;
        }

        // apply updates to db
        await db
            .update(inventory)
            .set({ name, type, keywords, description, imageUrls, location, preferredOffer })
            .where(eq(inventory.id, id));

        // structure the updated wish object to prepare for response
        const updatedWish: Inventory = {
            ...currentInventory,
            name,
            type,
            keywords,
            description,
            imageUrls,
        };

        // respond with the new wish object
        res.status(200).json(updatedWish);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// DELETE /inventory/:id    - req.params.id
export async function deleteInventory(req: Request, res: Response) {
    try {
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid inventory ID." });
            return;
        }

        const id = parseInt(req.params.id);

        const userId = 1;

        //find the inventory to delete
        const currentInventory: InventoryGet | undefined = await db.query.inventory.findFirst({
            where: eq(inventory.id, id),
            with: { user: true },
        });

        //check if naa ba ang inventory
        if (!currentInventory) {
            res.status(404).json({ error: true, message: "Inventory does not exist." });
            return;
        }
        //check if ang inventory kay sa user nga iyang session
        if (currentInventory.user.id != userId) {
            res.status(403).json({ error: true, message: "User does not own inventory." });
            return;
        }

        // await db.delete(inventory).where(eq(inventory.id, userId));
        await db.update(inventory).set({ isDeleted: true }).where(eq(inventory.id, userId));

        res.status(200).json(currentInventory);
        // TODO input validation from "req" object, business logic, then respond using "res" object
        // validation examples:
        // - check if inventory exists using id
        // - check if current session user owns the inventory (compare req.session.user.id and inventory.userId)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}
