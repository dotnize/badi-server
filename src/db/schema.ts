import { relations } from "drizzle-orm";
import {
    boolean,
    float,
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
    averageRating: float("average_rating"),
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
    tradeGroupId: int("tradegroup_id")
        .notNull()
        .references(() => tradeGroup.id),
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
    tradeGroupId: int("tradegroup_id")
        .notNull()
        .references(() => tradeGroup.id),
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

export const rating = mysqlTable("rating", {
    id: int("id").primaryKey().autoincrement(),
    fromUserId: int("user_id")
        .notNull()
        .references(() => user.id),
    toUserId: int("user_id")
        .notNull()
        .references(() => user.id),
    amount: int("rating").notNull(),
    description: varchar("description", { length: 255 }),
    timestamp: timestamp("timestamp").notNull(),
});

// Relations for the "with" parameter in drizzle-orm's findMany and findFirst

export const chatRoomRelations = relations(chatRoom, ({ one }) => ({
    // TODO: test properly. this will probably return the first message.
    lastMessagePreview: one(chatMessage, {
        fields: [chatRoom.id],
        references: [chatMessage.chatRoomId],
    }),
    member1: one(user, {
        fields: [chatRoom.member1Id],
        references: [user.id],
    }),
    member2: one(user, {
        fields: [chatRoom.member2Id],
        references: [user.id],
    }),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
    user: one(user, {
        fields: [inventory.userId],
        references: [user.id],
    }),
}));

export const ratingRelations = relations(rating, ({ one }) => ({
    fromUser: one(user, {
        fields: [rating.fromUserId],
        references: [user.id],
    }),
}));

export const tradeGroupRelations = relations(tradeGroup, ({ one }) => ({
    user1: one(user, {
        fields: [tradeGroup.user1Id],
        references: [user.id],
    }),
    user2: one(user, {
        fields: [tradeGroup.user2Id],
        references: [user.id],
    }),
}));

export const tradeInventoryRelations = relations(tradeInventory, ({ one }) => ({
    inventory: one(inventory, {
        fields: [tradeInventory.inventoryId],
        references: [inventory.id],
    }),
}));

export const wishRelations = relations(wish, ({ one }) => ({
    user: one(user, {
        fields: [wish.userId],
        references: [user.id],
    }),
}));
