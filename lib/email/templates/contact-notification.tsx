import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type ContactNotificationProps = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
};

export function ContactNotification({
  name,
  email,
  phone,
  company,
  message,
}: ContactNotificationProps) {
  return (
    <Html lang="sv">
      <Head />
      <Preview>Ny kontaktförfrågan från {name}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>vibedev</Heading>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={h2}>
              Ny kontaktförfrågan
            </Heading>
            <Text style={meta}>
              Du har fått en ny förfrågan via kontaktformuläret på vibedev.se.
            </Text>

            <Hr style={divider} />

            <Heading as="h3" style={h3}>
              Kontaktuppgifter
            </Heading>
            <Row label="Namn" value={name} />
            <Row label="E-post" value={email} />
            {phone && <Row label="Telefon" value={phone} />}
            {company && <Row label="Företag" value={company} />}

            <Hr style={divider} />

            <Heading as="h3" style={h3}>
              Meddelande
            </Heading>
            <Text style={messageBox}>{message}</Text>

            <Hr style={divider} />

            <Text style={footer}>
              Svara direkt på detta mail för att nå {name} — eller kopiera{" "}
              <strong>{email}</strong>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Text style={row}>
      <span style={rowLabel}>{label}: </span>
      <span style={rowValue}>{value}</span>
    </Text>
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
  margin: "0 0 8px",
};

const h3: React.CSSProperties = {
  color: "#1A1F2E",
  fontSize: "14px",
  fontWeight: "700",
  margin: "0 0 12px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const meta: React.CSSProperties = {
  color: "#6B7280",
  fontSize: "14px",
  margin: "0 0 16px",
};

const divider: React.CSSProperties = {
  borderColor: "#E5E7EB",
  margin: "20px 0",
};

const row: React.CSSProperties = {
  fontSize: "14px",
  margin: "0 0 8px",
};

const rowLabel: React.CSSProperties = {
  color: "#6B7280",
  minWidth: "80px",
  display: "inline-block",
};

const rowValue: React.CSSProperties = {
  color: "#1A1F2E",
  fontWeight: "500",
};

const messageBox: React.CSSProperties = {
  backgroundColor: "#F9FAFB",
  borderLeft: "3px solid #4F6EF7",
  borderRadius: "4px",
  color: "#1A1F2E",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: 0,
  padding: "16px",
  whiteSpace: "pre-wrap",
};

const footer: React.CSSProperties = {
  color: "#6B7280",
  fontSize: "12px",
  margin: 0,
};
