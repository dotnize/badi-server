import { mysql2 } from "@lucia-auth/adapter-mysql";
import { lucia } from "lucia";
import { express } from "lucia/middleware";

import { pool } from "~/db/drizzle";

export const auth = lucia({
    env: "DEV", // TODO: "PROD" if deployed to HTTPS
    middleware: express(),
    adapter: mysql2(pool, { user: "user", key: "user_key", session: "user_session" }),
});

export type Auth = typeof auth;
