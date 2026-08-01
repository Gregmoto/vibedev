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
    slug: "fran-vercel-till-cloudflare-workers",
    title: "Vi flyttade vibedev.se från Vercel till Cloudflare Workers — det här gick sönder",
    excerpt:
      "En Next.js-app på Cloudflare låter som en konfigurationsändring. Det är det inte. Här är de fyra sakerna som faktiskt stoppade oss — och hur vi löste dem.",
    description:
      "Vi migrerade vibedev.se från Vercel till Cloudflare Workers via OpenNext. Konkret genomgång av middleware som inte kan köras, Prisma på edge, Hyperdrive och certifikatglappet vid domänbytet.",
    category: "Tekniska val",
    tags: ["cloudflare workers", "opennext", "next.js", "prisma", "hyperdrive", "migrering"],
    readingTime: "9 min läsning",
    publishedAt: "2026-08-01",
    author: "VibeDev",
    heroLabel: "Från vår egen kodbas",
    content: [
      {
        heading: "Varför vi flyttade",
        paragraphs: [
          "Vår egen sajt låg på Vercel. Vi bygger sedan en tid tillbaka flera av våra kundprojekt på Cloudflare Workers, och det blev svårt att motivera varför vår egen sajt skulle ligga någon annanstans än där vi rekommenderar andra att ligga.",
          "Planen såg enkel ut: byt adapter, peka om domänen, klart. Verkligheten var fyra konkreta stopp. Ingen av dem stod i en snabbstartsguide, så vi skriver ner dem här.",
          "Kort om upplägget: Next.js kör på Cloudflare Workers genom OpenNext, som paketerar appen till en Worker. Databasen ligger kvar i Postgres hos Supabase.",
        ],
      },
      {
        heading: "Stopp 1: middleware kan inte köras alls",
        paragraphs: [
          "Vår adminpanel skyddades av middleware — en fil som körs före varje förfrågan och kontrollerar inloggning. Det är standardmönstret i Next.js.",
          "Problemet: i Next.js 16 döptes middleware om och kör numera i Node-miljö, medan OpenNext bara stödjer edge-varianten. Två lager som utvecklats åt olika håll. Det gick inte att tvinga fram — vi försökte, och byggverktyget svarade rakt ut att kombinationen inte finns.",
          "Lösningen blev att sluta använda middleware. Vi flyttade de skyddade adminsidorna till en egen mapp med en gemensam layout som kontrollerar inloggningen på serversidan innan något renderas. Inloggningssidan ligger utanför. Adresserna är oförändrade, skyddet är likvärdigt — och det som blev av med sig var beroendet till ett lager som inte kunde köras.",
          "Lärdomen: middleware känns som infrastruktur men är i praktiken applikationslogik. Ligger den i en layout i stället är den lättare att flytta.",
        ],
      },
      {
        heading: "Stopp 2: Prisma pratar inte TCP på Workers",
        paragraphs: [
          "Den här var den verkliga tröskeln. En vanlig databasanslutning öppnar en TCP-socket. Cloudflare Workers kan inte öppna sockets på det sättet.",
          "Vi behövde tre saker samtidigt. Först Cloudflare Hyperdrive, som sitter framför databasen och ger Workern en anslutning den kan använda — plus pooling på köpet. Sedan en driver-adapter i Prisma i stället för standardklienten. Och slutligen ett litet paket som låter drivrutinen använda Cloudflares egna sockets.",
          "Sedan kom en fälla till: Prisma försökte ladda sin inbyggda motor, som inte finns i den här miljön. Felmeddelandet handlade om filsystemsanrop som inte är implementerade, vilket inte alls pekar mot orsaken. Rätt lösning var att inte ange någon egen output-katalog för den genererade klienten och att markera Prisma som externt paket i bygget — då kan byggverktyget anpassa klienten för miljön.",
          "En sista detalj som är lätt att missa: på Workers får en anslutningspool inte återanvändas mellan förfrågningar. Klienten måste skapas per förfrågan. Vi löste det med en tunn omslagsfunktion, vilket innebar att inget av de nästan tjugo ställen som använder databasen behövde skrivas om.",
        ],
      },
      {
        heading: "Stopp 3: byggverktyget tog med databasen i webbläsarpaketet",
        paragraphs: [
          "Mitt i migreringen började bygget klaga på att det inte hittade moduler som `net`, `dns` och `fs`. Det är Node-funktioner som inte finns i en webbläsare — och de skulle aldrig hamna där.",
          "Orsaken visade sig vara en enda importrad. En liten hjälpfunktion för att formatera länkar låg i samma fil som databasanropen. En klientkomponent importerade den funktionen — och drog därmed med sig hela databaslagret in i webbläsarpaketet.",
          "Fixen var att bryta ut de rena hjälpfunktionerna till en egen fil utan databasberoenden. Det tog fem minuter när vi väl förstod vad som hände.",
          "Detta är värt att ta med sig även om du inte migrerar någonstans: en `import` är inte gratis. Den drar med sig allt filen råkar innehålla.",
        ],
      },
      {
        heading: "Stopp 4: sajten var nere en stund vid domänbytet",
        paragraphs: [
          "När vi kopplade domänen till Workern slutade sajten svara i ungefär tio minuter. Inget var trasigt — Cloudflare höll på att utfärda SSL-certifikatet för domänen, och innan det är klart finns det inget att svara med.",
          "Det står i dokumentationen att det kan ta upp till femton minuter, men i stunden ser det ut som ett haveri. Vi kontrollerade i loggarna att Workern var frisk och att det bara var certifikatet som saknades, och väntade ut det.",
          "Planera in det glappet. Gör bytet när trafiken är låg, och ha kvar den gamla miljön så att du kan peka tillbaka om något faktiskt är fel.",
        ],
      },
      {
        heading: "Vad vi skulle gjort annorlunda",
        paragraphs: [
          "Vi skulle testat databasanslutningen först. Alla fyra stoppen utom det sista handlade i grunden om att koden antog en Node-miljö, och det är databaslagret som avslöjar det snabbast. En halvdag på just den biten hade sparat oss omvägar.",
          "Vi skulle också deployat till en tillfällig testadress innan vi rörde domänen. Det gjorde vi till slut, och det var där vi kunde verifiera att databasen faktiskt svarade — utan att någon besökare påverkades.",
          "Var det värt det? Ja. Sajten körs nu på samma stack som vi bygger kundprojekt på, vilket gör att erfarenheterna går åt båda hållen. Men det var en migrering, inte en inställning.",
        ],
      },
      {
        heading: "Kort checklista om du står inför samma sak",
        paragraphs: [
          "Kontrollera databaslagret först — det är där de flesta antaganden om Node sitter. Kontrollera om du använder middleware och vad den gör. Räkna med att paketeringen kan behöva justeras för paket som talar med nätverket eller filsystemet.",
          "Deploya till en testadress och verifiera hela kedjan där: sidvisning, databasläsning, inloggning och formulär. Rör domänen sist, och först när testadressen är grön.",
          "Behöver ni hjälp med en liknande flytt? Titta på våra tjänster eller hör av er — vi har gjort den här resan på vår egen sajt och i kundprojekt.",
        ],
      },
    ],
  },
  {
    slug: "wordpress-till-next-js-utan-att-tappa-google",
    title: "Från WordPress till Next.js utan att tappa Google-rankningen",
    excerpt:
      "Den största risken med att lämna WordPress är inte tekniken — det är länkarna. Så här flyttade vi ett innehållstungt magasin utan att en enda adress dog.",
    description:
      "Praktisk genomgång av hur du migrerar från WordPress till Next.js och behåller din SEO: omdirigeringar, bilder som slutar fungera vid DNS-bytet, och vad som måste göras före cutover.",
    category: "Tekniska val",
    tags: ["wordpress", "next.js", "migrering", "seo", "redirects", "webbprestanda"],
    readingTime: "8 min läsning",
    publishedAt: "2026-07-28",
    author: "VibeDev",
    heroLabel: "Ur ett kundprojekt",
    content: [
      {
        heading: "Risken ligger inte där du tror",
        paragraphs: [
          "När företag lämnar WordPress handlar oron nästan alltid om tekniken: klarar vi att bygga om allt? Går innehållet att flytta?",
          "Den verkliga risken är en annan. En sajt med några års artiklar har rankning i Google och länkar utifrån som pekar på specifika adresser. Bryts de adresserna försvinner trafiken — och för en annonsfinansierad sajt försvinner intäkten med den.",
          "Vi gjorde den här flytten för Powerbike, ett svenskt magasin om MC, moped, ATV, snöskoter och cykel. Det som följer är vad vi faktiskt gjorde.",
        ],
      },
      {
        heading: "Adresserna: 399 omdirigeringar",
        paragraphs: [
          "WordPress körde adresser i formen år/artikelnamn. Den nya sajten har en plattare struktur utan årtal, vilket är bättre långsiktigt — en artikel som fortfarande är relevant ska inte se gammal ut i adressfältet.",
          "Alternativet hade varit att behålla den gamla formen för att slippa problemet. Vi valde i stället att generera en permanent omdirigering per artikel. Det blev 399 stycken.",
          "Permanent är nyckelordet. En permanent omdirigering talar om för Google att adressen har flyttat för gott, och rankningen följer med. En tillfällig gör det inte.",
          "Uppslagningen sker i utkanten av nätet med cache, så databasen belastas som mest en gång per adress och timme. En besökare som klickar på en fem år gammal länk märker ingenting.",
        ],
      },
      {
        heading: "Bilderna: 113 filer som skulle ha dött",
        paragraphs: [
          "Det här är den detalj som är lättast att missa och dyrast att missa. Artiklarnas bilder låg på WordPress-installationen. I samma sekund som domänen pekas om till den nya sajten slutar den gamla servern nås — och varenda bild i varenda artikel blir en trasig ruta.",
          "Vi hämtade hem samtliga 113 bilder innan bytet, konverterade dem till ett modernt format i tre storlekar och skrev om artiklarnas innehåll så att de pekar på de nya filerna.",
          "Skriptet som gjorde det kör i torrläge som standard och kräver ett explicit kommando för att faktiskt skriva. Vid en engångsoperation som rör hela arkivet vill man se vad som kommer att hända innan det händer.",
        ],
      },
      {
        heading: "Innehållet: från fritext till struktur",
        paragraphs: [
          "WordPress sparar artiklar som ett fält med fri HTML. Det fungerar, men gör innehållet svårt att återanvända — samma artikel kan inte enkelt visas annorlunda på mobil, och det går inte att lägga in en annonsplats mitt i texten utan att klistra in kod.",
          "Vi byggde i stället upp artiklar av block: text, bild, citat, faktaruta, annonsplats och affiliatelänk. Redaktionen ser fortfarande en vanlig editor, men innehållet är strukturerat under ytan.",
          "En konkret vinst: tester har egna fält för betygskriterier och pris. Det gör att samma data både visas enhetligt på sidan och kan levereras till Google som strukturerad information, vilket gör att betyg kan synas direkt i sökresultaten.",
        ],
      },
      {
        heading: "Ordningen som gör att det inte blir dramatiskt",
        paragraphs: [
          "Importera innehållet först och kontrollera antalet. I vårt fall bearbetades 61 poster, 60 importerades och en hoppades över medvetet eftersom den hamnat i fel kategori. Noll misslyckade, noll adresskrockar. Den sortens rapport ska du ha innan du går vidare.",
          "Hämta hem bilderna. Generera omdirigeringarna och testa ett urval av dem mot den nya sajten innan domänen rörs.",
          "Peka om domänen sist. Låt den gamla installationen ligga kvar en tid — inte som backup för innehållet, utan så att du kan gå tillbaka om något oväntat dyker upp.",
          "Efter bytet: skicka in den nya sitemapen i Google Search Console och håll ett öga på rapporten över adresser som inte hittas. Den avslöjar snabbt om någon omdirigering saknas.",
        ],
      },
      {
        heading: "Vad du får på andra sidan",
        paragraphs: [
          "En sajt utan plugins som ska hållas uppdaterade och utan de säkerhetsuppdateringar som följer med dem. Innehåll som ligger strukturerat och går att använda på flera sätt. Och sidor som laddar snabbt eftersom de inte drar in ett dussin tredjepartsskript.",
          "Det sista är inte en detalj för en annonsfinansierad sajt. Laddtid påverkar både hur många som stannar och hur Google värderar sidan.",
          "Funderar ni på att lämna WordPress? Läs mer om hur vi jobbar under tjänster, eller hör av er så tittar vi på er sajt.",
        ],
      },
    ],
  },
  {
    slug: "10-hemsideideer-2026",
    title: "10 idéer på hemsidor och webbappar att bygga 2026",
    excerpt:
      "Idéer som löser ett konkret problem, går att avgränsa och faktiskt kan tjäna pengar. Ingen av dem kräver ett stort team för att komma igång.",
    description:
      "Tio konkreta idéer på hemsidor, webbappar och system att bygga under 2026 — med vad som gör varje idé rimlig att avgränsa, vad den kan tjäna pengar på och vilka fallgropar som finns.",
    category: "Produktstrategi",
    tags: ["hemsida", "webbapp", "produktidéer", "2026", "saas", "mvp"],
    readingTime: "10 min läsning",
    publishedAt: "2026-07-22",
    author: "VibeDev",
    heroLabel: "Idéer & inspiration",
    content: [
      {
        heading: "Vad som gör en idé byggbar",
        paragraphs: [
          "De flesta produktidéer stupar inte på tekniken utan på omfattningen. En idé som kräver att tre användargrupper finns på plats samtidigt för att vara värd något är svår att starta. En idé som är värdefull för en enda användare från dag ett är det inte.",
          "Idéerna nedan har det gemensamt att de går att avgränsa. Du kan bygga en liten version, visa den för någon och få veta om du är på rätt spår.",
          "En sak till: ingen av idéerna är värd något i sig. Värdet ligger i att du kan något om just den branschen, eller är beredd att lära dig. Det är den delen som inte går att köpa.",
        ],
      },
      {
        heading: "1–3: Verktyg som ersätter ett kalkylark",
        paragraphs: [
          "Bokningssystem för en smal bransch. Generella bokningssystem finns i mängd, men de förstår inte att en hundtrim tar olika lång tid beroende på ras, eller att en däckverkstad behöver veta bilmodellen. Att bygga för en enda bransch gör produkten skarpare och säljet enklare.",
          "Offert- och kalkylverktyg för hantverkare. Många räknar fortfarande offerter i Excel och skickar dem som PDF via mejl. Ett verktyg som håller reda på prislistor, räknar fram totalen och låter kunden godkänna digitalt löser ett dagligt irritationsmoment.",
          "Internt system för schemaläggning och avvikelser. Nästan varje verksamhet med personal i skift har ett kalkylark som någon äger och som går sönder när den personen är sjuk. Det är sällan tekniskt svårt — värdet ligger i att förstå just den arbetsplatsens regler.",
        ],
      },
      {
        heading: "4–6: Produkter byggda på öppna data",
        paragraphs: [
          "Sökbar tjänst ovanpå ett offentligt register. Sverige publicerar stora mängder data gratis — bolagsinformation, fastighetsdata, upphandlingar, statistik. Datan är sällan trevlig att jobba med, och det är just där värdet ligger: den som gör den sökbar och begriplig har byggt något användbart. Vi har gjort detta med Bolagsdata API, byggt på data från Bolagsverket och SCB.",
          "Bevaknings- och notistjänst. Samma data, annan vinkel: i stället för att användaren söker, säger den till när något ändras. Ett nytt bolag i en bransch, en ny upphandling i en kommun, en ändring i ett register. Prenumeration är en naturlig affärsmodell.",
          "Jämförelsetjänst för en avgränsad marknad. Fungerar när priser eller villkor är svåra att överblicka och det finns en tydlig affärsmodell — förmedling, annonsering eller premiumfunktioner. Kräver att du kan hålla datan aktuell, vilket är den verkliga kostnaden.",
        ],
      },
      {
        heading: "7–8: Innehåll och community",
        paragraphs: [
          "Nischat magasin med egen annonsförsäljning. Ett redaktionellt fokus som är smalt nog att annonsörer vet att de når rätt personer. Vi har byggt detta för Powerbike inom motor och fordon, med eget annonssystem, betalt företagsregister och affiliatelänkar som fyra separata intäktsben.",
          "Community kring ett specifikt intresse. Svårare än det ser ut, eftersom värdet uppstår först när det finns medlemmar. Fungerar bäst när det finns ett verktyg som är användbart för en ensam användare — en samling, en logg, en kalender — och där gemenskapen är ett lager ovanpå.",
        ],
      },
      {
        heading: "9–10: E-handel och AI där det gör nytta",
        paragraphs: [
          "Webbshop för produkter som kräver rådgivning. Sortiment där kunden behöver veta att något passar — reservdelar till en specifik modell, produkter med storleksguide, varor som kräver konfiguration. Här räcker inte en standardbutik, och det är precis vad som gör idén värd att bygga.",
          "AI som gör en avgränsad uppgift, inte allt. De AI-funktioner som faktiskt används löser ett specifikt moment: sammanfatta ett dokument, föreslå en produkttext, klassificera inkommande ärenden. Bygg det som en funktion i en produkt som är värdefull även utan AI. En chattruta ovanpå något ingen ville ha förblir något ingen vill ha.",
        ],
      },
      {
        heading: "Innan du börjar bygga",
        paragraphs: [
          "Prata med fem personer som har problemet. Inte för att fråga om de skulle använda det — det svarar folk artigt ja på — utan för att förstå hur de löser det idag. Om svaret är ett kalkylark har du något. Om svaret är att de inte gör något alls är problemet kanske inte tillräckligt stort.",
          "Avgränsa till en användare och ett flöde. Bygg det ordentligt. Lägg till resten när någon efterfrågar det.",
          "Vi hjälper gärna till att skära scopet innan en rad kod skrivs. Läs mer om hur vi jobbar, eller titta på projekt vi byggt.",
        ],
      },
    ],
  },
  {
    slug: "soka-i-miljontals-rader-postgres",
    title: "Så fick vi en sökning över 3,5 miljoner företag från 50 sekunder till 1",
    excerpt:
      "Den naiva sökningen fungerar utmärkt i utveckling och kollapsar i produktion. Här är trappan i fyra steg som löste det — utan att byta databas.",
    description:
      "Konkret genomgång av hur vi optimerade fritextsökning i PostgreSQL över 3,5 miljoner rader: fyrstegssökning, index, begränsad kandidatmängd och tidsbudget mot databasen.",
    category: "Tekniska val",
    tags: ["postgresql", "sökning", "prestanda", "fulltext", "databas", "skalbarhet"],
    readingTime: "8 min läsning",
    publishedAt: "2026-07-18",
    author: "VibeDev",
    heroLabel: "Ur ett kundprojekt",
    content: [
      {
        heading: "Problemet som inte syns i utveckling",
        paragraphs: [
          "När vi byggde Bolagsdata API — en sökbar databas över Sveriges företag — fungerade sökningen fint under utvecklingen. Med några tusen testrader svarade allt direkt.",
          "Med hela registret inläst, 3,5 miljoner företag, tog vissa sökningar närmare en minut. Det är inte långsamt, det är trasigt.",
          "Det intressanta är varför. Det handlade inte om att databasen var för liten eller fel vald. Det handlade om att vi bad den göra något orimligt.",
        ],
      },
      {
        heading: "Varför breda sökord fäller en databas",
        paragraphs: [
          "En sökning på ett ovanligt ord är billig: databasen hittar tio träffar och är klar. En sökning på ett vanligt ord är dyr på ett sätt som är lätt att underskatta.",
          "Sök på \"bygg\" i ett svenskt företagsregister och du matchar över 200 000 bolag. Databasen måste då rangordna alla dessa för att kunna visa de tjugo bästa. Användaren kommer aldrig att se träff nummer 4 000 — men arbetet görs ändå.",
          "Det är den insikten hela lösningen bygger på: att inte göra arbete vars resultat ingen kommer att titta på.",
        ],
      },
      {
        heading: "Trappan i fyra steg",
        paragraphs: [
          "Vi byggde om sökningen som en trappa där varje steg är dyrare än det förra, och där vi slutar så fort vi har tillräckligt.",
          "Steg 1: ser frågan ut som ett organisationsnummer? Då är det en direktträff mot ett index. Klart på millisekunder, och det täcker en stor andel av verkliga sökningar.",
          "Steg 2: rena filter. Ort, bolagsform, status — sådant som går mot indexerade kolumner och skär bort merparten av registret innan textsökningen ens börjar.",
          "Steg 3: fulltextsökning med svensk språkhantering, så att böjningar av samma ord hittar varandra. Detta går mot ett index byggt för ändamålet.",
          "Steg 4: fuzzy-matchning som fångar felstavningar — men bara om fulltexten gav för få träffar, och bara på första sidan. Det är det överlägset dyraste steget, och det körs därför nästan aldrig.",
        ],
      },
      {
        heading: "Två knep som gjorde större skillnad än väntat",
        paragraphs: [
          "Tak på antal kandidater. Vid rangordning tittar vi på maximalt några tusen träffar. Sökningen på \"bygg\" rangordnar alltså inte 200 000 rader utan ett urval. Resultatet användaren ser blir i praktiken detsamma; arbetet blir en bråkdel.",
          "Tidsbudget mot databasen. Startsidan hämtar tre listor parallellt med ett tak på några sekunder. Hinner en fråga inte klart visas den kolumnen tom i stället för att hela sidan väntar. En sida som laddar med en tom lista är oändligt mycket bättre än en sida som inte laddar.",
          "Effekten sammanlagt: tunga sökningar gick från cirka 50 sekunder till ungefär 1. Branschsidor från 69 sekunder till 0,2. Startsidans svarstid från 31 sekunder till 0,06.",
        ],
      },
      {
        heading: "Vad vi inte gjorde",
        paragraphs: [
          "Vi lade inte till en separat sökmotor. Det hade fungerat, men infört ett system till att drifta, synka och hålla i liv — för ett problem som gick att lösa i databasen vi redan hade.",
          "Vi använde inte heller något ORM-lager för sökningen. Den är skriven som databasfunktioner i ren SQL, eftersom det är där prestandan avgörs och man vill ha exakt kontroll över vad som körs.",
          "Regeln vi tar med oss: lägg inte till ett system förrän du har konstaterat att det befintliga faktiskt inte räcker. Ofta är svaret att man ber det om fel sak.",
        ],
      },
      {
        heading: "Om du sitter med något liknande",
        paragraphs: [
          "Börja med att mäta vad som faktiskt är långsamt, med produktionslik datamängd. Testdata på några tusen rader döljer precis den här klassen av problem.",
          "Fråga sedan för varje steg: gör vi arbete vars resultat ingen kommer att se? Det är oftast där tiden ligger.",
          "Vi hjälper gärna till med prestandaarbete på befintliga system. Läs mer under tjänster eller hör av er.",
        ],
      },
    ],
  },
  {
    slug: "personnummer-i-svensk-bolagsdata",
    title: "Fällan i svensk bolagsdata: organisationsnumret kan vara ett personnummer",
    excerpt:
      "Bygger du något på svenska företagsregister sitter du sannolikt på personuppgifter utan att veta om det. Här är varför — och vad som faktiskt krävs.",
    description:
      "För enskilda näringsidkare är organisationsnumret ett personnummer. Vad det innebär för dig som bygger på svensk bolagsdata, och hur vi löste det tekniskt.",
    category: "Tekniska val",
    tags: ["gdpr", "personuppgifter", "bolagsdata", "öppna data", "databas", "integritet"],
    readingTime: "7 min läsning",
    publishedAt: "2026-07-15",
    author: "VibeDev",
    heroLabel: "Ur ett kundprojekt",
    content: [
      {
        heading: "Detaljen som ändrar allt",
        paragraphs: [
          "Svensk företagsdata är offentlig och avgiftsfri. Bolagsverket och SCB publicerar den öppet, och det är fullt tillåtet att bygga produkter på den.",
          "Men det finns en detalj som är lätt att missa: för enskilda näringsidkare är organisationsnumret personens personnummer. Det är inte ett undantag i marginalen — det rör en stor del av registret.",
          "Ett register över svenska företag är därmed också ett register över personnummer. Och personnummer är personuppgifter, oavsett att de kommer från en offentlig källa.",
        ],
      },
      {
        heading: "Varför det inte räcker att dölja i gränssnittet",
        paragraphs: [
          "Den intuitiva lösningen är att inte visa numret på sidan. Det räcker inte, av två skäl.",
          "För det första: om numret finns i svaret från servern spelar det ingen roll att gränssnittet inte visar det. Det går att läsa i webbläsarens utvecklarverktyg, och det följer med i varje anrop mot ett publikt API.",
          "För det andra: adressen till sidan innehåller ofta numret. En länk som går att dela blir därmed en delad personuppgift — även om själva sidan inte visar något känsligt.",
        ],
      },
      {
        heading: "Vad vi gjorde i stället",
        paragraphs: [
          "Maskering i alla publika svar. Numret kortas ner så att bara den ofarliga delen återstår. Det sker i databasen, inte i applikationskoden — så att samma skydd gäller oavsett vilken väg datan hämtas.",
          "Slumpade tokens i adresser. I stället för numret ligger en slumpad identifierare i länkar och i sitemapen. Adressen fungerar, går att dela och kan indexeras av sökmotorer — utan att exponera någon personuppgift.",
          "Behörighet på kolumnnivå. Det här är den bit som är lätt att slarva med. Vanliga radbaserade behörighetsregler i Postgres kan avgöra vilka *rader* någon får se, men de kan inte filtrera bort enskilda *kolumner*. Vi fick därför dra in läsrättigheten på tabellen och dela ut den kolumn för kolumn.",
        ],
      },
      {
        heading: "En fallgrop i själva behörighetsarbetet",
        paragraphs: [
          "En detalj som kostade oss tid: en behörighet på hela tabellen åsidosätter behörigheter på enskilda kolumner. Det räcker alltså inte att lägga till kolumnbehörigheter — den bredare rättigheten måste först tas bort, annars gäller den fortfarande.",
          "En annan: en kolumn behöver läsrättighet även om den bara används för att filtrera, aldrig visas. Villkoret läser kolumnen, och utan rättighet får du ett felmeddelande som inte alls pekar mot orsaken.",
          "Ordningen mellan deploy och databasändring blev också viktig. Drar du in rättigheter innan applikationen som slutat använda dem är uppe får du fel i produktion. Vi dokumenterade ordningen direkt i migrationsfilen, eftersom det inte är något man minns om ett halvår.",
        ],
      },
      {
        heading: "Checklista om du bygger på svensk bolagsdata",
        paragraphs: [
          "Kontrollera om ditt dataset innehåller enskilda firmor. Gör det, innehåller det personnummer.",
          "Utgå från vad som lämnar servern, inte vad som visas i gränssnittet. Granska API-svar, sitemaps, exportfiler och loggar.",
          "Lägg skyddet så djupt ner som möjligt — helst i databasen. Skydd som ligger i ett enskilt gränssnitt gäller bara det gränssnittet.",
          "Och tänk på adresserna. De är lätta att glömma och de sprids vidare av sig själva.",
        ],
      },
      {
        heading: "Offentligt betyder inte fritt fram",
        paragraphs: [
          "Att en uppgift är offentlig betyder att den får hämtas. Det betyder inte att den får spridas hur som helst, i vilken volym som helst, i vilket format som helst.",
          "Skillnaden mellan att slå upp ett enskilt bolag och att kunna ladda ner en miljon personnummer i en fil är hela poängen med dataskyddsreglerna.",
          "Bygger ni något på öppna data och vill ha ett par ögon på hanteringen? Hör gärna av er.",
        ],
      },
    ],
  },
  {
    slug: "hyra-eller-kopa-hemsida",
    title: "Hyra eller köpa hemsida — vad passar din verksamhet?",
    excerpt:
      "Att köpa en hemsida är en investering med en engångskostnad. Att hyra är en driftskostnad med löpande underhåll. Här är skillnaden i praktiken.",
    description:
      "Genomgång av skillnaden mellan att köpa och hyra hemsida: kostnadsstruktur, ägande, underhåll och vilka verksamheter som passar för respektive modell.",
    category: "Produktstrategi",
    tags: ["hyra hemsida", "hemsida kostnad", "webbyrå", "abonnemang", "drift", "underhåll"],
    readingTime: "7 min läsning",
    publishedAt: "2026-07-11",
    author: "VibeDev",
    heroLabel: "Så tänker vi",
    content: [
      {
        heading: "Två sätt att betala för samma sak",
        paragraphs: [
          "När du behöver en ny hemsida finns i grunden två upplägg. Antingen betalar du en engångssumma för att få den byggd och äger den sedan. Eller så betalar du en löpande avgift och får den byggd, driftad och underhållen så länge avtalet gäller.",
          "Ingen av modellerna är bättre än den andra. De passar olika verksamheter och olika situationer.",
          "Det som ofta glöms bort i jämförelsen är att en köpt hemsida inte är klar när den är levererad. Den behöver fortfarande hosting, certifikat, uppdateringar, säkerhetsrättningar och backup. De kostnaderna försvinner inte — de flyttar bara till dig.",
        ],
      },
      {
        heading: "Vad som faktiskt kostar efter lansering",
        paragraphs: [
          "En hemsida som ingen rör är en hemsida som långsamt går sönder. Ramverk får säkerhetsuppdateringar. Certifikat ska förnyas. Integrationer ändrar sina gränssnitt. Backup ska tas — och, viktigare, testas.",
          "För många mindre verksamheter blir det här den verkliga kostnaden. Inte bygget, utan att det inte finns någon som äger sajten efter leverans. Ett år senare är den långsam, ett år till och den slutar fungera.",
          "Den som köper en hemsida behöver alltså också bestämma vem som sköter den — internt eller inköpt. Räknar man in det blir jämförelsen mellan modellerna mer rättvis.",
        ],
      },
      {
        heading: "Så ser vår hyrmodell ut",
        paragraphs: [
          "Vi har en startavgift på 4 999 kr. Månadsavgiften bestäms av projektets omfattning och anges i offerten — en enkel företagssida och ett större skräddarsytt system är inte samma sak, och vi tycker inte att de ska kosta samma sak.",
          "I månadsavgiften ingår hosting, SSL, drift och löpande underhåll, backup, support och ett avtalat antal timmar ändringar per månad. Antalet timmar bestäms i offerten.",
          "Det som kan tillkomma är domän, samt tjänster som kräver egna abonnemang — exempelvis AI-konton eller SMS-utskick.",
          "Ingen bindningstid, tre månaders uppsägningstid. Vi äger lösningen så länge du hyr den; du äger ditt innehåll, din data och din domän. Utköp är möjligt, och villkoren står i offerten.",
        ],
      },
      {
        heading: "När hyra passar bättre",
        paragraphs: [
          "När du inte har någon som sköter tekniken internt och inte vill ha det. Då är det löpande underhållet inte en extra kostnad utan hela poängen.",
          "När du vill ha förutsägbara kostnader i stället för en stor engångsutgift. Särskilt i ett tidigt skede, där kapitalet gör mer nytta i verksamheten.",
          "När sajten behöver ändras löpande. Ingår ett antal timmar varje månad blir småjusteringar en självklarhet i stället för ett litet projekt varje gång.",
        ],
      },
      {
        heading: "När köpa passar bättre",
        paragraphs: [
          "När ni har egen teknisk kompetens och vill äga och vidareutveckla lösningen själva.",
          "När sajten är en central del av affären och ni vill ha full kontroll över koden, hostingen och takten.",
          "När ni redan har en förvaltningsbudget och en tydlig plan för vem som gör vad efter lansering.",
        ],
      },
      {
        heading: "Frågan som avgör",
        paragraphs: [
          "Vem sköter sajten om ett år? Har ni ett tydligt svar på den frågan fungerar båda modellerna. Har ni inte det är hyrmodellen sannolikt tryggare — då är underhållet någon annans ansvar i stället för något som glöms bort.",
          "Vill du veta vad hyrmodellen skulle kosta för just ditt projekt? Skicka en offertförfrågan så räknar vi ut månadskostnaden utifrån omfattningen. Föredrar ni att köpa lösningen tittar vi gärna på det i stället.",
        ],
      },
    ],
  },
  {
    slug: "annonser-utan-att-sanka-sajten",
    title: "Annonser utan att sänka sajten — så byggde vi ett annonssystem som inte förstör prestandan",
    excerpt:
      "Annonser gör sidor långsammare och får innehåll att hoppa. Båda sakerna straffas av Google. Så här löste vi det utan att offra intäkten.",
    description:
      "Hur vi byggde ett eget annonssystem som varken bryter sidcachen eller orsakar layouthopp: separat edge-endpoint, reserverad höjd och laddning först vid behov.",
    category: "Tekniska val",
    tags: ["annonser", "webbprestanda", "core web vitals", "cache", "adsense", "cls"],
    readingTime: "7 min läsning",
    publishedAt: "2026-07-08",
    author: "VibeDev",
    heroLabel: "Ur ett kundprojekt",
    content: [
      {
        heading: "Konflikten i botten",
        paragraphs: [
          "En annonsfinansierad sajt har ett inbyggt problem. Annonser är intäkten — men annonser gör också sidan långsammare och får innehållet att hoppa när de laddas in.",
          "Båda sakerna påverkar hur Google värderar sidan, och båda gör att besökare lämnar. Ju hårdare man försöker tjäna pengar, desto sämre blir produkten som ska tjäna dem.",
          "När vi byggde publiceringsplattformen för Powerbike var det här kärnan i uppdraget: annonserna får inte kosta mer i prestanda än de drar in.",
        ],
      },
      {
        heading: "Problem 1: annonser förstör cachen",
        paragraphs: [
          "Snabba sidor bygger på att samma färdiga sida kan skickas till alla besökare. Ingen väntan på databas, ingen rendering per person.",
          "Annonser vill det motsatta: de ska roteras, olika besökare ska se olika kampanjer, och visningar ska räknas. Gör man annonsvalet när sidan byggs blir varje besökares sida unik — och då försvinner hela cachevinsten.",
          "Vår lösning var att skilja på de två. Sidan cachas som vanligt och innehåller ingen annonsinformation. Annonsen hämtas separat med en egen, mycket lätt förfrågan som körs nära besökaren. Sidan förblir snabb; bara annonsen är dynamisk.",
        ],
      },
      {
        heading: "Problem 2: innehåll som hoppar",
        paragraphs: [
          "Det klassiska irritationsmomentet: du börjar läsa, en annons laddas in ovanför texten, och allt hoppar nedåt. Google mäter det här måttet direkt och väger in det i rankningen.",
          "Två saker löser det. Annonsplatsen får en bestämd höjd redan innan annonsen finns — utrymmet är alltså reserverat, och när annonsen dyker upp fylls en yta som redan var tom i stället för att skjuta undan något.",
          "Dessutom laddas annonsen först när besökaren närmar sig den. Annonser långt ned på sidan hämtas alltså inte alls om ingen scrollar dit, vilket gör att den första sidvisningen blir snabbare.",
        ],
      },
      {
        heading: "Egna annonser med extern fallback",
        paragraphs: [
          "Sajten säljer egna annonsplatser, med betalning via Stripe. Varje position kan ha flera aktiva kampanjer som roteras viktat.",
          "Finns ingen såld kampanj på en position fylls den automatiskt med ett annonsnätverk. Positionen står alltså aldrig tom — och den egna, mer lönsamma försäljningen har alltid företräde.",
          "Klick går via en egen adress som räknar och skickar vidare. Det ger statistik utan att tredjepartsskript behöver följa besökaren.",
        ],
      },
      {
        heading: "Statistik utan cookies",
        paragraphs: [
          "Vi räknar artikelvisningar med ett litet anrop som skickas en gång per artikel och besök. Det som skickas är artikelns id — inget om personen.",
          "Servern räknar upp en dagssiffra. Redaktionen ser vilka artiklar som läses; ingen enskild besökare kan följas.",
          "Det gör dessutom cookiebanner-frågan enklare: statistik som inte identifierar någon kräver inte samma hantering som spårning som gör det.",
        ],
      },
      {
        heading: "Vad man tar med sig",
        paragraphs: [
          "Det går att ha annonser och en snabb sajt samtidigt, men det kräver att man skiljer på vad som måste vara dynamiskt och vad som inte behöver vara det. Nästan allt på en artikelsida är statiskt. Det är bara annonsen som inte är det.",
          "Reservera alltid utrymmet innan innehållet finns. Det gäller inte bara annonser utan lika mycket bilder och inbäddat innehåll.",
          "Driver ni en innehållssajt som tappar i prestanda? Läs mer under tjänster eller hör av er.",
        ],
      },
    ],
  },
  {
    slug: "multi-tenant-saas-radsakerhet",
    title: "Multi-tenant SaaS: så håller du kunders data isolerad på riktigt",
    excerpt:
      "Alla kunder i samma databas är standard i SaaS. Frågan är vad som hindrar kund A från att se kund B:s data — och svaret får inte vara \"koden\".",
    description:
      "Praktisk genomgång av tenant-isolering i multi-tenant SaaS: radsäkerhet i databasen, varför applikationskoden inte räcker, och hur du testar isoleringen automatiskt.",
    category: "Tekniska val",
    tags: ["multi-tenant", "saas", "row level security", "postgresql", "säkerhet", "arkitektur"],
    readingTime: "8 min läsning",
    publishedAt: "2026-07-04",
    author: "VibeDev",
    heroLabel: "Ur ett kundprojekt",
    content: [
      {
        heading: "Frågan varje SaaS måste kunna besvara",
        paragraphs: [
          "I en multi-tenant-produkt ligger alla kunder i samma databas. Det är inte en genväg utan det normala — det är så du kan drifta en produkt i stället för hundra.",
          "Men det ställer en fråga som måste ha ett riktigt svar: vad hindrar kund A från att se kund B:s data?",
          "Om svaret är \"vi filtrerar på kund-id i koden\" är svaret otillräckligt. Det räcker med ett enda ställe där någon glömmer filtret — en ny endpoint, en rapport, ett exportjobb — så läcker data mellan kunder.",
        ],
      },
      {
        heading: "Lägg spärren i databasen",
        paragraphs: [
          "När vi byggde VIBESHOPS, en multi-tenant e-handelsplattform där varje handlare driver sin egen butik, lade vi isoleringen i databasen i stället för i koden.",
          "Postgres har radsäkerhet: regler som säger vilka rader en viss anslutning överhuvudtaget får se. Med det på plats blir en glömd `where`-sats inte längre en säkerhetsincident — databasen returnerar helt enkelt inga främmande rader.",
          "Poängen är att skyddet gäller oavsett vem som frågar och hur. Ny kod, en rapport, ett skript som någon kör manuellt — samma regler.",
          "Det viktiga är att det gäller samtliga tabeller. En enda tabell utan regler är en väg runt hela skyddet, och det är oftast en oansenlig tabell — loggar, bilagor, utkast — som glöms bort.",
        ],
      },
      {
        heading: "Testa isoleringen, tro inte på den",
        paragraphs: [
          "Radsäkerhet är bara skyddande om reglerna faktiskt är rätt. Det är lätt att skriva en regel som ser rätt ut och som inte täcker det man tror.",
          "Vi kör därför skarpa korstester automatiskt vid varje kodändring: logga in som kund A, försök läsa kund B:s data, förvänta noll rader. Går testet igenom med data har något gått sönder och bygget stoppas.",
          "Det här är den enskilt viktigaste investeringen i en multi-tenant-produkt. Reglerna kommer att ändras när nya tabeller tillkommer, och utan test upptäcker du glappet först när någon rapporterar det.",
        ],
      },
      {
        heading: "Isolering räcker inte — beräkna rätt saker på servern",
        paragraphs: [
          "En näraliggande fälla i e-handel: att lita på belopp som kommer från webbläsaren. Priser, rabatter och summor måste räknas på servern, varje gång.",
          "Vi räknar dessutom alla belopp i heltal öre i stället för decimaltal. Decimaltal i datorer har avrundningsfel som är helt harmlösa i de flesta sammanhang och direkt skadliga i en kassa.",
          "Kortuppgifter passerar aldrig våra servrar. Det minskar både säkerhetsrisken och regelbördan avsevärt.",
        ],
      },
      {
        heading: "Egen domän per kund",
        paragraphs: [
          "En förväntan i multi-tenant-produkter är att varje kund ska kunna använda sin egen domän. Det låter enkelt och innehåller en del arbete: certifikat måste utfärdas och förnyas per domän, och trafiken ska hitta rätt kund.",
          "Det finns färdiga tjänster för just detta som gör att man slipper bygga certifikathanteringen själv. Vi använder en sådan, med subdomän direkt från start och möjlighet att koppla egen domän när kunden vill.",
          "Rådet: bygg inte certifikathantering själv om du inte måste. Det är ett litet problem som växer när kunderna blir många.",
        ],
      },
      {
        heading: "Checklista",
        paragraphs: [
          "Radsäkerhet på samtliga tabeller, inte de flesta. Automatiska korstester som körs vid varje ändring. Beräkningar av pengar på servern, i heltal. Certifikathantering som du inte äger själv.",
          "Och en regel som är lätt att formulera men kräver disciplin: när en ny tabell läggs till ska den ha regler och test från början, inte i efterhand.",
          "Bygger ni multi-tenant och vill ha ett par ögon på isoleringen? Hör av er.",
        ],
      },
    ],
  },
  {
    slug: "cookie-samtycke-ga4-korrekt",
    title: "Cookie-samtycke och Google Analytics — så gör du rätt utan att tappa all data",
    excerpt:
      "De flesta svenska sajter laddar Analytics innan besökaren har sagt ja. Det är fel ordning, och det är enklare att rätta än man tror.",
    description:
      "Praktisk genomgång av hur cookie-samtycke bör fungera med Google Analytics 4 på en svensk sajt: rätt ordning, teknisk implementation och vad som faktiskt kräver samtycke.",
    category: "Tekniska val",
    tags: ["cookies", "gdpr", "google analytics", "ga4", "samtycke", "webbanalys"],
    readingTime: "6 min läsning",
    publishedAt: "2026-07-01",
    author: "VibeDev",
    heroLabel: "Så tänker vi",
    content: [
      {
        heading: "Det vanligaste felet",
        paragraphs: [
          "Mönstret känns igen från de flesta svenska sajter: en cookiebanner dyker upp längst ned, och Google Analytics har redan laddats och satt sina cookies innan du hunnit läsa den.",
          "Det är fel ordning. Poängen med samtycke är att det ska inhämtas innan spårningen börjar, inte informeras om efteråt.",
          "Bannern är alltså inte problemet — ordningen är. Och den är enklare att rätta än de flesta tror.",
        ],
      },
      {
        heading: "Vad som faktiskt kräver samtycke",
        paragraphs: [
          "Cookies som är nödvändiga för att sajten ska fungera kräver inte samtycke. Det handlar om sådant som håller reda på en inloggning eller innehållet i en varukorg — utan dem går tjänsten helt enkelt inte att använda.",
          "Cookies för statistik och marknadsföring kräver samtycke. Google Analytics hör dit. Att analysen är anonymiserad ändrar inte att den sätter cookies på besökarens enhet.",
          "Gränsdragningen är alltså inte \"är detta känsligt\" utan \"behövs detta för att tjänsten ska fungera\". Statistik är värdefullt för dig — men sajten fungerar utan det.",
        ],
      },
      {
        heading: "Så byggde vi det på den här sajten",
        paragraphs: [
          "Analytics-skriptet ligger inte i sidmallen. Det laddas av en komponent som först kontrollerar om besökaren har godkänt statistik. Har hen inte gjort det laddas skriptet aldrig — det finns alltså inget att blockera i efterhand, eftersom det aldrig kommer in.",
          "Valet sparas lokalt i webbläsaren. Har besökaren redan svarat visas ingen banner igen, och skriptet laddas eller laddas inte utifrån det tidigare valet.",
          "Bannern har två likvärdiga val: godkänn statistik eller endast nödvändiga. Ett mörkt mönster där \"godkänn\" är en stor knapp och \"neka\" är en grå länk i finstilt är inte ett giltigt samtycke.",
          "Vi lade dessutom in en funktion för att ändra sitt val i efterhand, eftersom ett samtycke ska gå att ta tillbaka lika enkelt som det gavs.",
        ],
      },
      {
        heading: "Men förlorar man inte all data?",
        paragraphs: [
          "Du förlorar besökarna som säger nej. Hur många det blir varierar, och du får räkna med att siffrorna i Analytics blir lägre än tidigare.",
          "Två saker gör det mindre dramatiskt än det låter. För det första är trenderna fortfarande användbara även om nivån är lägre — du ser vad som ökar och minskar.",
          "För det andra kan mycket mätas utan cookies alls. Sidvisningar per artikel, varifrån trafiken kommer och hur många som klickar på en knapp går att räkna på serversidan utan att identifiera någon. Vi har byggt just det åt en kund som ville ha läsarstatistik utan spårning.",
        ],
      },
      {
        heading: "Kort checklista",
        paragraphs: [
          "Ladda inga spårningsskript innan samtycke — blockera dem inte i efterhand, låt bli att ladda dem alls. Gör \"neka\" lika lätt som \"godkänn\". Gör det möjligt att ändra sig senare.",
          "Beskriv i cookiepolicyn vilka cookies som faktiskt sätts, vad de gör och hur länge de lever. En generisk text som inte stämmer med verkligheten är sämre än ingen alls.",
          "Osäker på hur er sajt gör idag? Öppna utvecklarverktygen, ladda om sidan och titta på vilka cookies som sätts innan du har klickat på något. Det svarar på frågan direkt.",
        ],
      },
    ],
  },
  {
    slug: "oppna-data-som-produkt",
    title: "Öppna data som produkt — vad som faktiskt krävs för att göra offentlig data användbar",
    excerpt:
      "Datan är gratis och tillgänglig för alla. Ändå finns det knappt några bra produkter byggda på den. Här är varför — och vad arbetet består av.",
    description:
      "Vad som krävs för att bygga en produkt på svenska öppna data: filformat, teckenkodning, importer som tål avbrott och varför själva datan är den enkla delen.",
    category: "Tekniska val",
    tags: ["öppna data", "bolagsverket", "scb", "datapipeline", "import", "ixbrl"],
    readingTime: "8 min läsning",
    publishedAt: "2026-06-26",
    author: "VibeDev",
    heroLabel: "Ur ett kundprojekt",
    content: [
      {
        heading: "Gratis är inte samma sak som lättanvänt",
        paragraphs: [
          "Sverige publicerar stora mängder offentlig data avgiftsfritt. Bolagsverket lägger ut företagsregistret, SCB lägger ut branschklassificeringar, och årsredovisningar finns att hämta i maskinläsbart format.",
          "Ändå möts den som vill använda företagsinformation nästan alltid av betalväggar och säljsamtal. Frågan är varför, om datan är fri.",
          "Svaret är att datan är fri men obekväm. Den kommer i stora bulkfiler, i flera format, med olika teckenkodning — och att göra den användbar är faktiskt ett arbete. Det arbetet är produkten.",
        ],
      },
      {
        heading: "Vad du möts av i praktiken",
        paragraphs: [
          "Filerna är stora och packade. Att packa upp dem till disk innan man läser dem fungerar på en laptop och inte på en server med begränsat utrymme. Man vill läsa dem strömmande, rakt ur arkivet.",
          "Formaten varierar. Vi byggde en läsare som hanterar XML, CSV, TSV och radbaserad JSON genom samma kodväg och som upptäcker avgränsare automatiskt, eftersom det annars blir en separat importrutin per källa.",
          "Teckenkodningen varierar också — Bolagsverket levererar i ett format och SCB i ett annat. Läser man fel blir svenska tecken förstörda, och det upptäcker man ofta först när en användare söker på ett företagsnamn som inte går att hitta.",
          "Årsredovisningarna är egna djuret: ett maskinläsbart format där varje bolags bokslut ligger i en egen fil, packad i tusentals arkiv. Vi mappade ett trettiotal begrepp ur standarden till kolumner för att få ut nyckeltal.",
        ],
      },
      {
        heading: "Importer som tål att gå sönder",
        paragraphs: [
          "En import som tar timmar kommer att avbrytas. Nätverket glappar, servern startas om, någon trycker fel. Frågan är inte om utan hur ofta.",
          "Därför skrev vi importen så att den kan köras om utan att skapa dubbletter, och så att den efter ett avbrott hoppar förbi det som redan är inläst i stället för att börja från början.",
          "Vi skriver i batchar med gradvis längre väntetid vid problem, eftersom en import som hamrar på databasen kan göra den långsam för alla andra samtidigt.",
          "För årsredovisningarna bokförs varje färdig fil. En import som kraschar vid fil 600 av nästan 800 fortsätter där den slutade — inte om från noll.",
        ],
      },
      {
        heading: "Datakvalitet är en produktfråga",
        paragraphs: [
          "Öppna data innehåller fel. Ett konkret exempel: enstaka bokslut har belopp angivna i fel storleksordning, vilket gör att ett litet bolag plötsligt ser ut att omsätta hundratals miljoner.",
          "Visar man en topplista utan filter hamnar de här felen överst — och då ser hela produkten opålitlig ut, även om resten av datan är korrekt.",
          "Vi lade därför in rimlighetsfilter på de listor som visas publikt. Det är inte att dölja data; det är att inte låta uppenbara inmatningsfel definiera förstaintrycket.",
          "En annan detalj: olika källor formaterar text olika. SCB levererar företagsnamn i versaler medan Bolagsverket har korrekt skiftläge. Vi normaliserar det som behöver normaliseras, utan att förstöra det som redan är rätt.",
        ],
      },
      {
        heading: "Skalan ställer egna krav",
        paragraphs: [
          "3,5 miljoner företag betyder potentiellt miljontals sidor. En sitemap kan innehålla ett begränsat antal adresser, så det behövs ett index som pekar på flera delfiler.",
          "Att räkna exakt antal rader i en tabell med miljontals poster tar längre tid än vad en sökmotor väntar. Vi uppskattar antalet ur databasens egen statistik i stället, vilket är tillräckligt bra för ändamålet och tar millisekunder.",
          "Poängen: vid den här storleken behöver även triviala saker som en sitemap tänkas igenom.",
        ],
      },
      {
        heading: "Var värdet ligger",
        paragraphs: [
          "Inte i datan — den har alla tillgång till. Värdet ligger i att göra den sökbar, begriplig och pålitlig. Det är importarbetet, sökningen, datakvaliteten och presentationen.",
          "Det är också därför öppna data är en rimlig grund för en produkt: konkurrensen sker på hantverket, inte på tillgången till råvaran.",
          "Sitter ni på data — offentlig eller egen — som borde vara sökbar? Vi hjälper gärna till. Läs mer under tjänster eller hör av er.",
        ],
      },
    ],
  },
  {
    slug: "claude-opus-5-vad-det-betyder",
    title: "Claude Opus 5 är här — vad det faktiskt betyder för dig som bygger produkt",
    excerpt:
      "Anthropic släppte Opus 5 den 24 juli 2026. Dubblad prestanda mot Opus 4.8 — till exakt samma pris. Vi går igenom siffrorna och vad de betyder i praktiken.",
    description:
      "Claude Opus 5 släpptes 24 juli 2026 med kraftigt förbättrad prestanda till oförändrat pris. Vi går igenom benchmarks, effort-reglaget, de nya utvecklarfunktionerna — och vad det konkret betyder för dig som bygger en digital produkt.",
    category: "AI",
    tags: ["ai", "claude", "anthropic", "opus 5", "produktutveckling", "ai-kostnader"],
    readingTime: "9 min läsning",
    publishedAt: "2026-07-24",
    author: "VibeDev",
    heroLabel: "Nyhet & analys",
    content: [
      {
        heading: "Vad som släpptes",
        paragraphs: [
          "Den 24 juli 2026 släppte Anthropic Claude Opus 5. Modellen finns tillgänglig i API:et under model-id:t claude-opus-5, den är standardmodell för Claude Max-abonnenter och den starkaste modellen på Claude Pro. Den rullas ut på samtliga plattformar.",
          "Den korta versionen: Opus 5 levererar väsentligt högre kapacitet än föregångaren Opus 4.8 — till exakt samma pris. 5 dollar per miljon input-tokens och 25 dollar per miljon output-tokens, oförändrat.",
          "Det är den detaljen som gör lanseringen intressant för alla som bygger något med AI i. Priset står stilla medan kapaciteten hoppar. Det förändrar kalkylen för vad som är rimligt att bygga.",
        ],
      },
      {
        heading: "Siffrorna — och vad de är värda",
        paragraphs: [
          "Anthropic redovisar resultat på ett antal utvärderingar. De mest talande: Opus 5 mer än dubblar Opus 4.8:s resultat på Frontier-Bench v0.1, till lägre kostnad. På CursorBench 3.2 landar den inom 0,5 procent av Fable 5:s toppresultat — till halva priset. På ARC-AGI 3 presterar den tre gånger så högt som näst bästa modell, och på Zapier AutomationBench ligger andelen godkända körningar runt 1,5 gånger näst bästa modell.",
          "På OSWorld 2.0, som mäter hur väl en modell klarar att styra ett faktiskt operativsystem, slår Opus 5 Fable 5:s bästa resultat till drygt en tredjedel av kostnaden.",
          "Sen den obligatoriska brasklappen: benchmarks är inte din produkt. En modell som presterar exceptionellt på ARC-AGI kan fortfarande vara medioker på just din domän, ditt datamaterial och dina användares faktiska frågor. Siffrorna säger något om riktningen — de säger ingenting om huruvida modellen löser ditt problem.",
          "Det enda test som räknas är ditt eget. Har ni redan något i produktion: kör en utvärdering på verkliga ärenden innan ni byter. Har ni inte det: låt bli att välja modell utifrån en topplista.",
        ],
      },
      {
        heading: "Effort-reglaget är den underskattade nyheten",
        paragraphs: [
          "Opus 5 låter dig ställa in hur mycket arbete modellen ska lägga på en uppgift — nivåerna heter low, high, xhigh och max. I praktiken är det ett reglage mellan intelligens och kostnad.",
          "Det låter som en teknisk detalj. Det är det inte. För en produkt med volym är det skillnaden mellan en AI-funktion som bär sig och en som äter marginalen.",
          "Tanken är enkel: alla anrop är inte lika viktiga. En enkel klassificering — \"är det här ett supportärende eller en säljfråga?\" — behöver inte samma resurser som en komplex analys av ett helt kundcase. Kör det billiga billigt och det svåra ordentligt.",
          "Vi ser det här som ett av de mest konkreta sätten att få ned AI-kostnaden i en produkt utan att sänka kvaliteten där den faktiskt märks.",
        ],
      },
      {
        heading: "Två nyheter för oss som bygger",
        paragraphs: [
          "Samtidigt med modellen släpptes två saker i beta som löser riktiga problem i produktion.",
          "Det första är att man kan ändra vilka verktyg modellen har tillgång till mitt i en konversation, utan att slå sönder prompt-cachen. Det låter smalt men är en märkbar kostnadssak: tidigare innebar ett ändrat verktygsutbud att hela den cachade historiken fick bearbetas om och betalas för på nytt. För agent-liknande produkter som byter läge under körning är det pengar rakt ned i fickan.",
          "Det andra är automatiska fallbacks. Om en förfrågan flaggas av säkerhetsklassificerarna kan den nu automatiskt dirigeras vidare till en annan modell i stället för att bara stanna. Det gör beteendet mer förutsägbart för användaren — särskilt i produkter som ligger nära gränsdragningar, exempelvis säkerhet eller medicin, där legitima frågor ibland fastnar.",
        ],
      },
      {
        heading: "Vad det betyder om du bygger en produkt",
        paragraphs: [
          "Tre saker är värda att ta med sig.",
          "För det första: prisbilden per levererad kapacitet fortsätter falla snabbt. En AI-funktion som var för dyr att räkna hem för ett halvår sedan kan vara lönsam idag — utan att en rad kod ändrats. Om ni har en idé som ni la på hyllan av kostnadsskäl kan det vara värt att räkna om den.",
          "För det andra: det är inte längre modellen som är flaskhalsen i de flesta produkter. Det är produktbesluten. Vad ska funktionen faktiskt göra, för vem, och hur vet ni att den gör nytta? Vi ser fler projekt kapsejsa på oklart scope än på otillräcklig modellkapacitet.",
          "För det tredje: bygg så att modellen kan bytas. Modellvalet är det som åldras snabbast i hela din stack — ungefär två gånger om året just nu. Ligger anropen bakom ett tunt eget lager är ett byte en konfigurationsändring. Ligger de utspridda i hela kodbasen blir det ett projekt.",
        ],
      },
      {
        heading: "Hur vi tänker på det här",
        paragraphs: [
          "Vi bygger appar, webbappar och AI-funktioner åt founders och produktteam. Vår hållning är oförändrad: modellen är en komponent, inte en produktstrategi.",
          "Det vi gör konkret är att isolera modellvalet, mäta på riktiga ärenden i stället för på benchmarks, och sätta effort-nivån per anropstyp i stället för att köra allt på högsta växeln. Det brukar ge en produkt som både känns bra och går att räkna hem.",
          "Och när nästa modell släpps — vilket den gör, om ungefär ett halvår — är bytet en eftermiddag i stället för ett kvartal.",
        ],
      },
      {
        heading: "Sammanfattat",
        paragraphs: [
          "Claude Opus 5 ger mer kapacitet för samma pengar som Opus 4.8, med ett effort-reglage som gör kostnaden styrbar och två beta-funktioner som tar bort verklig friktion i produktion.",
          "Det är goda nyheter. Men det ändrar inte den svåra delen: att veta vad som är värt att bygga. Den frågan löser ingen modelluppgradering åt dig.",
          "Funderar ni på att lägga in AI i er produkt — eller på att räkna om något ni tidigare valde bort? Hör av er, så tittar vi på det tillsammans.",
        ],
      },
    ],
  },
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
  /* ── Aktuella nyheter 2026: Vibecoding ───────────────────────────────────── */
  {
    slug: "ai-agenter-i-utvecklingsflodet-2026",
    title: "AI-agenter i utvecklingsflödet 2026 — vad de faktiskt klarar",
    excerpt:
      "Agentverktygen har gått från autocomplete till att ta sig an hela uppgifter på egen hand. Här är var de levererar 2026 — och var de fortfarande behöver dig.",
    description:
      "En aktuell lägesbild över AI-agenter i utveckling 2026: vad de klarar självständigt, var de fortfarande fallerar och hur team får ut värdet utan att tappa kontrollen.",
    category: "Vibecoding",
    tags: ["vibecoding", "ai-agenter", "automation", "ai-verktyg"],
    readingTime: "8 min läsning",
    publishedAt: "2026-06-03",
    author: "VibeDev",
    heroLabel: "Aktuellt",
    content: [
      {
        heading: "Från autocomplete till agent",
        paragraphs: [
          "För ett par år sedan handlade AI i kod om att föreslå nästa rad. 2026 ser bilden helt annorlunda ut: agentverktyg läser hela kodbasen, planerar en uppgift, redigerar flera filer, kör tester och itererar tills något fungerar — med dig som granskare snarare än skrivare.",
          "Det är ett verkligt skifte i hur arbetet känns. Men hypen har sprungit före verkligheten på flera punkter, och det lönar sig att vara tydlig med var gränsen faktiskt går just nu.",
        ],
      },
      {
        heading: "Där agenterna levererar idag",
        paragraphs: [
          "Agenter är starkast på väldefinierade, mönsterbundna uppgifter som spänner över många filer: migrera ett API, uppdatera importer efter en omstrukturering, skriva tester för en modul, eller bygga ut en feature efter en tydlig beskrivning där liknande kod redan finns att härma.",
          "De är också utmärkta på att snabbt sätta sig in i ett okänt projekt och svara på 'var hanteras X och vad händer om jag ändrar det'. Den utforskande förmågan sparar mycket tid innan en enda rad skrivs.",
        ],
      },
      {
        heading: "Där de fortfarande fallerar",
        paragraphs: [
          "Agenter snubblar på uppgifter som kräver att förstå varför något är byggt som det är — outtalade affärsregler, historiska beslut, subtila beroenden som inte syns i koden. De kan producera något som ser rätt ut och kör grönt, men ändå missar poängen.",
          "De överskattar också ofta sin säkerhet. En agent säger sällan 'jag är osäker här'; den fortsätter med självförtroende rakt in i fel antagande. Det är därför granskning inte blir mindre viktig med bättre agenter — den blir mer.",
        ],
      },
      {
        heading: "Så får team ut värdet utan att tappa kontrollen",
        paragraphs: [
          "Be om en plan före kod på allt som rör mer än en fil. Håll uppgifterna avgränsade — en agent som får ett tydligt, smalt mål presterar långt bättre än en som ska 'fixa autentiseringen'. Och ge den bra kontext: en kort fil med konventioner och arkitektur höjer kvaliteten dramatiskt.",
          "Låt aldrig en agent köra irreversibla operationer utan en grind. Den som mergar koden äger den, oavsett vem som skrev den. Med den disciplinen blir agenter en kraftmultiplikator i stället för en källa till tyst teknisk skuld.",
        ],
      },
      {
        heading: "Vart det är på väg",
        paragraphs: [
          "Trenden 2026 är tydlig: agenterna blir bättre på att hålla längre uppgifter i huvudet och samarbeta i flera steg. Men kärnkompetensen som efterfrågas förskjuts — från att skriva kod till att specificera, granska och fatta beslut.",
          "Det är goda nyheter för team som behärskar produkttänk. Verktygen tar hand om mer av hantverket; värdet ligger alltmer i att veta vad som ska byggas och varför.",
        ],
      },
    ],
  },
  {
    slug: "spec-driven-utveckling-med-ai",
    title: "Spec-driven utveckling — så får du AI att bygga rätt sak",
    excerpt:
      "Det största problemet med AI-genererad kod är sällan kvaliteten — det är att den bygger fel sak. En tydlig spec är botemedlet.",
    description:
      "En aktuell metod för 2026: hur du använder en lättviktig spec för att styra AI-agenter mot rätt resultat, och varför det blivit kärnfärdigheten i modern utveckling.",
    category: "Vibecoding",
    tags: ["vibecoding", "spec", "ai-verktyg", "arbetssätt"],
    readingTime: "7 min läsning",
    publishedAt: "2026-05-29",
    author: "VibeDev",
    heroLabel: "Metod",
    content: [
      {
        heading: "Problemet är inte koden — det är riktningen",
        paragraphs: [
          "När AI kan producera fungerande kod på sekunder flyttas flaskhalsen. Den nya risken är inte buggig kod, utan kod som löser fel problem snyggt och snabbt. Ju snabbare verktygen blir, desto dyrare blir ett otydligt mål.",
          "Spec-driven utveckling är svaret som vuxit fram 2026: i stället för att prompta löst beskriver du tydligt vad som ska byggas, låter AI:n bygga mot specen, och granskar resultatet mot samma spec.",
        ],
      },
      {
        heading: "Vad en bra spec innehåller",
        paragraphs: [
          "En spec behöver inte vara ett tjockt dokument. Den ska svara på: vad ska byggas, för vem, vilket beteende förväntas i normalfallet och i kantfallen, vad ligger uttryckligen utanför scope, och hur vet vi att det är klart.",
          "Just kantfallen och 'utanför scope' är det som gör mest skillnad. AI fyller annars luckorna med antaganden, och antaganden är där missförstånden föds. En mening som 'hantera tom lista genom att visa ett tomt-tillstånd' sparar en hel iteration.",
        ],
      },
      {
        heading: "Specen är både input och facit",
        paragraphs: [
          "Det fina med att skriva specen först är att den fungerar dubbelt: den styr vad AI:n bygger, och den blir måttstocken du granskar mot. När du ska bedöma resultatet jämför du inte mot en vag känsla, utan mot något konkret du skrev innan.",
          "Det gör granskningen snabbare och ärligare. Antingen uppfyller koden specen eller inte — och om specen visade sig vara fel har du lärt dig något billigt, innan en massa kod byggdes på fel premiss.",
        ],
      },
      {
        heading: "Lättvikt slår byråkrati",
        paragraphs: [
          "Faran är att 'spec' låter som tungrodd kravhantering. Det är inte poängen. En spec kan vara ett par stycken i ett issue, en punktlista, eller en kort beskrivning som du och agenten kommer överens om innan kodning börjar.",
          "Målet är precis så mycket struktur som behövs för att alla — människa och maskin — bygger samma sak. Mer än så bromsar; mindre än så leder till omarbete.",
        ],
      },
      {
        heading: "Den nya kärnfärdigheten",
        paragraphs: [
          "Att formulera tydligt vad som ska byggas har alltid varit värdefullt. 2026 har det blivit avgörande, för det är precis den färdigheten som avgör hur mycket du får ut av AI-verktygen.",
          "Den som kan tänka klart, avgränsa skarpt och beskriva exakt får utmärkta resultat. Den som promptar löst får löst byggd kod — snabbt, men åt fel håll. Specen är skillnaden.",
        ],
      },
    ],
  },
  /* ── Aktuella nyheter 2026: AI i produkter ───────────────────────────────── */
  {
    slug: "eu-ai-act-for-produktteam",
    title: "EU:s AI Act — vad svenska produktteam behöver göra nu",
    excerpt:
      "AI Act fasas in steg för steg och påverkar alla som bygger AI i sina produkter. Här är vad det betyder i praktiken — utan juristsnack.",
    description:
      "En praktisk genomgång av EU:s AI Act för svenska produktteam 2026: riskklassning, transparenskrav och vad ni bör göra redan nu för att ligga rätt.",
    category: "AI i produkter",
    tags: ["ai", "ai-act", "regelefterlevnad", "eu"],
    readingTime: "9 min läsning",
    publishedAt: "2026-06-04",
    author: "VibeDev",
    heroLabel: "Aktuellt",
    content: [
      {
        heading: "Varför det här angår er nu",
        paragraphs: [
          "EU:s AI Act är världens första breda AI-lagstiftning och fasas in i flera steg. Förbjudna användningar och transparenskrav börjar gälla först, medan tyngre krav på högrisksystem kommer senare. Poängen är att det inte är något som händer 'någon gång i framtiden' — delar gäller redan, och resten närmar sig.",
          "Det här är inte juridisk rådgivning, utan en praktisk orientering. Behöver ni säkra svar för just er produkt ska ni prata med en jurist — men ni vinner mycket på att förstå grunderna innan dess.",
        ],
      },
      {
        heading: "Allt handlar om risknivå",
        paragraphs: [
          "AI Act delar in användning i risknivåer. Vissa användningar är förbjudna. En del räknas som högrisk och får tunga krav på dokumentation, dataunderlag, mänsklig tillsyn och loggning. Mycket faller i en lägre kategori med främst transparenskrav. Och en stor del av vanliga produktfunktioner berörs ganska lätt.",
          "Första steget är därför att klassa: vad gör er AI, i vilket sammanhang, och vilken risknivå hamnar den i? De flesta SaaS- och konsumentprodukter ligger lågt, men det förändras snabbt om AI:n påverkar saker som anställning, kredit, utbildning eller hälsa.",
        ],
      },
      {
        heading: "Transparens är minimikravet för de flesta",
        paragraphs: [
          "Även produkter med låg risk har transparenskrav. Användare ska veta när de interagerar med ett AI-system, och AI-genererat innehåll behöver i många fall märkas. Det är sällan svårt att uppfylla — men det måste vara medvetet inbyggt, inte påklistrat i efterhand.",
          "Praktiskt betyder det tydliga formuleringar i gränssnittet: att en chatt drivs av AI, att ett svar är genererat, att ett förslag bör granskas. Det bygger dessutom förtroende, vilket är bra produktdesign oavsett lag.",
        ],
      },
      {
        heading: "Använder ni en extern modell? Då delar ni ansvaret",
        paragraphs: [
          "De flesta team bygger på en modell från en leverantör snarare än att träna egen. Det tar inte bort ert ansvar — det delar upp det. Leverantören har sina skyldigheter för själva modellen, men hur ni använder den i er produkt är ert ansvar.",
          "Håll därför koll på vad leverantören dokumenterar och tillåter, och var tydliga internt med var er produkt drar gränsen. Att kunna svara på 'vilken modell, till vad, med vilken data' är halva jobbet.",
        ],
      },
      {
        heading: "Vad ni bör göra redan nu",
        paragraphs: [
          "Börja med en enkel inventering: var sitter AI i er produkt, vad gör den, och vilken risknivå rör det sig om? Dokumentera transparensen mot användaren och se till att ni vet vilken data som går till modellen — det kopplar direkt till GDPR.",
          "Bygg in efterlevnad som en del av produktarbetet, inte som en panikåtgärd inför en deadline. Team som tänker risk och transparens från början får sällan obehagliga överraskningar — och slipper bygga om i efterhand.",
        ],
      },
    ],
  },
  {
    slug: "multimodal-ai-i-produkter",
    title: "Multimodal AI i produkter — text, bild och röst i samma flöde",
    excerpt:
      "Modellerna ser, hör och läser numera i samma anrop. Det öppnar nya produktupplevelser — men också nya sätt att göra fel.",
    description:
      "En aktuell guide 2026 till multimodal AI i produkter: när det tillför verkligt värde, vanliga fallgropar och hur du bygger upplevelsen rätt.",
    category: "AI i produkter",
    tags: ["ai", "multimodal", "produktdesign", "ux"],
    readingTime: "8 min läsning",
    publishedAt: "2026-05-27",
    author: "VibeDev",
    heroLabel: "Aktuellt",
    content: [
      {
        heading: "Modellerna är inte längre bara text",
        paragraphs: [
          "2026 är multimodalitet standard snarare än undantag. En och samma modell kan ta emot text, bild, ljud och ibland video i samma anrop och resonera över dem tillsammans. En användare kan fotografera något, ställa en fråga med rösten och få ett svar som väger in båda.",
          "Det öppnar produktupplevelser som var opraktiska tidigare. Men precis som med all AI är frågan inte 'kan vi', utan 'löser det här ett verkligt problem bättre än alternativet'.",
        ],
      },
      {
        heading: "Där multimodalt tillför verkligt värde",
        paragraphs: [
          "De starkaste användningarna tar bort friktion som tidigare var oundviklig. Att fotografera en produkt i stället för att beskriva den i ord. Att prata in en anteckning under fältarbete där tangentbord är opraktiskt. Att låta en bild och en fråga tolkas tillsammans, som när någon visar ett felmeddelande och frågar vad det betyder.",
          "Gemensamt för dem: den nya modaliteten är ett naturligare sätt att uttrycka samma sak. Det är då det känns som magi och inte som en gimmick.",
        ],
      },
      {
        heading: "De nya fallgroparna",
        paragraphs: [
          "Multimodalt innebär nya felkällor. Bilder kan vara suddiga, mörka eller visa något helt annat än användaren tror. Ljud har brus och dialekter. Modellen kan tolka fel på sätt som är svårare att förutse än ren text, och kostnaden per anrop är ofta högre eftersom bild och ljud väger tungt.",
          "Designa för det: gör det lätt att korrigera en feltolkning, visa tydligt vad modellen uppfattade, och ha ett vettigt beteende när indata är för dålig för att lita på. En produkt som tyst gissar fel tappar förtroende snabbt.",
        ],
      },
      {
        heading: "Sekretess väger ännu tyngre",
        paragraphs: [
          "Bilder och ljud bär ofta mer känslig information än användaren tänker på — ansikten i bakgrunden, dokument på skrivbordet, röster som kan identifiera. När den datan skickas till en extern modell blir GDPR-frågan direkt skarpare än med text.",
          "Var tydlig med vad som spelas in och skickas, samla bara in det som behövs för uppgiften, och fundera på var datan får behandlas. Det är både ett lagkrav och en förtroendefråga.",
        ],
      },
      {
        heading: "Börja smalt",
        paragraphs: [
          "Frestelsen är att bygga en allätande assistent som hanterar allt. Det blir nästan alltid sämre än en fokuserad funktion som gör en multimodal sak riktigt bra. Välj det enda flöde där en bild eller röst tydligt slår text, och putsa det tills det känns självklart.",
          "Multimodalt är ett kraftfullt verktyg 2026 — men samma regel gäller som alltid: värdet kommer från ett tydligt användarbehov, inte från att tekniken är imponerande.",
        ],
      },
    ],
  },
  /* ── Aktuella nyheter 2026: MVP-utveckling ───────────────────────────────── */
  {
    slug: "ai-prototyp-pa-en-dag",
    title: "Bygg en AI-prototyp på en dag — och vad den faktiskt bevisar",
    excerpt:
      "Med dagens verktyg kan du ha en klickbar prototyp på timmar. Men en prototyp svarar bara på vissa frågor — och inte de du kanske tror.",
    description:
      "En aktuell guide 2026 till att snabbprototypa med AI-verktyg: vad du kan bygga på en dag, vilka frågor det besvarar och var gränsen mot en riktig MVP går.",
    category: "MVP-utveckling",
    tags: ["mvp", "prototyp", "ai-verktyg", "validering"],
    readingTime: "7 min läsning",
    publishedAt: "2026-06-02",
    author: "VibeDev",
    heroLabel: "Aktuellt",
    content: [
      {
        heading: "Prototyp på timmar är verklighet nu",
        paragraphs: [
          "Med 2026 års verktyg kan en enskild person ha en klickbar, snygg prototyp på en dag — ibland på en eftermiddag. Du beskriver idén, får ett gränssnitt som ser färdigt ut, och kan klicka dig igenom flödet nästan direkt.",
          "Det är en superkraft för att tänka och kommunicera. Men det är lätt att blanda ihop 'ser färdig ut' med 'är validerad'. En prototyp svarar bara på vissa frågor, och det är värt att vara tydlig med vilka.",
        ],
      },
      {
        heading: "Vad en endagsprototyp faktiskt besvarar",
        paragraphs: [
          "En snabbprototyp är utmärkt för att svara på: förstår folk vad det här är? Känns flödet logiskt? Väcker det rätt reaktion när jag visar det? Den gör abstrakta idéer konkreta nog att få ärlig feedback på, och den är ovärderlig för att rikta in teamet.",
          "Den är också perfekt för att upptäcka att en idé inte håller — innan du investerat veckor. Att en prototyp får ett ljummet mottagande är en billig och nyttig läxa.",
        ],
      },
      {
        heading: "Vad den inte besvarar",
        paragraphs: [
          "En prototyp säger nästan ingenting om det riktigt svåra: håller det under verklig belastning, fungerar integrationerna, är datan korrekt, vill folk betala, kommer de tillbaka om en vecka? Allt det som avgör om produkten faktiskt fungerar i drift ligger utanför vad en mockup kan visa.",
          "Den vanligaste fällan 2026 är att tro att en imponerande prototyp betyder att produkten är 'nästan klar'. Avståndet från klickbar yta till robust produkt är fortfarande stort — verktygen har bara gjort ytan billig.",
        ],
      },
      {
        heading: "Prototyp först, MVP sen — i rätt ordning",
        paragraphs: [
          "Använd prototypen för det den är bra på: testa förståelse och riktning snabbt och billigt. När den bekräftat att idén är värd att bygga, då börjar det riktiga arbetet med en MVP som faktiskt fungerar för riktiga användare.",
          "Hoppa inte över valideringen bara för att ytan blev fin på en dag. Och försök inte heller göra prototypen till produkten genom att lappa på den — det leder oftast till skör grund som måste rivas.",
        ],
      },
      {
        heading: "Det billiga steget gör de dyra besluten bättre",
        paragraphs: [
          "Det bästa med endagsprototyper är att de gör tidiga produktbeslut billigare och modigare. Du kan testa tre riktningar på en vecka i stället för att gissa, och bara den som överlever kontakt med riktiga människor går vidare till bygge.",
          "Använd hastigheten till att lära dig mer, inte till att hoppa över lärandet. Det är så snabbprototyper gör MVP-arbetet bättre i stället för att lura dig.",
        ],
      },
    ],
  },
  {
    slug: "mvp-nyckeltal-2026",
    title: "MVP-nyckeltal 2026 — vad du faktiskt ska mäta",
    excerpt:
      "Nedladdningar och registreringar känns bra men säger lite. Här är måtten som faktiskt avslöjar om din MVP är på rätt väg.",
    description:
      "En aktuell guide till vilka nyckeltal som betyder något för en MVP 2026 — aktivering, retention och verkligt värde framför vanity-mått.",
    category: "MVP-utveckling",
    tags: ["mvp", "nyckeltal", "retention", "produktstrategi"],
    readingTime: "7 min läsning",
    publishedAt: "2026-05-25",
    author: "VibeDev",
    heroLabel: "Guide",
    content: [
      {
        heading: "Fel mått ger falsk trygghet",
        paragraphs: [
          "Det är lätt att fastna i siffror som känns bra: antal registreringar, nedladdningar, sidvisningar, klick. De stiger, grafen pekar uppåt och det känns som framgång. Men de säger nästan ingenting om huruvida produkten faktiskt löser ett problem.",
          "En MVP byggs för att lära, och då måste du mäta rätt saker. Annars optimerar du mot en känsla av framgång i stället för mot verkligt värde — och upptäcker först sent att grunden inte höll.",
        ],
      },
      {
        heading: "Aktivering: når folk fram till värdet?",
        paragraphs: [
          "Det första som betyder något är aktivering — andelen som faktiskt når fram till produktens kärnvärde, inte bara registrerar sig. Om hundra personer skapar konto men bara tio kommer fram till det som gör produkten användbar, har du ett onboarding-problem som överskuggar allt annat.",
          "Definiera tydligt vad 'aha-ögonblicket' är för just er produkt, och mät hur stor andel som kommer dit. Det pekar oftast på den mest värdefulla förbättringen ni kan göra.",
        ],
      },
      {
        heading: "Retention är sanningens ögonblick",
        paragraphs: [
          "Det starkaste enskilda måttet för en MVP är retention: kommer folk tillbaka av sig själva? En produkt som folk återvänder till vecka efter vecka har hittat något verkligt. En som testas en gång och glöms bort har det inte, oavsett hur många som provade.",
          "Titta på om kurvan planar ut på en sund nivå och håller sig där, snarare än på en lansering eller en topp. Det är skillnaden mellan en hink som håller vatten och en med hål i botten.",
        ],
      },
      {
        heading: "Komplettera siffror med samtal",
        paragraphs: [
          "I en MVP-fas är datamängden ofta för liten för att lita blint på siffror. Därför är kvalitativ feedback minst lika viktig. Prata särskilt med dem som testade och försvann — de pekar precis på var produkten brister medan det är billigt att ändra.",
          "Kombinationen är poängen: siffrorna visar vad som händer, samtalen förklarar varför. Den ena utan den andra leder lätt till felslut.",
        ],
      },
      {
        heading: "Välj få mått och var ärlig",
        paragraphs: [
          "Mät inte allt — välj de få tal som faktiskt skulle få er att ändra beslut, och sätt gärna en tröskel i förväg för vad som räknas som framgång. Annars är det lätt att i efterhand tolka vilken data som helst som uppmuntrande.",
          "En MVP med ärlig mätning av aktivering och retention ger dig ett tydligt svar: bygg vidare, justera, eller släpp. Det svaret är hela poängen med att bygga litet först.",
        ],
      },
    ],
  },
  /* ── Aktuella nyheter 2026: Tekniska val ─────────────────────────────────── */
  {
    slug: "managed-vs-egen-infra-2026",
    title: "Managed hosting eller egen server 2026 — vår beslutsguide",
    excerpt:
      "Plattformar som hanterar driften åt dig är billigare och smidigare än någonsin — men inte alltid rätt. Här är hur vi väljer.",
    description:
      "En aktuell beslutsguide 2026 för valet mellan managed hosting och egen infrastruktur — kostnad, kontroll, skalning och var brytpunkten ligger.",
    category: "Tekniska val",
    tags: ["infrastruktur", "hosting", "teknikval", "skalning"],
    readingTime: "8 min läsning",
    publishedAt: "2026-06-01",
    author: "VibeDev",
    heroLabel: "Beslutsguide",
    content: [
      {
        heading: "Standardvalet har förskjutits",
        paragraphs: [
          "2026 är managed-plattformar — där någon annan sköter servrar, skalning, certifikat och en stor del av driften — det naturliga förstavalet för de flesta produkter. De är mogna, prisvärda och låter små team fokusera på produkten i stället för på serverunderhåll.",
          "Men 'standardval' betyder inte 'alltid rätt'. Det finns lägen där egen infrastruktur fortfarande lönar sig, och det är värt att veta var brytpunkten går innan kostnaden eller begränsningarna överraskar er.",
        ],
      },
      {
        heading: "När managed är rätt",
        paragraphs: [
          "För de allra flesta webappar, SaaS-produkter och MVP:er är managed rätt. Ni slipper en hel kategori av arbete — drift, säkerhetspatchar, skalning vid trafiktoppar — och kommer ut snabbare. Ett litet team får effekten av en driftavdelning utan att anställa en.",
          "Det är särskilt rätt tidigt, när hastighet och fokus är viktigare än att optimera varje krona. Att lägga teamets begränsade tid på produkten i stället för på infrastruktur är nästan alltid rätt prioritering i början.",
        ],
      },
      {
        heading: "När egen infrastruktur lönar sig",
        paragraphs: [
          "Egen infrastruktur blir intressant vid tre saker: kostnad i stor skala, specifika krav, och kontroll. Vid hög och jämn belastning kan managed bli dyrt jämfört med egna servrar. Vissa krav — på var data får ligga, på specialiserad hårdvara, på låg latens — kan tvinga fram egen drift.",
          "Och ibland handlar det om kontroll: att inte vara låst vid en leverantörs begränsningar eller prismodell. Men räkna ärligt med vad egen drift kostar i tid och kompetens — den kostnaden är lätt att underskatta.",
        ],
      },
      {
        heading: "Den dolda kostnaden: inlåsning",
        paragraphs: [
          "Managed-plattformars baksida är beroendet. Ju mer ni bygger mot en specifik leverantörs unika funktioner, desto svårare blir det att flytta. Det är sällan ett problem — förrän priset höjs eller en gräns blir kännbar.",
          "Du behöver inte undvika managed för det. Men var medveten om var inlåsningen sitter, och håll de mest kritiska delarna så portabla som rimligt. Det är en billig försäkring mot en dyr framtida flytt.",
        ],
      },
      {
        heading: "Vår tumregel",
        paragraphs: [
          "Börja managed om inget tydligt skäl talar emot. Hastigheten och fokuset är värt mer än de besparingar egen drift kan ge tidigt, och de flesta produkter når aldrig den skala där egen infrastruktur lönar sig.",
          "Ompröva när ni ser konkreta signaler: kostnaden skenar i skala, en gräns börjar skava, eller ett krav tvingar fram det. Då är flytten ett medvetet beslut grundat i verkliga siffror — inte en magkänsla om att 'riktiga' team kör egna servrar.",
        ],
      },
    ],
  },
  {
    slug: "postgres-som-allt-2026",
    title: "Postgres för det mesta 2026 — när en databas räcker långt",
    excerpt:
      "Kö, sök, cache, vektorer — Postgres kan numera ersätta en hel rad specialverktyg. Här är när det är smart och när det inte är det.",
    description:
      "En aktuell teknisk genomgång 2026 av att använda Postgres för mer än bara relationsdata — fördelar, gränser och när du faktiskt behöver ett separat verktyg.",
    category: "Tekniska val",
    tags: ["postgres", "databas", "arkitektur", "teknikval"],
    readingTime: "8 min läsning",
    publishedAt: "2026-05-26",
    author: "VibeDev",
    heroLabel: "Tekniskt",
    content: [
      {
        heading: "En databas som vuxit ut ur sin roll",
        paragraphs: [
          "Postgres har blivit en av de mest pragmatiska grunderna att bygga på 2026. Med tillägg och inbyggda funktioner kan den hantera mycket som tidigare krävde separata system: jobbköer, fulltextsök, geodata, JSON-dokument och till och med vektorsökning för AI-funktioner.",
          "För många produkter betyder det att en enda, välbekant databas täcker behov som annars hade spridits över ett halvdussin tjänster. Det är ofta en stor vinst — men inte en universallösning.",
        ],
      },
      {
        heading: "Varför 'bara Postgres' ofta vinner tidigt",
        paragraphs: [
          "Varje extra system i en arkitektur är något att driva, övervaka, säkra och hålla i synk. Att klara sig med en databas i stället för fem minskar komplexiteten dramatiskt — mindre att lära sig, färre saker som kan gå sönder, en plats att backa upp.",
          "För ett litet team eller en ny produkt är det nästan alltid rätt att börja med Postgres för så mycket som möjligt. Du kan alltid bryta ut en del till ett specialverktyg senare, när ett verkligt behov visat sig.",
        ],
      },
      {
        heading: "Var gränsen går",
        paragraphs: [
          "Postgres är förvånansvärt kapabel, men inte gränslös. En jobbkö i databasen räcker långt men inte i extrem volym. Fulltextsök i Postgres är utmärkt tills kraven på relevans och skala blir riktigt höga. Vektorsök fungerar bra för måttliga datamängder men möter dedikerade verktyg vid riktigt stora.",
          "Tecknet att bryta ut något är konkret: när Postgres-lösningen börjar kräva mer trixande och tuning än det specialverktyg du undvek hade kostat att införa. Då, och inte tidigare, är det dags.",
        ],
      },
      {
        heading: "Glöm inte grunderna — som säkerhet",
        paragraphs: [
          "När en databas bär mycket av produkten blir det desto viktigare att den är rätt konfigurerad. Behörigheter, radnivåsäkerhet där data exponeras, backuper och övervakning är inte detaljer utan kärnan. En felkonfigurerad central databas är en enda punkt där mycket kan gå fel samtidigt.",
          "Ju mer ni lägger i Postgres, desto mer lönar det sig att vara noggrann med just dessa grunder. Bekvämligheten med en databas får inte bli en ursäkt för slarv med åtkomst och drift.",
        ],
      },
      {
        heading: "Pragmatism framför renlärighet",
        paragraphs: [
          "Det finns en dragning mot att välja det 'rätta' specialverktyget för varje behov. Men varje verktyg har en kostnad i komplexitet, och den kostnaden är verklig från dag ett medan vinsten ofta är teoretisk tills ni når skala.",
          "Vår hållning 2026: börja med Postgres för det mesta, mät var det faktiskt brister, och lägg bara till komplexitet där den löser ett verkligt problem. Det ger enklare system som är lättare att förstå, driva och lita på.",
        ],
      },
    ],
  },
  /* ── Aktuella nyheter 2026: Produktstrategi ──────────────────────────────── */
  {
    slug: "prissattning-av-ai-funktioner",
    title: "Prissättning av AI-funktioner — abonnemang, krediter eller användning?",
    excerpt:
      "AI-funktioner har en rörlig kostnad per användning, vilket bryter den klassiska SaaS-prismodellen. Här är hur du tänker rätt.",
    description:
      "En aktuell guide 2026 till att prissätta AI-funktioner: varför fast månadspris kan bli en förlustaffär och hur du väljer mellan abonnemang, krediter och användningsbaserat.",
    category: "Produktstrategi",
    tags: ["prissättning", "ai", "affärsmodell", "saas"],
    readingTime: "8 min läsning",
    publishedAt: "2026-05-31",
    author: "VibeDev",
    heroLabel: "Strategi",
    content: [
      {
        heading: "AI bryter den klassiska SaaS-modellen",
        paragraphs: [
          "Traditionell SaaS prissätts gärna med ett fast månadsbelopp, för marginalkostnaden för ytterligare en användare är nära noll. AI-funktioner förändrar det: varje anrop till en modell kostar pengar, och en intensiv användare kan kosta mångdubbelt mer än en passiv.",
          "Det betyder att ett naivt fast pris kan bli en förlustaffär — era mest aktiva kunder blir era dyraste. Prissättning av AI kräver därför mer tanke än att bara sätta en siffra per månad.",
        ],
      },
      {
        heading: "Tre vanliga modeller",
        paragraphs: [
          "Abonnemang: enkelt och förutsägbart för kunden, men riskabelt om användningen varierar kraftigt — du måste prissätta för att täcka även storförbrukarna. Krediter: kunden köper en pott som förbrukas, vilket kopplar pris till användning men ändå ger en känsla av kontroll. Rent användningsbaserat: betala per användning, rättvist men svårare för kunden att förutse.",
          "Inget är universellt rätt. Valet beror på hur jämn er användning är, hur priskänsliga kunderna är och hur mycket förutsägbarhet de värderar.",
        ],
      },
      {
        heading: "Skydda marginalen utan att straffa lojala kunder",
        paragraphs: [
          "Nyckeln är att er intäkt per kund grovt ska följa er kostnad per kund. Ett vanligt grepp är ett abonnemang som täcker normal användning, med tydliga gränser och möjlighet att köpa till för den som vill mer. Då får majoriteten enkelhet medan storförbrukarna betalar för sin förbrukning.",
          "Undvik att bygga en modell där era bästa, mest aktiva kunder blir de mest olönsamma. Det skapar en absurd situation där framgång gör ont, och det leder förr eller senare till panikhöjningar som skadar förtroendet.",
        ],
      },
      {
        heading: "Var transparent — överraskningar dödar förtroende",
        paragraphs: [
          "Användningsbaserade modeller har en känd risk: räkningschock. En kund som får en oväntat hög faktura blir inte bara missnöjd, utan slutar lita på produkten. Tydliga gränser, varningar när man närmar sig dem och möjligheten att sätta tak är inte detaljer — de är kärnan i en hållbar modell.",
          "Förutsägbarhet är värt mycket för köparen. Även en något dyrare men begriplig modell vinner ofta över en billigare men oförutsägbar.",
        ],
      },
      {
        heading: "Börja enkelt, justera med data",
        paragraphs: [
          "Du behöver inte den perfekta modellen från start, men du behöver förstå din kostnadsstruktur innan du sätter priset. Mät vad en typisk och en intensiv kund faktiskt kostar er, och prissätt utifrån det snarare än utifrån en gissning.",
          "Börja med en enkel, begriplig modell och var beredd att justera när ni ser verklig användning. Prissättning av AI är inte ett engångsbeslut — det är något ni förfinar i takt med att ni lär er hur produkten används.",
        ],
      },
    ],
  },
  {
    slug: "konkurrera-nar-alla-bygger-med-ai",
    title: "Konkurrera när alla bygger med AI — var finns vallgraven?",
    excerpt:
      "När vem som helst kan bygga en snygg AI-funktion på en helg, vad gör då din produkt svår att kopiera? Här är var försvaret faktiskt sitter.",
    description:
      "En aktuell strategigenomgång 2026: när AI gör funktioner till en commodity, var ligger en produkts verkliga konkurrensfördel — och var ligger den inte?",
    category: "Produktstrategi",
    tags: ["strategi", "ai", "konkurrens", "produktstrategi"],
    readingTime: "8 min läsning",
    publishedAt: "2026-05-24",
    author: "VibeDev",
    heroLabel: "Strategi",
    content: [
      {
        heading: "Funktioner är inte längre en vallgrav",
        paragraphs: [
          "När en konkurrent kan bygga en motsvarande AI-funktion på en helg är själva funktionen inte längre ett försvar. Det som kändes som en unik förmåga 2023 är ofta en kryssruta i alla konkurrenters produkter 2026. Att tävla på funktionslistan blir en kapplöpning ingen vinner.",
          "Det betyder inte att produkten är värdelös — det betyder att vallgraven flyttat. Frågan blir: vad i er produkt är faktiskt svårt att kopiera?",
        ],
      },
      {
        heading: "Data och distribution håller",
        paragraphs: [
          "Två klassiska vallgravar har snarare stärkts av AI. Den första är proprietär data: information som bara ni har och som gör er AI bättre på just ert problem än en generisk modell. Den är svår att kopiera eftersom den byggs upp över tid genom användning.",
          "Den andra är distribution: att redan ha kunderna, förtroendet och de inarbetade arbetsflödena. En konkurrent kan kopiera funktionen men inte över en natt kopiera er relation till marknaden. Båda är trögrörliga på ett sätt som faktiskt skyddar.",
        ],
      },
      {
        heading: "Integration och arbetsflöde är svårkopierat",
        paragraphs: [
          "En enskild funktion är lätt att härma. En produkt som sitter djupt inbäddad i kundens arbetsflöde, integrerad med deras andra system och anpassad efter hur de faktiskt jobbar, är det inte. Bytet kostar kunden för mycket.",
          "Det är därför det ofta lönar sig att bygga djupt snarare än brett: lös ett verkligt arbetsflöde hela vägen, i stället för att lägga till ytterligare en ytlig AI-funktion. Djupet är där bytkostnaden — och därmed försvaret — byggs.",
        ],
      },
      {
        heading: "Utförande och förtroende avgör",
        paragraphs: [
          "När alla har tillgång till samma modeller blir hur väl ni använder dem avgörande. En AI-funktion som är genomtänkt, pålitlig och faktiskt löser problemet slår en som imponerar i demo men sviker i vardagen. Kvaliteten i utförandet är en vallgrav i sig.",
          "Förtroende hör ihop med det. I en värld full av AI-funktioner som lovar mer än de håller blir en produkt som konsekvent levererar något folk vågar lita på. Det byggs långsamt och förloras snabbt — vilket gör det värdefullt.",
        ],
      },
      {
        heading: "Sluta tävla på det som blivit gratis",
        paragraphs: [
          "Den strategiska slutsatsen 2026 är att flytta tävlan bort från funktioner som blivit en commodity. Det vore slöseri att jaga en funktionsparitet som ändå inte ger något försvar.",
          "Lägg energin där den faktiskt bygger något varaktigt: data ni unikt kan samla, ett arbetsflöde ni löser djupare än andra, en relation och ett förtroende som tar tid att kopiera. Det är där en produkt blir svår att konkurrera ut — även när alla har samma AI.",
        ],
      },
    ],
  },
  /* ── Aktuella nyheter 2026: Integrationer ────────────────────────────────── */
  {
    slug: "klarna-integration-guide",
    title: "Klarna-integration — så kopplar du svensk checkout rätt",
    excerpt:
      "Klarna är en självklarhet i svensk e-handel, men integrationen har detaljer som lätt blir fel. Här är vad du behöver tänka på.",
    description:
      "En praktisk guide till att integrera Klarna i en e-handel — betalflödet, statushantering, webhooks och de vanligaste fallgroparna.",
    category: "Integrationer",
    tags: ["klarna", "integration", "e-handel", "betalningar"],
    readingTime: "7 min läsning",
    publishedAt: "2026-05-30",
    author: "VibeDev",
    heroLabel: "Integration",
    content: [
      {
        heading: "Klarna är förväntat i svensk e-handel",
        paragraphs: [
          "För svenska kunder är Klarna närmast en självklarhet i kassan — faktura, dela upp betalningen, eller betala direkt. Att erbjuda det är ofta avgörande för konvertering. Men en Klarna-integration är mer än en betalknapp; den har ett betalflöde och en statuslivscykel som måste hanteras rätt.",
          "Den här guiden går igenom det du behöver tänka på för att kopplingen ska bli pålitlig, inte bara fungera i en demo.",
        ],
      },
      {
        heading: "Förstå betalflödets faser",
        paragraphs: [
          "Klarna skiljer på olika faser i en betalning — att en order auktoriseras, att den fångas (när du levererar), och eventuella återbetalningar eller annulleringar. En vanlig miss är att behandla 'order lagd' som 'betalning klar'. Pengarna fångas typiskt först när du faktiskt skickar varan.",
          "Bygg din orderlogik kring de här faserna. Att blanda ihop dem leder till bokföring som inte stämmer och till kunder som debiteras vid fel tillfälle — två problem du verkligen inte vill ha.",
        ],
      },
      {
        heading: "Webhooks och statusuppdateringar",
        paragraphs: [
          "Betalstatus ändras inte alltid i samma ögonblick som kunden klickar — en betalning kan bli godkänd, nekad eller ändrad senare. Klarna meddelar din tjänst om förändringar, och din integration måste lyssna på det och hålla orderns status i synk.",
          "Verifiera att uppdateringarna faktiskt kommer från Klarna, och gör hanteringen idempotent så att en upprepad notis inte dubbelbehandlar en order. Det är samma robusthetsprinciper som för all betalintegration.",
        ],
      },
      {
        heading: "Testa kantfallen, inte bara lyckat köp",
        paragraphs: [
          "Det glada flödet — kund betalar, allt funkar — är det enkla. Det som ställer till det i produktion är kantfallen: en nekad betalning, en delvis återbetalning, en annullerad order, en kund som avbryter mitt i. Varje sådant fall måste din integration hantera utan att lämna ordern i ett oklart tillstånd.",
          "Testa dem aktivt i Klarnas testmiljö innan lansering. En betalintegration som bara testats på det lyckade fallet är en integration som kommer att överraska dig.",
        ],
      },
      {
        heading: "Logga allt som rör pengar",
        paragraphs: [
          "Med betalningar är spårbarhet inte valfritt. Logga varje statusövergång, webhook och åtgärd med tydlig orderreferens. När en kund hör av sig om en debitering, eller bokföringen inte stämmer, måste du snabbt kunna rekonstruera exakt vad som hände.",
          "En välbyggd Klarna-integration handlar mindre om själva API-anropen och mer om att hantera statuslivscykeln korrekt, robust och spårbart. Får du det rätt blir det en koppling du kan lita på i åratal.",
        ],
      },
    ],
  },
  {
    slug: "stripe-integration-guide",
    title: "Stripe-integration — betalningar som skalar utan krångel",
    excerpt:
      "Stripe är förstavalet för många som bygger egna betalflöden. Här är hur du integrerar det rätt — och de misstag som kostar dig.",
    description:
      "En praktisk guide till att integrera Stripe i en produkt — betalflödet, webhooks som sanningskälla, abonnemang och vanliga fallgropar.",
    category: "Integrationer",
    tags: ["stripe", "integration", "betalningar", "saas"],
    readingTime: "8 min läsning",
    publishedAt: "2026-05-23",
    author: "VibeDev",
    heroLabel: "Integration",
    content: [
      {
        heading: "Varför Stripe är förstavalet för många",
        paragraphs: [
          "När du bygger ett eget betalflöde — för en SaaS, en marknadsplats eller en produkt utanför de färdiga e-handelsplattformarna — är Stripe ofta det självklara valet. Dokumentationen är stark, verktygen är utvecklarvänliga och det hanterar allt från engångsköp till abonnemang och utbetalningar.",
          "Men kraftfullt är inte detsamma som självgående. En Stripe-integration som byggs slarvigt blir en källa till tysta fel som först syns i intäkterna. Här är principerna som gör den robust.",
        ],
      },
      {
        heading: "Webhooks är din sanningskälla",
        paragraphs: [
          "Det enskilt viktigaste att förstå: lita inte på vad som händer i kundens webbläsare för att avgöra om en betalning gått igenom. Användaren kan stänga fliken innan flödet är klart. Stripe skickar webhooks om vad som faktiskt hänt, och det är dem du ska basera din orderlogik på.",
          "Bygg din betalstatus kring inkommande webhooks, inte kring redirect-svaret. Det är skillnaden mellan en integration som stämmer och en som ibland missar betalningar eller levererar utan att ha tagit betalt.",
        ],
      },
      {
        heading: "Verifiera och gör allt idempotent",
        paragraphs: [
          "Verifiera signaturen på varje webhook så att ingen kan skicka falska betalhändelser till din endpoint. Och utgå från att webhooks kan komma mer än en gång — gör hanteringen idempotent så att samma händelse aldrig leder till dubbel leverans eller dubbel bokföring.",
          "Använd även idempotensnycklar på dina egna anrop mot Stripe, så att ett nätverksfel och en automatisk retry inte råkar skapa två debiteringar. Stripe stödjer det inbyggt — utnyttja det.",
        ],
      },
      {
        heading: "Abonnemang har sin egen komplexitet",
        paragraphs: [
          "Bygger du återkommande betalningar tillkommer en hel värld av tillstånd: provperioder, misslyckade förnyelser, uppgraderingar mitt i en period, uppsägningar, betalningar som försöker igen. Stripe hanterar mekaniken, men din produkt måste reagera rätt på varje övergång.",
          "Särskilt misslyckade förnyelser är värda omsorg — en kunds kort som går ut ska leda till ett vänligt påminnelseflöde, inte till en tyst avstängning eller en fortsatt gratis tjänst. Mappa upp tillstånden medvetet.",
        ],
      },
      {
        heading: "Testa i testläge och logga noggrant",
        paragraphs: [
          "Stripe har ett komplett testläge med testkort för alla scenarier — lyckat, nekat, kräver autentisering, misslyckad förnyelse. Använd det för att gå igenom kantfallen innan du går live, inte efter att en riktig kund stött på dem.",
          "Och som med all betalintegration: logga varje händelse med tydlig referens. När något rör pengar måste du kunna svara exakt på vad som hände, för vem och när. Får du webhooks, idempotens och loggning rätt blir Stripe en grund som skalar utan dramatik.",
        ],
      },
    ],
  },
  /* ── Kampanj: 10 säljande inlägg ─────────────────────────────────────────── */
  {
    slug: "excel-kaos-till-skalbar-webbapp",
    title: "Från internt Excel-kaos till skalbar webbapp — tecknen på att ni vuxit ur era verktyg",
    excerpt:
      "Affärskritiska flöden som hänger på sega kalkylark är en dold kostnad. Här är tecknen på att det är dags att utveckla en egen webbapp och automatisera interna processer.",
    description:
      "När era viktigaste processer drivs av Excel betalar ni en dold skatt varje dag. Lär dig känna igen tecknen och förstå värdet av skräddarsydd mjukvara som automatiserar flödet.",
    category: "Produktstrategi",
    tags: ["webbapp", "automatisera interna processer", "skräddarsydd mjukvara", "internt system"],
    readingTime: "7 min läsning",
    publishedAt: "2026-06-20",
    author: "VibeDev",
    heroLabel: "Guide",
    content: [
      {
        heading: "När kalkylarket blev ett affärssystem ni aldrig valde",
        paragraphs: [
          "Det börjar alltid oskyldigt. Ett kalkylark för ordrar, ett till för lager, ett tredje för något HR egentligen skulle äga. Två år senare driver en handfull Excel-filer era mest affärskritiska flöden — och varje gång någon är sjuk, slutar eller råkar sortera om en kolumn stannar verksamheten upp.",
          "Om det känns igen är ni förmodligen redo att utveckla en egen webbapp. Frågan är inte om Excel fungerar, för det gör det på sätt och vis. Frågan är vad det kostar er att låta affärskritiska processer vila på ett verktyg som aldrig var byggt för det.",
        ],
      },
      {
        heading: "Den dolda skatten ni betalar varje dag",
        paragraphs: [
          "Problemet med att låta ett kalkylark bli ett system är att det saknar allt som ett riktigt system ger. Det finns ingen sanningskälla — fem versioner av samma fil ger fem olika svar. Det kräver manuell handpåläggning där någon kopierar, klistrar och dubbelkollar. Det har ingen spårbarhet, så ingen vet vem som ändrade vad. Och mänskliga fel skalar tyst genom hela kedjan via en felaktig formel.",
          "Den verkliga kostnaden är inte Office-licensen. Det är timmarna, felen och risken — och att era bästa medarbetare blir mänsklig copy-paste i stället för att driva verksamheten framåt.",
        ],
      },
      {
        heading: "Fem tecken på att ni vuxit ur era verktyg",
        paragraphs: [
          "Det första tecknet är att en enda person i praktiken är systemet: slutar hen försvinner kunskapen om hur flödet fungerar. Det andra är att ni byggt makron på makron tills arket blivit ett skört korthus som ingen vågar röra. Det tredje är att samma data matas in manuellt på flera ställen.",
          "Det fjärde tecknet är allvarligast: ni börjar säga nej till tillväxt för att flödet inte skalar. Och det femte är att felen kostar riktiga pengar — felaktiga lagersaldon, missade leveranser eller fakturafel som beror på handpåläggning. Ett eller två av dessa? Håll koll. Tre eller fler? Då är det inte längre en fråga om ni ska bygga, utan när.",
        ],
      },
      {
        heading: "Vad skräddarsydd mjukvara faktiskt löser",
        paragraphs: [
          "Att automatisera interna processer handlar inte om att digitalisera för sakens skull, utan om att ta bort friktion där den kostar mest. En genomtänkt intern app ger er en sanningskälla där all data finns på ett ställe, inbyggd logik där reglerna som idag lever i någons huvud kodas in, samt behörigheter och spårbarhet så att rätt person ser rätt sak och varje ändring loggas.",
          "Skillnaden mot ett färdigt standardsystem är att skräddarsydd mjukvara formas efter ert sätt att arbeta — inte tvärtom. Ni slipper böja verksamheten efter en generisk produkts begränsningar, och ni äger både logiken och datan.",
        ],
      },
      {
        heading: "Det behöver varken vara dyrt eller ta ett år",
        paragraphs: [
          "Bilden av skräddarsytt som dyrt och långsamt är föråldrad. Med moderna, AI-stödda arbetssätt bygger vi på en bråkdel av tiden jämfört med en traditionell IT-byrå, och vi börjar smått: en skarp första version som löser ert mest smärtsamma flöde först, så att ni får värde på veckor i stället för att vänta på ett projekt i tolv månader.",
          "Eftersom vi jobbar med fast pris vet ni dessutom exakt vad det kostar innan vi börjar. Sitter ni fast i Excel-kaos är nästa steg enkelt: boka ett förutsättningslöst möte med oss, så tittar vi tillsammans på era flöden och pekar ut var en skräddarsydd webbapp ger snabbast effekt.",
        ],
      },
    ],
  },
  {
    slug: "lovable-bolt-vibedev-ai-byggare",
    title: "Lovable, Bolt och VibeDev — hur nästa generations AI-byggare förändrar produktutveckling",
    excerpt:
      "AI-verktyg gör att vi kan leverera färdiga produkter på veckor i stället för månader. Så ser modern produktutveckling ut — och så skiljer den sig från traditionell kodning.",
    description:
      "Lovable, Bolt och Cursor förändrar hur digitala produkter byggs. Lär dig skillnaden mot traditionell kodning och hur bygga app med AI ger snabb mjukvaruutveckling utan att offra kvalitet.",
    category: "Vibecoding",
    tags: ["modern produktutveckling", "bygga app med AI", "snabb mjukvaruutveckling", "lovable"],
    readingTime: "7 min läsning",
    publishedAt: "2026-06-19",
    author: "VibeDev",
    heroLabel: "Perspektiv",
    content: [
      {
        heading: "Ett tyst skifte i hur produkter byggs",
        paragraphs: [
          "Det har skett ett tyst skifte i hur digitala produkter byggs. Där det förut tog månader att gå från idé till fungerande app gör verktyg som Lovable, Bolt och Cursor att samma resa kan ta veckor. Det är inte en framtidsspaning — det är så modern produktutveckling ser ut redan idag, och det är kärnan i hur vi arbetar.",
          "För en VD eller produktägare är poängen inte verktygen i sig, utan vad de möjliggör: att validera en idé med riktiga användare innan konkurrenterna ens skrivit klart sin kravspec.",
        ],
      },
      {
        heading: "Skillnaden mot traditionell kodning",
        paragraphs: [
          "Traditionell mjukvaruutveckling är linjär och långsam: kravspec, design, utveckling, test och leverans i sekventiella steg där varje fas väntar på den förra. Att bygga app med AI vänder upp och ner på det. I stället för wireframes som ingen kan testa får ni en klickbar prototyp samma dag, och ändringar som förut tog en hel sprint tar nu minuter.",
          "Resultatet är snabb mjukvaruutveckling utan att kvaliteten faller, för att de svåra besluten fortfarande är mänskliga. AI:n sköter det repetitiva; vi lägger tiden på arkitektur, datamodell och affärslogik.",
        ],
      },
      {
        heading: "Vibecoding är inte att låta AI gissa",
        paragraphs: [
          "Den vanligaste missuppfattningen är att AI-byggande betyder att man släpper kontrollen. Tvärtom. Lovable och Bolt är fantastiska på att snabbt få upp en yta, men en produktion-redo produkt kräver senior arkitektur: säkerhet, datamodell, integrationer och skalbarhet.",
          "Vår superkraft är kombinationen — AI-accelererad exekvering ovanpå senior ingenjörskonst. Vi använder rätt verktyg för rätt sak: snabba byggare för prototyper, och mer kraftfulla agentverktyg för den riktiga kodbasen.",
        ],
      },
      {
        heading: "Vad det betyder för er affär",
        paragraphs: [
          "Effekten för verksamheten är konkret. Ni kommer snabbare till marknaden och kan testa en idé skarpt innan ni satsar stort. Ni sänker risken genom att bygga smått, testa och justera i stället för att lägga allt på en enda stor leverans. Och eftersom bygget går snabbare kan vi jobba med fast pris, vilket gör kostnaden förutsägbar.",
          "Det handlar alltså inte om att byta ut hantverket mot en knapp, utan om att ta bort det långsamma och dyra som aldrig tillförde värde — och lägga den tiden på det som faktiskt avgör om produkten lyckas.",
        ],
      },
      {
        heading: "Vill ni se vad ni kan ha lanserat om sex veckor?",
        paragraphs: [
          "Nästa generations AI-byggare förändrar inte bara hur snabbt vi bygger, utan vad som ens är möjligt för ett litet, vasst team att leverera. Det öppnar dörren för bolag som tidigare tyckte att skräddarsytt var för dyrt eller för långsamt.",
          "Vill ni se konkret hur arbetssättet skulle fungera för just er produkt? Testa er idé med oss — boka ett möte, så visar vi hur vägen från idé till lansering ser ut med modern, AI-stödd produktutveckling.",
        ],
      },
    ],
  },
  {
    slug: "skraddarsydd-brygga-e-handel-affarssystem",
    title: "När standardsystemen inte räcker — bygg en skräddarsydd brygga mellan e-handel och affärssystem",
    excerpt:
      "Växande e-handlare fastnar i manuell handpåläggning mellan butik och affärssystem. Så bygger du en skräddarsydd API-integration där vanliga plugins sviker.",
    description:
      "En guide för e-handlare som vuxit ur färdiga plugins: hur en skräddarsydd integration kopplar ihop Shopify eller Starweb med Fortnox och andra affärssystem — robust och utan handpåläggning.",
    category: "Integrationer",
    tags: ["api-integration e-handel", "koppla affärssystem", "skräddarsydda integrationer", "fortnox integration"],
    readingTime: "8 min läsning",
    publishedAt: "2026-06-18",
    author: "VibeDev",
    heroLabel: "Integration",
    content: [
      {
        heading: "Symptomet: någon sitter och kopierar data för hand",
        paragraphs: [
          "Du växer, ordrarna strömmar in, och någonstans mellan butiken och bokföringen sitter en person och kopierar data manuellt. Det är symptomet på att standardpluggarna inte längre räcker, och att en API-integration för e-handel byggd för just era flöden börjar bli lönsam.",
          "Färdiga plugins är gjorda för det vanligaste fallet. Så fort er verksamhet har en egenhet — en speciell artikellogik, en ovanlig momshantering, ett extra lager eller en kombination av system — börjar de svika. Då blir den manuella handpåläggningen er tillväxtbroms.",
        ],
      },
      {
        heading: "Varför färdiga plugins sviker när ni växer",
        paragraphs: [
          "En plugin gör ett antagande om hur er butik och ert affärssystem ser ut. Det håller tills ni gör något plugin-utvecklaren inte tänkt på. Ofta kan den bara mappa fält rakt av, hanterar inte era specialfall, och ger ingen kontroll när något går fel — ordrar fastnar tyst utan att någon larmas.",
          "Att koppla affärssystem som Fortnox mot en butik på Shopify eller Starweb handlar sällan om att flytta data. Det handlar om att översätta mellan två världar som beskriver samma sak olika: artikelnummer som inte matchar, momssatser som uttrycks olika, fraktrader och rabatter som måste bokföras rätt.",
        ],
      },
      {
        heading: "Vad en skräddarsydd brygga faktiskt gör",
        paragraphs: [
          "En skräddarsydd integration är ett tunt, robust lager mellan systemen som äger översättningen och felhanteringen. Den normaliserar data åt båda håll, mappar artiklar och moms explicit efter era regler, och lägger arbetet i en kö så att en order aldrig kopplar kundens kassa direkt till ett externt system som kan vara långsamt eller nere.",
          "Den är dessutom idempotent — samma order kan aldrig bokföras dubbelt — och den larmar aktivt när något fallerar. En tyst trasig integration upptäcks annars först i månadsskiftet när siffrorna inte stämmer, och då är felsökningen mycket dyrare.",
        ],
      },
      {
        heading: "Fortnox-integration i praktiken",
        paragraphs: [
          "En Fortnox-integration är kraftfull men har sina egenheter. Rate limits sätter taket tidigare än man tror vid trafiktoppar, artikelnummer och momskoder är de tysta felkällorna, och token-hanteringen i OAuth-flödet måste vara robust så att synken inte tyst tystnar när en token löper ut.",
          "Det här är precis den sortens komplexitet där färdiga lösningar tar slut och senior erfarenhet gör skillnad. Vi har byggt den typen av kopplingar i flera e-handelsprojekt och vet var fällorna sitter.",
        ],
      },
      {
        heading: "Låt oss titta på er arkitektur",
        paragraphs: [
          "Om er tillväxt bromsas av manuellt arbete mellan butik och affärssystem är en skräddarsydd brygga ofta den investering som betalar sig snabbast — den frigör timmar varje vecka och tar bort en hel kategori av fel.",
          "Boka ett möte så tittar vi på er arkitektur, kartlägger flödena mellan era system och föreslår var en skräddarsydd integration ger störst effekt först.",
        ],
      },
    ],
  },
  {
    slug: "bygga-egen-ai-agent-produktion",
    title: "Att bygga en egen AI-agent — från experiment i sandlådan till affärsnytta i produktion",
    excerpt:
      "Gå bortom generiska chatt-prompter. Så bygger företag autonoma AI-agenter som faktiskt utför arbete i bakgrunden — och vad som krävs för att de ska hålla i produktion.",
    description:
      "En praktisk guide till att utveckla en AI-agent som skapar verklig affärsnytta: skillnaden mot en chatt, var agenter passar, och hur du automatiserar med AI på ett säkert och pålitligt sätt.",
    category: "AI i produkter",
    tags: ["utveckla ai-agent", "ai i företag", "automatisera med ai", "ai-agent"],
    readingTime: "8 min läsning",
    publishedAt: "2026-06-17",
    author: "VibeDev",
    heroLabel: "Guide",
    content: [
      {
        heading: "Skillnaden mellan en chatt och en agent",
        paragraphs: [
          "De flesta företags första möte med AI är en chattruta: någon ställer en fråga och får ett svar. Det är användbart, men det är inte en agent. Att utveckla en AI-agent handlar om något mer kraftfullt — ett system som tar ett mål, planerar stegen, använder verktyg och faktiskt utför arbete, inte bara svarar.",
          "Skillnaden är som mellan en kollega som svarar på frågor och en som du kan delegera en hel uppgift till. Det är där den verkliga affärsnyttan av AI i företag börjar.",
        ],
      },
      {
        heading: "Var agenter faktiskt skapar värde",
        paragraphs: [
          "De bästa agentanvändningarna är ofta osynliga och pågår i bakgrunden. Det kan vara att automatiskt sortera och berika inkommande data, att bevaka en informationskälla och agera när något förändras, att kategorisera och dirigera ärenden, eller att utföra repetitivt underhållsarbete som annars äter en medarbetares dag.",
          "Gemensamt för dem är att de tar en uppgift som följer ett mönster men kräver omdöme, och låter en agent sköta grovjobbet. Att automatisera med AI på det sättet frigör människor till det som faktiskt kräver en människa.",
        ],
      },
      {
        heading: "Från imponerande demo till pålitlig produktion",
        paragraphs: [
          "En agent som imponerar i en demo och en agent som håller i produktion är två olika saker. I demon kör man det lyckade fallet några gånger. I produktion möter den verkligheten: trasig indata, externa system som är nere, kantfall ingen tänkt på. Demoeffekten — att något fungerar i 80 procent av fallen men fallerar oförutsägbart i resten — är den vanligaste anledningen till att AI-projekt fastnar.",
          "Vägen till produktion handlar om att bygga för felen: tydliga gränser, fallback-logik, loggning av varje steg och en mänsklig grind för det som är irreversibelt. Det är mindre glamoröst än prompten, men det är vad som avgör om agenten skapar värde eller blir ett experiment som aldrig lämnar sandlådan.",
        ],
      },
      {
        heading: "Säkerhet och behörigheter är inte valfritt",
        paragraphs: [
          "En agent som kan agera är också en ny angreppsyta. Den dyraste designmissen är att ge agenten breda behörigheter för att det är smidigt. En agent som kan läsa hela databasen, skicka mejl och radera poster är en risk som väntar på rätt input.",
          "Principen är minsta möjliga behörighet: ge agenten exakt de verktyg och den åtkomst uppgiften kräver, inte mer. Läsbehörighet är säkrare än skriv, och varje åtgärd som inte går att ångra ska ha en spärr. Det är så ni får nyttan utan att öppna en dörr ni inte vill ha öppen.",
        ],
      },
      {
        heading: "Börja med en uppgift, inte en vision",
        paragraphs: [
          "Det vanligaste misstaget är att försöka bygga en allätande superassistent. Det blir nästan alltid sämre än en fokuserad agent som gör en konkret sak riktigt bra. Välj den enskilt mest tidskrävande, mönsterbundna uppgiften ni har och låt en agent ta den först.",
          "Funderar ni på var en AI-agent skulle göra mest nytta hos er? Boka ett förutsättningslöst möte, så hjälper vi er hitta rätt första uppgift och skissar på hur en agent skulle byggas för att faktiskt klara den i produktion.",
        ],
      },
    ],
  },
  {
    slug: "darfor-misslyckas-it-upphandlingar",
    title: "Därför misslyckas traditionella IT-upphandlingar — och hur vårt arbetssätt räddar budgeten",
    excerpt:
      "Stela kravspecar och timdebitering är en fälla som spränger budgetar. Så undviker du den med fast pris, snabba iterationer och fokus på en skarp MVP.",
    description:
      "Traditionella IT-upphandlingar bygger på antaganden som sällan håller. Lär dig varför de spräcker budgeten och hur agil produktutveckling med fast pris ger bättre resultat.",
    category: "Produktstrategi",
    tags: ["it-upphandling mjukvara", "fast pris utveckling", "agil produktutveckling", "budget"],
    readingTime: "7 min läsning",
    publishedAt: "2026-06-16",
    author: "VibeDev",
    heroLabel: "Perspektiv",
    content: [
      {
        heading: "Felet sitter inbyggt i modellen",
        paragraphs: [
          "En traditionell IT-upphandling för mjukvara bygger på en tilltalande men felaktig idé: att man kan specificera exakt vad som ska byggas i förväg, lägga ut det, och få tillbaka precis det. Verkligheten är att ingen vet exakt vad som behövs förrän man börjat bygga och testa med riktiga användare.",
          "Resultatet är förutsägbart. Kravspecen blir antingen för stel för att rymma det man lär sig på vägen, eller så fylls den på med ändringar som var och en debiteras extra. Båda vägar leder till samma ställe: överskriden budget och en produkt som ändå inte träffar rätt.",
        ],
      },
      {
        heading: "Timdebiteringsfällan",
        paragraphs: [
          "Den klassiska modellen tar betalt per timme. Det skapar ett incitament som pekar åt fel håll: leverantören tjänar mer ju längre projektet tar. Det betyder inte att alla är ohederliga, men det betyder att ingen i upplägget belönas för att vara snabb eller skära bort onödigt.",
          "För er som beställare blir kostnaden oförutsägbar. Varje fråga, varje möte och varje ändring tickar, och slutnotan är okänd tills projektet är klart. Det gör det svårt att budgetera och ännu svårare att våga prova nytt.",
        ],
      },
      {
        heading: "Stora leveranser döljer risken till slutet",
        paragraphs: [
          "Den traditionella modellen samlar dessutom risken på ett ställe: i den stora slutleveransen. Man bygger i månader och visar resultatet sent. Om det visar sig att man byggt fel sak — eller rätt sak på fel sätt — upptäcks det när nästan hela budgeten redan är spenderad.",
          "Agil produktutveckling vänder på det. Genom att leverera i små, fungerande steg ser man tidigt om man är på rätt väg, medan det fortfarande är billigt att justera. Risken sprids ut och hanteras löpande i stället för att samlas till en dyr överraskning.",
        ],
      },
      {
        heading: "Vårt arbetssätt: fast pris och en skarp MVP först",
        paragraphs: [
          "Vi gör tvärtom mot den gamla modellen. Vi börjar med en tydligt avgränsad MVP som löser ert viktigaste behov först, och vi sätter ett fast pris på ett tydligt scope. Då vet ni exakt vad det kostar innan vi börjar, och vi belönas för att leverera effektivt snarare än för att dra ut på tiden.",
          "Ändringar hanteras öppet: vi beskriver vad ett tillägg innebär, vad det kostar och hur det påverkar tidsplanen, så bestämmer ni. Inget byggs i skymundan och inget faktureras i efterhand utan att ni sagt ja.",
        ],
      },
      {
        heading: "Rädda budgeten innan upphandlingen börjar",
        paragraphs: [
          "Det bästa sättet att undvika en misslyckad IT-upphandling är att inte gå in i den gamla modellens fälla från början. En förutsägbar kostnad, snabba iterationer och fokus på att få ut något skarpt tidigt slår en tjock kravspec nästan varje gång.",
          "Står ni inför en upphandling eller ett större utvecklingsprojekt? Boka ett möte så går vi igenom ert behov och visar hur ett upplägg med fast pris och tidig MVP skulle se ut för just er.",
        ],
      },
    ],
  },
  {
    slug: "innovationsfallan-startup-snabbhet",
    title: "Innovationsfällan — så bygger etablerade bolag nya digitala tjänster med en startups snabbhet",
    excerpt:
      "Stora bolag vill förnya sig men hämmas av interna processer. Så fungerar en extern, blixtsnabb tech-avdelning som testar och validerar nya idéer på riktigt.",
    description:
      "Etablerade bolag har resurserna men inte farten att lansera digitala produkter. Lär dig hur en innovationspartner och MVP-utveckling låter er röra er som en startup.",
    category: "MVP-utveckling",
    tags: ["lansera digital produkt", "mvp utveckling", "innovationspartner", "innovation"],
    readingTime: "7 min läsning",
    publishedAt: "2026-06-13",
    author: "VibeDev",
    heroLabel: "Strategi",
    content: [
      {
        heading: "Resurserna finns — men inte farten",
        paragraphs: [
          "Etablerade bolag har något de flesta startups bara drömmer om: kunder, kapital, data och distribution. Ändå är det ofta startupen som vinner kapplöpningen om en ny digital tjänst. Inte för att den har mer resurser, utan för att den rör sig snabbare.",
          "Det är innovationsfällan. Samma struktur som gör ett stort bolag stabilt och effektivt i sin kärnverksamhet gör det långsamt när det ska prova något nytt. Beslut tar tid, processer är byggda för att minimera risk, och en ny idé hinner tappa luft innan den ens fått testas.",
        ],
      },
      {
        heading: "Varför interna processer bromsar innovation",
        paragraphs: [
          "Ironin är att det som bromsar oftast är välmenande. Budgetcykler, prioriteringsmöten, IT-avdelningar som redan är fullbelagda med drift, och en helt rimlig ovilja att röra produktionssystem — allt det skyddar kärnaffären men kväver experiment.",
          "En ny digital tjänst behöver det motsatta klimatet: snabba beslut, frihet att testa, och acceptans för att de flesta idéer behöver justeras eller läggas ner. Det är svårt att skapa det inuti en organisation byggd för stabilitet.",
        ],
      },
      {
        heading: "En extern tech-avdelning som rör sig som en startup",
        paragraphs: [
          "Lösningen är inte att bygga om hela organisationen, utan att lägga innovationsarbetet där det kan röra sig fritt. Som innovationspartner fungerar vi som en extern, blixtsnabb tech-avdelning: vi tar en idé, bygger en skarp MVP och får den i händerna på riktiga användare medan den interna processen fortfarande hade varit i uppstartsfasen.",
          "Ni får startupens fart utan att riskera kärnaffären. Experimentet sker vid sidan om, kopplat till er kunskap och era resurser, men utan att fastna i de processer som annars hade bromsat det.",
        ],
      },
      {
        heading: "Validera billigt innan ni satsar stort",
        paragraphs: [
          "Poängen med MVP-utveckling är att lära, inte att leverera en färdig produkt direkt. En skarp första version svarar på den enda fråga som spelar roll tidigt: vill någon faktiskt ha det här? Det svaret är värt mer än någon marknadsanalys, och det kostar en bråkdel av en full satsning.",
          "Faller idén lär ni er det billigt och tidigt. Håller den har ni redan ett fungerande fundament att bygga vidare på, med riktig användarfeedback som visar vägen.",
        ],
      },
      {
        heading: "Testa er nästa idé med oss",
        paragraphs: [
          "Innovationsfällan är inte ett tecken på att ert bolag är dåligt på innovation — den är en naturlig följd av att vara bra på att driva en stabil verksamhet. Lösningen är att ge nya idéer ett annat tempo och en annan miljö att växa i.",
          "Har ni en idé som fastnat mellan möten och prioriteringar? Boka ett förutsättningslöst möte, så visar vi hur vi kan testa och validera den med en startups snabbhet — och er trygghet i ryggen.",
        ],
      },
    ],
  },
  {
    slug: "bygga-eller-kopa-egen-saas",
    title: "Bygga eller köpa? Så vet du när det är dags att utveckla en egen SaaS-plattform",
    excerpt:
      "Beslutsunderlag för ledningsgrupper: när blir licenskostnader och begränsningar i färdiga system dyrare än att äga sin egen tech-stack och sin egen data?",
    description:
      "En guide för ledningsgrupper som väger skräddarsytt system mot standardsystem. Lär dig när det lönar sig att utveckla en egen SaaS-plattform och äga både logik och data.",
    category: "Tekniska val",
    tags: ["utveckla saas plattform", "skräddarsytt system vs standardsystem", "teknikval", "bygga eller köpa"],
    readingTime: "8 min läsning",
    publishedAt: "2026-06-12",
    author: "VibeDev",
    heroLabel: "Beslutsguide",
    content: [
      {
        heading: "Rätt fråga är inte bygga eller köpa — det är när",
        paragraphs: [
          "Nästan alla bolag bör köpa standardsystem i början. Att utveckla en egen SaaS-plattform för något ett färdigt verktyg redan löser bra är slöseri. Frågan är inte om standardsystem är bra — det är de ofta — utan när de slutar vara rätt val för er.",
          "Den punkten kommer smygande. Licenskostnaderna växer med antalet användare, begränsningarna blir mer kännbara ju mer specifikt ni jobbar, och ni anpassar gradvis er verksamhet efter verktyget i stället för tvärtom. Då är det dags att räkna på alternativet.",
        ],
      },
      {
        heading: "När licenskostnaden börjar arbeta emot er",
        paragraphs: [
          "Standardsystem prissätts ofta per användare och månad. Det är billigt när ni är få och dyrt när ni är många — och kostnaden fortsätter uppåt utan att ni äger något. Vid en viss skala passerar de samlade licenskostnaderna vad det hade kostat att bygga och driva något eget.",
          "Lägg därtill att prismodellen är utanför er kontroll. En höjning, en ändrad licensnivå eller en funktion som flyttas till en dyrare plan kan plötsligt förändra kalkylen. Att äga sin egen plattform tar bort den osäkerheten.",
        ],
      },
      {
        heading: "När er data och era processer är det unika",
        paragraphs: [
          "Det starkaste argumentet för att bygga eget handlar sällan om pris, utan om det som gör er unika. Om er konkurrensfördel ligger i hur ni hanterar er data eller i ett arbetsflöde ingen färdig produkt stödjer, då tvingar standardsystemet in er i andras mall — och suddar ut just det som skiljer er från mängden.",
          "Ett skräddarsytt system formas efter er verklighet och låter er äga både logiken och datan. Det betyder också att ni kan vidareutveckla i er egen takt, koppla ihop precis de system ni vill, och inte vara beroende av en leverantörs roadmap.",
        ],
      },
      {
        heading: "Den verkliga jämförelsen är total ägandekostnad",
        paragraphs: [
          "Många jämför bara inköpspriset: en månadslicens mot en utvecklingskostnad. Den rättvisa jämförelsen är total ägandekostnad över tid. För standardsystemet: licenser som växer, begränsningar som kostar i form av kringgående lösningar, och beroendet av leverantören. För egen plattform: bygget, driften och vidareutvecklingen — men också en tillgång ni äger.",
          "Med modern, AI-stödd utveckling har dessutom byggsidan av kalkylen förändrats. Att utveckla en egen SaaS-plattform är inte längre det mångåriga, dyra projekt det en gång var, vilket flyttar brytpunkten tidigare än många tror.",
        ],
      },
      {
        heading: "Låt oss räkna på ert fall",
        paragraphs: [
          "Bygga eller köpa är ett beslut som tjänar på ett ärligt underlag snarare än en magkänsla. Var ligger er brytpunkt? Vad kostar era nuvarande system egentligen över tre år, inklusive begränsningarna? Och hur mycket av er konkurrensfördel sitter i sådant ett standardsystem aldrig kommer stödja?",
          "Boka ett möte, så hjälper vi er ledningsgrupp att räkna på det konkret och ärligt — och säger rakt ut om ett standardsystem faktiskt är rätt val för er just nu.",
        ],
      },
    ],
  },
  {
    slug: "automatisera-leads-foretagsdata-crm",
    title: "Automatisera era leads — koppla ihop publika företagsdata med era säljverktyg",
    excerpt:
      "Sluta leta leads manuellt. Så använder ni smarta API-kopplingar för att automatiskt hämta, matcha och leverera färska företagsleads direkt in i säljarnas CRM.",
    description:
      "En guide till att automatisera lead generation genom att hämta publika företagsdata och koppla dem via API till ert CRM — så att säljarna får färska, relevanta leads utan handpåläggning.",
    category: "Integrationer",
    tags: ["automatisera lead generation", "hämta företagsdata", "api integration crm", "automation"],
    readingTime: "7 min läsning",
    publishedAt: "2026-06-11",
    author: "VibeDev",
    heroLabel: "Integration",
    content: [
      {
        heading: "Manuell leadshantering är dyr och färskvara",
        paragraphs: [
          "I många säljteam går orimligt mycket tid åt till att leta, sammanställa och mata in leads för hand. Någon googlar företag, kopierar uppgifter till ett kalkylark och klistrar sedan in dem i CRM:et. Det är långsamt, det blir fel, och informationen är ofta gammal redan när den når en säljare.",
          "Att automatisera lead generation handlar om att låta maskinen göra det maskinen är bra på — samla in, matcha och leverera data — så att säljarna kan lägga sin tid på att faktiskt sälja.",
        ],
      },
      {
        heading: "Det finns mer publik företagsdata än ni tror",
        paragraphs: [
          "Sverige har en ovanligt rik tillgång på publik företagsinformation: organisationsnummer, bransch via SNI-koder, ort, juridisk form, registreringar och förändringar. Mycket av detta går att hämta programmatiskt och kombinera till en bild som är långt mer träffsäker än en manuell sökning.",
          "Att hämta företagsdata på det sättet låter er definiera er idealkund i kriterier — bransch, storlek, geografi, nyligen registrerade bolag — och låta systemet kontinuerligt hitta matchningar i stället för att någon ska leta dem en och en.",
        ],
      },
      {
        heading: "Kopplingen som gör datan användbar",
        paragraphs: [
          "Rådata blir värdefull först när den landar rätt. Med en API-integration mot ert CRM kan färska leads matchas mot det ni redan har — så att ni inte dubbletter eller kontaktar befintliga kunder — och sedan skapas eller berikas automatiskt på rätt plats, med rätt ägare och rätt status.",
          "Bygget måste vara robust: matchningslogik som hanterar att samma bolag kan stavas olika, dedup mot befintliga poster, och felhantering så att inget tappas tyst. Det är skillnaden mellan ett flöde säljarna litar på och ett de ignorerar.",
        ],
      },
      {
        heading: "Färska leads, automatiskt levererade",
        paragraphs: [
          "När allt hänger ihop förvandlas leadshanteringen från en manuell syssla till ett tyst flöde i bakgrunden. Nya bolag som matchar era kriterier dyker upp i CRM:et av sig själva, berikade med relevant data, redo att bearbetas. Säljaren öppnar systemet och hittar färska möjligheter i stället för en tom lista.",
          "Det här är också ett område där integritet och regler måste hanteras rätt. Publik data är publik, men hur den används och lagras lyder under GDPR — något vi bygger in från start snarare än lappar på i efterhand.",
        ],
      },
      {
        heading: "Koppla ihop era säljverktyg",
        paragraphs: [
          "Om era säljare lägger tid på att leta och mata in leads för hand finns det nästan alltid timmar att frigöra med rätt automation. Vinsten är dubbel: mer säljtid och färskare, mer relevanta leads.",
          "Boka ett möte, så tittar vi på era källor och ert CRM och skissar på hur ett automatiserat leadsflöde skulle se ut — från publik företagsdata hela vägen in i säljarnas vardag.",
        ],
      },
    ],
  },
  {
    slug: "somlos-ai-integrera-sprakmodeller-ux",
    title: "Sömlös AI — så integrerar du språkmodeller utan att förstöra användarupplevelsen",
    excerpt:
      "Sluta klistra in chatt-rutor överallt. Så integreras AI bäst som osynliga, smarta funktioner som lyfter produkten i bakgrunden i stället för att stå i vägen.",
    description:
      "En guide till UX för AI: hur du integrerar språkmodeller i din app som sömlösa funktioner som faktiskt förbättrar produktupplevelsen, i stället för ännu en chattruta.",
    category: "AI i produkter",
    tags: ["integrera ai i app", "ux för ai", "produktutveckling mjukvara", "ai-features"],
    readingTime: "7 min läsning",
    publishedAt: "2026-06-10",
    author: "VibeDev",
    heroLabel: "Produktdesign",
    content: [
      {
        heading: "Chattrutan är inte svaret på allt",
        paragraphs: [
          "När språkmodeller blev tillgängliga klistrade halva mjukvaruvärlden in en chattruta i hörnet av sin produkt. Det är den mest uppenbara — och ofta sämsta — vägen att integrera AI i en app. En chatt lägger arbetet på användaren: hen måste veta vad som går att fråga, formulera det väl, och tolka svaret.",
          "Bra UX för AI börjar i motsatt ände. Frågan är inte var vi kan stoppa in en chatt, utan var i produkten användaren tvekar, väntar eller gör något tråkigt manuellt — och hur AI kan ta bort den friktionen.",
        ],
      },
      {
        heading: "De bästa AI-funktionerna känns som genvägar",
        paragraphs: [
          "Den starkaste AI-upplevelsen skriker sällan AI. Den föreslår nästa steg, fyller i det uppenbara, strukturerar något rörigt eller sammanfattar automatiskt. Ett förslag användaren kan acceptera med ett klick slår en tom ruta hen måste formulera sig i.",
          "Det innebär att AI ofta gör mest nytta inbäddad i ett befintligt flöde snarare än som en separat funktion. Den smartaste integrationen är den användaren knappt tänker på — den gör bara uppgiften enklare.",
        ],
      },
      {
        heading: "Designa för osäkerheten",
        paragraphs: [
          "Språkmodeller har rätt ofta, men inte alltid, och de gör fel på sätt som kan vara svåra att förutse. En funktion som har rätt nio gånger av tio men fel oförutsägbart på den tionde tappar förtroende snabbt. Därför måste osäkerheten designas, inte gömmas.",
          "Det betyder att göra det lätt att se vad AI:n föreslog, lätt att ångra, och ärligt att visa när modellen är osäker. En funktion som säger att den inte är säker och ber användaren kolla är mer användbar än en som låtsas vara säker och har fel.",
        ],
      },
      {
        heading: "Behåll människan vid rodret",
        paragraphs: [
          "Användare accepterar AI-hjälp mycket lättare när de behåller kontrollen. Förslag de kan redigera, automationer de kan stänga av, utdata de kan justera. Funktioner som tar över helt utan insyn skapar obehag även när de fungerar.",
          "Tumregeln är enkel: AI gör grovjobbet, människan fattar beslutet. Den uppdelningen förvandlar funktionen från en svart låda till en assistent — och det är assistenter folk vill ha i sina verktyg.",
        ],
      },
      {
        heading: "Lyft produkten, inte bara funktionslistan",
        paragraphs: [
          "Att integrera AI väl är en produktdesignfråga minst lika mycket som en teknisk. Det handlar om att veta var en smart funktion faktiskt sparar tid eller höjer kvaliteten, och att bygga den så att den känns självklar snarare än påklistrad.",
          "Vill ni lägga in AI i er produkt på ett sätt som lyfter upplevelsen i stället för att belamra den? Boka ett möte, så går vi igenom era flöden och pekar ut var sömlös AI gör störst skillnad för era användare.",
        ],
      },
    ],
  },
  {
    slug: "behind-the-scenes-ide-till-lansering",
    title: "Behind the scenes — så tar vi en digital produkt från ritbord till lansering på halva tiden",
    excerpt:
      "En transparent titt på vår process: från första workshopen, genom den AI-stödda utvecklingsfasen, till driftsättning och optimering — och varför det går snabbare.",
    description:
      "Så ser VibeDevs process ut, steg för steg: från idé till färdig app via en smidig, AI-stödd systemutveckling som tar produkter till lansering på halva tiden.",
    category: "Vibecoding",
    tags: ["från idé till färdig app", "smidig systemutveckling", "vibecoding", "process"],
    readingTime: "8 min läsning",
    publishedAt: "2026-06-09",
    author: "VibeDev",
    heroLabel: "Process",
    content: [
      {
        heading: "Snabbare betyder inte slarvigare",
        paragraphs: [
          "Att ta en digital produkt från idé till färdig app på halva tiden låter som en genväg, men det är motsatsen. Farten kommer inte av att hoppa över steg, utan av att göra rätt steg i rätt ordning och låta moderna verktyg sköta det som inte kräver mänskligt omdöme.",
          "Här är en transparent genomgång av hur vi faktiskt arbetar — från första samtalet till en produkt i drift — så att ni vet exakt vad ni får och varför det går snabbt.",
        ],
      },
      {
        heading: "Steg 1: Workshop och skarpt scope",
        paragraphs: [
          "Allt börjar med att förstå problemet, inte att skriva kod. I en fokuserad workshop formulerar vi kärnan: vad produkten ska göra, för vem, och vilket enda flöde som måste fungera först. Lika viktigt är vad vi medvetet skär bort till en senare-lista.",
          "Det här steget är det som avgör om resten går snabbt. Ett otydligt scope hinner aldrig ifatt, hur effektivt teamet än kodar sedan. Ett skarpt scope är den enskilt största tidsbesparingen i hela projektet.",
        ],
      },
      {
        heading: "Steg 2: AI-stödd utveckling",
        paragraphs: [
          "Här ligger tempot. Med en AI-stödd, smidig systemutveckling — det vi kallar vibecoding — bygger vi kärnflödet hela vägen igenom på en bråkdel av den tid traditionell kodning hade krävt. AI:n accelererar det repetitiva: boilerplate, integrationer, tester. Den seniora tiden går till arkitektur, datamodell och de beslut som faktiskt är svåra.",
          "Vi visar framsteg löpande i stället för att försvinna i månader och dyka upp med en stor leverans. Det fångar missförstånd tidigt, medan de fortfarande är billiga att rätta, och håller er delaktiga hela vägen.",
        ],
      },
      {
        heading: "Steg 3: Driftsättning och optimering",
        paragraphs: [
          "När kärnan fungerar putsar vi det som möter användaren — felfall, tomma tillstånd, laddtider och den text folk faktiskt läser — och förbereder lansering: mätning på plats, säkerheten i ordning och en plan för hur feedback fångas upp.",
          "Lansering är inte slutet utan början på lärandet. Med riktiga användare i produkten ser vi vad som fungerar och optimerar därefter. Eftersom vi byggt på en genomtänkt grund går vidareutvecklingen snabbt — nästa förbättring är en iteration, inte en omskrivning.",
        ],
      },
      {
        heading: "Varför det går på halva tiden",
        paragraphs: [
          "Hastigheten kommer från tre saker tillsammans: ett skarpt scope som tar bort onödigt arbete, moderna AI-verktyg som accelererar exekveringen, och senior erfarenhet som ser till att grunden håller. Ingen av dem ensam räcker — det är kombinationen som gör skillnaden.",
          "Det gör också att vi kan jobba med fast pris och förutsägbara tidsramar, eftersom processen är något vi gjort många gånger och vet håller.",
        ],
      },
      {
        heading: "Vill ni se processen tillämpad på er idé?",
        paragraphs: [
          "Den bästa förståelsen för hur det här skulle fungera för er får ni inte av en text, utan av ett samtal om er konkreta idé. Då kan vi skissa på scope, tidsram och hur de första veckorna skulle se ut.",
          "Boka ett förutsättningslöst möte, så går vi igenom er produktidé och visar hur vägen från ritbord till lansering ser ut när den görs på halva tiden — utan att tumma på kvaliteten.",
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
