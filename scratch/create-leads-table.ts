import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function main() {
  try {
    console.log("Checking and creating lead_type enum and leads table...");
    
    // Create type if not exists
    // Note: in postgres, we can use a try-catch block for CREATE TYPE since CREATE TYPE IF NOT EXISTS is not standard in older PG versions, but we can do it via a block
    try {
      await db.execute(sql`
        DO $$ BEGIN
          CREATE TYPE lead_type AS ENUM('student-inquiry', 'mentor-application', 'institution-partner', 'general');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);
      console.log("Enum lead_type check complete.");
    } catch (e) {
      console.warn("Failed creating enum (may already exist):", e);
    }

    // Create table leads
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "leads" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "type" "lead_type" NOT NULL,
        "name" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL,
        "phone" varchar(50),
        "data" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `);
    console.log("Table 'leads' checked/created successfully!");
  } catch (err: any) {
    console.error("FAILED to check/create table:", err);
  }
}

main().then(() => process.exit(0));
