import type { Request, Response } from "express";

// GET /tradetransaction/group/:id   - req.params.id
export async function getTradeTransactionByGroupId(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// by inventory, i mean TradeInventory. gipamubo nalang kay taas ra kaayo
// GET /tradetransaction/inventory/:id   - req.params.id
export async function getTradeTransactionByInventoryId(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /tradetransaction/:id   - req.params.id
export async function getTradeTransactionById(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// POST /tradetransaction  - req.body (json body sa request)
export async function createTradeTransaction(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// PUT /tradetransaction/:id   - req.params.id and req.body
export async function updateTradeTransaction(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        // validation examples:
        // - check if tradeTransaction exists using id
        // - check if current session user is part of transaction's referenced tradeGroup
        // then req.body should contain the new values for the update query
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// DELETE /tradetransaction/:id    - req.params.id
export async function deleteTradeTransaction(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        // validation examples:
        // - check if tradeTransaction exists using id
        // - check if current session user is part of transaction's referenced tradeGroup
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}
