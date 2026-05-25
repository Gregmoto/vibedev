import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("[resend] RESEND_API_KEY saknas — e-postutskick fungerar inte.");
}

export const resend = new Resend(process.env.RESEND_API_KEY ?? "");
