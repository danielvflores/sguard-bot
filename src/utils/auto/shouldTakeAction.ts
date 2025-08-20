import { logOnly, notify, warn, muteMedium, muteStrict } from "./modActions.js";
import type { Message } from "discord.js";

type ModerationAction = (message: Message) => Promise<void>;

export const shouldTakeAction = (
  score: number,
  level: "light" | "medium" | "strict"
): { shouldAct: boolean; action?: ModerationAction; category: string } => {
  switch (level) {
    case "light":
      if (score >= 0.8) return { shouldAct: true, action: logOnly, category: "ALTO" };
      if (score >= 0.5) return { shouldAct: true, action: logOnly, category: "MEDIO" };
      return { shouldAct: false, category: "BAJO" };
    case "medium":
      if (score >= 0.7) return { shouldAct: true, action: muteMedium, category: "CRÍTICO" };
      if (score >= 0.4) return { shouldAct: true, action: warn, category: "ALTO" };
      if (score >= 0.2) return { shouldAct: true, action: notify, category: "MEDIO" };
      return { shouldAct: false, category: "BAJO" };
    case "strict":
      if (score >= 0.5) return { shouldAct: true, action: muteStrict, category: "CRÍTICO" };
      if (score >= 0.3) return { shouldAct: true, action: muteMedium, category: "ALTO" };
      if (score >= 0.15) return { shouldAct: true, action: warn, category: "MEDIO" };
      return { shouldAct: false, category: "BAJO" };
    default:
      return { shouldAct: false, category: "BAJO" };
  }
};