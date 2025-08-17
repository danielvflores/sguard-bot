import type { Message } from "discord.js";

export const logOnly = async (message: Message) => {
  // Solo loguea el mensaje
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
  // TODO: Implementar mute temporal si se desea
};

export const muteHeavy = async (message: Message) => {
  await message.reply("🚨 **Contenido extremo** - Usuario sancionado por violación grave.");
  // TODO: Implementar mute largo si se desea
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