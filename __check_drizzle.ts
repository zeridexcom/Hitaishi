import postgres from "postgres";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { max: 1, ssl: "require", prepare: false });
  const entries = await sql`SELECT * FROM "__drizzle_migrations"`;
  console.log("Drizzle migration entries:", JSON.stringify(entries, null, 2));
  await sql.end();
}
main();
