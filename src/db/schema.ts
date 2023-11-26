import { bigint, boolean, int, json, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

// TODO: most varchar lengths are unnecessarily 255. adjust to improve performance?

export const user = mysqlTable("user", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    // TODO: other user attributes
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

export const tradeGroup = mysqlTable("tradegroup", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    userCount: int("user_count").notNull(),
    tradeCount: int("trade_count").notNull(),
    status: varchar("status", { length: 255 }).notNull(),
    // TODO SABOTAN PA
});

export const trade = mysqlTable("trade", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    tradeGroupId: int("tradegroup_id")
        .notNull()
        .references(() => tradeGroup.id),
    initiatorId: int("user_id").references(() => user.id),
    receiverId: int("user_id").references(() => user.id), // TEMPORARY?
    contractId: int("contract_id"),
    inventoryId: int("inventory_id")
        .notNull()
        .references(() => inventory.id),
    status: varchar("status", { length: 255 }).notNull(),
    // TODO SABOTAN PA
});

export const transaction = mysqlTable("transaction", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    isCompleted: boolean("is_completed").notNull(),
    proofUrls: json("proof_urls").notNull(), // json array of links
    transactionDescription: varchar("transaction_description", { length: 255 }),
    timestamp: timestamp("timestamp"),
    // TODO
});

// TODO: tables for chat
