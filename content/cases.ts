export type CaseStudy = {
  slug: string;
  projectName: string;
  industry: string;
  summary: string;
  customerProblem: string;
  solution: string;
  process: string[];
  results: string[];
  techStack: string[];
  cta: {
    label: string;
    href: string;
  };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "nordfin-onboarding-plattform",
    projectName: "Nordfin Onboarding Platform",
    industry: "Fintech",
    summary:
      "En ny digital onboardingupplevelse för ett fintechbolag som behövde få fler registrerade användare att bli aktiva kunder snabbare.",
    customerProblem:
      "Kunden hade ett splittrat onboardingflöde där nya användare tappade fart mellan registrering, verifiering och första aktiva användning. Det påverkade både konvertering, intern supportbelastning och teamets möjlighet att växa effektivt.",
    solution:
      "Vi designade om hela onboardingresan och byggde en ny webbapp med tydligare steg, smartare informationsstruktur och bättre återkoppling för användaren i varje kritisk del av flödet.",
    process: [
      "Vi började med att analysera var användarna föll av och vilka steg som skapade mest osäkerhet i onboardingprocessen.",
      "Därefter tog vi fram ett nytt UX-upplägg, prioriterade kärnflödena och definierade en teknisk struktur som gick att lansera snabbt utan att låsa framtida utveckling.",
      "Efter release arbetade vi vidare med mätning, mindre förbättringar och optimeringar baserat på verkligt användarbeteende.",
    ],
    results: [
      "42 % högre andel användare som slutförde onboarding första veckan",
      "28 % färre supportärenden kopplade till verifiering och kontoaktivering",
      "Tydligare intern process för fortsatt optimering av konvertering",
    ],
    techStack: ["Next.js", "TypeScript", "Designsystem", "API-integrationer", "Analysinstrumentering"],
    cta: {
      label: "Boka möte om liknande projekt",
      href: "/boka-mote",
    },
  },
  {
    slug: "careflow-ai-support",
    projectName: "Careflow AI Support",
    industry: "SaaS / Kundservice",
    summary:
      "Ett AI-stöd för supportteam som behövde kortare svarstider, bättre kunskapsåteranvändning och jämnare kvalitet i kunddialogen.",
    customerProblem:
      "Kundens supportteam hanterade stora mängder ärenden manuellt. Svar blev ojämna, kunskap fastnade hos enskilda personer och ledtiderna började påverka både kundnöjdhet och intern effektivitet.",
    solution:
      "Vi tog fram en AI-funktion som sammanfattar ärenden, föreslår svar och hämtar relevant information från befintlig kunskapsbas. Funktionen byggdes direkt i arbetsflödet för att skapa värde utan att ändra teamets arbetssätt i onödan.",
    process: [
      "Först definierade vi vilka typer av ärenden som gav störst effekt att förbättra och hur teamet arbetade i praktiken.",
      "Sedan designade vi ett AI-stöd med mänsklig kontroll, tydliga fallback-flöden och en gränssnittslösning som gjorde rekommendationerna enkla att förstå och använda.",
      "Efter lansering följde vi upp träffsäkerhet, användning och effekt på svarstid för att iterera lösningen stegvis.",
    ],
    results: [
      "37 % kortare genomsnittlig svarstid",
      "Högre intern kvalitet i återanvändning av kunskap",
      "Bättre förutsättningar att skala supporten utan att växa teamet i samma takt",
    ],
    techStack: ["Next.js", "TypeScript", "LLM-integration", "Intern kunskapsbas", "Adminverktyg"],
    cta: {
      label: "Prata AI-lösningar med oss",
      href: "/kontakt",
    },
  },
  {
    slug: "buildlane-marketplace-mvp",
    projectName: "Buildlane Marketplace MVP",
    industry: "Marketplace / Startup",
    summary:
      "En första marknadsversion för ett founder-team som behövde validera affärsidé, få ut produkten snabbt och nå sina första betalande kunder.",
    customerProblem:
      "Teamet hade en stark idé men saknade tydlig prioritering för vad som faktiskt behövde byggas för att nå marknaden. Risken var att fastna i för mycket scope, lång ledtid och försenad validering.",
    solution:
      "Vi hjälpte kunden att definiera en fokuserad MVP, tog fram design för kärnflöden och byggde första versionen med betalflöde, användarkonton och adminstöd för att teamet snabbt skulle kunna lansera och lära sig från marknaden.",
    process: [
      "Vi började med att kapa ner produktidén till den minsta version som fortfarande kunde skapa verklig användarnytta och betalningsvilja.",
      "Därefter tog vi fram design, teknisk struktur och en tydlig leveransplan för att hålla tempo utan att tappa kvalitet i de centrala flödena.",
      "Efter lansering stöttade vi teamet i att tolka användarbeteende, förbättra onboarding och prioritera nästa iteration.",
    ],
    results: [
      "Lansering på 8 veckor från start till första version",
      "Första betalande kunder inom 30 dagar efter release",
      "Tydligare roadmap för vilka funktioner som faktiskt skulle byggas härnäst",
    ],
    techStack: ["Next.js", "TypeScript", "Prisma", "Stripe", "Produktdesign"],
    cta: {
      label: "Starta en MVP med VibeDev",
      href: "/boka-mote",
    },
  },
];
