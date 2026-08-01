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

export type TicketReplyEmailProps = {
  language: string;
  ticketNumber: number;
  bodyText: string;
  portalUrl: string;
  signature: string | null;
  accountName: string;
};

/** Handläggarens svar till kunden. Brödtexten skrivs i adminpanelen. */
export function TicketReplyEmail({
  language,
  ticketNumber,
  bodyText,
  portalUrl,
  signature,
  accountName,
}: TicketReplyEmailProps) {
  const t = getTicketCopy(language);
  const paragraphs = bodyText.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return (
    <Html lang={language}>
      <Head />
      <Preview>{`#${ticketNumber}`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>vibedev</Heading>
          </Section>

          <Section style={content}>
            {paragraphs.map((block, index) => (
              <Text key={index} style={paragraph}>
                {/* Radbrytningar inom ett stycke ska överleva till mejlet */}
                {block.split("\n").map((line, lineIndex, lines) => (
                  <span key={lineIndex}>
                    {line}
                    {lineIndex < lines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </Text>
            ))}

            <Hr style={divider} />

            <Text style={paragraph}>
              {t.closing}
              <br />
              {signature?.trim() || accountName}
            </Text>

            <Section style={{ margin: "20px 0 0" }}>
              <Button href={portalUrl} style={button}>
                {t.followLinkLabel}
              </Button>
            </Section>

            <Text style={{ ...small, marginTop: "16px" }}>
              {t.ticketNumberLabel}: #{ticketNumber}
            </Text>
            <Text style={small}>{t.replyHint}</Text>
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
