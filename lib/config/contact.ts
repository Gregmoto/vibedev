export const CONTACT = {
  email: "hello@vibedev.se",
  emailHref: "mailto:hello@vibedev.se",
  phone: "+46 70 186 63 38",
  phoneHref: "tel:+46701866338",
  address: {
    city: "Stockholm",
    country: "Sverige",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/vibedev", // TODO: bekräfta riktig URL
    instagram: "https://www.instagram.com/vibedev.se",   // TODO: bekräfta riktig URL
  },
  hours: {
    responseTime: "inom 24 timmar",
  },
} as const;

export const COMPANY = {
  legalName: "Holmfred Ecommerce AB", // TODO: bekräfta
  orgNumber: "XXXXXX-XXXX",           // TODO: lägg till riktigt org.nr
  vatNumber: "SEXXXXXXXXXXXX",         // TODO: lägg till riktigt VAT-nummer
  fSkatt: true,
} as const;
