import postgres from 'postgres';
const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
const sessionUrl = url.replace(':6543/', ':5432/');
const sql = postgres(sessionUrl, { max: 1, ssl: 'require', prepare: false, onnotice: () => {} });
try {
  const users = await sql`SELECT id, email, role FROM users`;
  console.log(JSON.stringify(users, null, 2));
} catch(e) {
  console.error('Error:', e?.message?.substring(0, 500));
}
await sql.end();
