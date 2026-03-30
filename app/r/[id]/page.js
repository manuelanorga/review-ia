"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

const STEPS = { filter: "filter", stars: "stars", complaint: "complaint", success: "success", blocked: "blocked" };

export default function ReviewPage() {
  const { id } = useParams();
  const [step, setStep] = useState(STEPS.filter);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [complaint, setComplaint] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const { data } = await supabase
          .from("businesses")
          .select("id, name, google_maps_url, email, tone")
          .eq("review_slug", id)
          .single();
        if (data) setBusiness(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchBusiness();
  }, [id]);

  const handleMood = (mood) => {
    if (mood === "happy") setStep(STEPS.stars);
    else setStep(STEPS.complaint);
  };

  const handleStars = (n) => {
    setStars(n);
    if (n >= 3) {
      setTimeout(() => {
        const url = business?.google_maps_url || `https://search.google.com/local/writereview?placeid=${id}`;
        window.open(url, "_blank");
        setStep(STEPS.success);
      }, 600);
    } else {
      setTimeout(() => setStep(STEPS.complaint), 600);
    }
  };

  const handleComplaint = async () => {
    if (!complaint.trim()) return;
    setSending(true);
    try {
      await supabase.from("complaints").insert({
        business_id: business?.id,
        message: complaint,
        stars: stars || 1,
        created_at: new Date().toISOString(),
      });
    } catch (err) { console.error(err); }
    setSending(false);
    setSent(true);
    setStep(STEPS.blocked);
  };

  const Y = "#FFE600";
  const BG = "#0A0A0A";

  if (loading) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #222", borderTopColor: Y, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!business) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: "center", padding: "0 24px" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
        <p style={{ color: "#666", fontSize: 15 }}>No encontramos este negocio.</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pop { 0% { transform: scale(1); } 50% { transform: scale(1.3); } 100% { transform: scale(1); } }
        .star-btn { background: none; border: none; cursor: pointer; padding: 4px; transition: transform 0.15s; }
        .star-btn:hover { transform: scale(1.15); }
        .mood-btn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 18px 12px; border-radius: 16px; border: 1.5px solid #222; background: #111; cursor: pointer; transition: all 0.2s; }
        .mood-btn:hover { border-color: #444; background: #161616; transform: translateY(-2px); }
        .mood-btn.happy:hover { border-color: #16a34a; background: #0a1a0f; }
        .mood-btn.mid:hover { border-color: #ca8a04; background: #1a1500; }
        .mood-btn.sad:hover { border-color: #dc2626; background: #1a0a0a; }
        textarea { width: 100%; padding: 14px; background: #111; border: 1.5px solid #222; border-radius: 12px; color: #f0f0ec; font-family: 'DM Sans', sans-serif; font-size: 14px; resize: none; outline: none; line-height: 1.6; }
        textarea:focus { border-color: #333; }
        textarea::placeholder { color: #444; }
      `}</style>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, animation: "fadeUp 0.4s ease both" }}>
        <div style={{ width: 28, height: 28, background: Y, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: BG, fontSize: 12, fontWeight: 700 }}>R</span>
        </div>
        <span style={{ color: "#444", fontSize: 13, fontWeight: 500 }}>RevGo.app</span>
      </div>

      {/* Card principal */}
      <div style={{ width: "100%", maxWidth: 400, background: "#111", border: "1px solid #1a1a1a", borderRadius: 24, padding: "32px 28px", animation: "fadeUp 0.4s ease 0.1s both" }}>

        {/* Nombre del negocio */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, background: "#1a1a1a", border: "1px solid #222", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 12px" }}>🏢</div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0ec", letterSpacing: "-0.02em", marginBottom: 4 }}>{business.name}</h1>
          <p style={{ fontSize: 12, color: "#555" }}>powered by RevGo.app</p>
        </div>

        {/* STEP 1: Filtro de humor */}
        {step === STEPS.filter && (
          <div style={{ animation: "fadeUp 0.3s ease both" }}>
            <p style={{ fontSize: 15, color: "#d0d0c8", textAlign: "center", lineHeight: 1.6, marginBottom: 24 }}>
              Hola 👋 ¿Cómo fue tu experiencia con nosotros?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="mood-btn happy" onClick={() => handleMood("happy")}>
                <span style={{ fontSize: 28 }}>😊</span>
                <span style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>Buena</span>
              </button>
              <button className="mood-btn mid" onClick={() => handleMood("happy")}>
                <span style={{ fontSize: 28 }}>😐</span>
                <span style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>Regular</span>
              </button>
              <button className="mood-btn sad" onClick={() => handleMood("sad")}>
                <span style={{ fontSize: 28 }}>😞</span>
                <span style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>Mala</span>
              </button>
            </div>
            <p style={{ fontSize: 11, color: "#333", textAlign: "center", marginTop: 16 }}>Tu opinión nos ayuda a mejorar</p>
          </div>
        )}

        {/* STEP 2A: Estrellas */}
        {step === STEPS.stars && (
          <div style={{ animation: "fadeUp 0.3s ease both" }}>
            <p style={{ fontSize: 13, color: "#4ade80", textAlign: "center", fontWeight: 600, marginBottom: 6 }}>¡Qué bueno saberlo! 🙌</p>
            <p style={{ fontSize: 15, color: "#d0d0c8", textAlign: "center", lineHeight: 1.6, marginBottom: 24 }}>
              ¿Cuántas estrellas le darías a tu experiencia?
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} className="star-btn" onClick={() => handleStars(n)} onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}
                  style={{ fontSize: 36, color: n <= (hovered || stars) ? Y : "#2a2a2a", animation: n <= stars ? "pop 0.3s ease" : "none" }}>★</button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: "#333", textAlign: "center" }}>3 estrellas o más → te llevamos directo a Google</p>
          </div>
        )}

        {/* STEP 2B: Queja interna */}
        {step === STEPS.complaint && (
          <div style={{ animation: "fadeUp 0.3s ease both" }}>
            <div style={{ background: "#1a0a00", border: "1px solid #3a1a00", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#fb923c", marginBottom: 4 }}>Lo sentimos mucho 🙏</p>
              <p style={{ fontSize: 12, color: "#7a4020", lineHeight: 1.6 }}>Queremos ayudarte a solucionarlo. Cuéntanos qué pasó y el equipo se pondrá en contacto contigo.</p>
            </div>
            <textarea rows={4} value={complaint} onChange={e => setComplaint(e.target.value)} placeholder="¿Qué podríamos haber hecho mejor?" />
            <button onClick={handleComplaint} disabled={!complaint.trim() || sending}
              style={{ width: "100%", marginTop: 12, padding: "14px", background: complaint.trim() ? "#1a1700" : "#111", border: `1px solid ${complaint.trim() ? "#3a3400" : "#1a1a1a"}`, borderRadius: 12, color: complaint.trim() ? Y : "#333", fontSize: 14, fontWeight: 700, cursor: complaint.trim() ? "pointer" : "not-allowed", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" }}>
              {sending ? "Enviando..." : "Enviar al equipo →"}
            </button>
            <p style={{ fontSize: 11, color: "#333", textAlign: "center", marginTop: 10 }}>Tu comentario no se publica en Google</p>
          </div>
        )}

        {/* STEP 3A: Éxito (fue a Google) */}
        {step === STEPS.success && (
          <div style={{ animation: "fadeUp 0.3s ease both", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0ec", marginBottom: 8, letterSpacing: "-0.02em" }}>¡Gracias por tu reseña!</h2>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 20 }}>Tu opinión ayuda a otros clientes y nos ayuda a seguir mejorando.</p>
            <div style={{ background: "#1a1700", border: "1px solid #2a2800", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 10, textAlign: "left" }}>
              <div style={{ width: 24, height: 24, background: Y, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <span style={{ color: BG, fontSize: 10, fontWeight: 700 }}>R</span>
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: Y, marginBottom: 4, letterSpacing: "0.06em" }}>REVGO AI · RESPUESTA AUTOMÁTICA</p>
                <p style={{ fontSize: 12, color: "#a89060", lineHeight: 1.6 }}>¡Muchas gracias por visitarnos! Nos alegra que hayas tenido una buena experiencia. ¡Te esperamos pronto! 💛</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3B: Queja enviada */}
        {step === STEPS.blocked && (
          <div style={{ animation: "fadeUp 0.3s ease both", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🙏</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f0ec", marginBottom: 8, letterSpacing: "-0.02em" }}>Mensaje recibido</h2>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>Gracias por avisarnos. El equipo revisará tu mensaje y se pondrá en contacto contigo para solucionar el problema.</p>
            <div style={{ marginTop: 20, padding: "12px 16px", background: "#111", border: "1px solid #1a1a1a", borderRadius: 10 }}>
              <p style={{ fontSize: 11, color: "#444" }}>Queremos mejorar para tu próxima visita 💛</p>
            </div>
          </div>
        )}

      </div>

      <p style={{ fontSize: 11, color: "#222", marginTop: 24 }}>Powered by RevGo.app</p>
    </div>
  );
}