import {
    boolean,
    int,
    json,
    mysqlTable,
    timestamp,
    tinyint,
    varchar,
} from "drizzle-orm/mysql-core";

// TODO: most varchar lengths are unnecessarily 255. adjust to improve performance?

export const user = mysqlTable("user", {
    id: int("id").primaryKey().autoincrement(),
    email: varchar("email", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 64 }).notNull(),
    lastName: varchar("last_name", { length: 64 }).notNull(),
    gender: varchar("gender", { length: 32 }).notNull(),
    phoneNumber: varchar("phone_number", { length: 32 }),
    avatarUrl: varchar("avatar_url", { length: 255 }),
    location: varchar("location", { length: 255 }).notNull(),
    verified: tinyint("verified").notNull(),
    isDeleted: boolean("is_deleted"),
});

export const userPassword = mysqlTable("user_password", {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id")
        .notNull()
        .references(() => user.id),
    password: varchar("password", { length: 255 }).notNull(),
});

export const inventory = mysqlTable("inventory", {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id")
        .notNull()
        .references(() => user.id),
    type: varchar("type", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    keywords: json("keywords").notNull(), // json array of strings
    location: varchar("location", { length: 255 }),
    description: varchar("description", { length: 255 }).notNull(),
    imageUrls: json("image_urls").notNull(), // json array of links
    preferredOffer: varchar("preferred_offer", { length: 255 }),
    isDeleted: boolean("is_deleted"),
});

export const wish = mysqlTable("wish", {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id")
        .notNull()
        .references(() => user.id),
    type: varchar("type", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    keywords: json("keywords").notNull(), // json array of strings
    description: varchar("description", { length: 255 }).notNull(),
    imageUrls: json("image_urls").notNull(), // json array of links
    isDeleted: boolean("is_deleted"),
});

export const contract = mysqlTable("contract", {
    id: int("id").primaryKey().autoincrement(),
    documentUrls: json("document_urls").notNull(), // json array of links
    description: varchar("description", { length: 255 }).notNull(),
    isDeleted: boolean("is_deleted"),
});

export const tradeGroup = mysqlTable("trade_group", {
    id: int("id").primaryKey().autoincrement(),
    user1Id: int("user1_id")
        .notNull()
        .references(() => user.id),
    user2Id: int("user2_id") // TEMPORARY, for one-to-one trade only
        .notNull()
        .references(() => user.id),
    contractId: int("contract_id").references(() => contract.id),
    status: varchar("status", { length: 255 }).notNull(),
    isDeleted: boolean("is_deleted"),
});

export const tradeInventory = mysqlTable("trade_inventory", {
    id: int("id").primaryKey().autoincrement(),
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
    isDeleted: boolean("is_deleted"),
});

export const tradeTransaction = mysqlTable("trade_transaction", {
    id: int("id").primaryKey().autoincrement(),
    tradeInventoryId: int("tradeinventory_id")
        .notNull()
        .references(() => tradeInventory.id),
    description: varchar("description", { length: 255 }),
    proofUrls: json("proof_urls").notNull(), // json array of links
    quantity: int("quantity").notNull(),
    timestamp: timestamp("timestamp").notNull(),
    isDeleted: boolean("is_deleted"),
});

export const chatRoom = mysqlTable("chat_room", {
    id: int("id").primaryKey().autoincrement(),
    member1Id: int("member1_id")
        .notNull()
        .references(() => user.id),
    member2Id: int("member2_id")
        .notNull()
        .references(() => user.id),
});

export const chatMessage = mysqlTable("chat_message", {
    id: int("id").primaryKey().autoincrement(),
    chatRoomId: int("chatroom_id")
        .notNull()
        .references(() => chatRoom.id),
    senderId: int("sender_id")
        .notNull()
        .references(() => user.id),
    content: varchar("content", { length: 255 }).notNull(),
    timestamp: timestamp("timestamp").notNull(),
    isDeleted: boolean("is_deleted"),
});

export const notification = mysqlTable("notification", {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id")
        .notNull()
        .references(() => user.id),
    type: varchar("type", { length: 255 }).notNull(), // "matched", "completedTrade", "newOffer"
    content: json("content").notNull(), // object with content, ids, or links depending on type
    timestamp: timestamp("timestamp").notNull(),
    isRead: boolean("is_read").notNull(),
    isDeleted: boolean("is_deleted"),
});

// types
export type User = typeof user.$inferSelect;
export type UserPassword = typeof userPassword.$inferSelect;
export type Inventory = typeof inventory.$inferSelect;
export type Wish = typeof wish.$inferSelect;
export type Contract = typeof contract.$inferSelect;
export type TradeGroup = typeof tradeGroup.$inferSelect;
export type TradeInventory = typeof tradeInventory.$inferSelect;
export type TradeTransaction = typeof tradeTransaction.$inferSelect;
export type ChatRoom = typeof chatRoom.$inferSelect;
export type ChatMessage = typeof chatMessage.$inferSelect;
export type Notification = typeof notification.$inferSelect;
