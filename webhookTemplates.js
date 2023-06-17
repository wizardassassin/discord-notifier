import { EmbedBuilder, WebhookClient } from "discord.js";
import { getSystemStatus } from "./systemStatus.js";

export class WebhookWrapper {
    #webhookClient;
    /** @param {string} url */
    constructor(url) {
        this.#webhookClient = new WebhookClient({ url });
    }

    /** @param {Parameters<WebhookClient['send']>[0]} data */
    async sendGeneric(data) {
        try {
            this.#webhookClient.send(data);
        } catch (error) {
            console.error(error);
            console.error("Couldn't send webhook");
        }
    }

    /** @param {EmbedBuilder} embed */
    async sendEmbed(embed) {
        await this.sendGeneric({
            embeds: [embed],
        });
    }
}

export class EmbedWrapper {
    static genericEmbed = () => new EmbedBuilder().setTimestamp();
    static titleEmbed = (title) => this.genericEmbed().setTitle(title);
    static systemEmbed = (title) => this.titleEmbed(title).setColor("DarkBlue");
    static errorEmbed = (title) => this.titleEmbed(title).setColor("Red");
}

export const startEmbed = () =>
    EmbedWrapper.systemEmbed("✅ Discord Notifier has Started");

export const stopEmbed = async (code) =>
    EmbedWrapper.systemEmbed(`🛑 Discord Notifier has Stopped: ${code}`).setFields({
        name: "System Status",
        value: String(await getSystemStatus()),
    });
