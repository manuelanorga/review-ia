"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Y = "#FFE600";
const BG = "#0A0A0A";
const SURF = "#111100";
const SURF2 = "#161608";
const TEXT = "#F0F0EC";
const MUTED = "#A0A090";
const LIGHT = "#D8D8D0";
const BORDER = "#2a2800";

export default function Contacto() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", negocio: "", mensaje: "" });

  const handleSubmit = () => {
    if (!form.nombre || !form.email || !form.mensaje) return;
    const text = encodeURIComponent(`Hola, soy ${form.nombre} de ${form.negocio || "mi negocio"}. Mi email es ${form.email}.\n\n${form.mensaje}`);
    window.open(`https://wa.me/51931067775?text=${text}`, "_blank");
    setSent(true);
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT, fontFamily: "'DM Sans', sans-serif" }}>
      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #2a2800", padding: "0 6%", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
          <img src="/logo.png" alt="RevGo logo" style={{ width: 30, height: 30, borderRadius: 7, objectFit: "contain" }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>RevGo<span style={{ color: Y }}>.app</span></span>
        </div>
        <button onClick={() => router.push("/")} style={{ padding: "7px 16px", background: "transparent", border: "1px solid #2a2800", borderRadius: 7, color: MUTED, fontSize: 13, cursor: "pointer" }}>← Volver</button>
      </nav>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "100px 6% 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{ fontSize: 11, color: Y, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>Contacto</span>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "16px 0 12px", color: TEXT }}>¿Cómo podemos ayudarte?</h1>
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7 }}>Estamos aquí para responder tus preguntas y ayudarte a sacar el máximo provecho de RevGo.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>

          {/* FORMULARIO */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 24, letterSpacing: "-0.02em" }}>Envíanos un mensaje</h2>

            {sent ? (
              <div style={{ background: "#1a1700", border: "1px solid #3a3400", borderRadius: 14, padding: "32px 28px", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
                <p style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8 }}>¡Mensaje enviado!</p>
                <p style={{ fontSize: 14, color: MUTED }}>Te redirigimos a WhatsApp. Te respondemos en menos de 24 horas.</p>
                <button onClick={() => setSent(false)} style={{ marginTop: 20, padding: "10px 24px", background: "transparent", border: "1px solid #2a2800", borderRadius: 8, color: MUTED, fontSize: 13, cursor: "pointer" }}>Enviar otro mensaje</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { key: "nombre", label: "Nombre completo *", placeholder: "Tu nombre", type: "text" },
                  { key: "email", label: "Correo electrónico *", placeholder: "tu@email.com", type: "email" },
                  { key: "negocio", label: "Nombre de tu negocio", placeholder: "Opcional", type: "text" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, color: MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", background: SURF2, border: `1px solid ${BORDER}`, borderRadius: 9, color: TEXT, fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" }}
                      onFocus={e => e.target.style.borderColor = Y}
                      onBlur={e => e.target.style.borderColor = BORDER}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, color: MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Mensaje *</label>
                  <textarea
                    placeholder="Cuéntanos en qué podemos ayudarte..."
                    value={form.mensaje}
                    onChange={e => setForm({ ...form, mensaje: e.target.value })}
                    rows={5}
                    style={{ width: "100%", padding: "12px 14px", background: SURF2, border: `1px solid ${BORDER}`, borderRadius: 9, color: TEXT, fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif", resize: "vertical", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = Y}
                    onBlur={e => e.target.style.borderColor = BORDER}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  style={{ padding: "13px", background: Y, border: "none", borderRadius: 9, color: BG, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }}
                  onMouseOver={e => e.currentTarget.style.background = "#fff176"}
                  onMouseOut={e => e.currentTarget.style.background = Y}
                >
                  Enviar mensaje por WhatsApp →
                </button>
                <p style={{ fontSize: 12, color: MUTED, textAlign: "center" }}>Te responderemos en menos de 24 horas</p>
              </div>
            )}
          </div>

          {/* INFO DE CONTACTO */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 4, letterSpacing: "-0.02em" }}>Información de contacto</h2>

            {[
              {
                icon: "💬",
                title: "WhatsApp",
                desc: "La forma más rápida de contactarnos",
                action: "Escribir por WhatsApp →",
                href: "https://wa.me/51931067775?text=Hola%2C%20me%20interesa%20RevGo%20para%20mi%20negocio",
              },
              {
                icon: "📧",
                title: "Correo electrónico",
                desc: "hola@revgo.app",
                action: "Enviar email →",
                href: "mailto:hola@revgo.app",
              },
              {
                icon: "📍",
                title: "Ubicación",
                desc: "Lima, Perú\nAtendemos toda LATAM",
                action: null,
                href: null,
              },
              {
                icon: "🕐",
                title: "Horario de atención",
                desc: "Lunes a viernes\n9:00 AM – 6:00 PM (hora Lima)",
                action: null,
                href: null,
              },
            ].map((item, i) => (
              <div key={i} style={{ background: SURF2, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 22px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, whiteSpace: "pre-line", marginBottom: item.action ? 10 : 0 }}>{item.desc}</div>
                  {item.action && (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: Y, fontWeight: 600, textDecoration: "none" }}>{item.action}</a>
                  )}
                </div>
              </div>
            ))}

            <div style={{ background: "#1a1700", border: "1px solid #3a3400", borderRadius: 12, padding: "20px 22px", marginTop: 4 }}>
              <p style={{ fontSize: 14, color: LIGHT, lineHeight: 1.7 }}>
                <strong style={{ color: Y }}>¿Ya eres cliente?</strong> Si necesitas soporte técnico, escríbenos directamente desde tu dashboard en la sección <strong>Ayuda</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "24px 6%", textAlign: "center" }}>
        <span style={{ fontSize: 12, color: MUTED }}>© 2026 RevGo · Lima, Perú · <span style={{ cursor: "pointer", color: MUTED }} onClick={() => router.push("/privacidad")}>Privacidad</span> · <span style={{ cursor: "pointer", color: MUTED }} onClick={() => router.push("/terminos")}>Términos</span></span>
      </footer>
    </div>
  );
}