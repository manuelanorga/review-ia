import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    // Validaciones básicas
    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
    }

    // Verificar si el email ya existe
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json({ error: "Este correo ya está registrado" }, { status: 409 });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario en Supabase
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        email: email.toLowerCase(),
        full_name: name || email.split("@")[0],
        password: hashedPassword,
        plan: "starter",
        created_at: new Date().toISOString(),
      })
      .select("id, email, full_name")
      .single();

    if (error) {
      console.error("Error creando usuario:", error);
      return NextResponse.json({ error: "Error al crear la cuenta" }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });

  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}