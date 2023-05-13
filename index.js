import * as dotenv from "dotenv";
import { WebhookClient } from "discord.js";
import { mcStatusQuery } from "./mcStatus.js";
import { sendStarted, sendStopped } from "./webhookTemplates.js";

dotenv.config();

const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_URL });

const intervals = [
    {
        name: "Minecraft Status Query",
        task: mcStatusQuery,
        delay: 5000,
        isRunning: false,
        timer: null,
    },
];

async function programExit(code) {
    await sendStopped({ webhookClient, code });
}

async function programStart() {
    await sendStarted({ webhookClient, names: intervals.map((x) => x.name) });
}

let sentExit = false;

process.on("SIGINT", (code) => {
    if (sentExit) return;
    sentExit = true;
    programExit(code).then((x) => process.exit(x || 0));
});

process.on("SIGTERM", (code) => {
    if (sentExit) return;
    sentExit = true;
    programExit(code).then((x) => process.exit(x || 0));
});

setInterval(() => {}, 1 << 30);

for (const interval of intervals) {
    interval.timer = setInterval(async () => {
        if (interval.isRunning) return;
        interval.isRunning = true;
        try {
            await interval.task(webhookClient);
        } catch (error) {
            console.error(error);
        }
        interval.isRunning = false;
    }, interval.delay);
}

await programStart();
