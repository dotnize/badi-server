import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";

export const pool = createPool({
    // ...
});

export const db = drizzle(pool);
