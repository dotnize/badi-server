import { and, eq, isNull, or } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "~/db/drizzle";
import { tradeGroup, tradeInventory, user } from "~/db/schema";
import { Expand, TradeGroup, User } from "~/lib/types";

// for the GET endpoints, we should include the referenced User objects for the response (based on the frontend's types)

// use this type below as response sa GET endpoints, for others use TradeGroup type only
type TradeGroupGet = Expand<TradeGroup & { user1: User; user2: User }>;

// GET /tradegroup/:id   - req.params.id
export async function getTradeGroupById(req: Request, res: Response) {
    try {
        // make sure id param is a valid number
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid trade group ID." });
            return;
        }

        // convert id param to number after validating
        const id = parseInt(req.params.id);

        const groupResult: TradeGroupGet | undefined = await db.query.tradeGroup.findFirst({
            where: and(eq(tradeGroup.id, id), isNull(tradeGroup.isDeleted)),
            with: { user1: true, user2: true },
        });

        if (!groupResult) {
            res.status(404).json({ error: true, message: "Trade group not found." });
            return;
        }

        res.status(200).json(groupResult);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// GET /tradegroup/user/:id   - req.params.id
export async function getTradeGroupByUserId(req: Request, res: Response) {
    try {
        // make sure id param is a valid number
        if (!req.params.id || isNaN(parseInt(req.params.id))) {
            res.status(400).json({ error: true, message: "Invalid user ID." });
            return;
        }

        // convert id param to number after validating
        const userId = parseInt(req.params.id);

        const resultGroups: TradeGroupGet[] = await db.query.tradeGroup.findMany({
            where: and(
                or(eq(tradeGroup.user1Id, userId), eq(tradeGroup.user2Id, userId)),
                isNull(tradeGroup.isDeleted)
            ),
            with: { user1: true, user2: true },
        });

        res.status(200).json(resultGroups);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// POST /tradegroup  - req.body (json body sa request)
export async function createTradeGroup(req: Request, res: Response) {
    try {
        // NOTE: When creating a new tradegroup, all inventories must be included in the same request.
        const { tradeInventories } = req.body;
        if (
            !tradeInventories ||
            !Array.isArray(tradeInventories) ||
            tradeInventories.length === 0
        ) {
            res.status(400).json({ error: true, message: "No trade inventories provided." });
            return;
        }

        if (
            !req.body.user1Id ||
            !req.body.user2Id ||
            isNaN(parseInt(req.body.user1Id)) ||
            isNaN(parseInt(req.body.user2Id)) ||
            req.body.user1Id === req.body.user2Id
        ) {
            res.status(400).json({ error: true, message: "Invalid user ID." });
            return;
        }

        const sessionUserId = req.session.userId;
        const user1Id = parseInt(req.body.user1Id);
        const user2Id = parseInt(req.body.user2Id);

        if (!sessionUserId || (sessionUserId !== user1Id && sessionUserId !== user2Id)) {
            // not authorized
            res.status(401).json({ error: true, message: "Unauthorized." });
            return;
        }

        if (user1Id === sessionUserId) {
            // check if user2 is valid user
            const user2 = await db.query.user.findFirst({ where: eq(user.id, user2Id) });
            if (!user2) {
                res.status(400).json({ error: true, message: "Invalid user ID." });
                return;
            }
        } else {
            // check if user1 is valid user
            const user1 = await db.query.user.findFirst({ where: eq(user.id, user1Id) });
            if (!user1) {
                res.status(400).json({ error: true, message: "Invalid user ID." });
                return;
            }
        }

        // create trade group
        const insertResult = await db
            .insert(tradeGroup)
            .values({ user1Id, user2Id, status: "pending" });

        // get new id of inserted row
        const id = insertResult[0].insertId;

        // insert trade inventories
        const tradeInvs = tradeInventories.map((inv) => {
            // TODO proper validation, and check if IDs exist?
            return {
                tradeGroupId: id,
                senderId: inv.senderId,
                receiverId: inv.receiverId,
                inventoryId: inv.inventoryId,
                totalQuantity: inv.totalQuantity,
                completedQuantity: 0,
                isCompleted: false,
            };
        });
        await db.insert(tradeInventory).values(tradeInvs);

        // structure the result object
        const newGroup = { id, user1Id, user2Id, status: "pending" };

        // respond with result object
        res.status(201).json(newGroup);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// PUT /tradegroup/:id   - req.params.id and req.body
export async function updateTradeGroup(req: Request, res: Response) {
    try {
        const { status } = req.body;
        const id = parseInt(req.params.id);

        if (!id || isNaN(id)) {
            res.status(400).json({ error: true, message: "Invalid trade group ID." });
            return;
        }
        if (!status) {
            res.status(400).json({ error: true, message: "Invalid status" });
            return;
        }

        // check if trade group exists
        const currentTradeGroup: TradeGroup | undefined = await db.query.tradeGroup.findFirst({
            where: eq(tradeGroup.id, id),
        });

        // if undefined/nonexistent
        if (!currentTradeGroup) {
            res.status(404).json({ error: true, message: "Trade group does not exist." });
            return;
        }

        const sessionUserId = req.session.userId;
        if (
            sessionUserId !== currentTradeGroup.user1Id &&
            sessionUserId !== currentTradeGroup.user2Id
        ) {
            res.status(403).json({ error: true, message: "You are not part of this trade group." });
            return;
        }

        await db.update(tradeGroup).set({ status }).where(eq(tradeGroup.id, id));

        const updatedTradeGroup: TradeGroup = { ...currentTradeGroup, status };

        res.status(200).json(updatedTradeGroup);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}

// DELETE /tradegroup/:id    - req.params.id
export async function deleteTradeGroup(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);

        if (!id || isNaN(id)) {
            res.status(400).json({ error: true, message: "Invalid trade group ID." });
            return;
        }

        const sessionUserId = req.session.userId;

        // check if trade group exists
        const currentTradeGroup: TradeGroup | undefined = await db.query.tradeGroup.findFirst({
            where: eq(tradeGroup.id, id),
        });

        // if undefined/nonexistent
        if (!currentTradeGroup) {
            res.status(404).json({ error: true, message: "Trade group does not exist." });
            return;
        }

        // check if current session user is part of trade group
        if (
            sessionUserId !== currentTradeGroup.user1Id &&
            sessionUserId !== currentTradeGroup.user2Id
        ) {
            res.status(403).json({ error: true, message: "You are not part of this trade group." });
            return;
        }

        // goodbye philippines
        //await db.delete(tradeGroup).where(eq(tradeGroup.id, id));
        await db.update(tradeGroup).set({ isDeleted: true }).where(eq(tradeGroup.id, id));

        res.status(200).json(currentTradeGroup);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal server error." });
    }
}
