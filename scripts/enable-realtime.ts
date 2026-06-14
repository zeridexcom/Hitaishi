import postgres from "postgres";

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL or DIRECT_URL required");
  process.exit(1);
}

const sql = postgres(url, { max: 1, ssl: "require", prepare: false, onnotice: () => {} });

async function main() {
  await sql`alter publication supabase_realtime add table public.messages;`;
  console.log("✓ added messages to supabase_realtime");
  await sql`alter publication supabase_realtime add table public.conversations;`;
  console.log("✓ added conversations to supabase_realtime");
}

main()
  .then(() => sql.end())
  .catch((e) => {
    console.error(e?.message ?? e);
    sql.end();
    process.exit(1);
  });
