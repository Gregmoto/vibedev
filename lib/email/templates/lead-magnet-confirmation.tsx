import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type LeadMagnetConfirmationProps = {
  email:   string;
  pdfUrl?: string;
};

const DEFAULT_PDF_URL =
  "https://vibedev.se/guides/vibecoding-guide-2026.pdf"; // TODO: ersätt med riktig PDF-URL

export function LeadMagnetConfirmation({
  email,
  pdfUrl = DEFAULT_PDF_URL,
}: LeadMagnetConfirmationProps) {
  return (
    <Html lang="sv">
      <Head />
      <Preview>Din guide är här — Vibecoding 2026</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>vibedev</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading as="h2" style={h2}>
              Tack! Guiden är på väg. 🎉
            </Heading>

            <Text style={paragraph}>
              Du får nu tillgång till <strong>Vibecoding — så bygger moderna
              team snabbare 2026</strong>. Klicka på knappen nedan för att
              ladda ner PDF:en direkt.
            </Text>

            <Section style={buttonSection}>
              <Button href={pdfUrl} style={ctaButton}>
                Ladda ner guiden →
              </Button>
            </Section>

            <Text style={paragraph}>
              I guiden hittar du erfarenheter från 4 utvecklare och 10+
              projekt: hur vi använder AI i kodflödet, vilka verktyg vi
              väljer och hur vi skär scope för att leverera på halva tiden.
            </Text>

            <Hr style={divider} />

            <Text style={small}>
              Frågor? Svara på det här mailet — vi läser alla svar.
            </Text>

            <Text style={signOff}>
              Med vänliga hälsningar,
              <br />
              <strong>Teamet på VibeDev</strong>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              VibeDev — Digital produktutveckling · Stockholm
              <br />
              Du prenumererar som {email}.{" "}
              <a href="https://vibedev.se" style={footerLink}>
                vibedev.se
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* ── Styles ────────────────────────────────────────────────────────────────── */

const body: React.CSSProperties = {
  backgroundColor: "#F5F7FB",
  fontFamily:      "'Helvetica Neue', Helvetica, Arial, sans-serif",
  margin:          0,
  padding:         "40px 0",
};

const container: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  borderRadius:    "12px",
  maxWidth:        "600px",
  margin:          "0 auto",
  overflow:        "hidden",
  boxShadow:       "0 2px 12px rgba(0,0,0,0.08)",
};

const header: React.CSSProperties = {
  backgroundColor: "#1A1F2E",
  padding:         "24px 32px",
};

const logo: React.CSSProperties = {
  color:      "#2563EB",
  fontSize:   "22px",
  fontWeight: "700",
  margin:     0,
};

const content: React.CSSProperties = {
  padding: "32px",
};

const h2: React.CSSProperties = {
  color:      "#0F172A",
  fontSize:   "22px",
  fontWeight: "700",
  margin:     "0 0 16px",
};

const paragraph: React.CSSProperties = {
  color:      "#374151",
  fontSize:   "15px",
  lineHeight: "1.7",
  margin:     "0 0 16px",
};

const buttonSection: React.CSSProperties = {
  margin: "24px 0",
};

const ctaButton: React.CSSProperties = {
  backgroundColor: "#2563EB",
  borderRadius:    "8px",
  color:           "#FFFFFF",
  display:         "inline-block",
  fontSize:        "15px",
  fontWeight:      "600",
  padding:         "14px 28px",
  textDecoration:  "none",
};

const small: React.CSSProperties = {
  color:      "#6B7280",
  fontSize:   "13px",
  lineHeight: "1.6",
  margin:     "0 0 12px",
};

const divider: React.CSSProperties = {
  borderColor: "#E5E7EB",
  margin:      "24px 0",
};

const signOff: React.CSSProperties = {
  color:      "#374151",
  fontSize:   "15px",
  lineHeight: "1.7",
  margin:     0,
};

const footerSection: React.CSSProperties = {
  backgroundColor: "#F9FAFB",
  borderTop:       "1px solid #E5E7EB",
  padding:         "16px 32px",
};

const footerText: React.CSSProperties = {
  color:      "#9CA3AF",
  fontSize:   "12px",
  lineHeight: "1.6",
  margin:     0,
  textAlign:  "center",
};

const footerLink: React.CSSProperties = {
  color:          "#2563EB",
  textDecoration: "none",
};
