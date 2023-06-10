import { EmbedWrapper, WebhookWrapper } from "../webhookTemplates.js";

export const disabled = false;

export const type = "MULTIPLE";

export const eventList = [
    { id: "minecraft_start", execute: serverStart },
    { id: "minecraft_stop", execute: serverStop },
    { id: "minecraft_join", execute: playerJoin },
    { id: "minecraft_leave", execute: playerLeave },
];

/**
 *
 * @param {{webhook: WebhookWrapper, msg: string}} data Message Data
 */
async function serverStart({ webhook, msg }) {
    const embed = EmbedWrapper.genericEmbed(msg);
    await webhook.sendEmbed(embed);
}

/**
 *
 * @param {{webhook: WebhookWrapper, msg: string}} data Message Data
 */
async function serverStop({ webhook, msg }) {
    const embed = EmbedWrapper.genericEmbed(msg);
    await webhook.sendEmbed(embed);
}

/**
 *
 * @param {{webhook: WebhookWrapper, msg: string}} data Message Data
 */
async function playerJoin({ webhook, msg }) {
    const embed = EmbedWrapper.genericEmbed(msg);
    await webhook.sendEmbed(embed);
}

/**
 *
 * @param {{webhook: WebhookWrapper, msg: string}} data Message Data
 */
async function playerLeave({ webhook, msg }) {
    const embed = EmbedWrapper.genericEmbed(msg);
    await webhook.sendEmbed(embed);
}
