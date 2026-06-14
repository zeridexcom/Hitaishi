import postgres from "postgres";

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL or DIRECT_URL required"); process.exit(1); }

// Session pooler on port 5432 for DDL
const sessionUrl = url.replace(":6543/", ":5432/");
const sql = postgres(sessionUrl, { max: 1, ssl: "require", prepare: false, onnotice: () => {} });

async function main() {
  console.log("→ Enabling RLS on messages...");
  await sql`ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;`;
  console.log("✓ RLS enabled on messages");

  console.log("→ Enabling RLS on conversations...");
  await sql`ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;`;
  console.log("✓ RLS enabled on conversations");

  console.log("→ Enabling RLS on conversation_participants...");
  await sql`ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;`;
  console.log("✓ RLS enabled on conversation_participants");

  console.log("→ Creating SELECT policy for conversation_participants...");
  await sql`
    CREATE POLICY "Users can see their own participations"
    ON public.conversation_participants FOR SELECT
    USING (user_id = auth.uid() OR auth.role() = 'service_role');
  `;
  console.log("✓ conversation_participants SELECT policy created");

  console.log("→ Creating SELECT policy for messages...");
  await sql`
    CREATE POLICY "Users can read messages in their conversations"
    ON public.messages FOR SELECT
    USING (
      auth.role() = 'service_role'
      OR
      EXISTS (
        SELECT 1 FROM public.conversation_participants cp
        WHERE cp.conversation_id = messages.conversation_id
        AND cp.user_id = auth.uid()
      )
    );
  `;
  console.log("✓ messages SELECT policy created");

  console.log("→ Creating INSERT policy for messages...");
  await sql`
    CREATE POLICY "Users can insert messages as themselves"
    ON public.messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);
  `;
  console.log("✓ messages INSERT policy created");

  console.log("→ Creating SELECT policy for conversations...");
  await sql`
    CREATE POLICY "Users can read their conversations"
    ON public.conversations FOR SELECT
    USING (
      auth.role() = 'service_role'
      OR
      EXISTS (
        SELECT 1 FROM public.conversation_participants cp
        WHERE cp.conversation_id = conversations.id
        AND cp.user_id = auth.uid()
      )
    );
  `;
  console.log("✓ conversations SELECT policy created");

  console.log("→ All 4 RLS policies + 3 RLS enable statements installed successfully.");
}

main()
  .then(() => sql.end())
  .catch((e: any) => {
    const msg = e?.message ?? String(e);
    if (msg.includes("already exists")) {
      console.log("⚠ Policy already exists — safe to ignore.");
      sql.end();
      process.exit(0);
    }
    console.error("FAILED:", msg.substring(0, 300));
    sql.end();
    process.exit(1);
  });
