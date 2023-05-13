import { EmbedBuilder, WebhookClient } from "discord.js";
import { getStatusSystemd } from "./systemStatus.js";

/**
 *
 * @param {{webhookClient: WebhookClient; names: string[]}} param0
 */
export async function sendStarted({ webhookClient, names }) {
    const embed = new EmbedBuilder()
        .setTitle("✅ Discord Notifier has Started")
        .setFields({ name: "Cron Listeners", value: names.join("\n") })
        .setTimestamp()
        .setColor("DarkBlue");
    const msg = await webhookClient.send({
        embeds: [embed],
    });
}

/**
 *
 * @param {{webhookClient: WebhookClient, code: NodeJS.Signals}} param0
 */
export async function sendStopped({ webhookClient, code }) {
    const exitStatus = await getStatusSystemd();
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
