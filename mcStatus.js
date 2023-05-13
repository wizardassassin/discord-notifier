import { EmbedBuilder, WebhookClient } from "discord.js";
import { exec } from "child_process";
import { promisify } from "util";

// TODO: Remove dependency on 3rd party api

const promiseExec = promisify(exec);

/**
 *
 * @param {{webhookClient: WebhookClient}} param0
 */
async function sendStartedMC({ webhookClient }) {
    const embed = new EmbedBuilder()
        .setTitle("✅ Minecraft Server has Started")
        .setTimestamp()
        .setColor("DarkGreen");
    const msg = await webhookClient.send({
        embeds: [embed],
    });
}

/**
 *
 * @param {{webhookClient: WebhookClient; version: string; motd: string; playerCount: number; maxPlayers: number; favicon: Buffer;}} param0
 */
async function sendStartedMC2({
    webhookClient,
    version,
    motd,
    playerCount,
    maxPlayers,
    favicon,
}) {
    const embed = new EmbedBuilder()
        .setTitle("✅ Minecraft Server has Started")
        .setFields(
            { name: "Version", value: version },
            { name: "MOTD", value: motd },
            { name: "Players", value: `${playerCount}/${maxPlayers}` }
        )
        .setThumbnail("attachment://favicon.png")
        .setTimestamp()
        .setColor("DarkGreen");
    const msg = await webhookClient.send({
        embeds: [embed],
        files: [
            {
                attachment: favicon,
                name: "favicon.png",
            },
        ],
    });
}

/**
 *
 * @param {{webhookClient: WebhookClient}} param0
 */
async function sendStoppedMC({ webhookClient }) {
    const embed = new EmbedBuilder()
        .setTitle("🛑 Minecraft Server has Stopped")
        .setTimestamp()
        .setColor("DarkGreen");
    const msg = await webhookClient.send({
        embeds: [embed],
    });
}

/**
 *
 * @param {{webhookClient: WebhookClient, playerCount: number}} param0
 */
async function sendCountUpdateMC({ webhookClient, playerCount }) {
    const embed = new EmbedBuilder()
        .setTitle(
            ":information_source: Minecraft Server Player Count: " + playerCount
        )
        .setTimestamp()
        .setColor("DarkGreen");
    const msg = await webhookClient.send({
        embeds: [embed],
    });
}

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
            await sendStoppedMC({ webhookClient });
            return;
        }
        const count = Number(json.player_count);
        if (count !== playerCount) {
            playerCount = count;
            await sendCountUpdateMC({ webhookClient, playerCount });
        }
        return;
    }
    if (json.online) {
        await sendStartedMC({ webhookClient });
        isOnline = true;
    }
}

let queryOnline = false;
const queryPlayers = new Set();

/**
 *
 * @param {string[]} players
 * @returns
 */
function getPlayerChange(players) {
    const playerSet = new Set(players);
    const joinedPlayers = players.filter((x) => !queryPlayers.has(x));
    const leftPlayers = [...queryPlayers].filter((x) => !playerSet.has(x));
    queryPlayers.clear();
    for (const player of players) {
        queryPlayers.add(player);
    }
    return [joinedPlayers, leftPlayers];
}

// IGNORE - Using an external API instead.
// Doesn't account for name changes
// A player joining and leaving in quick succession won't be detected
// Player skins are cached.
// IGNORE - Using an external API instead.

/**
 *
 * @param {string[]} players
 */
async function getPlayerSkins(players) {
    const files = await Promise.all(
        players.map(async (name) => {
            return {
                attachment: await fetch(
                    `https://mc-heads.net/avatar/${name}/24`
                )
                    .then((res) => res.blob())
                    .then((blob) => blob.arrayBuffer())
                    .then((arrBuffer) => Buffer.from(arrBuffer)),
                name: `${name}.png`,
            };
        })
    );
    return files.filter((x) => x.attachment.length !== 0);
}

/**
 *
 * @param {string[]} joinedPlayers
 * @param {string[]} leftPlayers
 * @param {WebhookClient} webhookClient
 */
async function sendPlayerChange(joinedPlayers, leftPlayers, webhookClient) {
    if (joinedPlayers.length + leftPlayers.length > 10) {
        const embed = new EmbedBuilder()
            .setTitle(
                "Error: Over 10 combined unique joins and leaves occured in a short time."
            )
            .setTimestamp()
            .setColor("Red");
        const msg = await webhookClient.send({
            embeds: [embed],
        });
        return;
    }
    const embeds = [];
    for (const player of leftPlayers) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${player} left the server`,
                iconURL: `attachment://${player}.png`,
            })
            .setTimestamp()
            .setColor("DarkGreen");
        embeds.push(embed);
    }
    for (const player of joinedPlayers) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${player} joined the server`,
                iconURL: `attachment://${player}.png`,
            })
            .setTimestamp()
            .setColor("DarkGreen");
        embeds.push(embed);
    }

    const files = await getPlayerSkins([...leftPlayers, ...joinedPlayers]);

    if (embeds.length !== 0) {
        const msg = await webhookClient.send({
            embeds,
            files,
        });
    }
}

/**
 *
 * @param {WebhookClient} webhookClient
 * @returns
 */
export async function mcStatusQuery(webhookClient) {
    const serverStatus = await promiseExec(
        `python mc_query.py ${process.env.MC_SERVER_IP}`
    );
    const json = JSON.parse(serverStatus.stdout);
    if (queryOnline) {
        if (!json.online) {
            queryOnline = false;
            await sendStoppedMC({ webhookClient });
            return;
        }
        const [joinedPlayers, leftPlayers] = getPlayerChange(json.players);
        await sendPlayerChange(joinedPlayers, leftPlayers, webhookClient);
        return;
    }
    if (json.online) {
        const favicon = JSON.parse(
            (
                await promiseExec(
                    `python mc_favicon.py ${process.env.MC_SERVER_IP}`
                )
            ).stdout
        ).favicon;
        await sendStartedMC2({
            webhookClient,
            version: json.version,
            motd: json.motd,
            playerCount: json.player_count,
            maxPlayers: json.player_max,
            favicon: Buffer.from(favicon, "base64"),
        });
        queryOnline = true;
    }
}
