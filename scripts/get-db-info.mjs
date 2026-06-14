import postgres from 'postgres';
const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
const sessionUrl = url.replace(':6543/', ':5432/');
const sql = postgres(sessionUrl, { max: 1, ssl: 'require', prepare: false, onnotice: () => {} });
try {
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`;
  console.log('TABLES:', JSON.stringify(tables.map(t => t.table_name)));
  
  const users = await sql`SELECT id, email FROM users LIMIT 5`;
  console.log('USERS:', JSON.stringify(users));
  
  const sessions = await sql`SELECT id, title, mentor_id FROM sessions LIMIT 10`;
  console.log('SESSIONS:', JSON.stringify(sessions));

  // Check mentorship_sessions if exists
  try {
    const ms = await sql`SELECT * FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE '%mentor%'`;
    console.log('MENTOR TABLES:', JSON.stringify(ms));
  } catch(e) {}

} catch(e) {
  console.error('Error:', e?.message?.substring(0, 500));
}
await sql.end();
