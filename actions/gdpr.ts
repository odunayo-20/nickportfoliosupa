"use server";

import { createStaticClient } from "@/lib/server";

interface ConsentPayload {
  fingerprint: string;
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export async function logConsent(data: ConsentPayload): Promise<void> {
  const supabase = createStaticClient();

  const { data: existing } = await supabase
    .from("gdpr_consents")
    .select("id")
    .eq("session_fingerprint", data.fingerprint)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("gdpr_consents")
      .update({
        necessary: data.necessary,
        analytics: data.analytics,
        marketing: data.marketing,
      })
      .eq("session_fingerprint", data.fingerprint);
  } else {
    await supabase.from("gdpr_consents").insert({
      session_fingerprint: data.fingerprint,
      necessary: data.necessary,
      analytics: data.analytics,
      marketing: data.marketing,
      country_code: "HR",
    });
  }
}
