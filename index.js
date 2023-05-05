import * as dotenv from "dotenv";
import { EmbedBuilder, WebhookClient } from "discord.js";
import systemStatus from "./systemStatus.js";
import { mcStatus } from "./mcStatus.js";

dotenv.config();

const webhookClient = new WebhookClient({ url: process.env.WEBHOOK_URL });

setInterval(() => mcStatus(webhookClient), 5000);

async function programExit(code) {
    const exitStatus = await systemStatus();
    const embed = new EmbedBuilder()
        .setTitle("🛑 Discord Notifier has Stopped: " + String(code))
        .setFields({
            name: "System Status",
            value: String(exitStatus),
        })
        .setTimestamp()
        .setColor("DarkBlue");
    const msg = await webhookClient.send({
        embeds: [embed],
    });
}

async function programStart() {
    const embed = new EmbedBuilder()
        .setTitle("✅ Discord Notifier has Started")
        .setTimestamp()
        .setColor("DarkBlue");
    const msg = await webhookClient.send({
        embeds: [embed],
    });
}

await programStart();

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
