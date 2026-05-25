export type PodcastEpisode = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  publishedAt: string;
  duration: string;
  embedUrl?: string | null;
  guests: Array<{
    name: string;
    role: string;
    bio: string;
  }>;
  showNotes: string[];
  summary: string[];
};

export const podcastEpisodes: PodcastEpisode[] = [
  /* ── Planerade avsnitt (stubs — inspelning ej klar) ─────────────────────── */
  {
    slug: "vad-ar-vibecoding-en-introduktion",
    title: "Vad är vibecoding egentligen? — En introduktion",
    excerpt:
      "Vi reder ut begreppet, berättar varför Andrej Karpathys tweet spred sig och vad vibecoding faktiskt innebär för ett produktteam 2026.",
    description:
      "Introduktionsavsnittet till Vibecoding-podden. Vi förklarar begreppet, myterna och vad det konkret innebär att bygga med AI i flödet.",
    publishedAt: "2026-06-01",
    duration: "32 min",
    guests: [],
    showNotes: [
      "Vad är vibecoding och varifrån kom begreppet?",
      "Skillnaden mellan att prompta för kod och att integrera AI i hela produktcykeln",
      "Varför senior kompetens fortfarande är kritisk",
      "Tre konkreta exempel från vår vardag",
    ],
    summary: [
      "I det här premiäravsnittet reder vi ut vad vibecoding egentligen innebär — bortom hype och buzzwords.",
      "Vi pratar om hur moderna team kan röra sig snabbare utan att kompromissa med kvalitet, och vad det kräver av de som leder arbetet.",
    ],
  },
  {
    slug: "cursor-vs-claude-code-vs-copilot-2026",
    title: "Cursor vs Claude Code vs Copilot — så väljer vi 2026",
    excerpt:
      "Vi jämför de tre dominerande AI-kodarverktygen med utgångspunkt i vad vi faktiskt använder i kundprojekt — och varför.",
    description:
      "En ärlig jämförelse av Cursor, Claude Code och GitHub Copilot baserad på verkliga projekt, inte benchmark-tester.",
    publishedAt: "2026-06-08",
    duration: "38 min",
    guests: [],
    showNotes: [
      "Vad vi faktiskt använder dagligen och varför",
      "Cursor: styrkor, svagheter och när det lyser",
      "Claude Code: agentic-läge och multi-fil-ändringar",
      "Copilot: fortfarande relevant som komplement?",
      "Hur verktygen kombineras i ett riktigt projekt",
    ],
    summary: [
      "Vi går igenom de tre stora AI-kodarverktygen baserat på vad vi sett i verkliga kundprojekt.",
      "Ingen av dem är rätt för allt — det handlar om att använda rätt verktyg för rätt uppgift.",
    ],
  },
  {
    slug: "bygga-mvp-pa-8-veckor-var-process",
    title: "Bygga MVP på 8 veckor — vår process",
    excerpt:
      "Hur ser en realistisk 8-veckors MVP-process ut när man jobbar med vibecoding? Vi berättar steg för steg.",
    description:
      "En genomgång av hur VibeDev strukturerar ett 8-veckors MVP-projekt — från kickoff till lansering — med AI i flödet.",
    publishedAt: "2026-06-15",
    duration: "41 min",
    guests: [],
    showNotes: [
      "Vecka 1–2: spec, scope och arkitekturbeslut",
      "Vecka 3–5: kärnfunktioner och dagliga demos",
      "Vecka 6–7: QA, integration och edge cases",
      "Vecka 8: lansering, monitoring och nästa prioritering",
      "Vad som skiljer ett välplanerat projekt från ett som spårar ur",
    ],
    summary: [
      "Vi delar vår konkreta process för hur ett 8-veckors MVP-projekt ser ut när vi jobbar med vibecoding.",
      "Fokus på vad som faktiskt tar tid, vad AI hjälper med och vad seniora beslut fortfarande kräver.",
    ],
  },
  {
    slug: "ai-i-kundsupport-nar-det-fungerar",
    title: "AI i kundsupport — när det fungerar",
    excerpt:
      "AI-stöd i kundsupport är ett av de vanligaste use casen — och ett av dem som oftast implementeras fel. Vad krävs för att det ska fungera?",
    description:
      "Vi analyserar varför AI-support ibland imponerar och ibland irriterar — och vad som avgör vilket håll det lutar åt.",
    publishedAt: "2026-06-22",
    duration: "35 min",
    guests: [],
    showNotes: [
      "De fyra vanligaste misstagen med AI i support",
      "Eskalationslogik: när ska människan ta vid?",
      "Hur man tränar modellen på rätt data",
      "Mätvärden som faktiskt visar om det fungerar",
    ],
    summary: [
      "AI i kundsupport är varken magisk lösning eller omöjlig uppgift — det är ett ingenjörsproblem med tydliga rätt och fel.",
      "Vi går igenom de vanligaste felen, hur man undviker dem och vad som krävs för att en AI-supportfunktion faktiskt ska hålla i produktion.",
    ],
  },
  {
    slug: "hur-vi-tanker-scope-80-20-regeln-for-mvps",
    title: "Hur vi tänker scope: 80/20-regeln för MVP:er",
    excerpt:
      "20 % av funktionerna levererar 80 % av värdet. Men vilka 20 %? Det är den svåra frågan och vi berättar hur vi tänker.",
    description:
      "VibeDev om hur vi bestämmer vad som ska vara med i ett MVP och varför rätt scope-beslut är det viktigaste vi gör.",
    publishedAt: "2026-06-29",
    duration: "29 min",
    guests: [],
    showNotes: [
      "Varför de flesta teams scope-beslut är drivna av rädsla, inte strategi",
      "Vår metod för att identifiera core-value-funktionerna",
      "Hur vi säger nej utan att förlora förtroende",
      "Vad som faktiskt ska valideras i version ett",
    ],
    summary: [
      "Scope-beslut är det viktigaste vi gör i ett projekt — och det mest undervärderade.",
      "Vi pratar om hur vi prioriterar, varför 80/20-tänket gör oss snabbare och vad som händer när team bygger för mycket för tidigt.",
    ],
  },
  /* ── Publicerade avsnitt ─────────────────────────────────────────────────── */
  {
    slug: "fran-ide-till-mvp-utan-att-tappa-fart",
    title: "Från idé till MVP utan att tappa fart",
    excerpt:
      "Ett avsnitt om hur företag kan definiera rätt första version, undvika scope creep och komma snabbare till marknaden.",
    description:
      "VibeDev pratar om hur startups och produktteam kan ta en idé till MVP med bättre tempo och tydligare prioritering.",
    publishedAt: "2025-03-12",
    duration: "41 min",
    guests: [
      {
        name: "Erik Sand",
        role: "Produktledare och startup-rådgivare",
        bio: "Har hjälpt flera nordiska produktteam att gå från idéstadium till validerad första release.",
      },
    ],
    showNotes: [
      "Varför de flesta team börjar med för mycket scope",
      "Hur man definierar vad som måste finnas i version ett",
      "Skillnaden mellan snabb lansering och förhastad lansering",
      "Vilka signaler man ska mäta direkt efter release",
    ],
    summary: [
      "Vi går igenom hur team kan kapa onödiga funktioner utan att förlora produktens kärnvärde.",
      "Samtalet fokuserar på hur tydligare prioritering leder till bättre fart, lägre risk och mer användbara lärdomar tidigt i produktresan.",
    ],
  },
  {
    slug: "vibecoding-i-praktiken-for-bolag",
    title: "Vibecoding i praktiken för bolag",
    excerpt:
      "Vad betyder vibecoding egentligen för företag som bygger riktiga digitala produkter med riktiga mål, deadlines och användare?",
    description:
      "Ett konkret samtal om vibecoding, AI-stöd i produktutveckling och hur moderna team kan jobba snabbare utan att tappa kontroll.",
    publishedAt: "2025-03-05",
    duration: "38 min",
    guests: [
      {
        name: "Maja Lindqvist",
        role: "Design lead och AI-produktstrateg",
        bio: "Arbetar i gränslandet mellan produktdesign, processutveckling och AI-drivna arbetsflöden.",
      },
    ],
    showNotes: [
      "Vad vibecoding betyder bortom hype och buzzwords",
      "Hur AI kan stötta research, design och utveckling",
      "När tempot ökar utan att kvalitén faller",
      "Varför seniort omdöme fortfarande är avgörande",
    ],
    summary: [
      "Avsnittet reder ut vad vibecoding faktiskt innebär när företag bygger produkter som ska fungera i verkligheten.",
      "Vi pratar om AI som arbetssätt, hur team kan skapa bättre flow och varför tydlig produktstyrning blir ännu viktigare när verktygen blir snabbare.",
    ],
  },
  {
    slug: "ai-funktioner-som-faktiskt-skapar-varde",
    title: "AI-funktioner som faktiskt skapar värde",
    excerpt:
      "Hur företag kan välja rätt AI-use case i stället för att jaga funktioner som ser bra ut men inte används.",
    description:
      "VibeDev diskuterar hur AI bör användas i appar och webbappar för att skapa konkret nytta för användare och verksamhet.",
    publishedAt: "2025-02-27",
    duration: "44 min",
    guests: [
      {
        name: "David Hjelm",
        role: "CTO inom SaaS",
        bio: "Har lett flera AI-initiativ inom B2B-produkter med fokus på support, analys och automation.",
      },
      {
        name: "Elin Fors",
        role: "Head of Product",
        bio: "Specialiserad på att omsätta komplex teknik till användbara produktfunktioner.",
      },
    ],
    showNotes: [
      "Hur man väljer rätt AI-problem att lösa",
      "Vanliga fallgropar när AI läggs in för sent eller för tidigt",
      "Skillnaden mellan demo-värde och affärsvärde",
      "Hur man mäter om AI-funktionen faktiskt används",
    ],
    summary: [
      "Det här avsnittet fokuserar på AI som produktfunktion, inte som trendmarkering.",
      "Vi går igenom hur företag kan prioritera use cases, hantera implementation och bygga AI-lösningar som känns naturliga för slutanvändaren.",
    ],
  },
  {
    slug: "produktbeslut-som-okar-konvertering",
    title: "Produktbeslut som ökar konvertering",
    excerpt:
      "Om hur bättre UX, tydligare flöden och smartare prioritering kan driva fler leads, köp och aktiverade användare.",
    description:
      "Ett avsnitt om sambandet mellan produktdesign, användarupplevelse och konvertering i digitala produkter.",
    publishedAt: "2025-02-18",
    duration: "35 min",
    guests: [
      {
        name: "Sofia Renberg",
        role: "UX-strateg och konverteringsspecialist",
        bio: "Har arbetat med att förbättra onboarding, köpflöden och aktivering i både SaaS och e-handel.",
      },
    ],
    showNotes: [
      "Var friktion uppstår i digitala flöden",
      "Hur designbeslut påverkar affären direkt",
      "Vad företag bör mäta före och efter en redesign",
      "Hur man prioriterar UX-arbete utan att tappa tempo",
    ],
    summary: [
      "Vi pratar om varför konvertering inte bara är en marknadsfråga utan i hög grad en produktfråga.",
      "Samtalet handlar om hur team kan använda design och struktur för att öka tydlighet, minska friktion och förbättra resultaten i hela kundresan.",
    ],
  },
];

export function getPodcastEpisode(slug: string) {
  return podcastEpisodes.find((episode) => episode.slug === slug);
}

export function getRelatedEpisodes(current: PodcastEpisode, limit = 3) {
  return podcastEpisodes.filter((episode) => episode.slug !== current.slug).slice(0, limit);
}
