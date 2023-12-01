import { and, eq, isNull } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "~/db/drizzle";
import { inventory, tradeInventory } from "~/db/schema";
import { Expand, Inventory, TradeInventory } from "~/lib/types";

// for the GET endpoints, we should include the referenced Inventory object for the response

// use this type below as response sa GET endpoints, for others use TradeInventory type only
type TradeInventoryGet = Expand<TradeInventory & { inventory: Inventory }>;

// GET /tradeinventory/:id   - req.params.id
export async function getTradeInventoryById(req: Request, res: Response) {
    try {
        // make sure id param is a valid number
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid trade group ID." });
            return;
        }

        // convert id param to number after validating
        const id = parseInt(req.params.id);

        const tradeInvResult: TradeInventoryGet | undefined =
            await db.query.tradeInventory.findFirst({
                where: and(eq(tradeInventory.id, id), isNull(tradeInventory.isDeleted)),
                with: { inventory: true },
            });

        if (!tradeInvResult) {
            res.status(404).json({ error: true, message: "Trade inventory not found." });
            return;
        }

        res.status(200).json(tradeInvResult);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /tradeinventory/group/:id   - req.params.id
export async function getTradeInventoryByGroupId(req: Request, res: Response) {
    try {
        // make sure id param is a valid number
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid group ID." });
            return;
        }

        // convert id param to number after validating
        const groupId = parseInt(req.params.id);

        const resultInventories: TradeInventoryGet[] = await db.query.tradeInventory.findMany({
            where: and(eq(tradeInventory.tradeGroupId, groupId), isNull(tradeInventory.isDeleted)),
            with: { inventory: true },
        });

        res.status(200).json(resultInventories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// POST /tradeinventory  - req.body (json body sa request)
export async function createTradeInventory(req: Request, res: Response) {
    try {
        // NOTE: When creating a new tradegroup, just use the POST /tradegroup endpoint to add the inventories.

        // parseint the body
        const tradeGroupId = parseInt(req.body.tradeGroupId);
        const senderId = parseInt(req.body.senderId);
        const receiverId = parseInt(req.body.receiverId);
        const inventoryId = parseInt(req.body.inventoryId);
        const totalQuantity = parseInt(req.body.totalQuantity);

        if (
            !tradeGroupId ||
            !senderId ||
            !receiverId ||
            !inventoryId ||
            !totalQuantity ||
            isNaN(tradeGroupId) ||
            isNaN(senderId) ||
            isNaN(receiverId) ||
            isNaN(inventoryId) ||
            isNaN(totalQuantity)
        ) {
            res.status(400).json({ error: true, message: "Missing fields." });
            return;
        }

        const sessionUserId = req.session.userId;

        // check if trade group exists
        const groupResult = await db.query.tradeGroup.findFirst({
            where: and(
                eq(tradeInventory.tradeGroupId, tradeGroupId),
                isNull(tradeInventory.isDeleted)
            ),
        });
        if (!groupResult) {
            res.status(404).json({ error: true, message: "Trade group not found." });
            return;
        }

        // check if session user is part of the trade group
        if (groupResult.user1Id !== sessionUserId && groupResult.user2Id !== sessionUserId) {
            res.status(400).json({ error: true, message: "You are not part of the trade group." });
            return;
        }

        // check if sender and receiver are part of the trade group
        if (groupResult.user1Id !== senderId && groupResult.user2Id !== senderId) {
            res.status(400).json({ error: true, message: "Sender not part of trade group." });
            return;
        }
        if (groupResult.user1Id !== receiverId && groupResult.user2Id !== receiverId) {
            res.status(400).json({ error: true, message: "Receiver not part of trade group." });
            return;
        }

        // check if inventory exists
        const inventoryResult = await db.query.inventory.findFirst({
            where: and(eq(inventory.id, inventoryId), isNull(inventory.isDeleted)),
        });
        if (!inventoryResult) {
            res.status(404).json({ error: true, message: "Inventory not found." });
            return;
        }

        // check if sender owns the inventory
        if (inventoryResult.userId !== senderId) {
            res.status(400).json({ error: true, message: "Sender does not own the inventory." });
            return;
        }

        // check if totalQuantity is valid
        if (totalQuantity < 1) {
            res.status(400).json({ error: true, message: "Invalid total quantity." });
            return;
        }

        // check if totalQuantity is less than or equal to the inventory quantity
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// PUT /tradeinventory/:id   - req.params.id and req.body
export async function updateTradeInventory(req: Request, res: Response) {
    try {
        const { incrementQuantity } = req.body;
        const id = parseInt(req.params.id);

        if (!id || isNaN(id)) {
            res.status(400).json({ error: true, message: "Invalid trade inventory ID." });
            return;
        }
        if (!incrementQuantity || isNaN(incrementQuantity) || incrementQuantity < 1) {
            res.status(400).json({ error: true, message: "Invalid completed quantity." });
            return;
        }

        const sessionUserId = req.session.userId;

        // check if trade inventory exists
        const currentTradeInventory: TradeInventory | undefined =
            await db.query.tradeInventory.findFirst({
                where: and(eq(tradeInventory.id, id), isNull(tradeInventory.isDeleted)),
            });

        // if undefined/nonexistent
        if (!currentTradeInventory) {
            res.status(404).json({ error: true, message: "Trade inventory does not exist." });
            return;
        }

        if (sessionUserId !== currentTradeInventory.senderId) {
            res.status(403).json({
                error: true,
                message: "You are the sender of this trade inventory.",
            });
            return;
        }

        const completedQuantity = currentTradeInventory.completedQuantity + incrementQuantity;
        const isCompleted = completedQuantity >= currentTradeInventory.totalQuantity;

        await db
            .update(tradeInventory)
            .set({
                completedQuantity,
                isCompleted,
            })
            .where(eq(tradeInventory.id, id));

        res.status(200).json({ ...currentTradeInventory, completedQuantity, isCompleted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// DELETE /tradeinventory/:id    - req.params.id
export async function deleteTradeInventory(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);

        if (!id || isNaN(id)) {
            res.status(400).json({ error: true, message: "Invalid trade inventory ID." });
            return;
        }

        const sessionUserId = req.session.userId;

        // check if trade inventory exists
        const currentTradeInventory: TradeInventory | undefined =
            await db.query.tradeInventory.findFirst({
                where: and(eq(tradeInventory.id, id), isNull(tradeInventory.isDeleted)),
            });

        // if undefined/nonexistent
        if (!currentTradeInventory) {
            res.status(404).json({ error: true, message: "Trade inventory does not exist." });
            return;
        }

        if (
            sessionUserId !== currentTradeInventory.senderId &&
            sessionUserId !== currentTradeInventory.receiverId
        ) {
            res.status(403).json({
                error: true,
                message: "You are part of this trade group.",
            });
            return;
        }

        // goodbye philippines
        //await db.delete(tradeInventory).where(eq(tradeInventory.id, id));

        await db.update(tradeInventory).set({ isDeleted: true }).where(eq(tradeInventory.id, id));

        res.status(200).json(currentTradeInventory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}
