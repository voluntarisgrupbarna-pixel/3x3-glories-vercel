import { NextRequest, NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  question?: string;
  message?: string;
  consent?: boolean;
  origin?: string;
};

const FORM_ID = "261294471275057";
const JOTFORM_SUBMIT_URL = `https://eu-submit.jotform.com/submit/${FORM_ID}`;

function splitName(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  return {
    first: parts.slice(0, Math.max(1, parts.length - 1)).join(" "),
    last: parts.length > 1 ? parts[parts.length - 1] : "",
  };
}

function buildInternalNote(payload: Required<Omit<LeadPayload, "consent">> & { consent: boolean }) {
  return [
    payload.message,
    "",
    `Origen: ${payload.origin}`,
    `Interès: ${payload.interest}`,
    `Consulta: ${payload.question}`,
    `Telèfon: ${payload.phone}`,
    `Email: ${payload.email}`,
    `Consentiment: ${payload.consent ? "Sí" : "No"}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => ({}))) as LeadPayload;
  const data = {
    name: (payload.name || "").trim(),
    email: (payload.email || "").trim(),
    phone: (payload.phone || "").trim(),
    interest: (payload.interest || "3×3 Westfield Glòries").trim(),
    question: (payload.question || "Vull rebre informació del campus").trim(),
    message: (payload.message || "").trim(),
    origin: (payload.origin || "QR contacte 3x3").trim(),
    consent: Boolean(payload.consent),
  };

  if (!data.name || !data.email || !data.phone || !data.consent) {
    return NextResponse.json({ error: "Falten dades obligatòries." }, { status: 400 });
  }

  const name = splitName(data.name);
  const form = new URLSearchParams();

  form.set("formID", FORM_ID);
  form.set("simple_spc", `${FORM_ID}-${FORM_ID}`);
  form.set("submitSource", "web_3x3_custom_whatsapp");
  form.set("website", "");
  form.set("q2_q2_fullname0[first]", name.first);
  form.set("q2_q2_fullname0[last]", name.last);
  form.set("q3_q3_phone1[full]", data.phone);
  form.set("q4_q4_email2", data.email);
  form.set("q10_tipusDinteres", data.interest);
  form.set("q11_sobreQue", data.question);
  form.set("q7_q7_textarea5", buildInternalNote(data));
  form.set("q8_q8_widget_TermsAndConditions6", "Accepted");

  const response = await fetch(JOTFORM_SUBMIT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "CB-Grup-Barna-3x3-Lead-Form",
    },
    body: form.toString(),
    redirect: "follow",
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Jotform ha rebutjat el contacte." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
