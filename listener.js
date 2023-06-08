import net from "net";

export class Server {
    #ip;
    #port;
    #server;
    /** @type {Set<string>} */
    #sockets;
    /** @type {Map<string, (msg: string) => Promise<void>>} */
    #listeners;
    /**
     * @param {string} ip
     * @param {number} port
     * @param {number} maxConnections
     */
    constructor(ip, port, maxConnections, data) {
        this.#ip = ip;
        this.#port = port;
        this.#server = net.createServer((socket) => this.#connectionListener(socket));
        this.#server.maxConnections = maxConnections;

        this.#sockets = new Set();
        this.#listeners = new Map();
    }

    start() {
        this.#server.listen(this.#port, this.#ip, () =>
            console.log("Opened server on", this.#server.address())
        );
        this.#server.on("close", () => console.log("Server Closed"));
    }

    stop() {
        this.#server.close();
        this.#sockets.forEach((key) => key.destroy());
    }

    /** @param {net.Socket} socket  */
    #connectionListener(socket) {
        console.log("Connected");
        this.#sockets.add(socket);

        socket.on("data", (data) => {
            const dataStr = data.toString().trim();
            const sep = data.indexOf(" ");
            if (sep === -1) {
                socket.destroy();
                console.error("Couldn't find seperator");
                return;
            }
            const id = dataStr.slice(0, sep);
            const msg = dataStr.slice(sep + 1);
            if (!this.#listeners.has(id)) {
                socket.destroy();
                console.error("Couldn't find corresponding id");
                return;
            }
            this.#listeners
                .get(id)(msg)
                .catch((err) => console.error(err)); // looks a bit scarry
        });

        socket.on("close", (hadError) => {
            this.#sockets.delete(socket);
            console.log("Disconnected", "hadError:", hadError);
        });
    }

    /**
     * @param {string} id
     * @param {(msg: string) => Promise<void>} callback
     */
    addListener(id, callback) {
        if (this.#listeners.has(id)) {
            console.error("Duplicate IDs");
            return;
        }
        this.#listeners.set(id, callback);
    }
}
