import fetch from "node-fetch";
import type { Message } from "discord.js";

const API_BASE_URL = process.env.API_BASE_URL;

interface ModerationConfig {
  level: "light" | "medium" | "strict";
  customSettings?: Record<string, any>;
}

const getModerationLevel = async (guildId: string): Promise<ModerationConfig> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${guildId}/moderation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bot ${process.env.BOT_TOKEN}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json() as ModerationConfig;
    return data;
  } catch (error) {
    console.log(`[AutoMod] Error obteniendo configuración para guild ${guildId}:`, error);
    console.log(`[AutoMod] Usando configuración por defecto: medium`);
    return { level: "medium" };
  }
};

const shouldTakeAction = (score: number, level: "light" | "medium" | "strict"): { shouldAct: boolean; action: string; category: string } => {
  switch (level) {
    case "light":
      if (score >= 0.8) return { shouldAct: true, action: "LOG_ONLY", category: "ALTO" };
      if (score >= 0.5) return { shouldAct: true, action: "LOG_ONLY", category: "MEDIO" };
      return { shouldAct: false, action: "NONE", category: "BAJO" };
      
    case "medium":
      if (score >= 0.7) return { shouldAct: true, action: "MUTE_MEDIUM", category: "CRÍTICO" };
      if (score >= 0.4) return { shouldAct: true, action: "WARNING", category: "ALTO" };
      if (score >= 0.2) return { shouldAct: true, action: "NOTIFICATION", category: "MEDIO" };
      return { shouldAct: false, action: "NONE", category: "BAJO" };
      
    case "strict":
      if (score >= 0.5) return { shouldAct: true, action: "MUTE_HEAVY", category: "CRÍTICO" };
      if (score >= 0.3) return { shouldAct: true, action: "MUTE_MEDIUM", category: "ALTO" };
      if (score >= 0.15) return { shouldAct: true, action: "WARNING", category: "MEDIO" };
      return { shouldAct: false, action: "NONE", category: "BAJO" };
      
    default:
      return { shouldAct: false, action: "NONE", category: "BAJO" };
  }
};

export const handleToxicMessage = async (message: Message, score: number): Promise<void> => {
  if (!message.guild) return;
  
  const guildId = message.guild.id;
  const config = await getModerationLevel(guildId);
  const decision = shouldTakeAction(score, config.level);
  
  console.log(`[AutoMod] Guild: ${message.guild.name} | Level: ${config.level} | Score: ${score.toFixed(3)} | Action: ${decision.action}`);
  
  if (!decision.shouldAct) return;
  
  switch (decision.action) {
    case "LOG_ONLY":
      console.log(`[AutoMod] ${decision.category} - Solo registrado (modo light)`);
      break;
      
    case "NOTIFICATION":
      await message.reply("ℹ️ **Contenido detectado** - Tu mensaje fue identificado como potencialmente problemático.");
      break;
      
    case "WARNING":
      await message.reply("⚠️ **Advertencia** - Evita este tipo de contenido en el servidor.");
      break;
      
    case "MUTE_MEDIUM":
      await message.reply("🔇 **Mensaje inapropiado** - Contenido removido por moderación automática.");
      break;
      
    case "MUTE_HEAVY":
      await message.reply("🚨 **Contenido extremo** - Usuario sancionado por violación grave.");
      break;
  }
};