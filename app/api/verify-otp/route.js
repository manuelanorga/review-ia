import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email y código requeridos" }, { status: 400 });
    }

    // Solo verificar que el código es válido — NO marcarlo como usado
    const { data: otpRecord, error } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("code", code)
      .eq("used", false)
      .gte("expires_at", new Date().toISOString())
      .single();

    if (error || !otpRecord) {
      return NextResponse.json({ error: "Código inválido o expirado" }, { status: 400 });
    }

    // Verificar si es usuario nuevo o existente
    const { data: user } = await supabase
      .from("users")
      .select("id, plan")
      .eq("email", email.toLowerCase())
      .single();

    const isNewUser = !user || !user.plan;

    return NextResponse.json({
      success: true,
      isNewUser,
    });

  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: "Error verificando el código" }, { status: 500 });
  }
}