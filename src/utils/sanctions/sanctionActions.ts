import { CommandInteraction, GuildMember, Client } from "discord.js";
import { createEmbed, EmbedColor } from "../global/createEmbeds.js";
import { parseDuration } from "../global/parseDuration.js";
import type { MinimalInteraction } from "../auto/autoTypes.js";

const sanctionHandlers = {
    kick: async (user: GuildMember, reason?: string) => user.kick(reason),
    ban: async (user: GuildMember, reason?: string) => user.ban({ reason: reason ?? "Sanción automática" }),
    mute: async (user: GuildMember, ms: number, reason?: string) => user.timeout(ms, reason),
};

type SanctionType = keyof typeof sanctionHandlers;

const sanctionVerbs: Record<SanctionType, string> = {
    kick: "expulsado",
    ban: "baneado",
    mute: "muteado",
};

export async function applySanction(
  action: "kick" | "ban",
  user: GuildMember,
  reason: string | undefined,
  interaction: CommandInteraction | MinimalInteraction,
  client: Client
): Promise<void>;

export async function applySanction(
  action: "mute",
  user: GuildMember,
  reason: string | undefined,
  interaction: CommandInteraction | MinimalInteraction,
  client: Client,
  time: string
): Promise<void>;

export async function applySanction(
  action: "kick" | "ban" | "mute",
  user: GuildMember,
  reason: string | undefined,
  interaction: CommandInteraction | MinimalInteraction,
  client: Client,
  time?: string
): Promise<void>

{
    const verb = sanctionVerbs[action];

    const ctxEmbed = createEmbed({
        title: `Usuario ${verb} ⚒️`,
        description: `⚠️ El usuario <@${user.id}> ha sido ${verb}.${reason ? `\n**Razón:** ${reason}` : ""}`,
        color: EmbedColor.SUCCESS,
        timestamp: true,
    });

    const dmEmbed = createEmbed({
        title: `Has sido ${verb} ⚒️⚠️`,
        description: `⚡ Has sido ${verb} del servidor **${interaction.guild?.name}**.${reason ? `\n**Razón:** ${reason}` : ""}`,
        color: EmbedColor.WRONG,
        timestamp: true,
    });

    try {
        await user.send({ embeds: [dmEmbed] }).catch(() => {});

        if (action === "mute") {
            if (!time) throw new Error("Debes especificar el tiempo para mute.");
            const ms = parseDuration(time);
            if (!ms) {
                await interaction.reply({
                    content: "❌ Formato de tiempo inválido. Usa ejemplos como: `30s`, `10m`, `2h`.",
                    ephemeral: true,
                });
                return;
            }
            await sanctionHandlers.mute(user, ms, reason);
        } else {
            await sanctionHandlers[action](user, reason);
        }

        await interaction.reply({ embeds: [ctxEmbed], flags: 64 });

    } catch {
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: `❌ No tengo permisos para ${verb} a este usuario.`,
                flags: 64,
            });
        }
    }
}