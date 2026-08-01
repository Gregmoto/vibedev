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
import { getTicketCopy } from "@/lib/tickets/copy";

export type TicketAutoReplyEmailProps = {
  language: string;
  ticketNumber: number;
  customerName: string | null;
  portalUrl: string;
  signature: string | null;
  accountName: string;
};

/** Kvittensen kunden får direkt när ett nytt ärende skapats — på kundens språk. */
export function TicketAutoReplyEmail({
  language,
  ticketNumber,
  customerName,
  portalUrl,
  signature,
  accountName,
}: TicketAutoReplyEmailProps) {
  const t = getTicketCopy(language);

  return (
    <Html lang={language}>
      <Head />
      <Preview>{`${t.ticketNumberLabel}: #${ticketNumber}`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>vibedev</Heading>
          </Section>

          <Section style={content}>
            <Text style={paragraph}>{t.greeting(customerName)}</Text>
            <Text style={paragraph}>{t.received}</Text>

            <Section style={numberBox}>
              <Text style={numberLabel}>{t.ticketNumberLabel}</Text>
              <Text style={numberValue}>#{ticketNumber}</Text>
            </Section>

            <Text style={paragraph}>{t.followLinkIntro}</Text>

            <Section style={{ margin: "20px 0" }}>
              <Button href={portalUrl} style={button}>
                {t.followLinkLabel}
              </Button>
            </Section>

            <Text style={small}>{t.replyHint}</Text>

            <Hr style={divider} />

            <Text style={paragraph}>
              {t.closing}
              <br />
              {signature?.trim() || accountName}
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

const paragraph: React.CSSProperties = {
  color: "#1A1F2E",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 12px",
};

const numberBox: React.CSSProperties = {
  backgroundColor: "#F9FAFB",
  borderRadius: "8px",
  margin: "20px 0",
  padding: "16px 20px",
};

const numberLabel: React.CSSProperties = {
  color: "#6B7280",
  fontSize: "12px",
  letterSpacing: "0.08em",
  margin: 0,
  textTransform: "uppercase",
};

const numberValue: React.CSSProperties = {
  color: "#1A1F2E",
  fontSize: "24px",
  fontWeight: "700",
  margin: "4px 0 0",
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
