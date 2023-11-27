import type { Request, Response } from "express";

// GET /inventory   - no input/params, ditso ra
export async function getAllInventory(req: Request, res: Response) {
    try {
        // TODO business logic, then respond using "res" object
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
        // - check if current user owns the inventory (compare req.session.user.id and inventory.userId)
        // then req.body should the new values for the update query
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
        // - check if current user owns the inventory (compare req.session.user.id and inventory.userId)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}
