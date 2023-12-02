import MysqlSession from "express-mysql-session";
import * as session from "express-session";
import { nanoid } from "nanoid";

const MySQLStore = MysqlSession(session);
const sessionStore = new MySQLStore({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    createDatabaseTable: true,
});

declare module "express-session" {
    interface SessionData {
        userId: number;
    }
}
declare module "http" {
    interface IncomingMessage {
        session: session.Session & {
            userId: number;
        };
    }
}

export default session.default({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "make sure to change this!",
    resave: false,
    saveUninitialized: false,
    name: "badi_session",
    proxy: true,
    cookie: {
        maxAge: 120 * 24 * 60 * 60 * 1000, // 90 days
        secure: process.env.NODE_ENV === "production" ? true : false,
        httpOnly: true,
        sameSite: "lax",
    },
    genid: function () {
        return nanoid(21);
    },
});
