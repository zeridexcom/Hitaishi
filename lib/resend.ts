import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM || "noreply@hitaishi.app";

// Check if we have a valid, configured key
export const isRealEmailConfigured =
  !!apiKey &&
  apiKey !== "re_xxx" &&
  !apiKey.startsWith("re_placeholder") &&
  apiKey.trim().length > 0;

export const resend = isRealEmailConfigured ? new Resend(apiKey) : null;
export const RESEND_FROM = fromEmail;
