import postgres from 'postgres';
const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url) { console.error('DIRECT_URL required'); process.exit(1); }
const sessionUrl = url.replace(':6543/', ':5432/');
console.log('Connecting...');
const sql = postgres(sessionUrl, { max: 1, ssl: 'require', prepare: false, onnotice: () => {} });
try {
  const sessions = await sql`SELECT id, title FROM sessions LIMIT 5`;
  console.log(JSON.stringify(sessions, null, 2));
} catch(e) {
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`;
  console.log('Tables:', JSON.stringify(tables, null, 2));
}
await sql.end();
