import type { CommandInteraction, Message } from "discord.js";
import { applySanction } from "../sanctions/sanctionActions.js";
import type { MinimalInteraction } from "./autoTypes.js";

export const logOnly = async (message: Message) => {
  console.log(`[AutoMod][LOG_ONLY] Guild: ${message.guild?.name} | User: ${message.author.tag} | Message: ${message.content}`);
};

export const notify = async (message: Message) => {
  await message.reply("ℹ️ **Contenido detectado** - Tu mensaje fue identificado como potencialmente problemático.");
};

export const warn = async (message: Message) => {
  await message.reply("⚠️ **Advertencia** - Evita este tipo de contenido en el servidor.");
};

export const muteLight = async (message: Message) => {
  await message.reply("🔇 **Mensaje inapropiado** - Contenido removido por moderación automática.");
  const member = message.member;
  if (member && message.guild) {
    const interaction: MinimalInteraction = {
      guild: message.guild,
      user: message.client.user,
      replied: false,
      deferred: false,
      reply: async () => { },
    };
    await applySanction("mute", member, "AutoMod: contenido inapropiado", interaction, message.client, "10m");
  }
};

export const muteMedium = async (message: Message) => {
  await message.reply("🔇 **Mensaje inapropiado** - Contenido removido por moderación automática.");
  const member = message.member;
  if (member && message.guild) {
    const interaction: MinimalInteraction = {
      guild: message.guild,
      user: message.client.user,
      replied: false,
      deferred: false,
      reply: async () => { },
    };
    await applySanction("mute", member, "AutoMod: contenido inapropiado", interaction, message.client, "30m");
  }
};

export const muteStrict = async (message: Message) => {
  await message.reply("🔇 **Mensaje inapropiado** - Contenido removido por moderación automática.");
  const member = message.member;
  if (member && message.guild) {
    const interaction: MinimalInteraction = {
      guild: message.guild,
      user: message.client.user,
      replied: false,
      deferred: false,
      reply: async () => { },
    };
    await applySanction("mute", member, "AutoMod: contenido inapropiado", interaction, message.client, "1h30m");
  }
};

export const selectSanction = (action: string) => {
  switch (action) {
    case "LOG_ONLY": return logOnly;
    case "NOTIFICATION": return notify;
    case "WARNING": return warn;
    case "MUTE_LIGHT": return muteLight;
    case "MUTE_MEDIUM": return muteMedium;
    case "MUTE_STRICT": return muteStrict;
    default: return async () => { return console.warn("Acción no reconocida:", action); };
  }
};