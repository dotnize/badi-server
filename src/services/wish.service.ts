import type { Request, Response } from "express";

// GET /wish
export async function getAllWish(req: Request, res: Response) {
    try {
        // TODO business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /wish/user/:id   - req.params.id
export async function getWishByUserId(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /wish/:id   - req.params.id
export async function getWishById(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// POST /wish  - req.body (json body sa request)
export async function createWish(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// PUT /wish/:id   - req.params.id and req.body
export async function updateWish(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        // validation examples:
        // - check if wish exists using id
        // - check if current session user owns the wish (compare req.session.user.id and wish.userId)
        // then req.body should contain the new values for the update query
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// DELETE /wish/:id    - req.params.id
export async function deleteWish(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        // validation examples:
        // - check if wish exists using id
        // - check if current session user owns the wish (compare req.session.user.id and wish.userId)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}
