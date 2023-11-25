import { bigint, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const user = mysqlTable("auth_user", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    // TODO: other user attributes
});

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

// TODO: other tables
