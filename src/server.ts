import express from "express";
import helmet from "helmet"; // middleware for extra security

import routes from "./routes";

const app = express();

// middleware
app.use(helmet());
app.use(express.json());

// custom middleware
app.use(routes); // router from routes.ts

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Badi API Server is running on port :${PORT}`);
});
