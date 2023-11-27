import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
    out: "./migrations",
    schema: "./src/db/schema.ts",
    breakpoints: true,
    driver: "mysql2",
    dbCredentials: {
        host: process.env.MYSQL_HOST as string,
        port: Number(process.env.MYSQL_PORT),
        database: process.env.MYSQL_DATABASE as string,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
    },
} satisfies Config;
