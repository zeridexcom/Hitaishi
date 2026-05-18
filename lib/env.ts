import { z } from "zod";

const baseSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().or(z.string().startsWith("postgres://")),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be >= 32 chars"),
});

const productionExtras = z.object({
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1),
  HMS_ACCESS_KEY: z.string().min(1),
  HMS_SECRET: z.string().min(32, "HMS_SECRET must be >= 32 chars"),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET: z.string().min(1),
  REDIS_URL: z.string().min(1),
});

export type ValidateResult =
  | { ok: true }
  | { ok: false; errors: string[] };

export function validateEnv(env: Record<string, string | undefined>): ValidateResult {
  const errors: string[] = [];

  const base = baseSchema.safeParse(env);
  if (!base.success) {
    for (const i of base.error.issues) {
      errors.push(`${i.path.join(".")}: ${i.message}`);
    }
    return { ok: false, errors };
  }

  if (base.data.NODE_ENV === "production") {
    const prod = productionExtras.safeParse(env);
    if (!prod.success) {
      for (const i of prod.error.issues) {
        errors.push(`${i.path.join(".")}: ${i.message}`);
      }
    }
  }

  return errors.length === 0 ? { ok: true } : { ok: false, errors };
}
