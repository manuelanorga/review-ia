"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const Y = "#FFE600";
const BG = "#0A0A0A";
const SURF = "#111100";
const SURF2 = "#161608";
const BORDER = "#2a2800";
const TEXT = "#F0F0EC";
const MUTED = "#A0A090";
const LIGHT = "#D8D8D0";

const STEPS = [
  { n: "01", title: "Conecta tu Google Business", desc: "Un clic. Google abre su ventana oficial. Nosotros jamás vemos tu contraseña.", icon: "○" },
  { n: "02", title: "Define el tono de tu marca", desc: "Cercano, formal o profesional. La IA aprende cómo habla tu negocio.", icon: "◇" },
  { n: "03", title: "Responde en autopiloto", desc: "Cada reseña nueva recibe una respuesta personalizada en segundos, 24/7.", icon: "△" },
];

const REVIEWS = [
  { stars: 5, name: "María González", avatar: "MG", avatarBg: "#4285F4", time: "Hace 2 horas", text: "Increíble experiencia, el personal súper atento y la habitación impecable. Definitivamente regreso.", response: "¡Gracias María! Nos alegra que hayas disfrutado tu estadía. ¡Te esperamos pronto!", replied: true },
  { stars: 2, name: "Carlos Mendoza", avatar: "CM", avatarBg: "#EA4335", time: "Hace 5 horas", text: "El servicio fue lento y la comida llegó fría. Esperaba más por el precio.", response: "Hola Carlos, lamentamos tu experiencia. Escríbenos directamente para compensarte.", replied: true },
  { stars: 4, name: "Lucía Fernández", avatar: "LF", avatarBg: "#34A853", time: "Hace 1 día", text: "Muy buen lugar, ambiente agradable y el personal atento. Solo faltó más rapidez.", response: null, replied: false },
];

const DEMO_REVIEWS = [
  {
    name: "Carlos Mendoza", initials: "CM", color: "#EA4335", stars: 2, time: "Hace 5h",
    text: "El servicio fue lento y la comida llegó fría. Esperaba más por el precio que pagué.",
    tone: "cercano", toneLabel: "Cercano",
    response: "Hola Carlos, qué pena que tu experiencia no fue la mejor. Eso no es lo que queremos para nuestros clientes. Escríbenos directamente y lo solucionamos juntos."
  },
  {
    name: "María González", initials: "MG", color: "#4285F4", stars: 5, time: "Hace 2h",
    text: "Increíble experiencia, el personal súper atento y la habitación impecable. Definitivamente regreso.",
    tone: "formal", toneLabel: "Formal",
    response: "Estimada María, le agradecemos sinceramente sus amables palabras. Es un honor contar con clientes como usted. Esperamos tener el placer de recibirle nuevamente muy pronto."
  },
  {
    name: "Rodrigo Vargas", initials: "RV", color: "#FBBC04", stars: 4, time: "Hace 1d",
    text: "El mejor hotel de Lima. Personal increíble y las instalaciones impecables. 100% recomendado.",
    tone: "profesional", toneLabel: "Profesional",
    response: "Gracias por su reseña, Rodrigo. Nos alegra que su experiencia haya superado las expectativas. Su satisfacción es nuestra mejor métrica de éxito. Hasta pronto."
  }
];

const FEATURES = [
  { icon: "🤖", title: "Respuestas inteligentes", desc: "Cada reseña recibe una respuesta única, personalizada y coherente con el tono de tu marca.", extra: null },
  { icon: "⚙️", title: "Control total", desc: "Tú decides cómo opera RevGo.", extra: ["Auto-publicar directamente en Google", "Revisar antes de publicar", "Editar cada respuesta a tu gusto"] },
  { icon: "📩", title: "Genera más reseñas", desc: "Envía campañas para pedir reseñas a tus clientes.", extra: ["Los felices → Google ⭐", "Los insatisfechos → feedback privado 🔒"] },
  { icon: "🌎", title: "Multilenguaje automático", desc: "Detecta el idioma de cada reseña y responde en el mismo idioma.", extra: ["Español → respuesta en español", "Inglés → respuesta en inglés", "Más de 50 idiomas soportados"] },
  { icon: "📱", title: "Kit de reseñas listo para imprimir", desc: "Genera tu QR personalizado y ponlo donde tus clientes felices puedan verlo.", extra: ["QR directo a tu página de reseñas en Google", "Cartel y tarjeta de mesa listos para imprimir", "Kit PDF completo con tu marca", "👉 El 72% de clientes dejan reseñas cuando se lo piden"] },
];

