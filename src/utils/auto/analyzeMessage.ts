import fetch from "node-fetch";

const manualTranslations: Record<string, string> = {
  "puta": "bitch", "puto": "bitch", "maricon": "faggot", "marica": "faggot",
  "mierda": "shit", "joder": "fuck", "jodido": "fucked", "cabrón": "asshole",
  "cabron": "asshole", "idiota": "idiot", "imbécil": "imbecile", "imbecil": "imbecile",
  "estúpido": "stupid", "estupido": "stupid", "pendejo": "asshole", "mamón": "asshole",
  "mamon": "asshole", "maldito": "damn", "pinche": "fucking", "hijo de puta": "son of a bitch",
  "hija de puta": "daughter of a bitch", "vete a la mierda": "go to hell",
  "que te jodan": "fuck you", "te voy a matar": "i will kill you",
  "tonto": "silly", "tonta": "silly", "tontito": "silly", "tontita": "silly",
  "bobo": "silly", "boba": "silly", "bobito": "silly", "bobita": "silly",
  "loco": "crazy", "loca": "crazy", "loquito": "crazy", "loquita": "crazy"
};

const isSpanish = (text: string): boolean => {
  const spanishWords = /\b(el|la|los|las|un|una|de|en|por|para|con|sin|del|al|que|quien|donde|cuando|como|por|que|porque|soy|eres|es|somos|son|está|están|estoy|estás|tengo|tienes|tiene|tenemos|tienen|puta|puto|maricon|marica|mierda|joder|cabrón|cabron|idiota|imbécil|imbecil|estúpido|estupido|pendejo|mamón|mamon|maldito|pinche)\b/i;
  const spanishChars = /ñ|á|é|í|ó|ú/i;
  return spanishWords.test(text) || spanishChars.test(text);
};

const isValidTranslation = (original: string, translated: string): boolean => {
  const invalidPatterns = [
    /prophets|blasphemy|peace|blessings/i,
    /\([^)]{30,}\)/,
    /–.*–/,
    translated.length > original.length * 3
  ];
  return !invalidPatterns.some(pattern => 
    pattern instanceof RegExp ? pattern.test(translated) : pattern
  );
};

const translateWithFallback = (text: string): string => {
  let translated = text.toLowerCase();

  Object.entries(manualTranslations).forEach(([spanish, english]) => {
    if (spanish.includes(' ')) {
      translated = translated.replace(new RegExp(spanish, 'gi'), english);
    }
  });
  
  Object.entries(manualTranslations).forEach(([spanish, english]) => {
    if (!spanish.includes(' ')) {
      translated = translated.replace(new RegExp(`\\b${spanish}\\b`, 'gi'), english);
    }
  });
  
  return translated !== text.toLowerCase() ? translated : text;
};

const translateToEnglish = async (text: string): Promise<string> => {
  if (!isSpanish(text)) return text;
  
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|en`;
    const res = await fetch(url);
    
    if (!res.ok) {
      const fallback = translateWithFallback(text);
      console.log(`[Translate] API failed, using fallback: "${text}" -> "${fallback}"`);
      return fallback;
    }
    
    const data = await res.json() as any;
    const translated = data.responseData?.translatedText || text;

    if (!isValidTranslation(text, translated)) {
      const fallback = translateWithFallback(text);
      console.log(`[Translate] Invalid translation, using fallback: "${text}" -> "${fallback}"`);
      return fallback;
    }
    
    console.log(`[Translate] "${text}" -> "${translated}"`);
    return translated;
  } catch {
    const fallback = translateWithFallback(text);
    console.log(`[Translate] Error, using fallback: "${text}" -> "${fallback}"`);
    return fallback;
  }
};

const analyzeContext = async (text: string): Promise<{ isToxic: boolean; score: number }> => {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) return { isToxic: false, score: 0 };
  
  const translatedText = await translateToEnglish(text);
  
  const affectionateContext = /\b(amor|mi amor|cariño|bebé|baby|corazón|linda|lindo|hermosa|hermoso|querido|querida)\b/i;
  const isAffectionate = affectionateContext.test(text.toLowerCase());
  
  try {
    const res = await fetch("https://api-inference.huggingface.co/models/unitary/toxic-bert", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: translatedText })
    });
    
    if (!res.ok) return { isToxic: false, score: 0 };
    
    const data = await res.json() as any;
    
    if (!Array.isArray(data) || !data[0]) return { isToxic: false, score: 0 };
    
    const toxicCategories = data[0].filter((item: any) => 
      item.label?.toLowerCase().match(/toxic|hate|insult|threat/)
    );
    
    let maxScore = Math.max(...toxicCategories.map((cat: any) => cat.score));
    
    if (isAffectionate && maxScore < 0.7) {
      maxScore = maxScore * 0.3;
      console.log(`[Context] Contexto cariñoso detectado, score ajustado: ${maxScore.toFixed(3)}`);
    }
    
    const isToxic = maxScore > 0.15;
    
    console.log(`[Analysis] "${translatedText}" -> ${isToxic ? 'TÓXICO' : 'SEGURO'} (${maxScore.toFixed(3)})`);
    return { isToxic, score: maxScore };
  } catch {
    return { isToxic: false, score: 0 };
  }
};

export const analyzeMessage = async (log: { content: string }): Promise<{ isToxic: boolean; score: number }> => 
  analyzeContext(log.content);