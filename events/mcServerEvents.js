import assert from "assert/strict";
import { EmbedWrapper, WebhookWrapper } from "../webhookTemplates.js";

export const disabled = false;

export const type = "MULTIPLE";

export const eventList = [
    { id: "minecraft_start", execute: serverStart },
    { id: "minecraft_stop", execute: serverStop },
    { id: "minecraft_join", execute: playerJoin },
    { id: "minecraft_leave", execute: playerLeave },
];

const getPlayerEmbed = (name) =>
    EmbedWrapper.genericEmbed().setColor("DarkGreen").setAuthor({
        name: name,
        iconURL: "",
    });
const getEmbed = (title) => EmbedWrapper.titleEmbed(title).setColor("DarkGreen");

/**
 *
 * @param {{webhook: WebhookWrapper, msg: string[]}} data Message Data
 */
async function serverStart({ webhook, msg: [rawVersion, motd, maxPlayers] }) {
    const sep = rawVersion.indexOf(" ");
    assert.ok(sep !== -1, "Couldn't find space seperator.");
    const mcVersion = rawVersion.slice(sep + 1);
    const name = rawVersion.slice(0, sep).split("-")[1];
    const embed = getEmbed("✅ Minecraft Server has Started").setFields(
        { name: "Version", value: `${name} ${mcVersion}` },
        { name: "MOTD", value: motd },
        { name: "Players", value: `0/${maxPlayers}` }
    );
    await webhook.sendEmbed(embed);
}

/**
 *
 * @param {{webhook: WebhookWrapper, msg: string[]}} data Message Data
 */
async function serverStop({ webhook, msg }) {
    const embed = getPlayerEmbed("🛑 Minecraft Server has Stopped");
    await webhook.sendEmbed(embed);
}

/**
 *
 * @param {{webhook: WebhookWrapper, msg: string[]}} data Message Data
 */
async function playerJoin({ webhook, msg }) {
    const embed = getEmbed().setDescription(msg.join("\n"));
    await webhook.sendEmbed(embed);
}

/**
 *
 * @param {{webhook: WebhookWrapper, msg: string}} data Message Data
 */
async function playerLeave({ webhook, msg }) {
    const embed = getEmbed().setDescription(msg.join("\n"));
    await webhook.sendEmbed(embed);
}
