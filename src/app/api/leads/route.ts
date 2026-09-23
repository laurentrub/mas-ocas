import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { LeadType } from "@/lib/supabase/database.types";
import { isSupabaseConfigured } from "@/lib/auth/session";
import type { LeadDetails } from "@/lib/demandes";
import { isHoneypotFilled, isLeadRateLimited } from "@/lib/lead-spam";

function mapSujetToType(sujet: string, interest: string, type?: string): LeadType {
  if (type === "visite" || type === "livraison" || type === "financement") {
    return type;
  }
  const s = (sujet || interest).toLowerCase();
  if (s.includes("rendez") || s.includes("visite") || s.includes("essai"))
    return "visite";
  if (s.includes("financ")) return "financement";
  if (s.includes("livraison")) return "livraison";
  if (s.includes("rappel")) return "rappel";
  if (s.includes("reprise")) return "reprise";
  if (s.includes("devis")) return "devis";
  return "contact";
}

function isValidDetails(details: unknown): details is LeadDetails {
  if (!details || typeof details !== "object") return false;
  const d = details as LeadDetails;
  if (d.kind === "visite") {
    return Boolean(d.preferred_date && d.preferred_slot);
  }
  if (d.kind === "livraison") {
    return Boolean(d.address && d.postal_code && d.city);
  }
  if (d.kind === "financement") {
    // legacy short schedule
    if (
      typeof d.installments === "number" &&
      [2, 3, 4].includes(d.installments) &&
      !("product" in d && d.product)
    ) {
      return true;
    }
    const okProduct = [
      "credit_classique",
      "loa",
      "lld",
      "credit_avec_apport",
      "credit_sans_apport",
    ].includes((d as { product?: string }).product ?? "");
    const okDuration = [36, 48, 60].includes(
      (d as { duration_months?: number }).duration_months ?? 0
    );
    const okCustomer = ["particulier", "professionnel"].includes(
      (d as { customer_type?: string }).customer_type ?? ""
    );
    return okProduct && okDuration && okCustomer && d.vehicle_price > 0;
  }
  return false;
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Service indisponible" },
      { status: 503 }
    );
  }

  const body = (await request.json()) as {
    name?: string;
    email?: string;
    phone?: string;
    interest?: string;
    message?: string;
    sujet?: string;
    type?: string;
    vehicle_slug?: string;
    details?: unknown;
    /** Honeypot — must stay empty. */
    website?: string;
  };

  // Soft OK for bots that fill the honeypot (avoid teaching them).
  if (isHoneypotFilled(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  if (isLeadRateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez dans une minute." },
      { status: 429 }
    );
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const hasDetails = isValidDetails(body.details);

  if (
    name.length < 2 ||
    !email.includes("@") ||
    (!hasDetails && message.length < 10)
  ) {
    return NextResponse.json({ error: "Champs invalides" }, { status: 400 });
  }

  const interest = String(body.interest ?? "").trim();
  const sujet = String(body.sujet ?? "").trim();
  const vehicle_slug = String(body.vehicle_slug ?? "").trim() || null;
  const leadType = mapSujetToType(sujet, interest, body.type);

  const supabase = await createClient();
  let vehicle_id: string | null = null;
  if (vehicle_slug) {
    const { data } = await supabase
      .from("vehicles")
      .select("id")
      .eq("slug", vehicle_slug)
      .maybeSingle();
    vehicle_id = data?.id ?? null;
  }

  const { error } = await supabase.from("leads").insert({
    type: leadType,
    name,
    email,
    phone: String(body.phone ?? "").trim() || null,
    message: message || null,
    interest: interest || null,
    vehicle_slug,
    vehicle_id,
    details: hasDetails ? (body.details as LeadDetails) : null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
