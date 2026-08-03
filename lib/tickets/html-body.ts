import { Parser } from "htmlparser2";

/**
 * Gör om ett mejls HTML till en enkel, säker struktur.
 *
 * Vi renderar aldrig avsändarens HTML som HTML. Ett inkommande mejl är text
 * från en främling, och `dangerouslySetInnerHTML` hade gjort varje ärendevy
 * till en öppen dörr för script, inbäddade formulär och stilar som tar över
 * sidan. I stället plockar vi ut det vi faktiskt vill visa — stycken, rubriker
 * och länkar — och bygger React-element av det.
 *
 * Bonusen är den som efterfrågades: en länk visas med sin länktext
 * ("Ansök till annonsör") i stället för en spårningsadress på 375 tecken.
 */

export type InlineRun = {
  text: string;
  /** Satt bara för säkra http(s)-länkar. */
  href?: string;
};

export type HtmlBlock = {
  heading: boolean;
  runs: InlineRun[];
};

/* Innehåll som aldrig ska visas. style/script är uppenbara; head-taggar råkar
   annars läcka in som lös text när mejlet har ett ofullständigt dokument. */
const SKIPPED_TAGS = new Set([
  "script",
  "style",
  "head",
  "title",
  "noscript",
  "meta",
  "link",
  "iframe",
  "object",
  "embed",
  "svg",
]);

/* Taggar som avslutar ett stycke. Mejl byggs nästan alltid med tabeller, så
   td/tr måste räknas hit — annars klumpas hela nyhetsbrevet till en enda rad. */
const BLOCK_TAGS = new Set([
  "p", "div", "br", "tr", "td", "th", "li", "ul", "ol", "table", "tbody",
  "blockquote", "section", "article", "header", "footer", "hr", "h1", "h2",
  "h3", "h4", "h5", "h6", "center", "address", "pre",
]);

const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

/** Skydd mot orimligt stora mejl — de finns, och de ska inte fälla sidan. */
const MAX_BLOCKS = 500;
const MAX_LINK_LABEL = 70;

function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * En länk utan text, eller vars text är själva adressen, får domänen som
 * etikett. Det är den enda informationen i en spårningslänk som säger något.
 */
function linkLabel(text: string, href: string): string {
  const trimmed = text.trim();

  if (trimmed && trimmed.length <= MAX_LINK_LABEL && !/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return trimmed.slice(0, MAX_LINK_LABEL) || "länk";
  }
}

/** Slår ihop intilliggande textbitar och städar bort tomma. */
function mergeRuns(runs: InlineRun[]): InlineRun[] {
  const out: InlineRun[] = [];

  for (const run of runs) {
    const text = run.text.replace(/\s+/g, " ");
    if (!text.trim() && !run.href) {
      continue;
    }

    const previous = out[out.length - 1];
    if (previous && previous.href === run.href) {
      previous.text += text;
    } else {
      out.push({ text, href: run.href });
    }
  }

  // Trimma ytterkanterna på blocket.
  if (out.length > 0) {
    out[0].text = out[0].text.replace(/^\s+/, "");
    out[out.length - 1].text = out[out.length - 1].text.replace(/\s+$/, "");
  }

  return out.filter((run) => run.text.trim().length > 0);
}

export function htmlToBlocks(html: string): HtmlBlock[] {
  const blocks: HtmlBlock[] = [];
  let runs: InlineRun[] = [];
  let skipDepth = 0;
  let headingDepth = 0;
  const hrefStack: string[] = [];

  const flush = () => {
    if (blocks.length >= MAX_BLOCKS) {
      runs = [];
      return;
    }

    const merged = mergeRuns(runs);
    runs = [];

    if (merged.length === 0) {
      return;
    }

    blocks.push({ heading: headingDepth > 0, runs: merged });
  };

  const parser = new Parser(
    {
      onopentag(name, attribs) {
        const tag = name.toLowerCase();

        if (SKIPPED_TAGS.has(tag)) {
          skipDepth += 1;
          return;
        }
        if (skipDepth > 0) {
          return;
        }

        if (BLOCK_TAGS.has(tag)) {
          flush();
        }
        if (HEADING_TAGS.has(tag)) {
          headingDepth += 1;
        }
        if (tag === "a") {
          const href = (attribs.href ?? "").trim();
          hrefStack.push(isSafeHttpUrl(href) ? href : "");
        }
        if (tag === "img") {
          // Bilder laddas inte. Fjärrbilder i mejl är spårpixlar lika ofta som
          // innehåll, och att hämta dem talar om för avsändaren att vi läst.
          const alt = (attribs.alt ?? "").trim();
          if (alt) {
            runs.push({ text: ` [${alt}] ` });
          }
        }
      },

      ontext(text) {
        if (skipDepth > 0 || !text) {
          return;
        }
        const href = hrefStack[hrefStack.length - 1];
        runs.push(href ? { text, href } : { text });
      },

      onclosetag(name) {
        const tag = name.toLowerCase();

        if (SKIPPED_TAGS.has(tag)) {
          skipDepth = Math.max(0, skipDepth - 1);
          return;
        }
        if (skipDepth > 0) {
          return;
        }

        if (tag === "a") {
          hrefStack.pop();
        }
        if (BLOCK_TAGS.has(tag)) {
          flush();
        }
        if (HEADING_TAGS.has(tag)) {
          headingDepth = Math.max(0, headingDepth - 1);
        }
      },
    },
    { decodeEntities: true, lowerCaseTags: true, lowerCaseAttributeNames: true },
  );

  parser.write(html);
  parser.end();
  flush();

  // Byt ut länkarnas text mot en läsbar etikett.
  return blocks.map((block) => ({
    heading: block.heading,
    runs: block.runs.map((run) =>
      run.href ? { text: linkLabel(run.text, run.href), href: run.href } : run,
    ),
  }));
}

/** True när HTML:en gav något vettigt att visa. */
export function hasRenderableHtml(blocks: HtmlBlock[]): boolean {
  return blocks.some((block) => block.runs.some((run) => run.text.trim().length > 1));
}
