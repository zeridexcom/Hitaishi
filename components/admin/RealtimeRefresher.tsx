"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export function RealtimeRefresher() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Subscribe to changes on key admin tables
    const tables = [
      "users",
      "profiles",
      "sessions",
      "mentor_verifications",
      "webhook_events",
      "conversations",
      "audit_log",
    ];

    const channels = tables.map((table) => {
      return supabase
        .channel(`admin-refresh-${table}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          (payload) => {
            console.log(`[RealtimeRefresher] Database change in "${table}":`, payload.eventType);
            router.refresh();
          }
        )
        .subscribe();
    });

    return () => {
      channels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
    };
  }, [router]);

  return null;
}
