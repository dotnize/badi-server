import cors from "cors";
import "dotenv/config"; // for environment variables
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet"; // middleware for extra security
import { createServer } from "http";

import { Server } from "socket.io";
import { corsConfig } from "./lib/config";
import sessionMiddleware from "./middleware/session";
import routes from "./routes";
import { initSocket } from "./socket";

// create the express app
const app = express();
const server = createServer(app);

// middleware
app.use(helmet());
app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// for deployments behind a proxy
app.set("trust proxy", 1);

// custom middleware
app.use(sessionMiddleware);
app.use(routes); // router from routes.ts

// websockets with socket.io
// socket.io
export const io = new Server(server, { cors: corsConfig, pingInterval: 30000, pingTimeout: 50000 });
io.use((socket, next) => {
    sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction);
});
io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.userId) {
        next();
    } else {
        console.log("io.use: no session");
        socket.disconnect();
    }
});
initSocket(io);

// start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Badi API Server started on port :${PORT}`);
});
