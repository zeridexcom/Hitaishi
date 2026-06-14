import postgres from 'postgres';
const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
const sessionUrl = url.replace(':6543/', ':5432/');
const sql = postgres(sessionUrl, { max: 1, ssl: 'require', prepare: false, onnotice: () => {} });
try {
  const SESSION_ID = 'ca93b97f-3bcb-4270-95f6-f31ec00b9ee5';
  // Check if a conversation with session UUID exists
  const convs = await sql`SELECT * FROM conversations WHERE id = ${SESSION_ID}`;
  console.log('CONV with session ID:', JSON.stringify(convs));
  // Check conversation participants for that conv
  const cps = await sql`SELECT * FROM conversation_participants WHERE conversation_id = ${SESSION_ID}`;
  console.log('CONV_PARTS for session ID:', JSON.stringify(cps));
  // Check messages for that conv
  const msgs = await sql`SELECT * FROM messages WHERE conversation_id = ${SESSION_ID}`;
  console.log('MESSAGES for session ID:', JSON.stringify(msgs));
  // Check old conversation
  const oldConvs = await sql`SELECT * FROM conversations WHERE id = '9cd85301-84f9-4cf6-b80e-de6a3e3045cc'`;
  console.log('OLD CONV:', JSON.stringify(oldConvs));
  const oldMsgs = await sql`SELECT * FROM messages WHERE conversation_id = '9cd85301-84f9-4cf6-b80e-de6a3e3045cc'`;
  console.log('OLD MSGS:', JSON.stringify(oldMsgs));
} catch(e) {
  console.error('Error:', e?.message?.substring(0, 500));
}
await sql.end();
