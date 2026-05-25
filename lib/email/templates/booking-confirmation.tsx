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

export type BookingConfirmationProps = {
  name: string;
  projectType: string;
};

export function BookingConfirmation({ name, projectType }: BookingConfirmationProps) {
  return (
    <Html lang="sv">
      <Head />
      <Preview>Vi har tagit emot din projektförfrågan, {name}!</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>vibedev</Heading>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={h2}>
              Vi har tagit emot din förfrågan!
            </Heading>
            <Text style={paragraph}>
              Hej {name}! Tack för att du kontaktar oss angående{" "}
              <strong>{projectType}</strong>.
            </Text>
            <Text style={paragraph}>
              Vi har tagit emot din förfrågan och en av våra specialister
              återkommer till dig inom <strong>24 timmar</strong> på vardagar för
              att boka in ett inledande samtal.
            </Text>
            <Text style={paragraph}>
              Under tiden är du välkommen att läsa mer om hur vi jobbar på{" "}
              <a href="https://vibedev.se/case-studies" style={link}>
                vibedev.se/case-studies
              </a>
              .
            </Text>

            <Hr style={divider} />

            <Text style={signOff}>
              Med vänliga hälsningar,
              <br />
              <strong>Teamet på vibedev</strong>
            </Text>
          </Section>

          <Section style={footerSection}>
            <Text style={footerText}>
              vibedev — Digital produktutveckling
              <br />
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
  margin: "0 0 16px",
};

const paragraph: React.CSSProperties = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0 0 12px",
};

const link: React.CSSProperties = {
  color: "#4F6EF7",
  textDecoration: "none",
};

const divider: React.CSSProperties = {
  borderColor: "#E5E7EB",
  margin: "24px 0",
};

const signOff: React.CSSProperties = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: 0,
};

const footerSection: React.CSSProperties = {
  backgroundColor: "#F9FAFB",
  borderTop: "1px solid #E5E7EB",
  padding: "16px 32px",
};

const footerText: React.CSSProperties = {
  color: "#9CA3AF",
  fontSize: "12px",
  lineHeight: "1.6",
  margin: 0,
  textAlign: "center",
};

const footerLink: React.CSSProperties = {
  color: "#4F6EF7",
  textDecoration: "none",
};
