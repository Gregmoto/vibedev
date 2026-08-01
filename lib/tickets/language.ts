/**
 * Språkdetektering för autosvar.
 *
 * Medvetet enkel: vi poängsätter vanliga funktionsord, som är de ord som
 * faktiskt skiljer språk åt i korta texter. Det räcker för att välja språk på
 * ett autosvar, men det är en gissning — därför faller vi tillbaka på svenska
 * så snart underlaget är för tunt eller för jämnt mellan två språk.
 */

export const SUPPORTED_LANGUAGES = ["sv", "en", "no", "da", "de", "fr", "es", "fi"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "sv";

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

/**
 * Funktionsord per språk. Orden är valda för att vara vanliga i sitt eget språk
 * och sällsynta i de andra — särskilt viktigt mellan svenska, norska och danska,
 * som annars är svåra att skilja åt på korta texter.
 */
const MARKERS: Record<SupportedLanguage, string[]> = {
  sv: ["och", "att", "jag", "är", "för", "inte", "med", "det", "vi", "hej", "tack", "kan", "har", "skulle", "gärna", "hur", "mycket", "från", "över"],
  en: ["the", "and", "you", "for", "with", "that", "this", "have", "would", "hello", "hi", "thanks", "please", "your", "about", "can", "we", "from"],
  no: ["ikke", "jeg", "og", "for", "med", "det", "vi", "hei", "takk", "kan", "har", "vil", "hvordan", "mye", "fra", "være", "noe", "dere"],
  da: ["ikke", "jeg", "og", "for", "med", "det", "vi", "hej", "tak", "kan", "har", "vil", "hvordan", "meget", "fra", "være", "noget", "jer"],
  de: ["und", "ich", "die", "der", "das", "nicht", "mit", "für", "ist", "hallo", "danke", "bitte", "wir", "haben", "können", "sehr", "eine"],
  fr: ["et", "je", "le", "la", "les", "pas", "avec", "pour", "est", "bonjour", "merci", "nous", "vous", "avoir", "pouvez", "une", "des"],
  es: ["y", "yo", "el", "la", "los", "no", "con", "para", "es", "hola", "gracias", "por favor", "nosotros", "tiene", "puede", "una", "muy"],
  fi: ["ja", "en", "on", "ei", "kanssa", "varten", "hei", "kiitos", "voitteko", "meillä", "olen", "että", "tämä", "mutta", "kun", "myös"],
};

/**
 * Ord som är gemensamma för svenska/norska/danska väger lätt; de får inte
 * avgöra valet. Ord som bara finns i ett av språken väger tungt.
 */
const DISTINCTIVE: Partial<Record<SupportedLanguage, string[]>> = {
  sv: ["är", "från", "gärna", "mycket", "själv", "också", "först", "här", "väldigt"],
  no: ["ikke", "hvordan", "være", "dere", "noe", "sjøl", "også", "her"],
  da: ["ikke", "hvordan", "være", "jer", "noget", "også", "meget"],
  fi: ["kiitos", "voitteko", "että", "tämä", "hei"],
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export type LanguageGuess = {
  language: SupportedLanguage;
  /** true när detekteringen var för osäker och vi föll tillbaka på standard */
  fallback: boolean;
};

export function detectLanguage(
  text: string,
  fallbackLanguage: SupportedLanguage = DEFAULT_LANGUAGE,
): LanguageGuess {
  const words = tokenize(text).slice(0, 400);

  // Under ~8 ord är underlaget för tunt för att gissa på; ett "Tack!" säger inget.
  if (words.length < 8) {
    return { language: fallbackLanguage, fallback: true };
  }

  const wordSet = new Set(words);
  const scores = new Map<SupportedLanguage, number>();

  for (const language of SUPPORTED_LANGUAGES) {
    let score = 0;

    for (const marker of MARKERS[language]) {
      if (wordSet.has(marker)) {
        score += 1;
      }
    }
    for (const marker of DISTINCTIVE[language] ?? []) {
      if (wordSet.has(marker)) {
        score += 2;
      }
    }

    scores.set(language, score);
  }

  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  const [best, bestScore] = ranked[0];
  const secondScore = ranked[1]?.[1] ?? 0;

  // Kräv både en tydlig träff och ett tydligt försprång. Utan marginalkravet
  // skulle ett enda ord kunna kasta ett danskt mejl över till norska.
  if (bestScore < 3 || bestScore - secondScore < 2) {
    return { language: fallbackLanguage, fallback: true };
  }

  return { language: best, fallback: false };
}