const PLANS = [
  {
    name: "Starter", price: "39", tagline: "Empieza a responder",
    desc: "Ideal para negocios pequeños",
    features: ["1 negocio conectado", "Hasta 50 reseñas/mes", "Respuestas con IA en español", "🤖 Autopiloto · Solo tono Formal", "📊 Analytics básico (solo visualizar)", "Soporte por email"],
    highlight: false, badge: null,
  },
  {
    name: "Growth", price: "79", tagline: "Crece en Google",
    desc: "Ideal para negocios en crecimiento",
    features: ["1-3 negocios conectados", "Hasta 300 reseñas/mes", "🌎 Español, inglés y 50 idiomas más", "🤖 Autopiloto · 3 tonos disponibles", "📊 Analytics completo + exportar PDF", "Soporte prioritario"],
    highlight: true, badge: "⭐ Más popular",
  },
  {
    name: "Pro", price: "149", tagline: "Domina tu reputación",
    desc: "Ideal para empresas multi-sucursal",
    features: ["Negocios ilimitados", "Reseñas ilimitadas", "🌎 Español, inglés y 50 idiomas más", "🤖 Autopiloto · 3 tonos disponibles", "📊 Analytics completo + exportar PDF", "Branding avanzado", "API access"],
    highlight: false, badge: null,
  },
  {
    name: "Agencia", price: "349", tagline: "Escala con tus clientes",
    desc: "Ideal para agencias y revendedores",
    features: ["Clientes ilimitados", "Multi-cuenta · White label", "🌎 Español, inglés y 50 idiomas más", "🤖 Autopiloto · 3 tonos disponibles", "📊 Analytics completo + exportar PDF", "Reportes avanzados", "Account manager dedicado"],
    highlight: false, badge: null,
  },
];

const FAQS = [
  { q: "¿Necesito dar mi contraseña de Google?", a: "No. Usamos OAuth — el mismo botón de 'Continuar con Google'. Google actúa como intermediario y nosotros jamás vemos tu contraseña." },
  { q: "¿Las respuestas suenan robóticas?", a: "No. La IA analiza cada reseña y genera una respuesta única con el nombre del cliente y detalles específicos. Puedes editar antes de publicar." },
  { q: "¿Puedo cancelar en cualquier momento?", a: "Sí, sin penalidades. Cancelas desde tu dashboard en 30 segundos, sin llamadas ni formularios." },
  { q: "¿Funciona para TripAdvisor y Booking?", a: "Actualmente soportamos Google Business Profile. TripAdvisor y Booking están en el roadmap del plan Business." },
];

const SOCIAL = [
  { name: "Instagram", href: "https://instagram.com", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> },
  { name: "LinkedIn", href: "https://linkedin.com", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
  { name: "WhatsApp", href: "https://wa.me", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg> },
  { name: "TikTok", href: "https://tiktok.com", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/></svg> },
];

function StarRow({ count }) {
  return (
    <div style={{ display: "flex", gap: 1 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= count ? "#FBBC04" : "#5a5a5a", fontSize: 12 }}>★</span>
      ))}
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} style={{ borderBottom: "1px solid #2a2800", padding: "22px 0", cursor: "pointer", userSelect: "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 15, color: LIGHT, fontFamily: "'DM Sans', sans-serif" }}>{q}</span>
        <span style={{ color: Y, fontSize: 22, flexShrink: 0, display: "inline-block", transform: open ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s", lineHeight: 1 }}>+</span>
      </div>
      {open && <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7, marginTop: 12, fontFamily: "'DM Sans', sans-serif" }}>{a}</p>}
    </div>
  );
}

