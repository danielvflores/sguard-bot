import "reflect-metadata";
import { Client } from "discordx";
import { config } from "dotenv";
import { setBotStatus } from "./bot/status.js";
import { loadCommands } from "./utils/global/loadCommands.js";
import type { Interaction } from "discord.js";
import { loadEvents } from "./utils/global/loadEvents.js";

config();

const client = new Client({
  intents: [
    "Guilds",
    "GuildMessages",
    "MessageContent"
  ]
});

client.once("ready", async () => {
  void client.initApplicationCommands();
  console.log("✅ Bot iniciado");
});

client.on("interactionCreate", async (interaction: Interaction) => {
  client.executeInteraction(interaction);
});

async function run() {
  await loadCommands();
  await loadEvents();
  setBotStatus(client);
  if (!process.env.BOT_TOKEN) {
    throw new Error("❌ BOT_TOKEN no definido en el archivo .env");
  }
  await client.login(process.env.BOT_TOKEN);
}

void run();