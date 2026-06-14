import postgres from 'postgres';
const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
const sessionUrl = url.replace(':6543/', ':5432/');
const sql = postgres(sessionUrl, { max: 1, ssl: 'require', prepare: false, onnotice: () => {} });
try {
  const cols = await sql`
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='messages'
    ORDER BY ordinal_position
  `;
  console.log('MESSAGES COLUMNS:', JSON.stringify(cols, null, 2));
} catch(e) {
  console.error('Error:', e?.message?.substring(0, 500));
}
await sql.end();
