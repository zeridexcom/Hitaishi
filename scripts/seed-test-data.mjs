import postgres from 'postgres';
const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
const sessionUrl = url.replace(':6543/', ':5432/');
const sql = postgres(sessionUrl, { max: 1, ssl: 'require', prepare: false, onnotice: () => {} });

const SESSION_ID = 'ca93b97f-3bcb-4270-95f6-f31ec00b9ee5';
const MENTOR_ID = 'a072eadd-b03c-4e2b-9be7-04aeaaf9dee2';
const STUDENT_ID = '30ee1ee8-27a3-4a15-b94f-aebad27bd9a5';
const CONV_ID = '9cd85301-84f9-4cf6-b80e-de6a3e3045cc';

try {
  // Add session participants
  await sql`
    INSERT INTO session_participants (session_id, user_id, role_in_session)
    VALUES (${SESSION_ID}, ${MENTOR_ID}, 'host'), (${SESSION_ID}, ${STUDENT_ID}, 'participant')
    ON CONFLICT DO NOTHING
  `;
  console.log('✓ Added session participants');

  // Link conversation to session if not already
  const convLink = await sql`SELECT id FROM conversations WHERE id = ${CONV_ID}`;
  if (convLink.length > 0) {
    console.log('✓ Conversation exists:', CONV_ID);
  }

  // Create conversation participants if not exist
  await sql`
    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES (${CONV_ID}, ${MENTOR_ID}), (${CONV_ID}, ${STUDENT_ID})
    ON CONFLICT DO NOTHING
  `;
  console.log('✓ Added conversation participants');

  console.log('Seed complete.');
} catch(e) {
  console.error('Error:', e?.message?.substring(0, 500));
}
await sql.end();
