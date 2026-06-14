import postgres from 'postgres';
const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
const sessionUrl = url.replace(':6543/', ':5432/');
const sql = postgres(sessionUrl, { max: 1, ssl: 'require', prepare: false, onnotice: () => {} });
try {
  // Get column info for sessions
  const cols = await sql`
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='sessions'
    ORDER BY ordinal_position
  `;
  console.log('SESSIONS COLUMNS:', JSON.stringify(cols, null, 2));

  // Get full session data
  const s = await sql`SELECT * FROM sessions WHERE id = 'ca93b97f-3bcb-4270-95f6-f31ec00b9ee5'`;
  console.log('SESSION:', JSON.stringify(s, null, 2));

  // Check session_participants
  const sp = await sql`SELECT * FROM session_participants WHERE session_id = 'ca93b97f-3bcb-4270-95f6-f31ec00b9ee5'`;
  console.log('PARTICIPANTS:', JSON.stringify(sp, null, 2));
} catch(e) {
  console.error('Error:', e?.message?.substring(0, 500));
}
await sql.end();
