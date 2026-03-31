import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    // Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Expiración: 10 minutos
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Invalidar códigos anteriores del mismo email
    await supabase
      .from("otp_codes")
      .update({ used: true })
      .eq("email", email.toLowerCase())
      .eq("used", false);

    // Guardar nuevo código
    await supabase.from("otp_codes").insert({
      email: email.toLowerCase(),
      code,
      expires_at: expiresAt,
    });

    // Crear o verificar usuario en Supabase
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (!existing) {
      await supabase.from("users").insert({
        email: email.toLowerCase(),
        full_name: email.split("@")[0],
        plan: "starter",
        created_at: new Date().toISOString(),
      });
    }

    // Enviar email con Resend
    await resend.emails.send({
      from: "RevGo <noreply@famousface.app>",
      to: email,
      subject: "Tu código de acceso a RevGo",
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0A0A0A; color: #F0F0EC; padding: 40px 32px; border-radius: 16px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 32px;">
            <div style="width: 32px; height: 32px; background: #FFE600; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
              <span style="color: #0A0A0A; font-size: 15px; font-weight: 700;">R</span>
            </div>
            <span style="font-size: 18px; font-weight: 700; color: #F0F0EC;">RevGo<span style="color: #FFE600;">.app</span></span>
          </div>
          
          <h1 style="font-size: 24px; font-weight: 700; color: #F0F0EC; margin-bottom: 8px; letter-spacing: -0.03em;">Tu código de acceso</h1>
          <p style="font-size: 14px; color: #A0A090; line-height: 1.6; margin-bottom: 32px;">Usa este código para ingresar a RevGo. Expira en 10 minutos.</p>
          
          <div style="background: #111100; border: 2px solid #FFE600; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
            <div style="font-size: 48px; font-weight: 700; color: #FFE600; letter-spacing: 0.2em;">${code}</div>
          </div>
          
          <p style="font-size: 12px; color: #555540; line-height: 1.6;">Si no solicitaste este código, ignora este correo. Nadie más puede acceder a tu cuenta.</p>
          
          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #2a2800;">
            <p style="font-size: 11px; color: #333320;">© 2026 RevGo · Lima, Perú</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json({ error: "Error enviando el código" }, { status: 500 });
  }
}