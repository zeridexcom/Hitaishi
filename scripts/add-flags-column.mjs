import postgres from 'postgres';
const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
const sessionUrl = url.replace(':6543/', ':5432/');
const sql = postgres(sessionUrl, { max: 1, ssl: 'require', prepare: false, onnotice: () => {} });
try {
  await sql`ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS flags jsonb`;
  console.log('✓ Added flags column to messages table');
  const cols = await sql`
    SELECT column_name, data_type FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='messages' ORDER BY ordinal_position
  `;
  console.log('Columns:', cols.map(c => c.column_name).join(', '));
} catch(e) {
  console.error('Error:', e?.message?.substring(0, 500));
}
await sql.end();
