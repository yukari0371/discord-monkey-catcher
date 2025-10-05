let token;
let messageContent;
import { Client } from "discord.js-selfbot-v13";
const client = new Client();

/** Functions */
import {
    logger,
    sleep
} from "./utils.js";
import { acceptFriendRequest } from "./operations/acceptFriendRequest.js";
import { confirmFriendRequest } from "./operations/ConfirmFriendRequest.js";

const runTask = async () => {
    const result = await confirmFriendRequest(token);
    if (result.status === "success") {
        if (result.ExtractedUsers.length !== 0) {
            logger.success(`Get ${result.ExtractedUsers.length} friend requests.`);
            logger.info("Run promotional program...");
            for (const user of result.ExtractedUsers) {
                const result = await acceptFriendRequest(token,user.id);
                if (result.status === "success") {
                    logger.success(`Add Friend: ${user.id}`);
                    try {
                        const _user = await client.users.fetch(user.id);
                        const dmChannel = await _user.createDM();
                        await dmChannel.send(messageContent);
                        logger.success(`Advertised: ${user.id}`)
                    } catch (err) {
                        logger.failed(`DM failed: ${user.id} - ${err.message}`);
                    }
                } else {
                    logger.failed(`Add friend failed: ${user.id}`);
                }
            }
        } else {
            return logger.info("There was no friend request.");
        }
    } else if (result.status === "error") {
        return logger.failed(result.message);
    }
}

(async() => {

    if (!process.env.DISCORD_TOKEN || process.env.DISCORD_TOKEN === "") {
        logger.error("DISCORD_TOKEN is not set.");
        logger.info("The program will stop after 6 seconds...");
        await sleep(6 * 1000);
        process.exit(1);
    }
    // Set a token.
    token = process.env.DISCORD_TOKEN.trim();

    if (!process.env.MESSAGE_CONTENT || process.env.MESSAGE_CONTENT === "") {
        logger.error("MESSAGE_CONTENT is not set.");
        logger.info("The program will stop after 6 seconds...");
        await sleep(6 * 1000);
        process.exit(1);
    }
    // Set a messageContent.
    messageContent = process.env.MESSAGE_CONTENT.trim();

    try {
        client.login(token);
        client.once("ready", async () => {
            logger.info(`Logged in as: ${client.user.tag}`);

            // Run every 15 minutes.
            await runTask(); // First run.
            setInterval(runTask, 15 * 60 * 1000);
        });
    } catch (e) {
        logger.error(e.message);
    }
})();