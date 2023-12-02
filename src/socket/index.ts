import type { Server, Socket } from "socket.io";

import { chat, joinRoom, leaveRoom } from "./chat";

const socketConnect = (socket: Socket) => {
    const req = socket.request;

    socket.use((__, next) => {
        req.session.reload((err) => {
            if (err) {
                socket.disconnect();
            } else {
                next();
            }
        });
    });

    socket.on("disconnect", leaveRoom);
    socket.on("joinRoom", joinRoom);
    socket.on("chat", chat);
};

export const initSocket = (io: Server) => {
    io.on("connection", socketConnect);
};
