import { EmbedWrapper, WebhookWrapper } from "../webhookTemplates.js";

export const disabled = false;

export const type = "SINGLE";

export const id = "Template";

/**
 * Executed when a message with the corresponding
 * `id` is received
 *
 * @param {{webhook: WebhookWrapper, msg: string[]}} data Message Data
 */
export async function execute({ webhook, msg }) {
    const embed = EmbedWrapper.titleEmbed(msg.join("\n"));
    await webhook.sendEmbed(embed);
}
