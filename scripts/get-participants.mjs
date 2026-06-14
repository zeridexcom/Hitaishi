import postgres from 'postgres';
const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
const sessionUrl = url.replace(':6543/', ':5432/');
const sql = postgres(sessionUrl, { max: 1, ssl: 'require', prepare: false, onnotice: () => {} });
try {
  const parts = await sql`SELECT session_id, user_id FROM session_participants`;
  console.log(JSON.stringify(parts, null, 2));
} catch(e) {
  console.error('Error:', e.message?.substring(0, 200));
}
await sql.end();
