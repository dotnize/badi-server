import { bigint, integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: serial("id").primaryKey(),
    // other user attributes
});

export const session = pgTable("user_session", {
    id: varchar("id", {
        length: 128,
    }).primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => user.id),
    activeExpires: bigint("active_expires", {
        mode: "number",
    }).notNull(),
    idleExpires: bigint("idle_expires", {
        mode: "number",
    }).notNull(),
});

export const key = pgTable("user_key", {
    id: varchar("id", {
        length: 255,
    }).primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => user.id),
    hashedPassword: varchar("hashed_password", {
        length: 255,
    }),
});
