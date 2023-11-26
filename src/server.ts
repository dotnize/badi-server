import cors from "cors";
import "dotenv/config"; // for environment variables
import express from "express";
import helmet from "helmet"; // middleware for extra security

import { corsConfig } from "./lib/config";
import routes from "./routes";

// create the express app
const app = express();

// middleware
app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use(routes); // router from routes.ts

// start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Badi API Server is running on port :${PORT}`);
});
