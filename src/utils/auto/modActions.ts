import type { Message } from "discord.js";
import { applySanction } from "../sanctions/sanctionActions.js";

export const logOnly = async (message: Message) => {
  console.log(`[AutoMod][LOG_ONLY] Guild: ${message.guild?.name} | User: ${message.author.tag} | Message: ${message.content}`);
};

export const notify = async (message: Message) => {
  await message.reply("ℹ️ **Contenido detectado** - Tu mensaje fue identificado como potencialmente problemático.");
};

export const warn = async (message: Message) => {
  await message.reply("⚠️ **Advertencia** - Evita este tipo de contenido en el servidor.");
};

export const muteMedium = async (message: Message) => {
  await message.reply("🔇 **Mensaje inapropiado** - Contenido removido por moderación automática.");
  //const member = message.member;
  //if (member && message.guild) {
  //  // Mute temporal de 10 minutos como ejemplo
  //  await applySanction("mute", member, "AutoMod: contenido inapropiado", {
  //    guild: message.guild,
  //    user: message.client.user,
  //    replied: false,
  //    deferred: false,
  //    reply: async () => {},
  //  } as any, message.client, "10m");
  //}
};

export const muteHeavy = async (message: Message) => {
  //await message.reply("🚨 **Contenido extremo** - Usuario sancionado por violación grave.");
  //const member = message.member;
  //if (member && message.guild) {
  //  // Mute temporal de 1 hora como ejemplo
  //  await applySanction("mute", member, "AutoMod: contenido extremo", {
  //    guild: message.guild,
  //    user: message.client.user,
  //    replied: false,
  //    deferred: false,
  //    reply: async () => {},
  //  } as any, message.client, "1h");
  //}
};

export const selectSanction = (action: string) => {
  switch (action) {
    case "LOG_ONLY": return logOnly;
    case "NOTIFICATION": return notify;
    case "WARNING": return warn;
    case "MUTE_MEDIUM": return muteMedium;
    case "MUTE_HEAVY": return muteHeavy;
    default: return async () => {return console.warn("Acción no reconocida:", action); };
  }
};