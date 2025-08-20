import type { Guild, ClientUser } from "discord.js";

export type MinimalInteraction = {
  guild: Guild;
  user: ClientUser;
  replied: boolean;
  deferred: boolean;
  reply: (...args: any[]) => Promise<void>;
};