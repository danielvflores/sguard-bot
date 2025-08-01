import { Client } from "discordx";

export function setBotStatus(client: Client) {
    client.once("ready", () => {
        client.user?.setPresence({
            activities: [{ name: "⚡ /help · sguard.com", type: 4 }],
            status: "dnd"
        });
    });
}