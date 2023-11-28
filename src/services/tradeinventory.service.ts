import type { Request, Response } from "express";
import { Expand, Inventory, TradeInventory } from "~/lib/types";

// for the GET endpoints, we should include the referenced Inventory object for the response

// use this type below as response sa GET endpoints, for others use TradeInventory type only
type TradeInventoryGet = Expand<TradeInventory & { inventory: Inventory }>;

// GET /tradeinventory/:id   - req.params.id
export async function getTradeInventoryById(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /tradeinventory/group/:id   - req.params.id
export async function getTradeInventoryByGroupId(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// POST /tradeinventory  - req.body (json body sa request)
export async function createTradeInventory(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// PUT /tradeinventory/:id   - req.params.id and req.body
export async function updateTradeInventory(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        // validation examples:
        // - check if tradeInventory exists using id
        // - check if current session user is part of tradeInventory (sender/receiver)
        // then req.body should contain the new values for the update query
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// DELETE /tradeinventory/:id    - req.params.id
export async function deleteTradeInventory(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        // validation examples:
        // - check if tradeInventory exists using id
        // - check if current session user is part of tradeInventory (sender/receiver)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}
