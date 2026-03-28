import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const payload = await request.json();
    const eventName = payload.meta?.event_name;
    const email = payload.data?.attributes?.user_email;
    const productName = payload.data?.attributes?.product_name?.toLowerCase();

    console.log("Webhook:", eventName, email, productName);

    let plan = "starter";
    if (productName?.includes("growth")) plan = "growth";
    else if (productName?.includes("pro")) plan = "pro";
    else if (productName?.includes("agencia")) plan = "agencia";

    if (eventName === "subscription_created" || eventName === "subscription_updated") {
      const { error } = await supabase
        .from("users")
        .update({ plan })
        .eq("email", email);
      
      console.log("Supabase update:", plan, email, error);
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}