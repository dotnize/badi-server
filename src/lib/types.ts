import type {
    chatMessage,
    chatRoom,
    contract,
    inventory,
    notification,
    rating,
    tradeGroup,
    tradeInventory,
    tradeTransaction,
    user,
    userPassword,
    wish,
} from "~/db/schema";

export type Expand<T> = T extends unknown ? { [K in keyof T]: T[K] } : never;
type MakeOptional<T, K extends keyof T> = Expand<Omit<T, K> & Partial<Pick<T, K>>>;

// types
export type User = MakeOptional<typeof user.$inferSelect, "isDeleted">;
export type UserPassword = typeof userPassword.$inferSelect;
export type Inventory = MakeOptional<typeof inventory.$inferSelect, "isDeleted">;
export type Wish = MakeOptional<typeof wish.$inferSelect, "isDeleted">;
export type Contract = MakeOptional<typeof contract.$inferSelect, "isDeleted">;
export type TradeGroup = MakeOptional<typeof tradeGroup.$inferSelect, "isDeleted">;
export type TradeInventory = MakeOptional<typeof tradeInventory.$inferSelect, "isDeleted">;
export type TradeTransaction = MakeOptional<typeof tradeTransaction.$inferSelect, "isDeleted">;
export type ChatRoom = typeof chatRoom.$inferSelect;
export type ChatMessage = MakeOptional<typeof chatMessage.$inferSelect, "isDeleted">;
export type Notification = MakeOptional<typeof notification.$inferSelect, "isDeleted">;
export type Rating = typeof rating.$inferSelect;
