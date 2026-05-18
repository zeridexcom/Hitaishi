export type ScanFlag = "phone" | "email" | "off_platform";

export interface ScanResult {
  clean: boolean;
  flags: ScanFlag[];
}

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;

// Pre-extract digit runs (allowing spaces / dashes) then validate as an Indian mobile.
function hasIndianPhone(text: string): boolean {
  const runs = text.match(/(?:\+?\d[\d\s-]{8,}\d)/g);
  if (!runs) return false;
  for (const r of runs) {
    const digits = r.replace(/\D/g, "");
    // strip optional country / trunk prefix
    const local = digits.startsWith("91") && digits.length === 12
      ? digits.slice(2)
      : digits.startsWith("0") && digits.length === 11
        ? digits.slice(1)
        : digits;
    if (local.length === 10 && /^[6-9]/.test(local)) return true;
  }
  return false;
}

const OFF_PLATFORM_PHRASES = [
  /\bwhats\s*app\b/i,
  /\btelegram\b/i,
  /\binstagram\b/i,
  /\bsignal\b/i,
  /\bmeet\s+outside\b/i,
  /\boff\s*platform\b/i,
  /\bdm\b/i,
];

export function scanMessage(body: string): ScanResult {
  const flags: ScanFlag[] = [];
  const text = body ?? "";

  if (hasIndianPhone(text)) flags.push("phone");
  if (EMAIL_RE.test(text)) flags.push("email");
  if (OFF_PLATFORM_PHRASES.some((re) => re.test(text))) {
    flags.push("off_platform");
  }

  return { clean: flags.length === 0, flags };
}
