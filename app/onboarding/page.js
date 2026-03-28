"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Onboarding() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    industry: "",
    website: "",
  });

  const industries = [
    "🏨 Hotel",
    "🍽️ Restaurante",
    "🏥 Clínica",
    "💆 Spa / Salud",
    "🏋️ Gimnasio",
    "🛍️ Tienda / Retail",
    "🏠 Inmobiliaria",
    "⚖️ Consultora",
    "🎓 Educación",
    "🔧 Otro",
  ];

  const CHECKOUT_URLS = {
    starter: "https://revgo.lemonsqueezy.com/checkout/buy/ea9dbdb9-ac54-43b8-a935-5001f6dd101c?embed=1",
    growth: "https://revgo.lemonsqueezy.com/checkout/buy/0f138e64-5cd0-4daa-a8df-268cbea631af?embed=1",
    pro: "https://revgo.lemonsqueezy.com/checkout/buy/5776260f-8236-4855-9fe5-c48389e39e3c?embed=1",
    agencia: "https://revgo.lemonsqueezy.com/checkout/buy/9b3d706b-84e5-4998-b58e-09aff23929e2?embed=1",
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("users").insert({
        email: session?.user?.email,
        full_name: form.full_name,
        phone: form.phone,
        industry: form.industry,
        website: form.website,
        plan: "starter",
      });
      if (error) {
        console.error("Supabase error:", JSON.stringify(error));
        alert(JSON.stringify(error));
        return;
      }
      const selectedPlan = localStorage.getItem("selectedPlan") || "starter";
      localStorage.removeItem("selectedPlan");
      window.location.href = CHECKOUT_URLS[selectedPlan] || CHECKOUT_URLS.starter;
    } catch (error) {
      console.error("catch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: 20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      <div style={{ width: "100%", maxWidth: 480 }}>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, justifyContent: "center" }}>
          <div style={{ width: 36, height: 36, background: "#FFE600", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#000", fontSize: 16, fontWeight: 700 }}>R</span>
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#f5f5f5" }}>RevGo<span style={{ color: "#FFE600" }}>.app</span></span>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= step ? "#FFE600" : "#262626", transition: "background 0.3s" }} />
          ))}
        </div>

        <div style={{ background: "#1a1a1a", border: "1px solid #262626", borderRadius: 16, padding: "32px" }}>

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f5f5f5", marginBottom: 6 }}>¡Hola! Cuéntanos de ti</h2>
              <p style={{ fontSize: 14, color: "#737373", marginBottom: 24 }}>Solo tomará 1 minuto configurar tu cuenta.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: "#737373", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Nombre completo *</label>
                  <input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="Manuel Añorga" style={{ width: "100%", marginTop: 6, padding: "12px 14px", background: "#0f0f0f", border: "1px solid #262626", borderRadius: 9, color: "#f5f5f5", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }}
                    onFocus={e => e.target.style.borderColor = "#FFE600"}
                    onBlur={e => e.target.style.borderColor = "#262626"}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "#737373", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Celular *</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+51 999 999 999" style={{ width: "100%", marginTop: 6, padding: "12px 14px", background: "#0f0f0f", border: "1px solid #262626", borderRadius: 9, color: "#f5f5f5", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }}
                    onFocus={e => e.target.style.borderColor = "#FFE600"}
                    onBlur={e => e.target.style.borderColor = "#262626"}
                  />
                </div>
              </div>
              <button onClick={() => form.full_name && form.phone && setStep(2)} style={{ width: "100%", marginTop: 24, padding: "13px", background: form.full_name && form.phone ? "#FFE600" : "#262626", border: "none", borderRadius: 9, color: form.full_name && form.phone ? "#000" : "#737373", fontSize: 14, fontWeight: 700, cursor: form.full_name && form.phone ? "pointer" : "not-allowed" }}>
                Continuar →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f5f5f5", marginBottom: 6 }}>¿Qué tipo de negocio tienes?</h2>
              <p style={{ fontSize: 14, color: "#737373", marginBottom: 24 }}>Personalizamos RevGo según tu industria.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {industries.map(ind => (
                  <button key={ind} onClick={() => setForm({ ...form, industry: ind })} style={{ padding: "12px 14px", background: form.industry === ind ? "rgba(255,230,0,0.1)" : "#0f0f0f", border: `1px solid ${form.industry === ind ? "#FFE600" : "#262626"}`, borderRadius: 9, color: form.industry === ind ? "#FFE600" : "#737373", fontSize: 13, fontWeight: form.industry === ind ? 700 : 400, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                    {ind}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: "13px", background: "transparent", border: "1px solid #262626", borderRadius: 9, color: "#737373", fontSize: 14, cursor: "pointer" }}>← Atrás</button>
                <button onClick={() => form.industry && setStep(3)} style={{ flex: 2, padding: "13px", background: form.industry ? "#FFE600" : "#262626", border: "none", borderRadius: 9, color: form.industry ? "#000" : "#737373", fontSize: 14, fontWeight: 700, cursor: form.industry ? "pointer" : "not-allowed" }}>
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f5f5f5", marginBottom: 6 }}>¿Tienes sitio web?</h2>
              <p style={{ fontSize: 14, color: "#737373", marginBottom: 24 }}>Opcional — lo usamos para personalizar tus respuestas.</p>
              <div>
                <label style={{ fontSize: 12, color: "#737373", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Sitio web</label>
                <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://tunegocio.com" style={{ width: "100%", marginTop: 6, padding: "12px 14px", background: "#0f0f0f", border: "1px solid #262626", borderRadius: 9, color: "#f5f5f5", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }}
                  onFocus={e => e.target.style.borderColor = "#FFE600"}
                  onBlur={e => e.target.style.borderColor = "#262626"}
                />
              </div>
              <div style={{ marginTop: 16, padding: "14px", background: "rgba(255,230,0,0.06)", border: "1px solid rgba(255,230,0,0.15)", borderRadius: 9 }}>
                <p style={{ fontSize: 12, color: "#c0b870", lineHeight: 1.6 }}>
                  🎉 ¡Ya casi listo! Tu Google Business Profile ya está conectado. En segundos podrás empezar a responder tus reseñas con IA automáticamente.
                </p>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: "13px", background: "transparent", border: "1px solid #262626", borderRadius: 9, color: "#737373", fontSize: 14, cursor: "pointer" }}>← Atrás</button>
                <button onClick={handleSave} disabled={loading} style={{ flex: 2, padding: "13px", background: "#FFE600", border: "none", borderRadius: 9, color: "#000", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Guardando..." : "¡Empezar con RevGo! 🚀"}
                </button>
              </div>
            </div>
          )}

        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#404040", marginTop: 20 }}>
          Al continuar aceptas nuestros <span style={{ color: "#FFE600", cursor: "pointer" }}>Términos de servicio</span>
        </p>
      </div>
    </div>
  );
}