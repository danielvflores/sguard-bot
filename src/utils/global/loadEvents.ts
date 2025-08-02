import { importx } from "@discordx/importer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadEvents() {
    await importx(path.resolve(__dirname, "../../event/**/*.{ts,js}"));
}
