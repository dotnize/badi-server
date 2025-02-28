import { and, like, ne, or } from "drizzle-orm";
import { db } from "~/db/drizzle";
import { inventory, notification } from "~/db/schema";
import { Inventory } from "./types";

export async function findMatch(
    id: number,
    fromUserId: number,
    keywords: string[],
    preferredOffer?: string
) {
    try {
        // TODO: support matching for wishes, and search the inventory of the wish's user to match

        // debugging
        console.log(
            `finding match for ${id} from ${fromUserId} with keywords ${keywords}, preferredOffer ${
                preferredOffer || "none"
            }`
        );

        // TODO: proper keyword matching, for now only first keyword is searched
        const match: Inventory | undefined = await db.query.inventory.findFirst({
            where: and(
                or(
                    //like(inventory.keywords, `%${keywords[0]}%`),
                    like(inventory.name, `%${keywords[0]}%`),
                    like(inventory.description, `%${keywords[0]}%`),
                    like(inventory.preferredOffer, `%${keywords[0]}%`),
                    //preferredOffer ? like(inventory.keywords, `%${preferredOffer}%`) : undefined,
                    preferredOffer ? like(inventory.name, `%${preferredOffer}%`) : undefined,
                    preferredOffer ? like(inventory.description, `%${preferredOffer}%`) : undefined,
                    preferredOffer
                        ? like(inventory.preferredOffer, `%${preferredOffer}%`)
                        : undefined
                ),
                ne(inventory.userId, fromUserId)
            ),
        });

        if (!match) {
            // debugging
            console.log("no match found");
            return;
        }

        // debugging
        console.log(`found match ${match.id} for ${id}`);
        //console.log(`match keywords: ${match.keywords}`);
        console.log(`match preferredOffer: ${match.preferredOffer}`);
        console.log(`match name: ${match.name}`);
        console.log(`match description: ${match.description}`);

        // add notifications to db
        await db.insert(notification).values([
            {
                userId: fromUserId,
                type: "match",
                timestamp: new Date(),
                isRead: false,
                content: { matchedUserId: match.userId, toReceiveIds: [match.id], toSendIds: [id] },
            },
            {
                userId: match.userId,
                type: "match",
                timestamp: new Date(),
                isRead: false,
                content: { matchedUserId: fromUserId, toReceiveIds: [id], toSendIds: [match.id] },
            },
        ]);
    } catch (err) {
        console.error(err);
    }
}
