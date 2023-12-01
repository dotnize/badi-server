import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

import { db } from "~/db/drizzle";
import { tradeGroup, tradeTransaction } from "~/db/schema";
import { TradeGroup, TradeTransaction } from "~/lib/types";

// GET /tradetransaction/group/:id   - req.params.id
export async function getTradeTransactionByGroupId(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object

        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid user ID." });
            return;
        }
        // convert id param to number after validating
        const tradeGroupId = parseInt(req.params.id);

        // get trade transactions by group id
        const resultTradeTransactions: TradeTransaction[] =
            await db.query.tradeTransaction.findMany({
                where: eq(tradeTransaction.tradeGroupId, tradeGroupId),
            });

        // respond with result array
        res.status(200).json(resultTradeTransactions);
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
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid user ID." });
            return;
        }
        // convert id param to number after validating
        const tradeInventoryId = parseInt(req.params.id);

        // get trade transactions by tradeInventoryId id
        const resultTradeTransactions: TradeTransaction[] =
            await db.query.tradeTransaction.findMany({
                where: eq(tradeTransaction.tradeInventoryId, tradeInventoryId),
            });

        // respond with result array
        res.status(200).json(resultTradeTransactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /tradetransaction/:id   - req.params.id
export async function getTradeTransactionById(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid user ID." });
            return;
        }
        // convert id param to number after validating
        const id = parseInt(req.params.id);

        // get trade transaction by id, and it's possibly nonexistent (undefined type)
        const tradeTransactionResult: TradeTransaction | undefined =
            await db.query.tradeTransaction.findFirst({
                where: eq(tradeTransaction.id, id),
            });

        // if type is undefined
        if (!tradeTransactionResult) {
            res.status(404).json({ error: true, message: "Trade Transaction does not exist." });
            return;
        }

        // respond with result object
        res.status(200).json(tradeTransactionResult);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// POST /tradetransaction  - req.body (json body sa request)
export async function createTradeTransaction(req: Request, res: Response) {
    try {
        // TODO input validation from "req" object, business logic, then respond using "res" object

        const {
            tradeGroupId,
            tradeInventoryId,
            description,
            proofUrls,
            quantity,
            timestamp = new Date(),
            isDeleted = false,
        } = req.body;

        // make sure all fields are present
        if (!tradeInventoryId || !tradeGroupId || !description || !proofUrls || !quantity) {
            res.status(400).json({ error: true, message: "Missing fields." });
            return;
        }

        //const userId = req.session.userId;
        // TODO: temporary, no auth/sessions for now para dali itest
        const userId = 1;

        // insert to db
        const insertResult = await db.insert(tradeTransaction).values({
            tradeGroupId,
            tradeInventoryId,
            description,
            proofUrls,
            quantity,
            timestamp,
            isDeleted,
        });

        // get new id of inserted row
        const id = insertResult[0].insertId;

        // structure the new wish object to prepare for response
        const newTradeTransaction: TradeTransaction = {
            id,
            tradeGroupId,
            tradeInventoryId,
            description,
            proofUrls,
            quantity,
            timestamp,
        };

        // respond with the new wish object
        res.status(201).json(newTradeTransaction);
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
        // - 1 check if tradeTransaction exists using id
        // - 2 check if current session user is part of transaction's referenced tradeGroup
        // - 3 then update, req.body should contain the new values for the update query

        // 1
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid user ID." });
            return;
        }

        // convert id param to number after validating
        const id = parseInt(req.params.id);
        console.log(id, "yjh");

        // get tradetransaction by id, and it's possibly nonexistent (undefined type)
        const currentTradeTransaction: TradeTransaction | undefined =
            await db.query.tradeTransaction.findFirst({
                where: eq(tradeTransaction.id, id),
            });

        // if type is undefined
        if (!currentTradeTransaction) {
            res.status(404).json({ error: true, message: "Trade Transaction does not exist." });
            return;
        }

        // 2
        // const currentTradeTransactionGroup: TradeGroup | undefined =
        //     await db.query.tradeGroup.findFirst({
        //         where: eq(tradeGroup.user1Id || tradeGroup.user2Id, req.session.userId),
        //     });

        // // if user is undefined
        // if (!currentTradeTransaction) {
        //     res.status(404).json({
        //         error: true,
        //         message: "You are not part of this Trade Transaction!",
        //     });
        //     return;
        // }

        // 3
        const {
            tradeGroupId = currentTradeTransaction.tradeGroupId,
            tradeInventoryId = currentTradeTransaction.tradeInventoryId,
            description = currentTradeTransaction.description,
            proofUrls = currentTradeTransaction.proofUrls,
            quantity = currentTradeTransaction.quantity,
            isDeleted = currentTradeTransaction.isDeleted,
        } = req.body;

        // make sure all fields are present
        if (!tradeInventoryId || !tradeGroupId || !description || !proofUrls || !quantity) {
            res.status(400).json({ error: true, message: "Missing fields." });
            return;
        }

        // apply updates to db
        await db
            .update(tradeTransaction)
            .set({
                tradeGroupId,
                tradeInventoryId,
                description,
                proofUrls,
                quantity,
                isDeleted,
            })
            .where(eq(tradeTransaction.id, id));

        // structure the updated wish object to prepare for response
        const updatedTradeTransaction: TradeTransaction = {
            ...currentTradeTransaction,
            tradeGroupId,
            tradeInventoryId,
            description,
            proofUrls,
            quantity,
            isDeleted,
        };

        // respond with the new trade transaction object
        res.status(200).json(updatedTradeTransaction);
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
        // - 1 check if tradeTransaction exists using id
        // - 2 check if current session user is part of transaction's referenced tradeGroup
        // - 3 then update is deleted

        // 1
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid user ID." });
            return;
        }

        // convert id param to number after validating
        const id = parseInt(req.params.id);

        // get wish by id, and it's possibly nonexistent (undefined type)
        const currentTradeTransaction: TradeTransaction | undefined =
            await db.query.tradeTransaction.findFirst({
                where: eq(tradeTransaction.id, id),
            });

        // if type is undefined
        if (!currentTradeTransaction) {
            res.status(404).json({ error: true, message: "Trade Transaction does not exist." });
            return;
        }

        // 2
        const currentTradeTransactionGroup: TradeGroup | undefined =
            await db.query.tradeGroup.findFirst({
                where: eq(tradeGroup.user1Id || tradeGroup.user2Id, req.session.userId),
            });

        // if user is undefined
        if (!currentTradeTransaction) {
            res.status(404).json({
                error: true,
                message: "You are not part of this Trade Transaction!",
            });
            return;
        }

        // 3
        // apply updates to db
        await db
            .update(tradeTransaction)
            .set({ isDeleted: true })
            .where(eq(tradeTransaction.id, id));

        // structure the updated wish object to prepare for response
        const updatedTradeTransaction: TradeTransaction = {
            ...currentTradeTransaction,
            isDeleted: true,
        };

        // respond with the new trade transaction object
        res.status(200).json(updatedTradeTransaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}