function AnimatedBar({ pct, color, label, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);
  const fired = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired.current) {
        fired.current = true;
        setTimeout(() => setWidth(pct), delay);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [pct, delay]);
  return (
    <div ref={ref} style={{ background: SURF2, border: "1px solid #2a2800", borderRadius: 12, padding: "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 13, color: LIGHT }}>{label}</span>
        <span style={{ fontSize: 26, fontWeight: 700, color, letterSpacing: "-0.03em" }}>{pct}%</span>
      </div>
      <div style={{ height: 5, background: "#2a2800", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${width}%`, background: color, borderRadius: 4, transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
    </div>
  );
}

function DemoAnimation() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responseText, setResponseText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("idle");
  const animRef = useRef(null);

  const r = DEMO_REVIEWS[currentIdx];

  function setActiveTone(tone) {
    return DEMO_REVIEWS[currentIdx].tone === tone;
  }

  useEffect(() => {
    let cancelled = false;

    async function runCycle() {
      setResponseText("");
      setIsGenerating(false);
      setShowPublish(false);
      setProgress(0);
      setPhase("idle");

      await sleep(1000);
      if (cancelled) return;

      setIsGenerating(true);
      setPhase("generating");
      await sleep(1400);
      if (cancelled) return;

      setIsGenerating(false);
      setPhase("typing");

      const text = DEMO_REVIEWS[currentIdx].response;
      for (let i = 0; i <= text.length; i++) {
        if (cancelled) return;
        setResponseText(text.slice(0, i));
        await sleep(32);
      }

      if (cancelled) return;
      setShowPublish(true);
      setPhase("reading");

      const start = Date.now();
      const duration = 9000;
      while (true) {
        if (cancelled) return;
        const elapsed = Date.now() - start;
        const pct = Math.min(100, (elapsed / duration) * 100);
        setProgress(pct);
        if (pct >= 100) break;
        await sleep(50);
      }

      if (cancelled) return;
      setCurrentIdx(prev => (prev + 1) % DEMO_REVIEWS.length);
    }

    runCycle();
    return () => { cancelled = true; };
  }, [currentIdx]);

  function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  const currentDemo = DEMO_REVIEWS[currentIdx];

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e0e0e0", borderRadius: 16, overflow: "hidden", maxWidth: 420, width: "100%", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
      <div style={{ padding: "16px", borderBottom: "1px solid #e0e0e0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: currentDemo.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0, transition: "background 0.4s" }}>
            {currentDemo.initials}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#202124" }}>{currentDemo.name}</div>
            <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
              {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 12, color: s <= currentDemo.stars ? "#FBBC04" : "#dadce0" }}>★</span>)}
            </div>
          </div>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#80868b" }}>{currentDemo.time}</span>
        </div>
        <div style={{ fontSize: 13, color: "#3c4043", lineHeight: 1.6, fontStyle: "italic", padding: "10px 12px", background: "#f8f9fa", border: "1px solid #e0e0e0", borderRadius: 8 }}>
          "{currentDemo.text}"
        </div>
      </div>

      <div style={{ padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
        <div style={{ fontSize: 10, color: "#80868b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Tono</div>
        <div style={{ display: "flex", gap: 6 }}>
          {["cercano", "formal", "profesional"].map(t => (
            <div key={t} style={{ flex: 1, padding: "7px", borderRadius: 8, border: currentDemo.tone === t ? "2px solid #FBBC04" : "1px solid #dadce0", background: currentDemo.tone === t ? "rgba(251,188,4,0.1)" : "#f8f9fa", fontSize: 12, textAlign: "center", fontWeight: currentDemo.tone === t ? 700 : 400, color: currentDemo.tone === t ? "#b8860b" : "#5f6368", transition: "all 0.3s" }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: "#80868b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Tu respuesta</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", background: "#f8f9fa", border: "1px solid #dadce0", borderRadius: 7, fontSize: 11, color: isGenerating ? "#b8860b" : "#5f6368", fontWeight: 600 }}>
            {isGenerating ? (
              <><span style={{ display: "inline-block", animation: "spin 0.8s linear infinite", fontSize: 12 }}>◌</span> Generando...</>
            ) : (
              <><span>✦</span> Generar con IA</>
            )}
          </div>
        </div>

        <div style={{ minHeight: 88, padding: "12px 14px", background: "#f8f9fa", border: `1.5px solid ${phase === "typing" || phase === "reading" ? "#FBBC04" : "#dadce0"}`, borderRadius: 9, fontSize: 13, lineHeight: 1.6, transition: "border-color 0.3s" }}>
          {responseText ? (
            <span style={{ color: "#202124" }}>{responseText}{phase === "typing" && <span style={{ display: "inline-block", width: 2, height: 13, background: "#FBBC04", verticalAlign: "middle", marginLeft: 1, animation: "blink 0.7s infinite" }} />}</span>
          ) : (
            <span style={{ color: "#9aa0a6", fontStyle: "italic" }}>Escribe o genera una respuesta con IA...</span>
          )}
        </div>

        {showPublish && (
          <div style={{ marginTop: 10, padding: "10px", background: "#1a73e8", borderRadius: 8, fontSize: 13, fontWeight: 700, color: "#fff", textAlign: "center", animation: "fadeUp 0.3s ease" }}>
            Publicar en Google →
          </div>
        )}

        {phase === "reading" && (
          <div style={{ marginTop: 10, height: 3, background: "#e0e0e0", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "#1a73e8", borderRadius: 4, transition: "width 0.1s linear" }} />
          </div>
        )}
      </div>
    </div>
  );
}

function SignupModal({ onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#111100", border: "1px solid #3a3800", borderRadius: 20, padding: "40px 36px", maxWidth: 420, width: "100%", position: "relative", animation: "fadeUp 0.25s ease both" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 18, background: "none", border: "none", color: MUTED, fontSize: 24, cursor: "pointer", lineHeight: 1 }}>×</button>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, background: Y, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: BG, fontSize: 15, fontWeight: 700 }}>R</span>
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, color: TEXT }}>RevGo<span style={{ color: Y }}>.app</span></span>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: TEXT, letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 8 }}>Crea tu cuenta gratis</h2>
        <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.6, marginBottom: 22 }}>Empieza a responder tus reseñas de Google con IA en menos de 3 minutos.</p>
        <button style={{ width: "100%", padding: "14px 20px", background: "#fff", border: "1.5px solid #e0e0e0", borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 14, fontWeight: 600, color: "#1a1a1a", fontFamily: "'DM Sans', sans-serif", marginBottom: 14, transition: "box-shadow 0.2s" }}
          onMouseOver={e => { e.currentTarget.style.boxShadow = "0 0 0 2px " + Y; }}
          onMouseOut={e => { e.currentTarget.style.boxShadow = "none"; }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-4z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C40.9 35.2 44 30 44 24c0-1.3-.1-2.7-.4-4z" />
          </svg>
          Registrarme con Google
        </button>
        <p style={{ fontSize: 11, color: "#333320", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
          Al registrarte aceptas nuestros <span style={{ color: "#666650", cursor: "pointer" }}>Términos</span> y <span style={{ color: "#666650", cursor: "pointer" }}>Privacidad</span>
        </p>
      </div>
    </div>
  );
}

export default function Landing() {
  const { data: session } = useSession();
  const router = useRouter();
  const [tick, setTick] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showSignup ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showSignup]);

  const activeReview = tick % REVIEWS.length;
  const open = (plan = "starter") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedPlan", plan);
    }
    signIn("google", { callbackUrl: "/onboarding" });
  };

  const login = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Roboto:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .fade1 { animation: fadeUp 0.7s ease both; }
        .fade2 { animation: fadeUp 0.7s ease 0.15s both; }
        .hl { transition: transform 0.2s, border-color 0.2s; }
        .hl:hover { transform: translateY(-3px); border-color: #3a3800 !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #2a2800; border-radius: 4px; }
        .hgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .sgrid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: #2a2800; }
        .tgrid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .fgrid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
        .bgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .social-btn { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 9px; border: 1px solid #2a2800; color: #555540; text-decoration: none; transition: all 0.2s; }
        .social-btn:hover { border-color: #FFE600; color: #FFE600; }
        @media (max-width: 1000px) { .fgrid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 900px) {
          .hgrid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .sgrid { grid-template-columns: repeat(2,1fr) !important; }
          .tgrid { grid-template-columns: 1fr !important; }
          .bgrid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 600px) {
          .navlinks { display: none !important; }
          .fgrid { grid-template-columns: 1fr !important; }
          .ctarow { flex-direction: column !important; }
          .footer-inner { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
        }
      `}</style>

      {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}

      {/* ✅ BOTÓN VOLVER ARRIBA */}
      {scrolled && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ position: "fixed", bottom: 28, right: 28, zIndex: 200, width: 44, height: 44, borderRadius: "50%", background: Y, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.4)", transition: "transform 0.2s, opacity 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"} title="Volver arriba">
          <span style={{ color: BG, fontSize: 18, fontWeight: 700, lineHeight: 1 }}>↑</span>
        </button>
      )}

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(10,10,10,0.95)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? "1px solid #2a2800" : "1px solid transparent", transition: "all 0.3s", padding: "0 6%", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* ✅ LOGO CLICKEABLE → va a home */}
        <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
          <img src="/logo.png" alt="RevGo logo" style={{ width: 30, height: 30, borderRadius: 7, objectFit: "contain" }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: TEXT, letterSpacing: "-0.01em" }}>RevGo<span style={{ color: Y }}>.app</span></span>
        </div>
        <div className="navlinks" style={{ display: "flex", flex: 1, justifyContent: "flex-end", marginRight: 24 }}>
          <a href="#precios" style={{ fontSize: 13, color: MUTED, textDecoration: "none", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = TEXT} onMouseOut={e => e.target.style.color = MUTED}>Precios</a>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* ✅ NUEVO: Ocultar "Empezar gratis" si ya hay sesión */}
          {!session && (
            <button onClick={open} style={{ padding: "8px 18px", background: Y, border: "none", borderRadius: 7, color: BG, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "#fff176"} onMouseOut={e => e.currentTarget.style.background = Y}>
              Empezar gratis
            </button>
          )}
          {/* ✅ NUEVO: Mostrar "Ir al Dashboard" si hay sesión, "Iniciar sesión" si no */}
          {session ? (
            <button onClick={() => router.push("/dashboard")} style={{ padding: "8px 18px", background: Y, border: "none", borderRadius: 7, color: BG, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "#fff176"} onMouseOut={e => e.currentTarget.style.background = Y}>
              Ir al Dashboard →
            </button>
          ) : (
            <button onClick={login} style={{ padding: "8px 18px", background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 7, color: MUTED, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }} onMouseOver={e => { e.currentTarget.style.borderColor = Y; e.currentTarget.style.color = Y; }} onMouseOut={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}>
              Iniciar sesión
            </button>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 6% 80px" }}>
        <div className="hgrid" style={{ maxWidth: 1160, margin: "0 auto", width: "100%" }}>

          {/* Copy */}
          <div className="fade1">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1a1700", border: "1px solid #3a3400", borderRadius: 20, padding: "5px 14px", marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: Y, display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ color: Y, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Más clientes desde Google Maps · Sin esfuerzo · 7 días gratis</span>
            </div>

            <div style={{ marginBottom: 32 }}>
              <DemoAnimation />
            </div>

            <h1 style={{ fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.03em", marginBottom: 20, color: TEXT }}>
              Estás ocupado haciendo<br />crecer tu negocio.<br />
              <span style={{ color: Y }}>RevGo se encarga<br />de tus reseñas en Google.</span>
            </h1>
            <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.75, maxWidth: 460, marginBottom: 24 }}>
              Convierte cada reseña en una oportunidad de crecimiento con inteligencia artificial.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 26 }}>
              {["Responde automáticamente — 24 horas, 7 días", "Mejora tu reputación y sube en Google Maps", "Aumenta tus clientes sin esfuerzo extra"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#1a1700", border: "1px solid #FFE60050", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: Y, fontSize: 10 }}>✓</span>
                  </div>
                  <span style={{ fontSize: 14, color: LIGHT }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: Y, marginBottom: 28 }}>👉 Sin esfuerzo. Sin contratar a nadie.</p>
            <div className="ctarow" style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
              <button onClick={open} style={{ padding: "14px 30px", background: Y, border: "none", borderRadius: 10, color: BG, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "background 0.2s", whiteSpace: "nowrap" }} onMouseOver={e => e.currentTarget.style.background = "#fff176"} onMouseOut={e => e.currentTarget.style.background = Y}>
                Empieza Gratis →
              </button>
              <a href="#como-funciona" style={{ textDecoration: "none" }}>
                <button style={{ padding: "14px 30px", background: "transparent", border: "1px solid #2a2800", borderRadius: 10, color: MUTED, fontSize: 15, fontWeight: 500, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }} onMouseOver={e => { e.currentTarget.style.borderColor = Y; e.currentTarget.style.color = Y; }} onMouseOut={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}>
                  Mira cómo funciona ↓
                </button>
              </a>
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {["Se requiere tarjeta", "7 días gratis", "Cancela cuando quieras"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: Y, fontSize: 11 }}>✓</span>
                  <span style={{ color: MUTED, fontSize: 12 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Google Maps preview */}
          <div className="fade2" style={{ width: "100%" }}>
            <div style={{ background: "#202124", border: "1px solid #303134", borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
              <div style={{ background: "#292a2d", padding: "12px 16px", borderBottom: "1px solid #303134", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#4285F4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>H</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e8eaed", fontFamily: "'Roboto', sans-serif" }}>Hotel Miraflores Boutique</div>
                    <div style={{ fontSize: 10, color: "#9aa0a6", marginTop: 1 }}>4.6 ★★★★★ · 847 reseñas</div>
                  </div>
                </div>
                <div style={{ background: "#1a1700", border: "1px solid #2a2800", borderRadius: 8, padding: "3px 9px", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: Y, display: "inline-block", animation: "pulse 2s infinite" }} />
                  <span style={{ color: Y, fontSize: 9, fontWeight: 700 }}>RevGo ACTIVO</span>
                </div>
              </div>
              <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
                {REVIEWS.map((r, i) => (
                  <div key={i} style={{ background: i === activeReview ? "#292a2d" : "#26272b", border: i === activeReview ? "1px solid #404144" : "1px solid #303134", borderRadius: 12, padding: "13px 14px", transition: "all 0.4s" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: r.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0, fontFamily: "'Roboto', sans-serif" }}>{r.avatar}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#e8eaed", fontFamily: "'Roboto', sans-serif" }}>{r.name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2, flexWrap: "wrap" }}>
                          <StarRow count={r.stars} />
                          <span style={{ fontSize: 10, color: "#9aa0a6" }}>{r.time}</span>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: "#bdc1c6", lineHeight: 1.55, marginBottom: r.replied ? 10 : 0, fontFamily: "'Roboto', sans-serif" }}>{r.text}</p>
                    {r.replied && r.response && (
                      <div style={{ background: "#1e1f23", borderRadius: 8, padding: "10px 12px", borderLeft: "3px solid #FFE600" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                          <div style={{ width: 16, height: 16, background: Y, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 8, fontWeight: 700, color: BG }}>R</span>
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, color: Y }}>Respuesta del propietario</span>
                          <span style={{ fontSize: 10, color: "#9aa0a6" }}>· hace un momento</span>
                        </div>
                        <p style={{ fontSize: 11, color: "#bdc1c6", lineHeight: 1.55 }}>{r.response}</p>
                      </div>
                    )}
                    {!r.replied && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, padding: "6px 10px", background: "#1a1700", borderRadius: 6, width: "fit-content" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: Y, animation: "pulse 1s infinite" }} />
                        <span style={{ fontSize: 10, color: Y, fontWeight: 500 }}>RevGo generando respuesta...</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ background: "#1e1f23", padding: "10px 14px", borderTop: "1px solid #303134", display: "flex", justifyContent: "space-around" }}>
                {[["100%", "respondidas"], ["4.8★", "rating actual"], ["↑0.5", "esta semana"]].map(([v, l]) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: Y }}>{v}</div>
                    <div style={{ fontSize: 9, color: "#9aa0a6", marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGOS BAR */}
      <div style={{ borderTop: "1px solid #2a2800", borderBottom: "1px solid #2a2800", padding: "18px 6%" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 11, color: "#444430", letterSpacing: "0.12em", textTransform: "uppercase" }}>Diseñado para</span>
          {["🏨 Hoteles", "🍽️ Restaurantes", "🦷 Clínicas", "💆 Spas", "🏠 Inmobiliarias"].map(t => (
            <span key={t} style={{ fontSize: 13, color: MUTED }}>{t}</span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section style={{ padding: "80px 6%" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="sgrid">
            {[["63%","negocios nunca responden sus reseñas"],["35%","más ingresos al responder el 100%"],["10+","reseñas por día en hoteles premium"],["3 min","para conectar tu Google Business"]].map(([v,l],i) => (
              <div key={i} style={{ background: BG, padding: "36px 28px", textAlign: "center" }}>
                <div style={{ fontSize: 44, fontWeight: 700, color: Y, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 10 }}>{v}</div>
                <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EL PROBLEMA */}
      <section style={{ padding: "70px 6% 80px", background: SURF }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: 11, color: Y, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>El problema</span>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 42px)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.03em", margin: "16px 0 16px", color: TEXT }}>
            Cada día, tus clientes dejan reseñas en Google.
          </h2>
          <p style={{ fontSize: 16, color: LIGHT, lineHeight: 1.85, marginBottom: 36 }}>
            Algunas son buenas. Otras no tanto. <strong style={{ color: TEXT }}>Todas necesitan una respuesta.</strong><br />
            Cada reseña sin responder le cuesta dinero a tu negocio.
          </p>
          <p style={{ fontSize: 15, fontWeight: 600, color: LIGHT, marginBottom: 20 }}>Pero en la realidad:</p>
          <div className="tgrid" style={{ marginBottom: 32 }}>
            {[
              ["⏰", "No tienes tiempo", "El día a día de tu negocio te consume. Responder reseñas se queda siempre para después."],
              ["😣", "No sabes qué responder", "Especialmente las negativas. Una mala respuesta puede empeorar las cosas."],
              ["📉", "Te cuesta clientes", "El silencio habla por ti. Y lo que dice no es bueno para tu reputación."],
            ].map(([icon, title, desc], i) => (
              <div key={i} className="hl" style={{ background: SURF2, border: "1px solid #2a2800", borderRadius: 12, padding: "24px 20px", textAlign: "left" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#1a1700", border: "1px solid #3a3400", borderRadius: 14, padding: "20px 24px" }}>
            <p style={{ fontSize: 15, color: LIGHT, lineHeight: 1.8 }}>
              👉 <strong style={{ color: Y }}>Los clientes leen tus respuestas antes de decidir comprar.</strong><br />
              No responder no es una opción. Es perder ventas en silencio.
            </p>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section style={{ padding: "70px 6% 80px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div className="bgrid">
            <div>
              <span style={{ fontSize: 11, color: Y, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>Beneficios</span>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.03em", margin: "14px 0 24px", color: TEXT }}>
                Los negocios que responden <span style={{ color: Y }}>todas</span> sus reseñas:
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 32 }}>
                {[
                  ["⭐", "Generan más confianza", "Los clientes potenciales ven que te importa su opinión."],
                  ["📈", "Mejoran su posicionamiento en Google", "Google premia a los negocios activos en Maps."],
                  ["💰", "Aumentan sus ventas", "Más confianza = más conversiones = más clientes."],
                ].map(([icon, title, desc], i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, background: "#1a1700", border: "1px solid #3a3400", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 3 }}>{title}</div>
                      <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#1a1700", border: "1px solid #3a3400", borderRadius: 14, padding: "22px 24px", textAlign: "center" }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: Y, marginBottom: 8, letterSpacing: "-0.02em" }}>💡 Hasta un 35% más de ingresos.</p>
                <p style={{ fontSize: 14, color: LIGHT, lineHeight: 1.6 }}>👉 RevGo hace posible ese 100% sin esfuerzo.</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <AnimatedBar pct={97} color={Y} label="de los clientes leen las respuestas" delay={0} />
              <AnimatedBar pct={88} color="#4ade80" label="prefieren negocios que responden" delay={200} />
              <AnimatedBar pct={79} color="#60a5fa" label="regresan si solucionas su problema" delay={400} />
              <p style={{ fontSize: 11, color: "#333320", textAlign: "right", marginTop: 4 }}>Fuente: Harvard Business School · ReviewTrackers</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" style={{ padding: "70px 6% 80px", background: SURF }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 11, color: Y, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>Cómo funciona</span>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "14px 0 0", color: TEXT }}>Listo en 3 minutos</h2>
          </div>
          <div className="tgrid">
            {STEPS.map((s, i) => (
              <div key={i} className="hl" style={{ background: SURF2, border: "1px solid #2a2800", borderRadius: 14, padding: "32px 28px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 18, right: 20, fontSize: 56, fontWeight: 700, color: "#1a1800", lineHeight: 1, userSelect: "none" }}>{s.n}</div>
                <div style={{ width: 36, height: 36, background: "#1a1700", border: "1px solid #2a2800", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, color: Y, fontSize: 16 }}>{s.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: TEXT, marginBottom: 10, letterSpacing: "-0.02em", lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "70px 6% 80px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 11, color: Y, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>Features</span>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "14px 0 0", color: TEXT }}>Todo lo que necesita tu negocio</h2>
          </div>
          <div className="fgrid">
            {FEATURES.map((f, i) => (
              <div key={i} className="hl" style={{ background: SURF2, border: "1px solid #2a2800", borderRadius: 14, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 32 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, letterSpacing: "-0.02em", lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65 }}>{f.desc}</p>
                {f.extra && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4, paddingTop: 12, borderTop: "1px solid #2a2800" }}>
                    {f.extra.map((item, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <span style={{ color: Y, fontSize: 11, marginTop: 2, flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: 12, color: LIGHT, lineHeight: 1.4 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="precios" style={{ padding: "70px 6% 80px", background: SURF }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 11, color: Y, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>Precios</span>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "14px 0 10px", color: TEXT }}>Simple y transparente</h2>
            <p style={{ fontSize: 14, color: MUTED }}>7 días gratis en el plan Starter · Cancela cuando quieras</p>
          </div>
          <div className="tgrid" style={{ alignItems: "start" }}>
            {PLANS.map((p, i) => (
              <div key={i} className="hl" style={{ background: p.highlight ? "#131200" : SURF2, border: p.highlight ? "1px solid #FFE60055" : "1px solid #2a2800", borderRadius: 16, padding: "32px 26px", position: "relative" }}>
                {p.highlight && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: Y, color: BG, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>{p.badge}</div>
                )}
                <div style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: p.highlight ? Y : MUTED, fontWeight: p.highlight ? 600 : 400 }}>{p.tagline}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{p.desc}</div>
                </div>
                <div style={{ margin: "16px 0" }}>
                  <span style={{ fontSize: 46, fontWeight: 700, color: p.highlight ? Y : TEXT, letterSpacing: "-0.04em", lineHeight: 1 }}>S/{p.price}</span>
                  <span style={{ fontSize: 13, color: MUTED }}>/mes</span>
                </div>
                <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                  {p.features.map((feat, j) => (
                    <div key={j} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                      <span style={{ color: Y, fontSize: 11, flexShrink: 0, marginTop: 2 }}>✓</span>
                      <span style={{ fontSize: 13, color: LIGHT, lineHeight: 1.4 }}>{feat}</span>
                    </div>
                  ))}
                </div>
                <button onClick={open}
                  style={{ width: "100%", padding: "12px", background: p.highlight ? Y : "transparent", border: p.highlight ? "none" : "1px solid #2a2800", borderRadius: 9, color: p.highlight ? BG : MUTED, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" }}
                  onMouseOver={e => { if (p.highlight) { e.currentTarget.style.background = "#fff176"; } else { e.currentTarget.style.borderColor = Y; e.currentTarget.style.color = Y; } }}
                  onMouseOut={e => { if (p.highlight) { e.currentTarget.style.background = Y; } else { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; } }}
                >
                  {i === 0 ? "Empezar gratis 7 días →" : i === 3 ? "Hablar con ventas →" : `Suscribirme a ${p.name} →`}
                </button>
                {i === 0 && (
                  <p style={{ fontSize: 11, color: MUTED, textAlign: "center", marginTop: 8 }}>
                    Se requiere tarjeta · Cancela antes del día 7 sin costo
                  </p>
                )}
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", color: "#444430", fontSize: 13, marginTop: 24 }}>
            ¿Más de 10 locales?{" "}<span style={{ color: Y, cursor: "pointer" }}>Contáctanos para un plan a medida →</span>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "70px 6% 80px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 11, color: Y, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>FAQ</span>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "14px 0 0", color: TEXT }}>Preguntas frecuentes</h2>
          </div>
          <div style={{ borderTop: "1px solid #2a2800" }}>
            {FAQS.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "90px 6%", textAlign: "center", background: SURF }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(30px, 4vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 18, color: TEXT }}>
            Tu reputación<br /><span style={{ color: Y }}>empieza hoy</span>
          </h2>
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.7, marginBottom: 32 }}>
            Únete a los negocios en Lima que ya responden el 100% de sus reseñas automáticamente.
          </p>
          <button onClick={open} style={{ padding: "15px 44px", background: Y, border: "none", borderRadius: 10, color: BG, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "#fff176"} onMouseOut={e => e.currentTarget.style.background = Y}>
            Empieza gratis 7 días →
          </button>
          <p style={{ color: "#333320", fontSize: 12, marginTop: 14 }}>Sin compromisos · Se requiere tarjeta · Cancela antes del día 7 sin costo</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #2a2800", padding: "32px 6%" }}>
        <div className="footer-inner" style={{ maxWidth: 1160, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, background: Y, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: BG, fontSize: 12, fontWeight: 700 }}>R</span>
            </div>
            <span style={{ fontSize: 14, color: "#555540" }}>RevGo.app</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#333320", marginRight: 4 }}>Síguenos</span>
            {SOCIAL.map(s => (
              <a key={s.name} href={s.href} title={s.name} className="social-btn" target="_blank" rel="noopener noreferrer">{s.svg}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            {["Privacidad", "Términos", "Contacto"].map(l => (
              <span key={l} style={{ color: "#2a2810", fontSize: 12, cursor: "pointer", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = MUTED} onMouseOut={e => e.target.style.color = "#2a2810"}>{l}</span>
            ))}
            <span style={{ color: "#1a1808", fontSize: 12 }}>© 2026 RevGo · Lima, Perú</span>
          </div>
        </div>
      </footer>
    </div>
  );
}