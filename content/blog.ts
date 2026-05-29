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
    slug: "ai-i-din-produkt",
    title: "AI i din digitala produkt — när det tillför värde och när det inte gör det",
    excerpt:
      "Fem frågor att ställa innan ni implementerar AI, konkreta use cases och hur ni undviker den kostsamma demoeffekten.",
    description:
      "En praktisk guide för founders och produktteam: när AI faktiskt tillför värde i en digital produkt, hur ni undviker demoeffekten och en beslutsmodell för att välja rätt.",
    category: "AI",
    tags: ["ai", "produktutveckling", "beslutsmodell", "ai-features"],
    readingTime: "12 min läsning",
    publishedAt: "2026-02-01",
    author: "VibeDev",
    heroLabel: "Guide",
    content: [
      {
        heading: "Vad menas egentligen med AI i en digital produkt?",
        paragraphs: [
          "AI i produkten kan betyda hundra olika saker. Det är viktigt att specificera vad man menar, annars bygger man fel sak — eller köper in ett lager som aldrig levererar det man hoppades på.",
        ],
      },
      {
        heading: "Den kostsamma demoeffekten",
        paragraphs: [
          "Det finns ett fenomen vi kallar demoeffekten: en AI-funktion som i demo är imponerande men i produktion fallerar på 20–40 % av fallen.",
        ],
      },
      {
        heading: "Fem frågor att ställa innan ni implementerar AI",
        paragraphs: [
          "En enkel beslutsmodell med fem frågor för att avgöra om AI är rätt för en specifik funktion.",
        ],
      },
    ],
  },
  /* ── Planerade poster (stubs — innehåll ej klart) ───────────────────────── */
  {
    slug: "cursor-vs-claude-code-2026",
    title: "Cursor vs Claude Code 2026 — vad vi använder och varför",
    excerpt:
      "En ärlig jämförelse av de två kraftfullaste AI-kodarverktygen just nu — baserad på verkliga projekt, inte benchmark-tester.",
    description:
      "Vi jämför Cursor och Claude Code i praktiken: styrkor, svagheter, när vi väljer vilket och hur de kombineras i ett produktteam.",
    category: "Vibecoding",
    tags: ["vibecoding", "cursor", "claude code", "ai-verktyg"],
    readingTime: "8 min läsning",
    publishedAt: "2026-03-01",
    author: "VibeDev",
    heroLabel: "Jämförelse",
    content: [
      {
        heading: "Cursor och Claude Code — två olika filosofier",
        paragraphs: [
          "Cursor är en IDE-fork av VS Code med djup AI-integration direkt i editorn. Du ser din kod, du markerar, du chattar i en sidopanel och autocomplete föreslår nästa rad medan du skriver. Claude Code är ett terminalbaserat agentverktyg som opererar på hela kodbasen — du beskriver vad du vill ha gjort och det läser, planerar, redigerar och kör kommandon självständigt.",
          "Skillnaden är inte bara teknisk. Cursor håller dig i förarsätet rad för rad. Claude Code låter dig delegera hela uppgifter. De bästa teamen vi sett använder båda, men för olika typer av arbete.",
        ],
      },
      {
        heading: "När vi väljer Cursor",
        paragraphs: [
          "Cursor lyser när du arbetar i en fil eller en handfull filer och vill ha kontroll över varje ändring. Autocomplete är snabbast i klassen och tab-to-accept gör att du kommer i flow när du skriver känd kod. För frontend-arbete, där du itererar på UI och vill se resultatet direkt, är den närheten till editorn ovärderlig.",
          "Det är också ett tryggare verktyg för utvecklare som är nya i AI-assisterad kodning. Du ser exakt vad som föreslås innan det landar, och tröskeln att granska är låg eftersom allt händer i editorn du redan kan.",
        ],
      },
      {
        heading: "När vi väljer Claude Code",
        paragraphs: [
          "Claude Code vinner på uppgifter som spänner över många filer: en refaktorering genom hela kodbasen, att lägga till en feature som rör backend, frontend och tester samtidigt, eller att förstå ett okänt projekt. Du beskriver målet och låter agenten utforska, planera och genomföra.",
          "Det är också överlägset för repetitivt arbete som följer ett mönster — migrera 30 endpoints till ett nytt API, uppdatera importer efter en omstrukturering, skriva tester för en hel modul. Sådant där du vet vad som ska göras men inte vill göra det för hand.",
        ],
      },
      {
        heading: "Så kombinerar vi dem i praktiken",
        paragraphs: [
          "Ett typiskt arbetspass hos oss börjar ofta i Claude Code för det grova: sätt upp strukturen, generera boilerplate, koppla ihop systemen. Sedan växlar vi till Cursor för finliret — justera UI, putsa logik, fixa edge cases där vi vill känna varje ändring.",
          "Poängen är inte att välja ett verktyg för alltid. Poängen är att matcha verktyget mot uppgiften. Brett och repetitivt? Claude Code. Smalt och känsligt? Cursor.",
        ],
      },
      {
        heading: "Det viktigaste är fortfarande omdömet",
        paragraphs: [
          "Båda verktygen gör dig snabbare, men ingen av dem ersätter förmågan att läsa kod, ifrågasätta förslag och förstå konsekvenser. Den vanligaste fällan vi ser är att team accepterar AI-genererad kod utan att granska den — och bygger teknisk skuld i rekordfart.",
          "Verktyget skriver koden. Du äger den. Det är den uppdelningen som avgör om AI-kodning blir en superkraft eller en framtida huvudvärk.",
        ],
      },
    ],
  },
  {
    slug: "sa-skar-du-scope-pa-en-mvp",
    title: "Så skär du scope på en MVP utan att slänga bort idén",
    excerpt:
      "20 % av funktionerna levererar 80 % av värdet. Men vilka 20 %? En praktisk metod för att hitta rätt och bygga det viktigaste först.",
    description:
      "En guide till hur founders och produktteam prioriterar rätt funktioner i ett MVP och undviker den vanligaste fällan — att bygga för mycket.",
    category: "MVP-utveckling",
    tags: ["mvp", "scope", "prioritering", "produktstrategi"],
    readingTime: "7 min läsning",
    publishedAt: "2026-03-08",
    author: "VibeDev",
    heroLabel: "Guide",
    content: [
      {
        heading: "De flesta MVP:er är för stora",
        paragraphs: [
          "Scope creep börjar inte med dåliga intentioner — det börjar med osäkerhet. När man inte vet vilka funktioner som är kritiska lägger man in alla, för säkerhets skull. Resultatet är en första version som tar dubbelt så lång tid att bygga och ändå missar det användarna faktiskt bryr sig om.",
          "En MVP ska inte vara en mindre version av den färdiga produkten. Den ska vara det minsta du kan bygga för att lära dig det du behöver veta härnäst. Allt annat är distraktion.",
        ],
      },
      {
        heading: "Börja med en mening, inte en funktionslista",
        paragraphs: [
          "Innan du listar funktioner, formulera kärnan: 'Den här produkten hjälper [vem] att [göra vad] så att [vilket resultat].' Om en funktion inte direkt stödjer den meningen är den en kandidat för att skäras.",
          "Den här övningen är obekväm på rätt sätt. Den tvingar fram beslut om vem produkten är till för och vilket problem som faktiskt löses först. Vaga svar här leder garanterat till uppsvullet scope senare.",
        ],
      },
      {
        heading: "Metoden: must / should / later",
        paragraphs: [
          "Ta varje föreslagen funktion och placera den i en av tre högar. 'Must' — utan denna fungerar inte kärnflödet alls. 'Should' — gör upplevelsen klart bättre men kärnan funkar utan. 'Later' — bra idé, men ingen vet ännu om den behövs.",
          "Bygg bara 'must'-högen i version ett. Det känns brutalt, men det är hela poängen. Du kan alltid lägga till från de andra högarna när riktiga användare visar dig vad som saknas — och de kommer att visa dig något annat än du gissade.",
        ],
      },
      {
        heading: "Skär djup, inte bara bredd",
        paragraphs: [
          "Det vanligaste misstaget när man skär scope är att behålla alla funktioner men göra var och en halvfärdig. Det är fel väg. Bättre att ha tre flöden som fungerar exceptionellt än tolv som fungerar nästan.",
          "Ett välgjort kärnflöde bygger förtroende och ger ärlig feedback. Tolv halvfärdiga flöden ger bara förvirring — både för användarna och för dig som försöker tolka vad som funkar.",
        ],
      },
      {
        heading: "Idén dör inte av att du skär — den blir tydligare",
        paragraphs: [
          "Founders är ofta rädda att en bantad MVP förråder visionen. Det omvända är sant. När du tvingas välja det allra viktigaste blir produktens själ tydligare, inte svagare. Visionen lever i roadmappen; MVP:n är bara första steget mot den.",
          "Vi har aldrig sett ett team ångra att de byggde mindre först. Vi har sett många ångra att de byggde för mycket innan de visste om någon ville ha det.",
        ],
      },
    ],
  },
  {
    slug: "fortnox-integration-e-handel",
    title: "Fortnox-integration i e-handel — så undviker du de vanliga fällorna",
    excerpt:
      "Fortnox API är kraftfullt men har sina egenheter. Här är de vanligaste felen vi sett och hur du undviker dem.",
    description:
      "En teknisk guide för team som integrerar Fortnox i e-handelssystem — baserad på erfarenheter från CMS Online och andra projekt.",
    category: "Tekniska val",
    tags: ["fortnox", "integration", "e-handel", "api"],
    readingTime: "9 min läsning",
    publishedAt: "2026-03-15",
    author: "VibeDev",
    heroLabel: "Tekniskt",
    content: [
      {
        heading: "Fortnox API — kraftfullt men inte alltid intuitivt",
        paragraphs: [
          "Vi har byggt Fortnox-integrationer i flera e-handelsprojekt och stöter på samma mönster av problem gång på gång. API:et är fullt kapabelt, men det har egenheter som inte syns förrän du sitter mitt i produktionen och en order vägrar synka.",
          "Den här guiden samlar de fällor vi sett oftast — så att du slipper lära dig dem den dyra vägen.",
        ],
      },
      {
        heading: "Rate limits sätter taket tidigare än du tror",
        paragraphs: [
          "Fortnox begränsar antalet anrop per sekund och per timme. I en e-handel med trafiktoppar — rea, kampanj, julhandel — är det lätt att slå i taket om varje order utlöser flera direktanrop. Resultatet blir köer som svämmar över och kunder vars orderbekräftelse dröjer.",
          "Lösningen är att bygga ett kö- och retry-lager från start. Lägg order i en kö, processa i kontrollerad takt och hantera 429-svar med exponentiell backoff. Skicka aldrig anrop synkront i checkout-flödet — det kopplar din kunds köpupplevelse till Fortnox tillgänglighet.",
        ],
      },
      {
        heading: "Artikelnummer och momssatser är de tysta felkällorna",
        paragraphs: [
          "Den vanligaste datakrocken är artikelnummer som inte matchar mellan butiken och Fortnox. Skapas artiklar automatiskt vid första ordern, eller måste de finnas i förväg? Bestäm en strategi och håll den konsekvent, annars får du dubbletter eller orphan-rader.",
          "Momssatser är nästa fälla. Fortnox vill ha rätt momskod per rad, och e-handelsplattformar uttrycker moms olika. Mappa explicit mellan butikens momslogik och Fortnox momskoder — gissa aldrig, och testa med blandade kundvagnar (olika satser, frakt, rabatter) innan lansering.",
        ],
      },
      {
        heading: "Token-hantering och OAuth",
        paragraphs: [
          "Fortnox använder OAuth med access-tokens som går ut och refresh-tokens som måste roteras. Ett vanligt produktionshaveri är att refresh-token-flödet inte är robust — en token löper ut, ingen förnyar den, och hela synken tystnar utan tydligt larm.",
          "Bygg förnyelse som en bakgrundsprocess med marginal, inte i sista sekund. Och larma aktivt när autentisering fallerar — en tyst trasig integration upptäcks annars först när bokföringen inte stämmer i månadsskiftet.",
        ],
      },
      {
        heading: "Logga allt och gör synken idempotent",
        paragraphs: [
          "När en order inte dyker upp i Fortnox vill du kunna svara på frågan 'vad hände med order 4711?' på sekunder, inte timmar. Logga varje anrop, svar och statusövergång med order-id som nyckel. Det är skillnaden mellan en snabb felsökning och en hel dags grävande.",
          "Gör dessutom synken idempotent: om samma order skickas två gånger ska den inte bokföras dubbelt. Använd en extern referens eller idempotensnyckel så att retries är säkra. Det är den enskilt viktigaste designprincipen för en integration du kan lita på.",
        ],
      },
    ],
  },
  {
    slug: "react-native-eller-native-beslutsguide-2026",
    title: "React Native eller native? Vår beslutsguide 2026",
    excerpt:
      "Ska ni bygga med React Native, Swift/Kotlin eller något annat? En rak guide baserad på vad vi faktiskt rekommenderar och varför.",
    description:
      "VibeDev:s beslutsmodell för mobilutveckling 2026 — när React Native är rätt val och när native är värt kostnaden.",
    category: "Tekniska val",
    tags: ["react native", "ios", "android", "mobilutveckling"],
    readingTime: "8 min läsning",
    publishedAt: "2026-03-22",
    author: "VibeDev",
    heroLabel: "Beslutsguide",
    content: [
      {
        heading: "Valet är mer nyanserat än det verkar",
        paragraphs: [
          "React Native har mognat enormt de senaste åren. Med Hermes, ny arkitektur och ett robust ekosystem är prestandagapet mot native ofta omärkbart för användaren. Men det finns fortfarande situationer där native — Swift på iOS, Kotlin på Android — är det rätta valet.",
          "Den här guiden är beslutsmodellen vi faktiskt använder när en kund frågar. Den handlar mindre om teknik och mer om vad produkten ska vara.",
        ],
      },
      {
        heading: "När React Native är rätt",
        paragraphs: [
          "Om ni ska finnas på både iOS och Android, har ett team som kan TypeScript och vill dela kod mellan plattformar — då är React Native nästan alltid rätt. Ni bygger en gång, levererar till två plattformar och itererar snabbare. För de flesta affärsappar, marknadsplatser, bokningstjänster och innehållsappar räcker det med god marginal.",
          "Det är också rätt val för en MVP. Att validera en idé på två plattformar samtidigt, med ett mindre team, är svårslaget. Ni kan alltid skriva om prestandakritiska delar i native senare om behovet uppstår.",
        ],
      },
      {
        heading: "När native är värt kostnaden",
        paragraphs: [
          "Native blir rätt när appen lever och dör på plattformsspecifika förmågor: avancerad kamera- och bildbehandling, tung 3D eller AR, realtidsljud, komplexa gester eller djup integration med OS-funktioner som widgets, watch-appar och bakgrundsbearbetning.",
          "Det gäller också när varje millisekund och varje bildruta räknas — spel, finansiella handelsappar, verktyg där latens är produkten. I de fallen är den extra kostnaden för två kodbaser en investering, inte ett slöseri.",
        ],
      },
      {
        heading: "Den dolda kostnaden ligger i underhållet",
        paragraphs: [
          "Folk jämför ofta bara byggkostnaden. Den verkliga skillnaden visar sig över tid. Med React Native underhåller ni en kodbas och en uppgraderingscykel. Med native underhåller ni två — varje feature byggs, testas och buggfixas i dubbel uppsättning.",
          "Samtidigt har React Native sin egen underhållsskatt: uppgraderingar mellan större versioner kan vara smärtsamma, och tredjepartsbibliotek hänger inte alltid med. Räkna med den verkligheten, oavsett vilket ni väljer.",
        ],
      },
      {
        heading: "Vår tumregel",
        paragraphs: [
          "Börja med React Native om inget tydligt skäl talar emot det. De flesta appar har inte de extrema krav som motiverar native, och hastigheten att nå marknaden på båda plattformarna väger tungt.",
          "Välj native när en konkret, kritisk förmåga kräver det — inte för att det känns 'mer på riktigt'. Och kom ihåg att valet inte är binärt: React Native låter dig skriva native-moduler för just de delar som behöver det. Hybriden är ofta det smartaste svaret.",
        ],
      },
    ],
  },
  {
    slug: "sakra-dina-llm-anrop",
    title: "Säkra dina LLM-anrop — guide för svenska bolag",
    excerpt:
      "Prompt injection, dataläckage och överdrivet breda behörigheter är de vanligaste säkerhetsfelen vi ser i LLM-integrationer.",
    description:
      "En praktisk säkerhetsguide för svenska bolag som integrerar LLM:er i sina produkter — vad som kan gå fel och hur man skyddar sig.",
    category: "Tekniska val",
    tags: ["säkerhet", "llm", "ai", "prompt injection"],
    readingTime: "10 min läsning",
    publishedAt: "2026-03-29",
    author: "VibeDev",
    heroLabel: "Säkerhet",
    content: [
      {
        heading: "LLM-säkerhet är produktsäkerhet",
        paragraphs: [
          "Säkerhetsproblem i LLM-integrationer är inte teoretiska — de är välkända angreppsytor som aktivt utnyttjas. Så snart du kopplar en språkmodell till verktyg, databaser eller användardata har du öppnat nya vägar in, och de fungerar inte som de sårbarheter du är van vid.",
          "Den goda nyheten: de flesta riskerna går att begränsa kraftigt med några grundläggande principer. Här är de vi alltid implementerar för svenska bolag.",
        ],
      },
      {
        heading: "Prompt injection — det nya SQL-injection",
        paragraphs: [
          "Prompt injection innebär att en angripare bäddar in instruktioner i innehåll som modellen läser — ett dokument, en webbsida, ett mejl — och får modellen att lyda dem i stället för dina. Om din LLM kan vidta åtgärder, kan en injection få den att läcka data eller utföra oönskade operationer.",
          "Grundregeln: behandla allt modellen läser från externa källor som opålitlig data, aldrig som instruktioner. Separera systeminstruktioner från användarinnehåll tydligt, och låt aldrig modellutdata ensamt avgöra om en känslig åtgärd ska utföras. Kräv en kontrollerad bekräftelse för irreversibla operationer.",
        ],
      },
      {
        heading: "Dataläckage — vad skickar du egentligen till modellen?",
        paragraphs: [
          "Varje token du skickar till en extern LLM-leverantör lämnar din miljö. Skicka aldrig personnummer, betalkortsuppgifter, hälsodata eller hemligheter i prompts utan att veta exakt var datan tar vägen och hur länge den lagras. För svenska bolag är detta en GDPR-fråga, inte bara en hygienfråga.",
          "Maskera eller filtrera känsliga fält innan de når modellen. Överväg en EU-baserad eller självhostad modell för data som inte får lämna unionen. Och dokumentera databehandlingen — du behöver kunna svara på vad som delas, med vem och varför.",
        ],
      },
      {
        heading: "Minsta möjliga behörighet",
        paragraphs: [
          "Den dyraste designmissen vi ser är att ge LLM-agenten breda behörigheter 'för att det är smidigt'. En modell som kan läsa hela databasen, skicka mejl och radera poster är en katastrof som väntar på rätt prompt.",
          "Ge agenten exakt de verktyg och den åtkomst den behöver för sin uppgift, inte mer. Läsbehörighet är säkrare än skriv. Skriv är säkrare än radera. Och varje verktyg som kan göra något irreversibelt ska ha en spärr — en bekräftelse, en gräns eller en mänsklig grind.",
        ],
      },
      {
        heading: "Logga, övervaka och sätt gränser",
        paragraphs: [
          "Logga alla prompts, svar och verktygsanrop så att du kan utreda incidenter och upptäcka missbruk. Sätt hårda gränser på output-längd, antal verktygsanrop per session och kostnad per användare — annars kan en enda fientlig eller buggig loop dränera både budget och tålamod.",
          "Säkerhet är inte ett engångsarbete. Modeller, attacker och ditt eget produktbeteende förändras. Behandla LLM-lagret som vilken annan produktionskomponent som helst: med övervakning, larm och regelbunden granskning.",
        ],
      },
    ],
  },
  {
    slug: "fast-pris-vs-timpris",
    title: "Hur vi tar betalt: fast pris vs timpris (och varför vi valde det vi valde)",
    excerpt:
      "De flesta byråer tar betalt per timme. Vi gör inte det. Här förklarar vi varför — och vad det faktiskt innebär för er som kund.",
    description:
      "VibeDev förklarar sin prismodell, varför fast pris på fast scope fungerar bättre för kunder och vilka avvägningar som finns.",
    category: "Produktstrategi",
    tags: ["pris", "affärsmodell", "upphandling", "budget"],
    readingTime: "6 min läsning",
    publishedAt: "2026-04-05",
    author: "VibeDev",
    heroLabel: "Perspektiv",
    content: [
      {
        heading: "Timprissättning skapar fel incitament",
        paragraphs: [
          "Med timpris tjänar byrån mer ju längre projektet tar. Det är inte en bra grund för ett partnerskap. Det betyder inte att alla byråer som tar betalt per timme är ohederliga — men incitamentet pekar åt fel håll, och det märks över tid i hur beslut fattas.",
          "Vi valde tidigt att inte sälja timmar. Här är resonemanget bakom, och de avvägningar som faktiskt finns — för det finns inget prismodell utan baksidor.",
        ],
      },
      {
        heading: "Fast pris riktar fokus mot resultat",
        paragraphs: [
          "När priset är fast och scopet är tydligt blir vårt jobb att leverera det överenskomna så bra och effektivt som möjligt. Effektivitet gynnar oss båda i stället för att straffa er. Vi har inget skäl att dra ut på saker, och ni vet exakt vad det kostar innan vi börjar.",
          "Det tvingar också fram bättre samtal i början. Eftersom priset hänger på ett tydligt scope måste vi tillsammans definiera vad som faktiskt ska byggas. Den disciplinen är värdefull i sig — den fångar otydligheter innan de blir dyra.",
        ],
      },
      {
        heading: "Förutsägbarhet är värt mycket för kunden",
        paragraphs: [
          "För er som kund är det enklare att budgetera, lättare att förankra internt och tryggare att ge klartecken när siffran är känd. Inga obehagliga överraskningar i slutet av månaden, ingen oro för att en fråga på ett möte tickar upp fakturan.",
          "Det gör relationen rakare. Ni kan fråga, ändra er och resonera fritt utan att räkna minuter. Den friheten leder ofta till bättre produktbeslut.",
        ],
      },
      {
        heading: "Avvägningen: scope måste hanteras seriöst",
        paragraphs: [
          "Den ärliga baksidan med fast pris är att förändringar i scope måste hanteras explicit. Om ni mitt i projektet vill lägga till något väsentligt är det ett nytt beslut, inte bara 'några timmar till'. Det kan kännas stelare än timpris, där allt bara läggs på.",
          "Vi löser det med tydlig scope-definition från start och en enkel process för tillägg: vi beskriver vad det innebär, vad det kostar och hur det påverkar tidsplanen — så bestämmer ni. Inget byggs i skymundan, och inget faktureras i efterhand utan att ni sagt ja.",
        ],
      },
      {
        heading: "När timpris faktiskt är bättre",
        paragraphs: [
          "Vi är inte dogmatiska. För rent utforskande arbete, löpande förvaltning eller uppdrag där ingen ärligt kan definiera scopet i förväg kan en löpande modell vara rättvisare för båda. Att tvinga fast pris på något fundamentalt osäkert leder bara till uppblåsta riskpåslag.",
          "Poängen är inte att fast pris alltid vinner. Poängen är att prismodellen ska matcha hur säkert arbetet är — och att incitamenten ska peka mot ert resultat, inte mot fler fakturerade timmar.",
        ],
      },
    ],
  },
  /* ── Publicerade poster ──────────────────────────────────────────────────── */
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
  /* ── Vibecoding (nya) ────────────────────────────────────────────────────── */
  {
    slug: "infor-vibecoding-i-teamet",
    title: "Så inför ni vibecoding i teamet — utan kaos",
    excerpt:
      "Att släppa in AI i utvecklingsflödet utan struktur skapar mer förvirring än fart. Här är hur vi inför det stegvis.",
    description:
      "En praktisk guide för team som vill börja arbeta med AI-assisterad utveckling — roller, granskning, kvalitet och de vanligaste fallgroparna.",
    category: "Vibecoding",
    tags: ["vibecoding", "team", "arbetssätt", "ai-verktyg"],
    readingTime: "8 min läsning",
    publishedAt: "2026-04-12",
    author: "VibeDev",
    heroLabel: "Guide",
    content: [
      {
        heading: "Verktyg utan process ger bara snabbare kaos",
        paragraphs: [
          "Det är lätt att tro att vibecoding handlar om att köpa licenser till Cursor och Claude Code och sätta igång. I praktiken är verktygen den enkla delen. Det svåra är att förändra hur teamet arbetar, granskar och tar beslut.",
          "Team som hoppar över den biten upptäcker snabbt att AI inte gör dem snabbare — den gör dem snabbare på att producera kod ingen riktigt äger. Strukturen är det som gör skillnaden mellan en superkraft och en framtida huvudvärk.",
        ],
      },
      {
        heading: "Börja med ett avgränsat område",
        paragraphs: [
          "Försök inte lägga om hela teamets arbetssätt på en gång. Välj ett område där AI passar bra och risken är låg — tester, boilerplate, intern verktygskod — och låt teamet bygga vana där först.",
          "När de ser var verktygen lyser och var de famlar växer omdömet. Det omdömet är vad ni sedan tar med er till känsligare delar av kodbasen. Tillit byggs genom erfarenhet, inte genom en kickoff.",
        ],
      },
      {
        heading: "Granskning blir viktigare, inte mindre viktig",
        paragraphs: [
          "När produktionen av kod accelererar måste granskningen hänga med. Den vanligaste regressionen vi ser är att team godkänner AI-genererad kod snabbare än de skulle godkänt en kollegas — för att den 'ser rätt ut'.",
          "Sätt en tydlig norm: AI skriver, en människa äger. Den som mergar koden ansvarar för att förstå den, oavsett vem eller vad som skrev den. Det enda som ändras är att granskaren nu lägger mer tid på att tänka och mindre på att skriva.",
        ],
      },
      {
        heading: "Skriv ner era konventioner — för både människor och AI",
        paragraphs: [
          "AI-verktyg presterar dramatiskt bättre när de har kontext om hur ert projekt ska se ut. En kort fil med kodstandard, mappstruktur, namngivning och vanliga mönster gör att förslagen landar rätt från början.",
          "Bonusen är att samma dokument hjälper nyanställda. Det du skriver för att styra AI:n är ofta exakt det du borde skrivit för teamet ändå.",
        ],
      },
      {
        heading: "Mät på rätt sak",
        paragraphs: [
          "Mät inte hur mycket kod ni producerar — det är fel mått och leder till fel beteende. Mät om ni levererar värde snabbare, om kvaliteten håller och om teamet trivs med arbetssättet.",
          "Vibecoding lyckas när teamet lägger mer energi på vad som ska byggas och varför, och mindre på det mekaniska hantverket. Det är den förskjutningen ni vill se — inte fler rader per dag.",
        ],
      },
    ],
  },
  {
    slug: "prompta-for-battre-kod",
    title: "Prompta för bättre kod — vår metod för tydliga instruktioner",
    excerpt:
      "Skillnaden mellan medioker och utmärkt AI-kod ligger ofta i prompten. Här är hur vi formulerar oss för att få rätt resultat.",
    description:
      "Konkreta tekniker för att skriva prompts som ger användbar, korrekt kod — kontext, avgränsning, exempel och iteration.",
    category: "Vibecoding",
    tags: ["vibecoding", "prompting", "ai-verktyg", "produktivitet"],
    readingTime: "7 min läsning",
    publishedAt: "2026-04-19",
    author: "VibeDev",
    heroLabel: "Metod",
    content: [
      {
        heading: "Prompten är specifikationen",
        paragraphs: [
          "Om du ger en vag instruktion får du en vag lösning — gissad ur tomma intet. AI-verktyg är inte tankeläsare; de fyller i luckor med antaganden, och antaganden är där buggar föds. En bra prompt är i praktiken en kravspecifikation.",
          "De flesta som är besvikna på AI-genererad kod har egentligen ett promptproblem. När instruktionen blir tydlig blir resultatet ofta förvånansvärt bra.",
        ],
      },
      {
        heading: "Ge kontext innan du ger uppgiften",
        paragraphs: [
          "Innan du säger vad du vill ha gjort, beskriv var det ska göras. Vilket språk och ramverk, vilka konventioner finns, hur ser den omgivande koden ut, vilka bibliotek får användas. Ju mer modellen vet om sammanhanget, desto mer landar förslaget i din verklighet i stället för en generisk.",
          "Att peka modellen mot befintliga filer som exempel — 'följ samma mönster som i den här komponenten' — är ofta mer effektivt än långa beskrivningar. Visa hellre än berätta.",
        ],
      },
      {
        heading: "Avgränsa hårt",
        paragraphs: [
          "En instruktion som 'fixa autentiseringen' bjuder in till att modellen ändrar mer än du vill. Säg i stället exakt vad som ska och inte ska röras: 'Lägg till e-postvalidering i login-formuläret. Ändra inget i backend-logiken.'",
          "Tydliga gränser gör också granskningen enklare. När du vet vad som var tänkt att ändras är det snabbt att se om något oväntat smög sig in.",
        ],
      },
      {
        heading: "Be om plan före kod vid större uppgifter",
        paragraphs: [
          "För allt som rör mer än en fil, be modellen beskriva sin plan innan den skriver kod. Då ser du om den förstått uppgiften rätt, och du kan korrigera kursen innan en massa kod redan är skriven på fel premiss.",
          "Det är samma princip som med en mänsklig kollega: en kort koll på riktningen sparar timmar av omarbete. Det kostar en mening att be om, och betalar tillbaka rikligt.",
        ],
      },
      {
        heading: "Iterera — förvänta dig inte perfektion i ett svar",
        paragraphs: [
          "De bästa resultaten kommer sällan från första prompten. Behandla det som en dialog: granska, peka på vad som är fel, be om justering. 'Det här fungerar, men hantera fallet där listan är tom' tar dig längre än att skriva om hela prompten.",
          "Den som behärskar den här iterativa rytmen får ut mångdubbelt mer av samma verktyg. Prompting är en färdighet, och den blir bättre med övning precis som allt annat.",
        ],
      },
    ],
  },
  /* ── AI i produkter (nya) ────────────────────────────────────────────────── */
  {
    slug: "rag-eller-finetuning",
    title: "RAG eller finetuning? Så väljer du rätt för din produkt",
    excerpt:
      "Två sätt att få en språkmodell att kunna din domän. De löser olika problem — och valet påverkar både kostnad och kvalitet.",
    description:
      "En beslutsguide för produktteam: när Retrieval-Augmented Generation är rätt, när finetuning lönar sig och varför de flesta bör börja med RAG.",
    category: "AI i produkter",
    tags: ["ai", "rag", "finetuning", "llm"],
    readingTime: "9 min läsning",
    publishedAt: "2026-04-26",
    author: "VibeDev",
    heroLabel: "Beslutsguide",
    content: [
      {
        heading: "Två lösningar på två olika problem",
        paragraphs: [
          "När en språkmodell inte kan det din produkt kräver finns två huvudvägar: RAG, där du hämtar relevant information och ger den till modellen vid varje fråga, och finetuning, där du tränar modellen på egen data så att den lär sig nytt beteende.",
          "Den vanligaste missuppfattningen är att de är utbytbara. De är de inte. RAG handlar om att ge modellen rätt fakta. Finetuning handlar om att ändra hur modellen beter sig. Att blanda ihop dem leder till dyra felval.",
        ],
      },
      {
        heading: "RAG — när modellen behöver veta dina fakta",
        paragraphs: [
          "Om problemet är att modellen inte känner till ditt innehåll — produktdokumentation, kunddata, interna policys, färska uppgifter — då är RAG nästan alltid rätt. Du indexerar din kunskap, hämtar de mest relevanta bitarna vid varje fråga och låter modellen svara utifrån dem.",
          "Fördelen är att informationen alltid är aktuell: uppdatera källan så är svaret uppdaterat, utan ny träning. Du får också spårbarhet — du kan visa vilka källor svaret bygger på, vilket är guld värt för förtroende och felsökning.",
        ],
      },
      {
        heading: "Finetuning — när modellen behöver bete sig annorlunda",
        paragraphs: [
          "Finetuning lönar sig när problemet inte är fakta utan form: en specifik ton, ett strikt utdataformat, en domänjargong eller en uppgift modellen återkommande gör fel på trots tydliga instruktioner. Då kan träning på exempel forma beteendet på ett sätt som prompting inte når.",
          "Priset är att det kräver kvalitetsdata, kostar att genomföra och måste göras om när du vill ändra beteendet. Och det löser inte faktaproblem — en finetunad modell vet fortfarande inte vad som står i ditt senaste dokument.",
        ],
      },
      {
        heading: "Börja nästan alltid med RAG",
        paragraphs: [
          "För de allra flesta produkter är RAG rätt första steg. Det är billigare, snabbare att komma igång med, lättare att underhålla och löser det vanligaste behovet — att modellen ska kunna din specifika information.",
          "Lägg också tid på prompting innan du ens överväger finetuning. Förvånansvärt ofta löser en välformulerad systeminstruktion det du trodde krävde träning. Finetuning är optimering, inte startpunkt.",
        ],
      },
      {
        heading: "Och ibland: båda",
        paragraphs: [
          "Mogna AI-produkter kombinerar ofta teknikerna. En finetunad modell som behärskar ditt format och din ton, matad med färska fakta via RAG, ger det bästa av två världar — konsekvent beteende och aktuell kunskap.",
          "Men det är ett senare steg. Bygg det enkla först, mät var det faktiskt brister, och lägg bara till komplexitet där den löser ett verkligt problem. Annars betalar du för en arkitektur du inte behöver.",
        ],
      },
    ],
  },
  {
    slug: "ai-features-anvandare-vill-ha",
    title: "AI-funktioner användare faktiskt vill ha",
    excerpt:
      "De flesta AI-funktioner imponerar i demo och dör i verkligheten. Här är mönstren för de som överlever kontakt med riktiga användare.",
    description:
      "En guide till att designa AI-funktioner som skapar verkligt värde — fokus på uppgift, förtroende och hur du undviker AI för AI:s skull.",
    category: "AI i produkter",
    tags: ["ai", "produktdesign", "ux", "ai-features"],
    readingTime: "8 min läsning",
    publishedAt: "2026-05-03",
    author: "VibeDev",
    heroLabel: "Produktdesign",
    content: [
      {
        heading: "AI är inte en funktion — det är ett medel",
        paragraphs: [
          "Den vanligaste produktfällan just nu är att lägga till AI för att kunna säga att man har AI. Användare bryr sig inte om att något drivs av en språkmodell. De bryr sig om att en uppgift blir enklare, snabbare eller bättre.",
          "Bra AI-funktioner börjar därför inte i tekniken utan i ett konkret användarproblem. 'Folk lägger 20 minuter på att sammanfatta sina möten' är en bra start. 'Vi borde ha en AI-assistent' är inte det.",
        ],
      },
      {
        heading: "De bästa funktionerna känns som genvägar",
        paragraphs: [
          "Den starkaste AI-upplevelsen skriker sällan AI. Den tar bort ett steg, föreslår nästa, fyller i det uppenbara eller strukturerar något rörigt. Ett förslag du kan acceptera med ett klick slår en chattruta du måste formulera dig i.",
          "Fundera på var i flödet användaren tvekar, väntar eller gör tråkigt manuellt arbete. Det är där en AI-genväg gör mest nytta — och där den känns naturlig snarare än påklistrad.",
        ],
      },
      {
        heading: "Förtroende byggs på förutsägbarhet",
        paragraphs: [
          "En AI-funktion som har rätt nio gånger av tio men fel på ett oförutsägbart sätt tappar förtroende snabbt. Användare slutar lita på den och slutar använda den. Konsekvens väger ofta tyngre än rå förmåga.",
          "Designa för felen: gör det lätt att se vad AI:n föreslog, lätt att ångra, och var ärlig med osäkerhet. En funktion som säger 'jag är inte säker här, kolla själv' är mer användbar än en som låtsas vara säker och har fel.",
        ],
      },
      {
        heading: "Ge användaren kontroll",
        paragraphs: [
          "Människor accepterar AI-hjälp mycket lättare när de behåller rodret. Förslag de kan redigera, automationer de kan stänga av, utdata de kan justera. Funktioner som tar över helt utan insyn skapar obehag, även när de fungerar.",
          "Tumregeln: AI gör grovjobbet, människan fattar beslutet. Den uppdelningen gör funktionen till en assistent i stället för en svart låda — och assistenter är vad folk vill ha.",
        ],
      },
      {
        heading: "Mät användning, inte applåder",
        paragraphs: [
          "En demo som får rummet att gå 'wow' säger ingenting om värde. Det som räknas är om folk använder funktionen igen, om den sparar tid och om den löser problemet den lovade. Det är där många AI-satsningar faller — imponerande lansering, tom användning en månad senare.",
          "Bygg in mätning från start. Om ingen återvänder till funktionen är det en signal att problemet inte var verkligt nog, eller att lösningen inte var tillräckligt bra. Lyssna på den signalen tidigt.",
        ],
      },
    ],
  },
  {
    slug: "kostnadskontroll-llm-produktion",
    title: "Kostnadskontroll för LLM i produktion",
    excerpt:
      "AI-funktioner kan vara billiga i demo och skrämmande dyra i skala. Här är hur du håller kostnaden under kontroll utan att offra kvalitet.",
    description:
      "Praktiska tekniker för att hålla nere kostnaden för språkmodeller i produktion — modellval, caching, kontextstorlek och gränser.",
    category: "AI i produkter",
    tags: ["ai", "llm", "kostnad", "skalning"],
    readingTime: "8 min läsning",
    publishedAt: "2026-05-10",
    author: "VibeDev",
    heroLabel: "Tekniskt",
    content: [
      {
        heading: "Demo-kostnad och produktionskostnad är olika världar",
        paragraphs: [
          "I utveckling testar du en funktion några hundra gånger och kostnaden är försumbar. I produktion, med tusentals användare och miljontals anrop, kan samma funktion bli en av dina största löpande utgifter. Den skalningen överraskar många team.",
          "Den goda nyheten: de flesta AI-kostnader går att skära kraftigt utan att kvaliteten märkbart sjunker. Det handlar om att vara medveten om var pengarna faktiskt går.",
        ],
      },
      {
        heading: "Använd inte den största modellen till allt",
        paragraphs: [
          "Det vanligaste slöseriet är att låta en dyr toppmodell hantera även triviala uppgifter. Klassificering, enkel formatering och korta svar klarar mindre, billigare modeller utmärkt — ofta till en bråkdel av priset och med lägre latens.",
          "Bygg en routing-logik: lättviktiga uppgifter till en liten modell, det som verkligen kräver kapacitet till den stora. Den uppdelningen ensam kan halvera kostnaden i många produkter.",
        ],
      },
      {
        heading: "Cacha det som upprepas",
        paragraphs: [
          "Om många användare ställer liknande frågor, eller om samma kontext skickas om och om igen, betalar du för samma arbete flera gånger. Cachning — av hela svar för vanliga frågor, eller av återanvänd kontext där leverantören stödjer det — tar bort den dubbelkostnaden.",
          "Även enkel cachning av de vanligaste frågorna kan ge stor effekt, eftersom användning sällan är jämnt fördelad. En liten andel frågor står ofta för en stor andel av anropen.",
        ],
      },
      {
        heading: "Håll koll på kontextstorleken",
        paragraphs: [
          "Du betalar för varje token i prompten, inklusive all kontext du skickar med. Team som stoppar in 'allt för säkerhets skull' — hela dokument, lång historik, oavkortade systeminstruktioner — betalar för data modellen oftast inte behöver.",
          "Skicka bara det som är relevant för uppgiften. Med RAG, hämta de mest relevanta bitarna i stället för hela källan. Trimma konversationshistorik. Korta, fokuserade prompts är billigare och ger ofta bättre svar.",
        ],
      },
      {
        heading: "Sätt gränser och larma",
        paragraphs: [
          "Sätt hårda tak per användare och per session — på antal anrop, output-längd och kostnad. Det skyddar mot både buggar som loopar och användare som missbrukar funktionen, och det gör kostnaden förutsägbar i stället för obegränsad.",
          "Larma på avvikelser. En plötslig kostnadsökning är ofta första tecknet på en bugg eller ett angrepp. Ju tidigare du ser den, desto billigare blir den att åtgärda.",
        ],
      },
    ],
  },
  /* ── MVP-utveckling (nya) ────────────────────────────────────────────────── */
  {
    slug: "fran-ide-till-mvp-pa-sex-veckor",
    title: "Från idé till MVP på sex veckor — så lägger vi upp arbetet",
    excerpt:
      "Sex veckor låter snabbt, men det är fullt möjligt med rätt fokus. Här är hur vi strukturerar arbetet vecka för vecka.",
    description:
      "En konkret tidsplan för att ta en produktidé till en lanserbar MVP på sex veckor — vad som händer varje vecka och var de flesta fastnar.",
    category: "MVP-utveckling",
    tags: ["mvp", "process", "tidsplan", "produktutveckling"],
    readingTime: "8 min läsning",
    publishedAt: "2026-05-17",
    author: "VibeDev",
    heroLabel: "Process",
    content: [
      {
        heading: "Sex veckor kräver fokus, inte fler timmar",
        paragraphs: [
          "Att bygga en MVP på sex veckor handlar inte om att jobba dubbelt så hårt. Det handlar om att vara obeveklig med vad som ska byggas och vad som ska vänta. Tempot kommer från tydlighet, inte från stress.",
          "Den här tidsplanen är hur vi faktiskt lägger upp ett sådant projekt. Den fungerar för att besluten fattas i rätt ordning och scopet hålls fast hela vägen.",
        ],
      },
      {
        heading: "Vecka 1 — definiera och avgränsa",
        paragraphs: [
          "Första veckan byggs ingenting. Vi formulerar kärnan, identifierar det enda flöde som måste fungera och skär bort allt annat till en 'senare'-lista. Vi enas om vad vi vill lära oss av lanseringen — det styr alla beslut framåt.",
          "Det är den viktigaste veckan i hela projektet. Ett projekt som börjar med otydligt scope hinner aldrig ifatt, oavsett hur snabbt teamet sedan kodar.",
        ],
      },
      {
        heading: "Vecka 2–4 — bygg kärnflödet",
        paragraphs: [
          "Här ligger tyngdpunkten. Vi bygger det centrala flödet hela vägen igenom — från start till värde — och får det att fungera på riktigt, inte i mockup. Vi prioriterar djup framför bredd: ett flöde som verkligen håller slår fem som nästan gör det.",
          "Vi visar upp framsteg löpande, inte bara i slutet. Det fångar missförstånd tidigt och håller alla överens om riktningen medan det fortfarande är billigt att justera.",
        ],
      },
      {
        heading: "Vecka 5 — putsa det som möter användaren",
        paragraphs: [
          "Med kärnan på plats lägger vi näst sista veckan på det som avgör förstaintrycket: de uppenbara felfallen, tomma tillstånd, laddningstider, den text användaren faktiskt läser. Inte ny funktionalitet — bara att det befintliga känns färdigt nog att släppa.",
          "Det är frestande att smyga in 'bara en till feature' här. Vi gör det inte. Den disciplinen är skillnaden mellan att lansera på tid och att glida iväg.",
        ],
      },
      {
        heading: "Vecka 6 — testa, fixa, lansera",
        paragraphs: [
          "Sista veckan testar vi det hela som en användare skulle, fixar det som skaver och förbereder lansering: mätning på plats, en plan för hur feedback fångas, och en kontroll av att det kritiska fungerar i skarpt läge.",
          "Sedan släpper vi. En MVP är inte slutet — det är början på lärandet. Poängen med sex veckor är att komma till den punkten snabbt, med riktiga användare som visar vad nästa steg ska vara.",
        ],
      },
    ],
  },
  {
    slug: "validera-din-mvp",
    title: "Så validerar du din MVP med riktiga användare",
    excerpt:
      "Att lansera är inte att validera. Här är hur du faktiskt får veta om din produkt löser ett verkligt problem.",
    description:
      "En guide till att validera en MVP på riktigt — vilka signaler som betyder något, vilka som lurar dig och hur du tolkar tidig feedback.",
    category: "MVP-utveckling",
    tags: ["mvp", "validering", "användartest", "produktstrategi"],
    readingTime: "7 min läsning",
    publishedAt: "2026-05-24",
    author: "VibeDev",
    heroLabel: "Guide",
    content: [
      {
        heading: "Lansering är inte validering",
        paragraphs: [
          "Många team tror att jobbet är klart när MVP:n är ute. Men en lansering svarar inte på den viktigaste frågan: löser produkten ett problem folk faktiskt har? Den frågan besvaras bara av hur människor beter sig efteråt.",
          "Validering är hela poängen med att bygga en MVP. Om du inte planerar hur du ska lära dig något, har du bara byggt en liten produkt — inte ett experiment.",
        ],
      },
      {
        heading: "Beslut innan lansering: vad skulle övertyga dig?",
        paragraphs: [
          "Bestäm i förväg vad som skulle räknas som ett tydligt ja och vad som skulle vara ett tydligt nej. Annars är det lätt att i efterhand tolka vilken data som helst som uppmuntrande — vi är skickliga på att lura oss själva när vi vill att något ska lyckas.",
          "Det behöver inte vara avancerat. 'Om hälften av de som testar återkommer inom en vecka är vi på rätt spår' är en konkret hypotes du kan mäta mot. Det viktiga är att tröskeln sätts före, inte efter.",
        ],
      },
      {
        heading: "Beteende slår åsikter",
        paragraphs: [
          "Folk är artiga. 'Vad fin app, den ska jag använda' betyder ofta ingenting. Det som betyder något är om de faktiskt kommer tillbaka, slutför flödet och bjuder in andra — eller, i bästa fall, betalar.",
          "Lägg vikt vid vad användare gör, inte vad de säger i en intervju. Den enskilt starkaste valideringssignalen är återkommande, oombedd användning. Allt annat är hjälpsamt men sekundärt.",
        ],
      },
      {
        heading: "Prata med dem som slutade",
        paragraphs: [
          "Det är frestande att fokusera på de entusiastiska användarna, men mest lär du dig av dem som testade och försvann. Var i flödet tappade du dem? Vad förväntade de sig som inte fanns? Förstod de ens vad produkten var till för?",
          "De samtalen är obekväma men ovärderliga. De pekar precis på var produkten brister medan det fortfarande är billigt att ändra. En handfull ärliga 'därför slutade jag'-svar är mer värt än hundra tomma applåder.",
        ],
      },
      {
        heading: "Var beredd att ändra — eller lägga ner",
        paragraphs: [
          "Validering är bara meningsfull om du är villig att agera på resultatet. Ibland säger datan att kärnan funkar och du ska bygga vidare. Ibland säger den att problemet inte var verkligt nog, och då är den ärligaste — och billigaste — slutsatsen att svänga eller släppa idén.",
          "Det är inte ett misslyckande. Hela poängen med en MVP är att ta reda på det innan du investerat ett år och en förmögenhet. Ett snabbt nej är en seger, inte en förlust.",
        ],
      },
    ],
  },
  /* ── Produktstrategi (nya) ───────────────────────────────────────────────── */
  {
    slug: "roadmap-som-haller",
    title: "Bygg en roadmap som håller — bortom önskelistan",
    excerpt:
      "De flesta roadmaps är bara prioriterade önskelistor som spricker vid första kontakten med verkligheten. Här är hur du bygger en som faktiskt styr.",
    description:
      "En guide för founders och produktteam: hur en roadmap blir ett verktyg för beslut snarare än en lista över allt ni vill bygga.",
    category: "Produktstrategi",
    tags: ["roadmap", "prioritering", "produktstrategi", "planering"],
    readingTime: "7 min läsning",
    publishedAt: "2026-04-15",
    author: "VibeDev",
    heroLabel: "Strategi",
    content: [
      {
        heading: "En roadmap är inte en önskelista",
        paragraphs: [
          "Den vanligaste roadmappen är en lång lista med funktioner sorterade efter vem som skrek högst. Den spricker så fort verkligheten knackar på, för den bygger på allt man vill ha snarare än på vad man försöker uppnå.",
          "En roadmap som håller utgår från mål, inte funktioner. Den svarar på 'vad försöker vi åstadkomma härnäst' innan den listar 'vad ska vi bygga'. Den skillnaden avgör om dokumentet styr besluten eller bara samlar damm.",
        ],
      },
      {
        heading: "Organisera kring resultat, inte features",
        paragraphs: [
          "I stället för 'bygg funktion X, Y och Z', formulera 'gör onboarding så enkel att fler kommer igång'. Då blir funktionerna medel som kan bytas ut om en bättre väg dyker upp, i stället för löften du är låst vid.",
          "Det här gör roadmappen motståndskraftig. När ni lär er något nytt kan ni ändra hur ni når målet utan att hela planen rasar. Målet står fast; vägen får anpassas.",
        ],
      },
      {
        heading: "Var ärlig med tidshorisonten",
        paragraphs: [
          "Det som ligger närmast i tiden kan vara konkret. Det som ligger längre bort ska vara medvetet vagt — riktningar, inte datum. Att låtsas att kvartal tre är lika exakt planerat som nästa vecka är ett löfte du garanterat bryter.",
          "Använd gärna nivåer som 'nu', 'snart' och 'senare' i stället för precisa datum långt fram. Det sätter rätt förväntan både internt och mot kunder, och skyddar din trovärdighet när planerna oundvikligen ändras.",
        ],
      },
      {
        heading: "Säg nej synligt",
        paragraphs: [
          "En roadmap definieras lika mycket av vad den utesluter som av vad den innehåller. Ha en uttalad 'inte nu'-lista. Den hjälper alla att förstå att ett nej inte betyder ett glömt — det betyder ett medvetet val om vad som är viktigast just nu.",
          "Utan den listan blir varje ny idé en strid om utrymme. Med den blir det en fråga om prioritering: vad ska i så fall vänta? Det är ett mycket sundare samtal.",
        ],
      },
      {
        heading: "Revidera regelbundet — det är meningen",
        paragraphs: [
          "En roadmap som aldrig ändras är inte disciplinerad, den är frånkopplad verkligheten. Gå igenom den med jämna mellanrum: vad har ni lärt er, vad har förändrats, stämmer prioriteringen fortfarande?",
          "Poängen är inte att hålla fast vid planen till varje pris. Poängen är att alltid ha en tydlig, gemensam bild av vad som spelar roll nu — och modet att uppdatera den när ny kunskap kräver det.",
        ],
      },
    ],
  },
  {
    slug: "nar-ska-man-skala",
    title: "När ska man skala? Tecknen att leta efter",
    excerpt:
      "Att skala för tidigt dödar fler produkter än att skala för sent. Här är signalerna som visar att det faktiskt är dags.",
    description:
      "En guide till att veta när en produkt är redo att skalas — vilka signaler som betyder att det är dags och vilka som lurar dig att satsa för tidigt.",
    category: "Produktstrategi",
    tags: ["skalning", "tillväxt", "produktstrategi", "product-market-fit"],
    readingTime: "7 min läsning",
    publishedAt: "2026-05-06",
    author: "VibeDev",
    heroLabel: "Strategi",
    content: [
      {
        heading: "För tidig skalning är en vanlig dödsorsak",
        paragraphs: [
          "Det känns kontraintuitivt, men att trycka på gasen för tidigt sänker fler produkter än att vänta för länge. När du skalar något som ännu inte fungerar förstärker du bara dess brister — och bränner pengar, team och tålamod i processen.",
          "Att veta när man ska skala är därför en av de viktigaste strategiska bedömningarna en founder gör. Det handlar om att läsa signaler rätt, inte om att vara modig.",
        ],
      },
      {
        heading: "Signal 1 — användare stannar av sig själva",
        paragraphs: [
          "Den starkaste signalen är retention. Kommer folk tillbaka utan att du knuffar dem? Om en stor del av användarna återvänder vecka efter vecka har du något som håller. Om de testar en gång och försvinner spelar tillväxttakten ingen roll — du fyller en hink med hål.",
          "Skala aldrig på toppen av en linje, eller på en lansering. Skala på en kurva som planar ut på en sund nivå och håller sig där. Det är beviset på att värdet är verkligt.",
        ],
      },
      {
        heading: "Signal 2 — tillväxt sker utan att du tvingar den",
        paragraphs: [
          "När användare rekommenderar produkten oombedda, när nya kommer in utan att du betalat för dem, när efterfrågan trycker på snabbare än du hinner med — det är en stark indikation på att marknaden vill ha det du byggt.",
          "Den sortens organisk dragning är svår att fejka. När du ser den är det ofta rätt tillfälle att lägga resurser på att möta efterfrågan i stället för att skapa den.",
        ],
      },
      {
        heading: "Signal 3 — ekonomin går ihop i liten skala",
        paragraphs: [
          "Innan du skalar måste grundekonomin fungera. Tjänar du mer på en kund över tid än vad det kostar att skaffa och behålla hen? Om svaret är nej förvärrar skalning bara problemet — du förlorar mer pengar, snabbare.",
          "Få enhetsekonomin att gå ihop i liten skala först. Då blir skalning att hälla bränsle på en eld som redan brinner, inte ett desperat försök att tända den.",
        ],
      },
      {
        heading: "Signalerna som lurar dig",
        paragraphs: [
          "Var försiktig med vanity-signaler: en viral topp, en räcka grattis från vänner, en lansering som trendar en dag. De känns som framgång men säger inget om varaktigt värde. Många team har skalat på en tillfällig spik och kraschat när den lade sig.",
          "Lita på de tråkiga, uthålliga måtten — retention, organisk tillväxt, sund ekonomi — framför de spännande engångshändelserna. Skalning belönar tålamod att vänta på rätt bevis.",
        ],
      },
    ],
  },
  /* ── Integrationer (e-handelskopplingar) ─────────────────────────────────── */
  {
    slug: "shopify-integration-guide",
    title: "Shopify-integration — så kopplar du ihop din butik smidigt",
    excerpt:
      "Behöver du koppla Shopify mot affärssystem, lager eller en egen tjänst? Här är vägarna in och fällorna att undvika.",
    description:
      "En praktisk guide till att integrera Shopify med externa system — API-modellen, webhooks, vanliga användningsfall och fallgropar.",
    category: "Integrationer",
    tags: ["shopify", "integration", "e-handel", "api"],
    readingTime: "8 min läsning",
    publishedAt: "2026-05-12",
    author: "VibeDev",
    heroLabel: "Integration",
    content: [
      {
        heading: "När behöver du en Shopify-integration?",
        paragraphs: [
          "Shopify räcker långt på egen hand, men så fort din verksamhet växer dyker behoven upp: order ska in i affärs- eller bokföringssystemet, lagersaldon ska stämma mot ett externt lager, kunddata ska synka mot ett CRM eller en egen tjänst ska få veta när ett köp sker.",
          "Den goda nyheten är att Shopify har ett av de mognaste API-ekosystemen bland e-handelsplattformarna. Den mindre goda är att det finns flera vägar in, och att välja fel väg gör underhållet onödigt tungt.",
        ],
      },
      {
        heading: "API-modellen: Admin API och webhooks",
        paragraphs: [
          "Det centrala är Admin API, där du läser och skriver ordrar, produkter, kunder och lager. För realtid kompletterar du med webhooks — Shopify meddelar din tjänst när något händer, till exempel att en order skapats, i stället för att du måste fråga om och om igen.",
          "Kombinationen är nästan alltid rätt: webhooks för att reagera snabbt på händelser, API-anrop för att hämta detaljer och hålla data i synk. Bygg på pollning bara där webhooks inte täcker behovet — det är dyrare och långsammare.",
        ],
      },
      {
        heading: "Respektera rate limits",
        paragraphs: [
          "Shopify begränsar hur många anrop du får göra, och vid trafiktoppar — kampanjer, rea, helger — är det lätt att slå i taket om varje händelse utlöser flera direktanrop. Resultatet blir strypta anrop och eftersläpande synk.",
          "Bygg ett kö- och retry-lager från start. Lägg arbete i en kö, processa i kontrollerad takt och hantera strypning med backoff. Koppla aldrig kundens checkout-upplevelse direkt till ett externt system som kan vara långsamt eller nere.",
        ],
      },
      {
        heading: "Gör synken idempotent och säkra dina webhooks",
        paragraphs: [
          "Webhooks kan levereras mer än en gång. Om samma order-händelse triggar din logik två gånger får du inte skapa dubbla bokföringsrader eller dubbla lageruttag. Använd order-id eller en idempotensnyckel så att en upprepad leverans är ofarlig.",
          "Verifiera också att webhooks faktiskt kommer från Shopify genom att kontrollera signaturen. En osignerad endpoint är en öppen dörr — vem som helst kan skicka falska händelser till ditt system.",
        ],
      },
      {
        heading: "Logga allt — du kommer behöva det",
        paragraphs: [
          "När en order inte dyker upp där den ska vill du snabbt kunna svara på vad som hände. Logga varje webhook, anrop och statusövergång med order-id som nyckel. Det förvandlar felsökning från en halv dags grävande till några minuter.",
          "En genomtänkt Shopify-integration är inte svår — men den kräver att du behandlar den som produktionskritisk infrastruktur, inte som ett skript du sätter upp och glömmer. Köer, idempotens, signaturer och loggning är vad som gör den pålitlig.",
        ],
      },
    ],
  },
  {
    slug: "starweb-integration-guide",
    title: "Starweb-integration — koppla din svenska e-handel rätt",
    excerpt:
      "Starweb är en populär svensk e-handelsplattform. Så kopplar du den mot affärssystem och egna tjänster utan att det blir spretigt.",
    description:
      "En praktisk guide till att integrera Starweb med externa system — vanliga användningsfall, API-modellen och de fällor vi sett oftast.",
    category: "Integrationer",
    tags: ["starweb", "integration", "e-handel", "api"],
    readingTime: "7 min läsning",
    publishedAt: "2026-05-14",
    author: "VibeDev",
    heroLabel: "Integration",
    content: [
      {
        heading: "Starweb i en svensk verksamhet",
        paragraphs: [
          "Starweb är en etablerad svensk e-handelsplattform, och många av integrationsbehoven är just därför väldigt svenska: koppling mot Fortnox eller Visma, frakt via svenska transportörer, och synk mot lager- eller affärssystem som verksamheten redan kör.",
          "Att integrationen är svensk i sin natur är en fördel — det finns etablerade mönster för det mesta. Men det betyder också att detaljer som momshantering och organisationsnummer måste sitta rätt, eftersom de landar direkt i bokföringen.",
        ],
      },
      {
        heading: "Förstå dataflödet innan du bygger",
        paragraphs: [
          "Den vanligaste fällan är att börja koda mot API:et innan man bestämt vad som faktiskt ska synka och åt vilket håll. Ska ordrar bara ut ur Starweb, eller ska lagersaldon också tillbaka in? Vem äger artikelregistret — butiken eller affärssystemet?",
          "Rita upp flödet först: vilka objekt (ordrar, produkter, kunder, lager) som rör sig, i vilken riktning och vad som är källan till sanning för varje. Den halvtimmen sparar dagar av omarbete senare.",
        ],
      },
      {
        heading: "Artikelnummer och moms är de tysta felkällorna",
        paragraphs: [
          "Precis som med andra e-handelsintegrationer är det artikelnummer och momssatser som ställer till det. Matchar artikelnumren mellan Starweb och affärssystemet, eller skapas dubbletter? Mappas momssatserna rätt så att bokföringen stämmer?",
          "Bestäm en tydlig strategi för hur artiklar matchas och hur moms översätts, och håll den konsekvent. Testa med blandade kundvagnar — olika momssatser, frakt, rabatter — innan lansering, inte efter.",
        ],
      },
      {
        heading: "Bygg robust mot avbrott",
        paragraphs: [
          "Externa system går ner, svarar långsamt eller stryper anrop. En synk som antar att allt alltid fungerar kommer att tappa ordrar tyst. Lägg arbete i en kö, försök igen vid fel med backoff och gör synken idempotent så att en upprepad körning inte dubbelbokför.",
          "Koppla aldrig kundens köpflöde direkt mot ett externt system i realtid. Ta emot ordern i Starweb, lägg synken i bakgrunden och larma om något fastnar — så blir en extern störning din interna notis i stället för kundens problem.",
        ],
      },
      {
        heading: "Logga och övervaka",
        paragraphs: [
          "Logga varje synkad order med tydlig referens, och larma aktivt när något fallerar. En tyst trasig integration upptäcks annars först i månadsskiftet när siffrorna inte stämmer — och då är felsökningen mycket dyrare.",
          "En välbyggd Starweb-integration är inte komplicerad, men den belönar omsorg om detaljerna. Får du dataflödet, momsen och felhanteringen rätt blir den något du sällan behöver tänka på igen.",
        ],
      },
    ],
  },
  {
    slug: "woocommerce-integration-guide",
    title: "WooCommerce-integration — flexibelt men med ansvar",
    excerpt:
      "WooCommerce ger dig full kontroll och full frihet. Här är hur du integrerar mot det utan att friheten blir en fälla.",
    description:
      "En praktisk guide till att integrera WooCommerce med externa system — REST API, webhooks, plugin-djungeln och vanliga fallgropar.",
    category: "Integrationer",
    tags: ["woocommerce", "integration", "e-handel", "wordpress"],
    readingTime: "8 min läsning",
    publishedAt: "2026-05-16",
    author: "VibeDev",
    heroLabel: "Integration",
    content: [
      {
        heading: "Frihet med baksida",
        paragraphs: [
          "WooCommerce bygger på WordPress och är öppet, flexibelt och anpassningsbart in i minsta detalj. Det är dess största styrka — och precis det som gör integrationer kluriga. Två WooCommerce-butiker kan vara byggda helt olika under ytan.",
          "Det betyder att du aldrig kan anta hur en specifik butik beter sig. Plugins, teman och anpassningar påverkar hur data ser ut och vad som händer vid en order. Börja alltid med att kartlägga den faktiska butiken, inte en idealbild av WooCommerce.",
        ],
      },
      {
        heading: "REST API och webhooks",
        paragraphs: [
          "WooCommerce har ett REST API för ordrar, produkter, kunder och lager, plus webhooks som meddelar din tjänst när något händer. Det är samma beprövade mönster som hos andra plattformar: webhooks för realtidshändelser, API för att hämta detaljer och hålla data i synk.",
          "Autentisering sker vanligtvis med API-nycklar. Förvara dem säkert, ge dem minsta möjliga behörighet och rotera dem om de läcker. En nyckel med full åtkomst i fel händer är ett allvarligt problem.",
        ],
      },
      {
        heading: "Akta dig för plugin-konflikter",
        paragraphs: [
          "Den vanligaste källan till mystiska buggar i WooCommerce-integrationer är andra plugins. Ett plugin som ändrar hur priser räknas, hur moms hanteras eller hur ordrar sparas kan tyst bryta dina antaganden. Det som fungerade i en testbutik fallerar i kundens skarpa miljö.",
          "Testa alltid mot en miljö som speglar produktionen, med samma plugins aktiva. Och var defensiv i koden — anta att data kan se annorlunda ut än dokumentationen lovar, och validera innan du litar på den.",
        ],
      },
      {
        heading: "Prestanda och driftansvar",
        paragraphs: [
          "Eftersom WooCommerce kör på WordPress delar din butik resurser med allt annat på samma installation. Tunga API-anrop kan påverka butikens prestanda, särskilt under trafiktoppar. Håll anropen effektiva, hämta bara det du behöver och undvik att hamra API:et i onödan.",
          "Till skillnad från en hostad plattform ligger driftansvaret på ägaren. Det betyder att uppdateringar av WordPress, WooCommerce eller plugins kan ändra beteendet under dina fötter. En robust integration är förlåtande och larmar när något oväntat dyker upp.",
        ],
      },
      {
        heading: "Gör det robust och spårbart",
        paragraphs: [
          "Som med all e-handelsintegration: lägg synken i en kö, gör den idempotent, verifiera webhooks och logga varje order med tydlig referens. Det är de principerna som gör skillnaden mellan en koppling du litar på och en du ständigt felsöker.",
          "WooCommerce belönar den som respekterar dess öppenhet. Bygg med marginal för att butiken är anpassad, så får du en flexibel integration som håller — i stället för en skör som spricker vid nästa plugin-uppdatering.",
        ],
      },
    ],
  },
  {
    slug: "prestashop-integration-guide",
    title: "PrestaShop-integration — så kopplar du din butik rätt",
    excerpt:
      "PrestaShop är kraftfullt och vanligt i Europa. Här är hur du integrerar mot det och vad du ska tänka på med dess datamodell.",
    description:
      "En praktisk guide till att integrera PrestaShop med externa system — webservice-API:et, datamodellen, versionsskillnader och vanliga fallgropar.",
    category: "Integrationer",
    tags: ["prestashop", "integration", "e-handel", "api"],
    readingTime: "7 min läsning",
    publishedAt: "2026-05-18",
    author: "VibeDev",
    heroLabel: "Integration",
    content: [
      {
        heading: "PrestaShop och dess egenheter",
        paragraphs: [
          "PrestaShop är en kraftfull, öppen e-handelsplattform som är spridd i Europa. Den har ett eget webservice-API och en datamodell som är rikare — och mer egensinnig — än många andra plattformars. Det ger flexibilitet, men kräver att du förstår hur den hänger ihop innan du bygger.",
          "Den som närmar sig PrestaShop med antaganden från andra plattformar blir ofta överraskad. Det lönar sig att läsa på om just dess struktur först, snarare än att gissa.",
        ],
      },
      {
        heading: "Webservice-API:et",
        paragraphs: [
          "PrestaShop exponerar ett webservice-API där du kommer åt ordrar, produkter, kunder och lager. Åtkomst styrs via en API-nyckel med konfigurerbara behörigheter — ge nyckeln bara åtkomst till de resurser integrationen faktiskt behöver, inte mer.",
          "API:et är XML-orienterat i grunden, vilket kan kännas omständligt om du är van vid renare JSON-API:er. Räkna med att lägga lite extra tid på att hantera formatet, och bygg ett tydligt lager mellan API:et och din egen logik så att egenheterna inte sprider sig genom hela koden.",
        ],
      },
      {
        heading: "Datamodellen kräver respekt",
        paragraphs: [
          "PrestaShop hanterar mycket via relaterade objekt: produkter har kombinationer och attribut, priser påverkas av regler och grupper, och flerspråkighet är inbyggt på fältnivå. Ett 'enkelt' fält som produktnamn kan finnas i flera språkversioner samtidigt.",
          "Kartlägg noga hur de objekt du bryr dig om hänger ihop innan du läser eller skriver. Att missa en relation — till exempel hur en produktvariant kopplas till lagersaldo — leder till data som ser rätt ut men beter sig fel.",
        ],
      },
      {
        heading: "Hantera versionsskillnader",
        paragraphs: [
          "PrestaShop har funnits länge och olika större versioner skiljer sig åt i både API och datamodell. En integration byggd mot en version kan bete sig annorlunda mot en annan. Ta alltid reda på exakt vilken version butiken kör innan du bygger.",
          "Bygg defensivt och validera den data du får tillbaka i stället för att lita blint på en dokumentationsversion. Och testa mot en miljö som speglar den skarpa butiken, med rätt version och konfiguration.",
        ],
      },
      {
        heading: "Robusthet och loggning, som alltid",
        paragraphs: [
          "Grundprinciperna är desamma som för alla e-handelsintegrationer: lägg synken i en kö, gör den idempotent, försök igen vid fel och logga varje order med tydlig referens. Larma aktivt när något fallerar, så att en trasig integration syns direkt och inte först i bokföringen.",
          "PrestaShop belönar förberedelse. Lägg tiden på att förstå datamodellen och versionen i förväg, bygg ett rent lager mot det egensinniga API:et, och du får en koppling som håller över tid i stället för en som ständigt överraskar.",
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
