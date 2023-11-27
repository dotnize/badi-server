import type { Request, Response } from "express";

// GET /contract/:id   - req.params.id
export async function getContractById(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /contract/tradegroup/:id   - req.params.id
export async function getContractByTradeGroupId(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// POST /contract  - req.body (json body sa request)
export async function createContract(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// PUT /contract/:id   - req.params.id and req.body
export async function updateContract(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        // validation examples:
        // - check if contract exists using id
        // - check if current session user is part of the contract's tradeGroupId
        // then req.body should contain the new values for the update query
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// DELETE /contract/:id    - req.params.id
export async function deleteContract(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        // validation examples:
        // - check if contract exists using id
        // - check if current session user is part of the contract's tradeGroupId
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}
