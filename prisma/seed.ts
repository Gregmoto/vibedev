import bcrypt from "bcryptjs";
import { ContentStatus, UserRole } from "@prisma/client";
import { db } from "../lib/db";

// ── Admin-användare ───────────────────────────────────────────────────────────
async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL ?? "admin@vibedev.se";
  const password = process.env.SEED_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 12);

  await db.user.upsert({
    where: { email },
    update: { passwordHash, role: UserRole.ADMIN, name: "VibeDev Admin" },
    create: { email, passwordHash, role: UserRole.ADMIN, name: "VibeDev Admin" },
  });

  console.log(`✓ Admin: ${email}`);
}

// ── Blogginlägg ───────────────────────────────────────────────────────────────
async function seedBlogPosts() {
  const posts = [
    {
      title: "Vad är vibecoding — och varför förändrar det hur vi bygger produkter?",
      slug: "vad-ar-vibecoding",
      excerpt:
        "Vibecoding handlar om att bygga med känsla och flöde snarare än perfekt planering. Vi förklarar vad det innebär i praktiken och varför det passar moderna startups.",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Vibecoding är ett arbetssätt där du prioriterar rörelse och iteration framför perfekt arkitektur. Istället för att planera allt i förväg bygger du snabbt, känner efter vad som fungerar och justerar längs vägen.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Det låter enkelt, men det kräver disciplin — du måste veta när du ska sakta ner och refaktorera, och när du ska hålla tempot uppe. Den balansen är kärnan i vibecoding.",
              },
            ],
          },
        ],
      },
      category: "Metodik",
      tags: ["vibecoding", "produktutveckling", "startup"],
      author: "VibeDev",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2025-03-01"),
      seoTitle: "Vad är vibecoding? — VibeDev",
      metaDescription:
        "Vibecoding handlar om att bygga med känsla och flöde. Lär dig vad det innebär och hur det förändrar produktutveckling.",
    },
    {
      title: "Från idé till MVP på 6 veckor — så här gör vi det",
      slug: "fran-ide-till-mvp-pa-6-veckor",
      excerpt:
        "En MVP behöver inte ta månader att bygga. Vi delar vår beprövade process för att gå från idé till lanserad produkt på under 6 veckor.",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "De flesta founders underskattar hur lite som faktiskt behövs för en MVP. Du behöver inte alla features — du behöver rätt features. Det är den viktigaste insikten i vår process.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Vecka 1–2 handlar om att definiera kärnvärdet. Vecka 3–4 om att bygga det, inget annat. Vecka 5–6 om att testa med riktiga användare och iterera baserat på feedback.",
              },
            ],
          },
        ],
      },
      category: "MVP",
      tags: ["mvp", "startup", "produktutveckling", "process"],
      author: "VibeDev",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2025-03-15"),
      seoTitle: "Från idé till MVP på 6 veckor — VibeDev",
      metaDescription:
        "Lär dig hur vi tar produkter från idé till lansering på under 6 veckor med vår beprövade MVP-process.",
    },
    {
      title: "AI i produkter — vad som faktiskt skapar värde (och vad som inte gör det)",
      slug: "ai-i-produkter-vad-som-skapar-varde",
      excerpt:
        "Alla pratar om att lägga till AI i sina produkter. Men få vet vad som faktiskt skapar värde för användaren. Vi delar vad vi lärt oss från verkliga projekt.",
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "AI skapar värde när den löser ett problem som användaren redan har — inte när den skapar ett nytt beteende som användaren måste lära sig. Det är den viktigaste regeln vi tillämpar när vi integrerar AI.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Vi har sett produkter lyckas med enkel AI-integration (som smart autocomplete eller sammanfattningar) och misslyckas med komplexa AI-agenter. Skillnaden är alltid samma: hur nära lösningen är till ett verkligt, befintligt användarbehov.",
              },
            ],
          },
        ],
      },
      category: "AI",
      tags: ["ai", "produktutveckling", "ux", "strategi"],
      author: "VibeDev",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2025-04-01"),
      seoTitle: "AI i produkter — vad som skapar värde — VibeDev",
      metaDescription:
        "Vi delar vad vi lärt oss om AI-integration i verkliga produkter — vad som fungerar och vad som inte gör det.",
    },
  ];

  for (const post of posts) {
    await db.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log(`✓ Blogginlägg: ${posts.length} st`);
}

// ── Podcast ───────────────────────────────────────────────────────────────────
async function seedPodcast() {
  const episode = {
    title: "Att bygga en AI-produkt från grunden — med Johan Lindqvist",
    slug: "bygga-ai-produkt-fran-grunden",
    description:
      "Vi pratar med Johan Lindqvist om hur han tog sin AI-idé från whiteboard till betalande kunder på fyra månader. Vad fungerade, vad gick fel och vad skulle han göra annorlunda?",
    showNotes: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "I det här avsnittet djupdyker vi i Johans resa från initial idé till lansering. Vi diskuterar allt från val av teknisk stack till hur man hittar sina första kunder.",
            },
          ],
        },
      ],
    },
    guestNames: ["Johan Lindqvist"],
    audioUrl: null,
    embedUrl: null,
    status: ContentStatus.PUBLISHED,
    publishedAt: new Date("2025-04-10"),
    seoTitle: "Bygga AI-produkt från grunden — VibeDev Podcast",
    metaDescription:
      "Johan Lindqvist berättar hur han tog sin AI-idé från whiteboard till betalande kunder på fyra månader.",
  };

  await db.podcastEpisode.upsert({
    where: { slug: episode.slug },
    update: episode,
    create: episode,
  });

  console.log(`✓ Podcast: 1 avsnitt`);
}

