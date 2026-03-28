import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("x-signature");
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  // Verificar firma
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(body).digest("hex");

  if (signature !== digest) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body);
  console.log("Webhook recibido:", eventName, email, productName);
  const eventName = payload.meta?.event_name;
  const email = payload.data?.attributes?.user_email;
  const productName = payload.data?.attributes?.product_name?.toLowerCase();

  // Determinar plan
  let plan = "starter";
  if (productName?.includes("growth")) plan = "growth";
  else if (productName?.includes("pro")) plan = "pro";
  else if (productName?.includes("agencia")) plan = "agencia";

  if (eventName === "subscription_created" || eventName === "subscription_updated") {
    await supabase
      .from("users")
      .update({ plan })
      .eq("email", email);
  }

  if (eventName === "subscription_cancelled") {
    await supabase
      .from("users")
      .update({ plan: "starter" })
      .eq("email", email);
  }

  return Response.json({ success: true });
}