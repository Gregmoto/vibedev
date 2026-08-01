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

export type PasswordResetEmailProps = {
  resetUrl: string;
  expiresInMinutes: number;
};

export function PasswordResetEmail({ resetUrl, expiresInMinutes }: PasswordResetEmailProps) {
  return (
    <Html lang="sv">
      <Head />
      <Preview>Återställ ditt lösenord till VibeDev</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>vibedev</Heading>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={h2}>
              Återställ ditt lösenord
            </Heading>

            <Text style={paragraph}>
              Vi fick en begäran om att återställa lösenordet till ditt adminkonto. Klicka på
              knappen nedan för att välja ett nytt lösenord.
            </Text>

            <Section style={{ margin: "28px 0" }}>
              <Button href={resetUrl} style={button}>
                Välj nytt lösenord
              </Button>
            </Section>

            <Text style={small}>
              Länken gäller i {expiresInMinutes} minuter och kan bara användas en gång.
            </Text>

            <Hr style={divider} />

            <Text style={small}>
              Har du inte begärt detta kan du ignorera mejlet — ditt nuvarande lösenord fortsätter
              att gälla och ingenting har ändrats.
            </Text>

            <Text style={{ ...small, marginTop: "16px" }}>
              Fungerar inte knappen? Kopiera och klistra in den här adressen i webbläsaren:
            </Text>
            <Text style={urlBox}>{resetUrl}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const body: React.CSSProperties = {
  backgroundColor: "#f5f7fb",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  margin: 0,
  padding: "40px 0",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  maxWidth: "600px",
  margin: "0 auto",
  overflow: "hidden",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
};

const header: React.CSSProperties = {
  backgroundColor: "#1A1F2E",
  padding: "24px 32px",
};

const logo: React.CSSProperties = {
  color: "#4F6EF7",
  fontSize: "22px",
  fontWeight: "700",
  margin: 0,
};

const content: React.CSSProperties = {
  padding: "32px",
};

const h2: React.CSSProperties = {
  color: "#1A1F2E",
  fontSize: "22px",
  fontWeight: "700",
  margin: "0 0 12px",
};

const paragraph: React.CSSProperties = {
  color: "#1A1F2E",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 8px",
};

const button: React.CSSProperties = {
  backgroundColor: "#4F6EF7",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "15px",
  fontWeight: "600",
  padding: "13px 24px",
  textDecoration: "none",
};

const small: React.CSSProperties = {
  color: "#6B7280",
  fontSize: "13px",
  lineHeight: "1.6",
  margin: 0,
};

const divider: React.CSSProperties = {
  borderColor: "#E5E7EB",
  margin: "24px 0",
};

const urlBox: React.CSSProperties = {
  backgroundColor: "#F9FAFB",
  borderRadius: "4px",
  color: "#4F6EF7",
  fontSize: "12px",
  margin: "6px 0 0",
  padding: "10px",
  wordBreak: "break-all",
};
