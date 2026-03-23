export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  category: string;
  tags: string[];
  readingTime: string;
  publishedAt: string;
  author: string;
  heroLabel: string;
  content: Array<{
    heading: string;
    paragraphs: string[];
  }>;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "vad-kostar-det-att-bygga-en-app",
    title: "Vad kostar det att bygga en app?",
    excerpt:
      "En tydlig genomgång av vad som driver kostnad i apputveckling och hur företag kan planera smartare från start.",
    description:
      "Lär dig vilka faktorer som påverkar pris, scope och tidslinje när ett företag ska bygga en app.",
    category: "Apputveckling",
    tags: ["budget", "app", "produktstrategi"],
    readingTime: "7 min läsning",
    publishedAt: "2025-03-10",
    author: "VibeDev",
    heroLabel: "Guide",
    content: [
      {
        heading: "Det finns inget standardpris på en app",
        paragraphs: [
          "Den största missuppfattningen i många appprojekt är att det finns ett fast pris för att bygga en app. I verkligheten beror kostnaden på vad appen ska göra, hur många användarflöden som måste fungera från dag ett och hur mycket integration, design och backend-logik som krävs.",
          "Två appar kan se lika enkla ut på ytan men skilja enormt i utvecklingsarbete beroende på om de behöver betalningar, notiser, kontohantering, adminflöden eller externa system.",
        ],
      },
      {
        heading: "Det som driver kostnaden mest",
        paragraphs: [
          "De största kostnadsdrivarna är vanligtvis produktens omfattning, antalet plattformar, integrationsnivå, designkvalitet och hur mycket som måste byggas skräddarsytt. Ett annat vanligt misstag är att underskatta tiden som går till produktbeslut, testning och iteration.",
          "När företag försöker pressa ner priset genom att hoppa över rätt förstudie blir resultatet ofta högre total kostnad eftersom fel saker byggs först.",
        ],
      },
      {
        heading: "Hur företag bör tänka i stället",
        paragraphs: [
          "Det smartaste är nästan alltid att börja med en tydligt scopead första version. Då går det att kontrollera budget, komma ut snabbare på marknaden och få signaler från riktiga användare innan mer funktionalitet läggs till.",
          "En bra partner hjälper er inte bara att estimera kostnaden, utan också att minska den genom bättre prioriteringar.",
        ],
      },
    ],
  },
  {
    slug: "hur-bygger-man-en-mvp",
    title: "Hur bygger man en MVP?",
    excerpt:
      "Så definierar du rätt första version, undviker överbyggda lösningar och tar en idé till marknaden snabbare.",
    description:
      "En praktisk guide till hur företag bygger en MVP med rätt scope, tempo och tydligt affärsfokus.",
    category: "MVP",
    tags: ["mvp", "startup", "scope"],
    readingTime: "6 min läsning",
    publishedAt: "2025-03-07",
    author: "VibeDev",
    heroLabel: "MVP",
    content: [
      {
        heading: "En MVP är inte en halv produkt",
        paragraphs: [
          "En MVP handlar inte om att bygga något slarvigt eller ofärdigt. Det handlar om att bygga minsta möjliga produkt som kan bevisa något viktigt: att användare förstår värdet, att ett problem faktiskt löses eller att någon är villig att betala.",
          "När företag blandar ihop MVP med låg kvalitet tappar de ofta förtroende både internt och externt.",
        ],
      },
      {
        heading: "Börja med lärandemålet",
        paragraphs: [
          "Det viktigaste i början är att definiera vad ni behöver lära er först. Är det om marknaden vill ha lösningen, om användare klarar flödet eller om ni kan sälja tjänsten? Svaret styr vilka funktioner som ska in i version ett.",
          "Många team börjar i funktioner i stället för i frågan de behöver få besvarad. Då växer scopet snabbt utan att produkten blir smartare.",
        ],
      },
      {
        heading: "Bygg det som låser upp nästa steg",
        paragraphs: [
          "En stark MVP innehåller bara det som krävs för att nå nästa tydliga steg: lansering, användartest, pilotkund eller första intäkt. Resten kan vänta.",
          "Det är ofta bättre att ha tre riktigt välfungerande flöden än tolv halvdana.",
        ],
      },
    ],
  },
  {
    slug: "vad-ar-vibecoding",
    title: "Vad är vibecoding?",
    excerpt:
      "Ett modernt sätt att bygga digitala produkter snabbare med bättre flyt mellan strategi, design, AI och utveckling.",
    description:
      "VibeDev förklarar vad vibecoding betyder i praktiken för företag som bygger appar, webbappar och AI-produkter.",
    category: "Vibecoding",
    tags: ["vibecoding", "ai", "utveckling"],
    readingTime: "5 min läsning",
    publishedAt: "2025-03-04",
    author: "VibeDev",
    heroLabel: "Perspektiv",
    content: [
      {
        heading: "Vibecoding är mer än snabb kodproduktion",
        paragraphs: [
          "Vibecoding handlar om att skapa bättre flow mellan idé, prioritering, design och implementation. Det är ett sätt att bygga där tempo och kvalitet inte ställs mot varandra, utan där rätt verktyg och rätt process används för att få mer gjort med mindre friktion.",
          "Det handlar inte om att släppa kontrollen. Det handlar om att bli snabbare utan att bli slarvig.",
        ],
      },
      {
        heading: "AI är en del av arbetssättet, inte hela poängen",
        paragraphs: [
          "I många team reduceras vibecoding till att använda AI för att skriva kod. Det är för smalt. Den verkliga effekten kommer när AI hjälper till i research, innehåll, struktur, prototyper, dokumentation och iteration, samtidigt som seniora beslut fortfarande styr riktningen.",
          "Det gör att team kan fokusera mer på vad som ska byggas och varför, inte bara på hur varje liten del produceras.",
        ],
      },
      {
        heading: "För företag betyder det kortare väg från idé till värde",
        paragraphs: [
          "För företag innebär vibecoding att färre saker fastnar mellan led, att beslut kan testas snabbare och att ett mindre team kan skapa mer momentum.",
          "När det används rätt blir det ett konkurrensfördelande arbetssätt, inte bara ett kreativt modeord.",
        ],
      },
    ],
  },
  {
    slug: "ai-i-apputveckling",
    title: "AI i apputveckling",
    excerpt:
      "Så kan företag använda AI i appar och webbappar på ett sätt som faktiskt skapar nytta för både användare och verksamhet.",
    description:
      "Praktiska sätt att använda AI i apputveckling, från automatisering till smartare användarupplevelser.",
    category: "AI",
    tags: ["ai", "apputveckling", "automation"],
    readingTime: "8 min läsning",
    publishedAt: "2025-03-01",
    author: "VibeDev",
    heroLabel: "AI",
    content: [
      {
        heading: "AI är mest värdefull när den löser en tydlig uppgift",
        paragraphs: [
          "Det är lätt att prata om AI som ett allmänt lager som ska finnas i alla produkter. Men i praktiken blir resultatet bäst när funktionen är tydligt kopplad till ett konkret behov, som snabbare support, bättre sök, smartare rekommendationer eller automatiserad sammanfattning.",
          "Företag som börjar med use case före teknikval får nästan alltid bättre effekt.",
        ],
      },
      {
        heading: "Bra AI-upplevelser känns enkla",
        paragraphs: [
          "Den starkaste AI-upplevelsen i en produkt är ofta den som inte skriker AI. Den bara gör uppgiften enklare. Det kan vara ett förslag, en genväg, en automatisk strukturering eller hjälp att fatta beslut snabbare.",
          "När AI skapar otydlighet eller kräver för mycket tolkning från användaren minskar förtroendet snabbt.",
        ],
      },
      {
        heading: "Tekniken måste stödja kvalitet och kontroll",
        paragraphs: [
          "För företag är implementeringen minst lika viktig som idén. Dataflöden, källor, fallback-logik, kostnader och säkerhet måste vara genomtänkta för att lösningen ska hålla.",
          "Det är därför AI-projekt bör byggas som produktfunktioner, inte som isolerade experiment.",
        ],
      },
    ],
  },
  {
    slug: "no-code-vs-skraddarsydd-utveckling",
    title: "No-code vs skräddarsydd utveckling",
    excerpt:
      "När är no-code rätt val och när bör företag investera i skräddarsydd utveckling för sin digitala produkt?",
    description:
      "En rak jämförelse mellan no-code och skräddarsydd utveckling för företag som planerar en ny produkt.",
    category: "Produktval",
    tags: ["no-code", "webbapp", "teknikval"],
    readingTime: "6 min läsning",
    publishedAt: "2025-02-26",
    author: "VibeDev",
    heroLabel: "Jämförelse",
    content: [
      {
        heading: "No-code kan vara rätt i tidigt läge",
        paragraphs: [
          "För vissa team är no-code ett rimligt sätt att testa en idé eller få ut ett enkelt flöde snabbt. Det kan fungera bra när produkten har låg komplexitet, få integrationer och ett begränsat behov av unik logik.",
          "Problemet uppstår när ett tillfälligt upplägg blir den långsiktiga grunden utan att någon riktigt har valt det.",
        ],
      },
      {
        heading: "Skräddarsydd utveckling ger kontroll och fart över tid",
        paragraphs: [
          "När produkten blir affärskritisk, behöver skala eller kräver mer specifik funktionalitet blir skräddarsydd utveckling oftast det bättre valet. Ni får bättre kontroll över upplevelse, prestanda, data och vidareutveckling.",
          "Det kostar mer initialt men minskar ofta begränsningar och omskrivningar längre fram.",
        ],
      },
      {
        heading: "Rätt val beror på vart ni är på väg",
        paragraphs: [
          "Frågan är därför sällan vilket alternativ som är bäst generellt. Frågan är vilket alternativ som bäst stödjer er nästa viktiga fas.",
          "Bra rådgivning hjälper er att välja rätt nivå av investering, inte alltid mest teknik.",
        ],
      },
    ],
  },
  {
    slug: "vanliga-misstag-nar-foretag-bygger-digitala-produkter",
    title: "Vanliga misstag när företag bygger digitala produkter",
    excerpt:
      "Sex återkommande misstag som bromsar fart, skapar teknisk skuld och gör digitala satsningar dyrare än de behöver vara.",
    description:
      "Lär dig vilka vanliga misstag företag gör när de bygger digitala produkter och hur de kan undvikas.",
    category: "Produktstrategi",
    tags: ["misstag", "produkt", "strategi"],
    readingTime: "7 min läsning",
    publishedAt: "2025-02-22",
    author: "VibeDev",
    heroLabel: "Strategi",
    content: [
      {
        heading: "För mycket scope för tidigt",
        paragraphs: [
          "Det vanligaste misstaget är att försöka få med för många funktioner i första versionen. Resultatet blir längre ledtid, fler beroenden och sämre fokus på det som faktiskt måste fungera först.",
          "Ju tidigare ett team lär sig säga nej till rätt saker, desto bättre blir produktens chans att lyckas.",
        ],
      },
      {
        heading: "Teknikbeslut utan produktperspektiv",
        paragraphs: [
          "När teknikval görs utan koppling till affär, användarbehov och roadmap blir lösningen ofta onödigt tung eller felprioriterad. Det skapar friktion både i utveckling och i den framtida produkten.",
          "Bra teknikval är nästan alltid kopplade till vilken typ av produkt ni vill bygga och hur snabbt ni behöver röra er.",
        ],
      },
      {
        heading: "Otydligt ägarskap och svag prioritering",
        paragraphs: [
          "Många projekt tappar fart därför att för många viljor försöker styra samtidigt. Om ingen äger prioriteringen blir roadmapen reaktiv och teamet bygger för att tillfredsställa interna önskemål snarare än verkliga mål.",
          "Ett starkt produktspår kräver tydliga prioriteringar, tydliga beslut och en gemensam bild av vad som spelar roll nu.",
        ],
      },
    ],
  },
];

export const blogCategories = Array.from(new Set(blogPosts.map((post) => post.category)));
export const blogTags = Array.from(new Set(blogPosts.flatMap((post) => post.tags))).sort();

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedBlogPosts(current: BlogPost, limit = 3) {
  return blogPosts
    .filter((post) => post.slug !== current.slug)
    .sort((a, b) => {
      const aScore =
        Number(a.category === current.category) +
        a.tags.filter((tag) => current.tags.includes(tag)).length;
      const bScore =
        Number(b.category === current.category) +
        b.tags.filter((tag) => current.tags.includes(tag)).length;

      return bScore - aScore;
    })
    .slice(0, limit);
}
