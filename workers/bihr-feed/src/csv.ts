/**
 * Strömmande CSV-hantering för Bihrs produktkatalog.
 *
 * Katalogen är 273 MB uppackad och kan därför aldrig ligga i minnet på en
 * Worker (128 MB). Allt här arbetar på strömmar: text går in i bitar, hela
 * poster kommer ut, och den sammanslagna filen skrivs vidare direkt.
 *
 * En sak gör det klurigare än det ser ut: fältet Html Description innehåller
 * både kommatecken och radbrytningar inuti citattecken. Att dela på "\n" hade
 * alltså delat mitt i en produkt. Delningen nedan följer citattillståndet.
 */

/** Delar CSV-text i hela poster. Matar in en bit i taget, får ut kompletta poster. */
export class RecordSplitter {
  private buffer = "";
  /**
   * Hur långt in i bufferten vi redan läst. Utan den skannas den sparade
   * svansen om vid varje ny bit, och citattillståndet växlar dubbelt så många
   * gånger som det ska — vilket delar poster mitt i HTML-beskrivningar.
   */
  private scanPos = 0;
  private inQuotes = false;

  /**
   * Lägger till en bit text och returnerar de poster som blivit kompletta.
   * Ofullständig svans sparas till nästa anrop.
   */
  push(chunk: string): string[] {
    this.buffer += chunk;
    return this.drain(false);
  }

  /** Avslutar strömmen och returnerar det som är kvar. */
  end(): string[] {
    return this.drain(true);
  }

  private drain(final: boolean): string[] {
    const records: string[] = [];
    let start = 0;
    let i = this.scanPos;

    for (; i < this.buffer.length; i++) {
      const char = this.buffer[i];

      if (char === '"') {
        // Ett citattecken sist i bufferten kan vara första halvan av ett
        // escapat par ("") som delats mitt itu av en chunkgräns. Vi kan inte
        // avgöra det förrän nästa bit kommit — så vi pausar här.
        if (i === this.buffer.length - 1 && !final) {
          break;
        }
        // Två citattecken i rad är ett escapat citattecken, inte en gräns.
        if (this.inQuotes && this.buffer[i + 1] === '"') {
          i++;
          continue;
        }
        this.inQuotes = !this.inQuotes;
        continue;
      }

      if (!this.inQuotes && (char === "\n" || char === "\r")) {
        const record = this.buffer.slice(start, i);
        if (record.length > 0) {
          records.push(record);
        }
        // Hoppa över \r\n som ett radslut.
        if (char === "\r" && this.buffer[i + 1] === "\n") {
          i++;
        }
        start = i + 1;
      }
    }

    this.buffer = this.buffer.slice(start);
    this.scanPos = Math.max(0, i - start);

    if (final && this.buffer.length > 0) {
      records.push(this.buffer);
      this.buffer = "";
      this.scanPos = 0;
    }

    return records;
  }
}

/**
 * Plockar ut fälten ur en post. `limit` gör att vi kan sluta läsa så snart vi
 * har fältet vi är ute efter — produktposterna har 36 fält och vi behöver
 * oftast bara det nionde.
 */
export function parseFields(record: string, limit = Infinity): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < record.length; i++) {
    const char = record[i];

    if (inQuotes) {
      if (char === '"') {
        if (record[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      fields.push(current);
      current = "";
      if (fields.length >= limit) {
        return fields;
      }
    } else {
      current += char;
    }
  }

  fields.push(current);
  return fields;
}

/** Citerar ett värde bara när det behövs — håller filen så liten som möjligt. */
export function quoteField(value: string): string {
  if (value === "") {
    return "";
  }
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Läser en hel (liten) CSV till en uppslagstabell på artikelnummer.
 * Används för lager och priser, som är några MB — produkterna strömmas i
 * stället, eftersom de är hundratals gånger större.
 */
export function toLookup(
  csv: string,
  keyColumn = 0,
): { header: string[]; rows: Map<string, string[]> } {
  const splitter = new RecordSplitter();
  const records = [...splitter.push(csv), ...splitter.end()];

  if (records.length === 0) {
    return { header: [], rows: new Map() };
  }

  const header = parseFields(records[0]);
  const rows = new Map<string, string[]>();

  for (let i = 1; i < records.length; i++) {
    const fields = parseFields(records[i]);
    const key = fields[keyColumn];
    if (key) {
      rows.set(key, fields);
    }
  }

  return { header, rows };
}