// ── Case studies ──────────────────────────────────────────────────────────────
async function seedCaseStudies() {
  const cases = [
    {
      title: "SaaS-plattform för fastighetsbranschen",
      slug: "saas-fastighet",
      clientName: "Klient A",
      industry: "Fastighet",
      summary: "Vi byggde en komplett SaaS-plattform som ersatte manuella processer och minskade administrationen med 60 %.",
      problem: "Klienten hanterade hyresgästprocesser manuellt i kalkylblad, vilket ledde till fel och tidsspill.",
      solution: "En webbaserad plattform med automatiserade arbetsflöden, e-signering och realtidsrapportering.",
      process: { steps: ["Discovery", "Design", "Utveckling", "Lansering"] },
      results: { adminReduction: "60%", timeToMarket: "8 veckor" },
      techStack: ["Next.js", "Prisma", "PostgreSQL", "Vercel"],
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2025-02-01"),
    },
    {
      title: "AI-driven kundtjänst för e-handel",
      slug: "ai-kundtjanst-ehandel",
      clientName: "Klient B",
      industry: "E-handel",
      summary: "En AI-assistent som hanterar 80 % av kundtjänstärendena automatiskt och frigör teamet för komplexa ärenden.",
      problem: "Kundtjänstteamet var överväldigat av repetitiva frågor om orderstatus, returer och produktinformation.",
      solution: "En LLM-baserad assistent tränad på produktdatan och integrerad i befintlig helpdesk-lösning.",
      process: { steps: ["Datainsamling", "Modellval", "Integration", "Testning", "Lansering"] },
      results: { automationRate: "80%", customerSatisfaction: "+15%" },
      techStack: ["OpenAI API", "Next.js", "Vercel"],
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2025-02-15"),
    },
    {
      title: "MVP för fintech-startup på 5 veckor",
      slug: "mvp-fintech",
      clientName: "Klient C",
      industry: "Fintech",
      summary: "Från konceptgodkännande till lanserad MVP med 200 betatestare på fem veckor.",
      problem: "Grundarna hade en validerad idé men ingen teknisk kapacitet och ett hårt deadlinekrav mot investerare.",
      solution: "Vi tog fullt ägarskap av produkt och teknik, levererade en fungerande MVP med core-funktionalitet.",
      process: { steps: ["Kravanalys", "Design", "Utveckling", "QA", "Lansering"] },
      results: { timeToLaunch: "5 veckor", betaUsers: 200 },
      techStack: ["React Native", "Node.js", "Supabase"],
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2025-03-01"),
    },
    {
      title: "Intern automationsplattform för tillverkningsindustrin",
      slug: "automation-tillverkning",
      clientName: "Klient D",
      industry: "Tillverkning",
      summary: "En intern plattform som automatiserade rapportering och produktionsuppföljning och sparar 20+ timmar per vecka.",
      problem: "Produktionschefer samlade data manuellt från flera system och sammanställde det i Excel varje vecka.",
      solution: "En dashboardplattform som aggregerar data i realtid med automatiska avvikelseaviseringar.",
      process: { steps: ["Processanalys", "Datamodellering", "Utveckling", "Utbildning"] },
      results: { weeklySavedHours: 20, adoptionRate: "95%" },
      techStack: ["Next.js", "Prisma", "PostgreSQL", "Recharts"],
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date("2025-03-20"),
    },
  ];

  for (const c of cases) {
    await db.caseStudy.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }

  console.log(`✓ Case studies: ${cases.length} st`);
}

// ── Site settings ─────────────────────────────────────────────────────────────
async function seedSettings() {
  const existing = await db.siteSettings.findFirst();

  if (!existing) {
    await db.siteSettings.create({
      data: {
        siteName: "VibeDev",
        siteUrl: "https://vibedev.se",
        contactEmail: "hello@vibedev.se",
        footerText: "© 2025 VibeDev. Alla rättigheter förbehållna.",
        socialLinks: {
          linkedin: "https://linkedin.com/company/vibedev",
          github: "https://github.com/vibedev",
        },
        defaultSeoTitle: "VibeDev — Digital produktutveckling",
        defaultMetaDescription:
          "Vi bygger digitala produkter som skapar verkligt värde — MVPs, webbappar, AI-lösningar och mobilappar.",
      },
    });
    console.log("✓ Site settings: skapad");
  } else {
    console.log("✓ Site settings: finns redan");
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("Seedar databasen...\n");

  await seedAdmin();
  await seedBlogPosts();
  await seedPodcast();
  await seedCaseStudies();
  await seedSettings();

  console.log("\nKlar!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
