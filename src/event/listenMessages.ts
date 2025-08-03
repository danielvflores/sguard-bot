import { Discord, On, Guard, type ArgsOf } from "discordx";
import type { Message, PartialMessage } from "discord.js";
import { NotBot } from "@discordx/utilities";
import { analyzeMessage } from "../utils/auto/analyzeMessage.js";

@Discord()
export class ListenMessages {
  @On({ event: "messageCreate" })
  @Guard(NotBot)
  async onMessage([message]: ArgsOf<"messageCreate">) {
    if (!("content" in message) || !message.content) return;
    const log = {
      guild: message.guild
        ? { id: message.guild.id, name: message.guild.name }
        : null,
      channel: "name" in message.channel
        ? { id: message.channel.id, name: message.channel.name, type: message.channel.type }
        : { id: message.channel.id, type: message.channel.type },
      author: message.author
        ? { id: message.author.id, username: message.author.username, discriminator: message.author.discriminator }
        : null,
      content: message.content,
      timestamp: message.createdTimestamp
    };
    if (analyzeMessage(log)) {
      console.log("Mensaje ofensivo detectado:", log);
    }
  }
}

interface MessageLog {
  guild: { id: string; name: string } | null;
  channel: { id: string; name?: string; type: string | number } | null;
  author: { id: string; username: string; discriminator: string } | null;
  content: string;
  timestamp: number;
}

export async function exportLogs(log: MessageLog) {
  return log;
}