export type PodcastEpisode = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  publishedAt: string;
  duration: string;
  guests: Array<{
    name: string;
    role: string;
    bio: string;
  }>;
  showNotes: string[];
  summary: string[];
};

export const podcastEpisodes: PodcastEpisode[] = [
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
