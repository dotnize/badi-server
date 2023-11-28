import type { Request, Response } from "express";
import { Expand, TradeGroup, User } from "~/lib/types";

// for the GET endpoints, we should include the referenced User objects for the response (based on the frontend's types)

// use this type below as response sa GET endpoints, for others use TradeGroup type only
type TradeGroupGet = Expand<TradeGroup & { user1: User; user2: User }>;

// GET /tradegroup/:id   - req.params.id
export async function getTradeGroupById(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /tradegroup/user/:id   - req.params.id
export async function getTradeGroupByUserId(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// POST /tradegroup  - req.body (json body sa request)
export async function createTradeGroup(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// PUT /tradegroup/:id   - req.params.id and req.body
export async function updateTradeGroup(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        // validation examples:
        // - check if tradeGroup exists using id
        // - check if current session user is part of tradeGroup
        // then req.body should contain the new values for the update query
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// DELETE /tradegroup/:id    - req.params.id
export async function deleteTradeGroup(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        // validation examples:
        // - check if tradeGroup exists using id
        // - check if current session user is part of tradeGroup
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}
