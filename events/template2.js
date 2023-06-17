import { EmbedWrapper, WebhookWrapper } from "../webhookTemplates.js";

export const disabled = false;

export const type = "MULTIPLE";

export const eventList = [
    { id: "Template-1", execute: execute1 },
    { id: "Template-2", execute: execute2 },
    { id: "Template-3", execute: execute3 },
];

/**
 *
 * @param {{webhook: WebhookWrapper, msg: string[]}} data Message Data
 */
async function execute1({ webhook, msg }) {
    const embed = EmbedWrapper.titleEmbed(msg.join("\n"));
    await webhook.sendEmbed(embed);
}

/**
 *
 * @param {{webhook: WebhookWrapper, msg: string[]}} data Message Data
 */
async function execute2({ webhook, msg }) {
    const embed = EmbedWrapper.titleEmbed(msg.join("\n"));
    await webhook.sendEmbed(embed);
}

/**
 *
 * @param {{webhook: WebhookWrapper, msg: string[]}} data Message Data
 */
async function execute3({ webhook, msg }) {
    const embed = EmbedWrapper.titleEmbed(msg.join("\n"));
    await webhook.sendEmbed(embed);
}
