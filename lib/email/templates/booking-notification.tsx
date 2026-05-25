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

export type BookingNotificationProps = {
  name: string;
  email: string;
  company?: string;
  role?: string;
  projectType: string;
  budget: string;
  timeline: string;
  goal?: string;
  project: string;
};

export function BookingNotification({
  name,
  email,
  company,
  role,
  projectType,
  budget,
  timeline,
  goal,
  project,
}: BookingNotificationProps) {
  return (
    <Html lang="sv">
      <Head />
      <Preview>Ny projektförfrågan från {name} — {projectType}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>vibedev</Heading>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={h2}>
              Ny projektförfrågan
            </Heading>
            <Text style={badge}>{projectType}</Text>

            <Hr style={divider} />

            <Heading as="h3" style={h3}>
              Kontaktuppgifter
            </Heading>
            <Row label="Namn" value={name} />
            <Row label="E-post" value={email} />
            {company && <Row label="Företag" value={company} />}
            {role && <Row label="Roll" value={role} />}

            <Hr style={divider} />

            <Heading as="h3" style={h3}>
              Projektdetaljer
            </Heading>
            <Row label="Projekttyp" value={projectType} />
            <Row label="Budget" value={budget} />
            <Row label="Tidslinje" value={timeline} />
            {goal && <Row label="Primärt mål" value={goal} />}

            <Hr style={divider} />

            <Heading as="h3" style={h3}>
              Projektbeskrivning
            </Heading>
            <Text style={messageBox}>{project}</Text>

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
  margin: "0 0 12px",
};

const badge: React.CSSProperties = {
  backgroundColor: "#EEF2FF",
  borderRadius: "20px",
  color: "#4F6EF7",
  display: "inline-block",
  fontSize: "12px",
  fontWeight: "600",
  margin: "0 0 16px",
  padding: "4px 12px",
};

const h3: React.CSSProperties = {
  color: "#1A1F2E",
  fontSize: "14px",
  fontWeight: "700",
  margin: "0 0 12px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
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
  minWidth: "100px",
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
