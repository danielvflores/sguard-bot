import esWords from "./keywords/es.json" with { type: "json" };
import enWords from "./keywords/en.json" with { type: "json" };
import fetch from "node-fetch";

const keyWords: string[] = [...esWords, ...enWords];
const keyWordRegex = new RegExp(`\\b(${keyWords.join("|")})\\b`, "i");

async function analyzeContext(text: string): Promise<boolean> {
  const apiKey = process.env.DEEPAI_API_KEY;
  if (!apiKey) {
    console.error("DeepAI API key not set");
    return false;
  }
  const url = "https://api.deepai.org/api/text-moderation";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Api-Key": apiKey,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `text=${encodeURIComponent(text)}`
    });
    const data = await res.json() as any;

    console.log(`[DeepAI] Resultado:`, data.output, `Texto: "${text}"`);

    if (Array.isArray(data.output)) {
      return data.output.some((cat: string) => ["hate_speech", "sexual", "offensive", "violent"].includes(cat));
    }
    return false;
  } catch (error) {
    console.error("Error calling DeepAI API:", error);
    return false;
  }
}

export async function analyzeMessage(log: { content: string }): Promise<boolean> {
  const contentLower = log.content.normalize("NFD").replace(/[\u0000-\u001f\u007f-\u007f]/g, "").toLowerCase();
  const hasKeyword = keyWordRegex.test(contentLower);
  return await analyzeContext(log.content);
}