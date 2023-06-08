import * as dotenv from "dotenv";
import assert from "assert/strict";
import { WebhookWrapper, startEmbed, stopEmbed } from "./webhookTemplates.js";
import { Server } from "./listener.js";
import fs from "fs/promises";

dotenv.config();

const webhook = new WebhookWrapper(process.env.WEBHOOK_URL);

const server = new Server(process.env.LISTENER_IP, process.env.LISTENER_PORT, 1);

const eventsFolder = "./events";

const files = await fs.readdir(eventsFolder);

for (const file of files) {
    const filePath = `${eventsFolder}/${file}`;
    try {
        const callback = await import(filePath);
        if (callback.disabled === true) continue;
        const type = callback.type;
        assert.ok(type === "MULTIPLE" || type === "SINGLE", "Invalid type property");
        if (type === "SINGLE") {
            assert.ok(typeof callback.id === "string", "Invalid id");
            assert.ok(typeof callback.execute === "function", "Invalid function");
            server.addListener(callback.id, (msg) => callback.execute({ webhook, msg }));
            continue;
        }
        assert.ok(callback.eventList instanceof Array, "Invalid eventList");
        assert.ok(
            callback.eventList.every(
                (x) => typeof x.id === "string" && typeof x.execute === "function"
            ),
            "Invalid eventList"
        );
        for (const { id, execute } of callback.eventList) {
            server.addListener(id, (msg) => execute({ webhook, msg }));
        }
    } catch (error) {
        console.error(error);
        console.error("Error importing:", filePath);
    }
}

server.start();

webhook.sendEmbed(startEmbed());

let sentExit = false;

process.on("SIGINT", (code) => {
    if (sentExit) return;
    sentExit = true;
    stopEmbed(code)
        .then((res) => webhook.sendEmbed(res))
        .then((x) => process.exit(x || 0));
});

process.on("SIGTERM", (code) => {
    if (sentExit) return;
    sentExit = true;
    stopEmbed(code)
        .then((res) => webhook.sendEmbed(res))
        .then((x) => process.exit(x || 0));
});
