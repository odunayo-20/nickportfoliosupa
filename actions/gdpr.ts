"use server";

import { createAdminClient } from "@/lib/admin";
import { rateLimit } from "@/lib/rate-limit";

interface ConsentPayload {
  fingerprint: string;
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export async function logConsent(data: ConsentPayload): Promise<void> {
  const fingerprint = String(data?.fingerprint ?? "");
  if (!fingerprint || fingerprint.length > 128) return;
  if (!(await rateLimit("consent", 20, 10 * 60_000))) return;

  // Service client + upsert: the public role can't read gdpr_consents, so the old
  // "select then update" never found the row, and repeat visits failed on the unique key.
  const supabase = createAdminClient();
  const { error } = await supabase.from("gdpr_consents").upsert(
    {
      session_fingerprint: fingerprint,
      necessary: true,
      analytics: !!data.analytics,
      marketing: !!data.marketing,
      country_code: "HR",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "session_fingerprint" }
  );
  if (error) console.error("Failed to log consent:", error.message);
}
