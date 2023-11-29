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
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /inventory/:id   - req.params.id
export async function getInventoryById(req: Request, res: Response) {
    try {
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
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// DELETE /inventory/:id    - req.params.id
export async function deleteInventory(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        // validation examples:
        // - check if inventory exists using id
        // - check if current session user owns the inventory (compare req.session.user.id and inventory.userId)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}
