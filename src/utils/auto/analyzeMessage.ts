
const keyWords: Array<string> = ["mrd", "estúpido", "idiota", "imbécil", "tonto", "estúpida", "idiota", "imbécil", "tonta"];

export function analyzeMessage(log: { content: string }): boolean {
  const contentLower = log.content.toLowerCase();
  return keyWords.some(word => contentLower.includes(word));
}