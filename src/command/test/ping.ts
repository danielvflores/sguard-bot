import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Ping {
  @Slash({ description: "ping" })
  async ping(interaction: CommandInteraction): Promise<void> {
    await interaction.reply("pong!");
  }
}