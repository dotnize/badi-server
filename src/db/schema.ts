import { bigint, boolean, int, json, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

// TODO: most varchar lengths are unnecessarily 255. adjust to improve performance?

export const user = mysqlTable("user", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    firstName: varchar("first_name", { length: 64 }).notNull(),
    lastName: varchar("last_name", { length: 64 }).notNull(),
    gender: varchar("gender", { length: 32 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 32 }).notNull(),
    avatarUrl: varchar("avatar_url", { length: 255 }),
    location: varchar("location", { length: 255 }),
    isVerified: boolean("is_verified").notNull(),
});

// --- special tables for lucia auth
export const key = mysqlTable("user_key", {
    id: varchar("id", {
        length: 255,
    }).primaryKey(),
    userId: int("user_id")
        .notNull()
        .references(() => user.id),
    hashedPassword: varchar("hashed_password", {
        length: 255,
    }),
});
export const session = mysqlTable("user_session", {
    id: varchar("id", {
        length: 128,
    }).primaryKey(),
    userId: int("user_id")
        .notNull()
        .references(() => user.id),
    activeExpires: bigint("active_expires", {
        mode: "number",
    }).notNull(),
    idleExpires: bigint("idle_expires", {
        mode: "number",
    }).notNull(),
});
// ---

export const inventory = mysqlTable("inventory", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    userId: int("user_id")
        .notNull()
        .references(() => user.id),
    type: varchar("type", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    keywords: json("keywords").notNull(), // json array of strings
    description: varchar("description", { length: 255 }).notNull(),
    imageUrls: json("image_urls").notNull(), // json array of links
    preferredOffer: varchar("preferred_offer", { length: 255 }),
});

export const wish = mysqlTable("wish", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    userId: int("user_id")
        .notNull()
        .references(() => user.id),
    type: varchar("type", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    keywords: json("keywords").notNull(), // json array of strings
    description: varchar("description", { length: 255 }).notNull(),
    imageUrls: json("image_urls").notNull(), // json array of links
});

export const contract = mysqlTable("contract", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    documentUrls: json("document_urls").notNull(), // json array of links
    description: varchar("description", { length: 255 }).notNull(),
});

export const tradeGroup = mysqlTable("trade_group", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    user1Id: int("user1_id").references(() => user.id),
    user2Id: int("user2_id") // TEMPORARY, for one-to-one trade only
        .notNull()
        .references(() => user.id),
    contractId: int("contract_id").references(() => contract.id),
    status: varchar("status", { length: 255 }).notNull(),
});

export const tradeInventory = mysqlTable("trade_inventory", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    tradeGroupId: int("tradegroup_id")
        .notNull()
        .references(() => tradeGroup.id),
    senderId: int("user_id")
        .notNull()
        .references(() => user.id),
    receiverId: int("user_id")
        .notNull()
        .references(() => user.id),
    inventoryId: int("inventory_id")
        .notNull()
        .references(() => inventory.id),
    totalQuantity: int("total_quantity").notNull(),
    completedQuantity: int("completed_quantity").notNull(),
    isCompleted: boolean("is_completed").notNull(),
});

export const tradeTransaction = mysqlTable("trade_transaction", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    tradeInventoryId: int("tradeinventory_id")
        .notNull()
        .references(() => tradeInventory.id),
    description: varchar("description", { length: 255 }),
    proofUrls: json("proof_urls").notNull(), // json array of links
    quantity: int("quantity").notNull(),
    timestamp: timestamp("timestamp"),
});

export const chatRoom = mysqlTable("chat_room", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    member1Id: int("member1_id")
        .notNull()
        .references(() => user.id),
    member2Id: int("member2_id")
        .notNull()
        .references(() => user.id),
});

export const chatMessage = mysqlTable("chat_message", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    chatRoomId: int("chatroom_id")
        .notNull()
        .references(() => chatRoom.id),
    senderId: int("sender_id")
        .notNull()
        .references(() => user.id),
    content: varchar("content", { length: 255 }).notNull(),
    timestamp: timestamp("timestamp"),
});

export const notification = mysqlTable("notification", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    userId: int("user_id")
        .notNull()
        .references(() => user.id),
    type: varchar("type", { length: 255 }).notNull(), // "matched", "completedTrade", "newOffer"
    content: json("content").notNull(), // object with content, ids, or links depending on type
    timestamp: timestamp("timestamp"),
    isRead: boolean("is_read").notNull(),
});
