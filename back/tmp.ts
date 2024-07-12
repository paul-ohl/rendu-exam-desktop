import { Server } from "socket.io";

function main() {
    const conversations = [
        { users: ["Pol", "John"], id: 1 },
        { users: ["Mary", "Pol"], id: 2 },
    ];
    const port = 3000;

    const io = new Server(port, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("New connection!");
        for (const conv of conversations) {
            socket.on(`conversation-${conv.id}`, (msg, sender) => {
                // io.emit(`new-convo`, convo.id);
                io.emit(`conversation-${conv.id}`, msg, sender);
            });
        }
    });

    process.on("SIGINT", () => {
        console.log("Bye bye!");
        process.exit();
    });

    process.on("SIGTERM", () => {
        console.log("Bye bye!");
        process.exit();
    });

    process.on("uncaughtException", (err) => {
        console.error(err);
        process.exit(1);
    });

    console.log(`Server running on port ${port}`);
}

main();
