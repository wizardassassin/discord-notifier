import { EmbedBuilder, WebhookClient } from "discord.js";
import { exec } from "child_process";
import { promisify } from "util";

const promiseExec = promisify(exec);

let isOnline = false;
let playerCount = 0;
/**
 *
 * @param {WebhookClient} webhookClient
 * @returns
 */
export async function mcStatus(webhookClient) {
    const serverStatus = await promiseExec(
        `mcstatus ${process.env.MC_SERVER_IP} json`
    );
    const json = JSON.parse(serverStatus.stdout);
    if (isOnline) {
        if (!json.online) {
            isOnline = false;
            const embed = new EmbedBuilder()
                .setTitle("🛑 Minecraft Server has Stopped")
                .setTimestamp()
                .setColor("DarkGreen");
            const msg = await webhookClient.send({
                embeds: [embed],
            });
            return;
        }
        const count = Number(json.player_count);
        if (count !== playerCount) {
            playerCount = count;
            const embed = new EmbedBuilder()
                .setTitle(
                    ":information_source: Minecraft Server Player Count: " +
                        playerCount
                )
                .setTimestamp()
                .setColor("DarkGreen");
            const msg = await webhookClient.send({
                embeds: [embed],
            });
        }
        return;
    }
    if (json.online) {
        const embed = new EmbedBuilder()
            .setTitle("✅ Minecraft Server has Started")
            .setTimestamp()
            .setColor("DarkGreen");
        const msg = await webhookClient.send({
            embeds: [embed],
        });
        isOnline = true;
    }
}
