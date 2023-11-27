import MysqlSession from "express-mysql-session";
import * as session from "express-session";
import { nanoid } from "nanoid";
import type { User } from "~/db/schema";

const MySQLStore = MysqlSession(session);
const sessionStore = new MySQLStore({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
});

declare module "express-session" {
    // eslint-disable-next-line no-unused-vars
    interface SessionData {
        user: User;
    }
}
declare module "http" {
    // eslint-disable-next-line no-unused-vars
    interface IncomingMessage {
        session: session.Session & {
            user: User;
        };
    }
}

export default session.default({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "make sure to change this!",
    resave: false,
    saveUninitialized: false,
    name: "badi",
    proxy: true,
    cookie: {
        maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
        secure: process.env.NODE_ENV === "production" ? true : false,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
    genid: function () {
        return nanoid(21);
    },
});
