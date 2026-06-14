import postgres from 'postgres';
const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
const sessionUrl = url.replace(':6543/', ':5432/');
const sql = postgres(sessionUrl, { max: 1, ssl: 'require', prepare: false, onnotice: () => {} });

const SESSION_ID = 'ca93b97f-3bcb-4270-95f6-f31ec00b9ee5';

try {
  // Insert a test message directly
  await sql`
    INSERT INTO messages (conversation_id, sender_id, body)
    VALUES (${SESSION_ID}, 'a072eadd-b03c-4e2b-9be7-04aeaaf9dee2', 'Hello from mentor')
    ON CONFLICT DO NOTHING
  `;
  console.log('✓ Inserted test message');

  // Verify it appears
  const msgs = await sql`SELECT id, body, sender_id FROM messages WHERE conversation_id = ${SESSION_ID}`;
  console.log('Messages:', JSON.stringify(msgs));
} catch(e) {
  console.error('Error:', e?.message?.substring(0, 500));
}
await sql.end();
