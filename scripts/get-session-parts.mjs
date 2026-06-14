import postgres from 'postgres';
const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
const sessionUrl = url.replace(':6543/', ':5432/');
const sql = postgres(sessionUrl, { max: 1, ssl: 'require', prepare: false, onnotice: () => {} });
try {
  const parts = await sql`SELECT session_id, user_id FROM session_participants`;
  console.log('PARTS:', JSON.stringify(parts));
  const sessions = await sql`SELECT id, title FROM sessions`;
  console.log('SESSIONS:', JSON.stringify(sessions));
  const convs = await sql`SELECT id, title, type FROM conversations LIMIT 10`;
  console.log('CONVERSATIONS:', JSON.stringify(convs));
  const convParts = await sql`SELECT conversation_id, user_id FROM conversation_participants LIMIT 10`;
  console.log('CONV_PARTS:', JSON.stringify(convParts));
} catch(e) {
  console.error('Error:', e?.message?.substring(0, 500));
}
await sql.end();
