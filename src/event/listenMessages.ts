import { Discord, On, Guard, type ArgsOf } from "discordx";
import type { Message, PartialMessage } from "discord.js";
import { NotBot } from "@discordx/utilities";

@Discord()
export class ListenMessages {
  @On({ event: "messageCreate" })
  @Guard(NotBot)
  async onMessage([message]: ArgsOf<"messageCreate">) {
    if (!("content" in message) || !message.content) return;
    const guildName = message.guild?.name ?? "DM";
    const userName = message.author?.username ?? "*Unknown*";
    const content = message.content;
    console.log(`${guildName} - ${userName} : ${content}`);
  }
}