import fetch from "node-fetch";
import type { Message } from "discord.js";
import { selectSanction } from "./modActions.js";
import { shouldTakeAction } from "./shouldTakeAction.js";

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


export const handleToxicMessage = async (message: Message, score: number): Promise<void> => {
  if (!message.guild) return;

  const config = await getModerationLevel(message.guild.id);
  const decision = shouldTakeAction(score, config.level);

  if (decision.shouldAct && decision.action) {
    await decision.action(message);
  }
};