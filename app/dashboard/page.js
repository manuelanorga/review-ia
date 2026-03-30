"use client";
import { QRCodeCanvas } from "qrcode.react";
import React, { useState, useEffect } from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const REVIEWS = [
  { id: 1, name: "María González", avatar: "MG", avatarColor: "#4285F4", stars: 5, time: "Hace 2h", text: "Increíble experiencia, el personal súper atento y la habitación impecable. Definitivamente regreso.", status: "pending", source: "Google" },
  { id: 2, name: "Carlos Mendoza", avatar: "CM", avatarColor: "#EA4335", stars: 2, time: "Hace 5h", text: "El servicio fue lento y la comida llegó fría. Esperaba más por el precio que pagué.", status: "pending", source: "Google" },
  { id: 3, name: "Lucía Fernández", avatar: "LF", avatarColor: "#34A853", stars: 4, time: "Hace 1d", text: "Muy buen lugar, ambiente agradable. Solo le faltó un poco más de rapidez en el servicio.", status: "responded", response: "¡Hola Lucía! Muchas gracias por tu visita. ¡Te esperamos pronto!", source: "Google" },
  { id: 4, name: "Rodrigo Vargas", avatar: "RV", avatarColor: "#FBBC04", stars: 5, time: "Hace 2d", text: "El mejor hotel de Lima. Personal increíble y las instalaciones impecables. 100% recomendado.", status: "responded", response: "¡Gracias Rodrigo! Nos alegra mucho que hayas disfrutado tu estadía.", source: "Google" },
  { id: 5, name: "Ana Torres", avatar: "AT", avatarColor: "#9C27B0", stars: 1, time: "Hace 3d", text: "Pésima atención. Me prometieron una habitación y me dieron otra completamente diferente.", status: "pending", source: "Google" },
  { id: 6, name: "Martín Quispe", avatar: "MQ", avatarColor: "#00BCD4", stars: 3, time: "Hace 4d", text: "El lugar está bien pero el precio me pareció un poco elevado para lo que ofrecen.", status: "responded", response: "Hola Martín, gracias por tu comentario. ¡Esperamos verte pronto!", source: "Google" },
];

const STATS = [
  { label: "Reseñas este mes", value: "47", change: "+12", up: true, icon: "⭐" },
  { label: "Rating promedio", value: "4.3", change: "+0.2", up: true, icon: "📈" },
  { label: "Tasa de respuesta", value: "68%", change: "+34%", up: true, icon: "💬" },
  { label: "Sin responder", value: "3", change: "-8", up: true, icon: "⏳" },
];

const TONE_PREVIEWS = {
  cercano: [
    { stars: 5, name: "María G.", avatarColor: "#4285F4", text: "¡Increíble lugar! Todo perfecto, el personal muy atento.", response: "¡Gracias María, nos alegra muchísimo! 😊 Tu visita nos llena de energía. ¡Te esperamos muy pronto con los brazos abiertos!" },
    { stars: 2, name: "Carlos M.", avatarColor: "#EA4335", text: "El servicio fue lento y la comida llegó fría.", response: "Hola Carlos, qué pena que tu experiencia no fue la mejor 😔 Eso no es lo que queremos. ¡Escríbenos y lo solucionamos juntos!" },
    { stars: 4, name: "Lucía F.", avatarColor: "#34A853", text: "Muy buena experiencia, aunque algo lento.", response: "¡Hola Lucía! Gracias por tu visita y tu comentario honesto 🙌 Tomamos nota y ya estamos mejorando. ¡Vuelve pronto!" },
  ],
  formal: [
    { stars: 5, name: "María G.", avatarColor: "#4285F4", text: "¡Increíble lugar! Todo perfecto, el personal muy atento.", response: "Estimada María, le agradecemos sinceramente sus amables palabras. Es un honor contar con clientes como usted. Esperamos verla nuevamente." },
    { stars: 2, name: "Carlos M.", avatarColor: "#EA4335", text: "El servicio fue lento y la comida llegó fría.", response: "Estimado Carlos, lamentamos que su experiencia no haya cumplido nuestros estándares. Le invitamos a contactarnos para atender su caso personalmente." },
    { stars: 4, name: "Lucía F.", avatarColor: "#34A853", text: "Muy buena experiencia, aunque algo lento.", response: "Estimada Lucía, agradecemos su valoración. Tomamos nota de su observación sobre los tiempos y trabajaremos en mejorarlo de inmediato." },
  ],
  profesional: [
    { stars: 5, name: "María G.", avatarColor: "#4285F4", text: "¡Increíble lugar! Todo perfecto, el personal muy atento.", response: "Gracias por su reseña, María. Nos alegra que su experiencia haya superado las expectativas. Su satisfacción es nuestra mejor métrica. ¡Hasta pronto!" },
    { stars: 2, name: "Carlos M.", avatarColor: "#EA4335", text: "El servicio fue lento y la comida llegó fría.", response: "Gracias por su feedback, Carlos. Lamentamos que el servicio no estuvo a la altura. Hemos registrado su comentario para mejorar nuestros procesos." },
    { stars: 4, name: "Lucía F.", avatarColor: "#34A853", text: "Muy buena experiencia, aunque algo lento.", response: "Gracias por su valoración, Lucía. Apreciamos su observación sobre los tiempos. Estamos implementando mejoras para optimizar la experiencia." },
  ],
};

const BUSINESSES = [
  { id: 1, name: "Hotel Miraflores", plan: "Pro", active: true, locked: false },
  { id: 2, name: "Restaurante El Mar", plan: "Pro", active: false, locked: false },
  { id: 3, name: "Spa Boutique Lima", plan: "Free", active: false, locked: true },
  { id: 4, name: "Clínica San Isidro", plan: "Free", active: false, locked: true },
];

const TOUR_STEPS = [
  { icon: "👋", title: "Bienvenido a RevGo.app", desc: "En los próximos pasos te mostramos todo lo que puedes hacer desde tu panel. Es rápido, te lo prometemos.", highlight: null },
  { icon: "▦", title: "Dashboard — tu vista general", desc: "Aquí verás un resumen de todo: reseñas recientes, el estado de tu autopiloto, alertas urgentes y tus métricas más importantes de un vistazo.", highlight: "dashboard" },
  { icon: "★", title: "Reseñas — gestiona cada opinión", desc: "Aquí aparecen todas las reseñas de Google de tu negocio. Puedes filtrarlas, generar respuestas con IA en segundos y publicarlas directamente en Google.", highlight: "reviews" },
  { icon: "⚡", title: "Autopiloto — responde sin esfuerzo", desc: "Activa el autopiloto y RevGo responderá automáticamente cada nueva reseña. Tú eliges el tono: cercano, formal o profesional.", highlight: "autopilot" },
  { icon: "◎", title: "Analytics — conoce tu reputación", desc: "Mira la evolución de tu rating, qué días recibes más reseñas, qué palabras mencionan más tus clientes y cuánto ha mejorado tu tasa de respuesta.", highlight: "analytics" },
  { icon: "🚀", title: "¡Listo para empezar!", desc: "Ya conoces todo lo que RevGo tiene para ti. Tu primera reseña está esperando una respuesta. ¡Empieza ahora!", highlight: null },
];

const CHECKOUT_URLS = {
  starter: "https://revgo.lemonsqueezy.com/checkout/buy/ea9dbdb9-ac54-43b8-a935-5001f6dd101c?embed=1",
  growth:  "https://revgo.lemonsqueezy.com/checkout/buy/0f138e64-5cd0-4daa-a8df-268cbea631af?embed=1",
  pro:     "https://revgo.lemonsqueezy.com/checkout/buy/5776260f-8236-4855-9fe5-c48389e39e3c?embed=1",
  agencia: "https://revgo.lemonsqueezy.com/checkout/buy/9b3d706b-84e5-4998-b58e-09aff23929e2?embed=1",
};

const PLAN_PRICES = { starter: "S/39", growth: "S/79", pro: "S/149", agencia: "S/349" };

function Stars({ count, size = 12 }) {
  return (
    <span style={{ fontSize: size, letterSpacing: -1 }}>
      {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= count ? "#FBBC04" : "#cbd5e1" }}>★</span>)}
    </span>
  );
}

function UpgradeOverlay({ dark, d, children, blur = false }) {
  if (!blur) return children;
  return (
    <div style={{ position: "relative" }}>
      <div style={{ filter: "blur(4px)", pointerEvents: "none", userSelect: "none", opacity: 0.6 }}>{children}</div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: dark ? "rgba(15,15,15,0.7)" : "rgba(248,250,252,0.7)", borderRadius: 14, backdropFilter: "blur(2px)" }}>
        <div style={{ fontSize: 20, marginBottom: 8 }}>🔒</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: d.text, marginBottom: 4, textAlign: "center" }}>Función Premium</div>
        <div style={{ fontSize: 12, color: d.muted, marginBottom: 12, textAlign: "center", maxWidth: 180 }}>Actualiza tu plan para desbloquear</div>
        <button style={{ padding: "8px 18px", background: d.accent, border: "none", borderRadius: 8, color: d.accentFg, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Ver planes →</button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [dark, setDark] = useState(true);
  const [reviews, setReviews] = useState(REVIEWS);
  const [selected, setSelected] = useState(null);
  const [editText, setEditText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [autopilot, setAutopilot] = useState(true);
  const [tone, setTone] = useState("formal");
  const [activeTab, setActiveTab] = useState("all");
  const [toast, setToast] = useState(null);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [activeBusiness, setActiveBusiness] = useState(1);
  const [showBusinessMenu, setShowBusinessMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [accountSection, setAccountSection] = useState(null);
  const [showTour, setShowTour] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("tourCompleted") !== "true";
  });
  const [tourStep, setTourStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [plan, setPlan] = useState("starter");
  const [userName, setUserName] = useState("Usuario");
  const [userEmail, setUserEmail] = useState("");
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [reviewSlug, setReviewSlug] = useState("");
  const [qrTab, setQrTab] = useState("qr");

  async function handleConnectBusiness() {
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (status === "loading") return;
      if (!session?.user?.email) { setLoadingPlan(false); return; }
      try {
        const { data: userData } = await supabase
          .from("users").select("plan, full_name, email, id").eq("email", session.user.email).single();
        if (userData) {
          setPlan(userData.plan || "starter");
          setUserName(userData.full_name || session.user.name || "Usuario");
          setUserEmail(userData.email || session.user.email);
          const { data: firstBiz } = await supabase
            .from("businesses")
            .select("id, review_slug")
            .eq("user_id", userData.id)
            .limit(1)
            .maybeSingle();
          if (firstBiz?.review_slug) setReviewSlug(firstBiz.review_slug);
          if (firstBiz?.id) {
            const { data: complaintsData } = await supabase
              .from("complaints")
              .select("*")
              .eq("business_id", firstBiz.id)
              .order("created_at", { ascending: false });
            if (complaintsData) setComplaints(complaintsData);
          }
        } else {
          router.push("/onboarding");
        }
      } catch (err) { console.error("Error cargando plan:", err); }
      finally { setLoadingPlan(false); }
    };
    fetchUserPlan();
  }, [session, status]);

  const isPro = plan !== "starter";
  const canDownloadPDF = plan !== "starter";
  const availableTones = plan === "starter" ? ["formal"] : ["cercano", "formal", "profesional"];

  const openCheckout = (planKey) => {
    if (window.LemonSqueezy) { window.LemonSqueezy.Url.Open(CHECKOUT_URLS[planKey]); }
    else { window.open(CHECKOUT_URLS[planKey], "_blank"); }
  };

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const navRefs = { dashboard: React.useRef(null), reviews: React.useRef(null), autopilot: React.useRef(null), analytics: React.useRef(null) };
  const closeTour = () => { setShowTour(false); setSpotlightRect(null); localStorage.setItem("tourCompleted", "true"); };
  const currentStep = TOUR_STEPS[tourStep];

  React.useEffect(() => {
    if (!showTour || isMobile) { setSpotlightRect(null); return; }
    const highlight = TOUR_STEPS[tourStep].highlight;
    if (highlight && navRefs[highlight]?.current) {
      const rect = navRefs[highlight].current.getBoundingClientRect();
      setSpotlightRect({ x: rect.x, y: rect.y, w: rect.width, h: rect.height });
    } else { setSpotlightRect(null); }
  }, [tourStep, showTour, isMobile]);

  const nextStep = () => { if (tourStep < TOUR_STEPS.length - 1) { setTourStep(tourStep + 1); } else { closeTour(); } };
  const prevStep = () => { if (tourStep > 0) setTourStep(tourStep - 1); };

  const d = dark ? {
    bg: "#0f0f0f", sidebar: "#141414", card: "#1a1a1a", border: "#262626",
    text: "#f5f5f5", muted: "#737373", subtle: "#404040",
    accent: "#FFE600", accentFg: "#000", surface: "#1f1f1f", hover: "#242424",
  } : {
    bg: "#f8fafc", sidebar: "#ffffff", card: "#ffffff", border: "#e2e8f0",
    text: "#0f172a", muted: "#64748b", subtle: "#cbd5e1",
    accent: "#1d4ed8", accentFg: "#ffffff", surface: "#f1f5f9", hover: "#f8fafc",
  };

  // ── Modo demo: activo cuando no hay negocio conectado ──
  const isDemo = !reviewSlug;

  const currentBusiness = BUSINESSES.find(b => b.id === activeBusiness);
  const pendingCount = reviews.filter(r => r.status === "pending").length;
  const respondedToday = reviews.filter(r => r.status === "responded").length;
  const urgentReview = reviews.find(r => r.status === "pending" && r.stars === 1);
  const filtered = reviews.filter(r => { if (activeTab === "pending") return r.status === "pending"; if (activeTab === "responded") return r.status === "responded"; return true; });
  const showToast = (msg) => { setToast({ msg }); setTimeout(() => setToast(null), 3000); };

  const generateAI = async (review) => {
    setGenerating(true); setEditText("");
    try {
      const res = await fetch("/api/generate-response", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reviewText: review.text, reviewerName: review.name, stars: review.stars, tone, plan }) });
      const data = await res.json();
      setEditText(data.response || "Error generando respuesta");
    } catch (error) { setEditText("Error conectando con la IA"); }
    finally { setGenerating(false); }
  };

  const publish = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "responded", response: editText } : r));
    setSelected(null); setEditText(""); showToast("Respuesta publicada en Google ✓");
  };

  const selectedReview = reviews.find(r => r.id === selected);
  const TONES = [{ key: "cercano", label: "😊 Cercano" }, { key: "formal", label: "🤝 Formal" }, { key: "profesional", label: "💼 Profesional" }];
  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "reviews", label: "Reseñas", icon: "★", badge: pendingCount },
    { id: "autopilot", label: "Autopiloto IA", icon: "⚡" },
    { id: "analytics", label: "Estadísticas", icon: "◎", pro: true },
    { id: "qr", label: "Captar reseñas", icon: "📱", pro: true },
  ];

  if (loadingPlan || status === "loading") {
    return (
      <div style={{ display: "flex", height: "100vh", background: "#0f0f0f", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}.sk{background:linear-gradient(90deg,#1a1a1a 25%,#242424 50%,#1a1a1a 75%);background-size:1200px 100%;animation:shimmer 1.5s infinite;border-radius:6px}`}</style>
        <div style={{ width: 220, background: "#141414", borderRight: "1px solid #262626", padding: "18px 16px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid #262626" }}>
            <div className="sk" style={{ width: 30, height: 30, borderRadius: 7 }} />
            <div className="sk" style={{ width: 80, height: 16 }} />
          </div>
          <div className="sk" style={{ height: 52, borderRadius: 8, marginBottom: 16 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[100, 80, 90, 70, 75].map((w, i) => (
              <div key={i} className="sk" style={{ height: 34, borderRadius: 7, width: `${w}%` }} />
            ))}
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ height: 56, background: "#141414", borderBottom: "1px solid #262626", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
            <div>
              <div className="sk" style={{ width: 100, height: 15, marginBottom: 6 }} />
              <div className="sk" style={{ width: 160, height: 11 }} />
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div className="sk" style={{ width: 110, height: 28, borderRadius: 7 }} />
              <div className="sk" style={{ width: 36, height: 36, borderRadius: 8 }} />
              <div className="sk" style={{ width: 32, height: 32, borderRadius: "50%" }} />
            </div>
          </div>
          <div style={{ flex: 1, padding: "20px 24px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ background: "#1a1a1a", border: "1px solid #262626", borderRadius: 12, padding: "16px 18px" }}>
                  <div className="sk" style={{ width: 28, height: 28, borderRadius: "50%", marginBottom: 10 }} />
                  <div className="sk" style={{ width: "70%", height: 26, marginBottom: 6 }} />
                  <div className="sk" style={{ width: "90%", height: 12 }} />
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "#1a1a1a", border: "1px solid #262626", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #262626" }}>
                  <div className="sk" style={{ width: 120, height: 14 }} />
                </div>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{ padding: "11px 16px", borderBottom: "1px solid #262626", display: "flex", gap: 10, alignItems: "center" }}>
                    <div className="sk" style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="sk" style={{ width: "60%", height: 12, marginBottom: 6 }} />
                      <div className="sk" style={{ width: "90%", height: 11 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: "#1a1a1a", border: "1px solid #262626", borderRadius: 14, padding: 16 }}>
                  <div className="sk" style={{ width: 130, height: 14, marginBottom: 14 }} />
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <div className="sk" style={{ width: "40%", height: 12 }} />
                      <div className="sk" style={{ width: "25%", height: 12 }} />
                    </div>
                  ))}
                </div>
                <div style={{ background: "#1a1a1a", border: "1px solid #262626", borderRadius: 14, padding: 16, flex: 1 }}>
                  <div className="sk" style={{ width: 140, height: 14, marginBottom: 14 }} />
                  {[0,1,2].map(i => (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div className="sk" style={{ width: "100%", height: 4, borderRadius: 4 }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: d.bg, fontFamily: "'DM Sans', sans-serif", overflow: "hidden", color: d.text }} onClick={() => { showBusinessMenu && setShowBusinessMenu(false); showUserMenu && setShowUserMenu(false); }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
        @keyframes tourPulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(1.04); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes connectModalIn { from { opacity:0; transform:scale(0.93) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #404040; border-radius: 4px; }
        textarea:focus { outline: none; }
      `}</style>

      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000, background: dark ? "#1a1a1a" : "#0f172a", color: "#f5f5f5", padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500, border: `1px solid ${dark ? "#262626" : "#1e3a5f"}`, animation: "slideIn 0.3s ease", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
          <span style={{ color: "#4ade80" }}>✓</span> {toast.msg}
        </div>
      )}

      {showTour && (() => {
        const PAD = 10;
        const isCentered = isMobile || !spotlightRect;
        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 2000, pointerEvents: "none" }}>
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "all" }} onClick={closeTour}>
              <defs><mask id="smask"><rect width="100%" height="100%" fill="white" />{!isMobile && spotlightRect && <rect x={spotlightRect.x - PAD} y={spotlightRect.y - PAD} width={spotlightRect.w + PAD * 2} height={spotlightRect.h + PAD * 2} rx="10" fill="black" />}</mask></defs>
              <rect width="100%" height="100%" fill="rgba(0,0,0,0.78)" mask="url(#smask)" />
            </svg>
            {!isMobile && spotlightRect && <div style={{ position: "absolute", pointerEvents: "none", left: spotlightRect.x - PAD - 4, top: spotlightRect.y - PAD - 4, width: spotlightRect.w + (PAD + 4) * 2, height: spotlightRect.h + (PAD + 4) * 2, borderRadius: 14, border: `2px solid ${d.accent}`, animation: "tourPulse 1.5s ease-in-out infinite" }} />}
            {!isMobile && spotlightRect && <div style={{ position: "absolute", pointerEvents: "none", left: spotlightRect.x + spotlightRect.w + 14, top: spotlightRect.y + spotlightRect.h / 2 - 8, width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderRight: `10px solid ${dark ? "#1a1a1a" : "#ffffff"}` }} />}
            <div style={{ position: "fixed", pointerEvents: "all", ...(isMobile ? { left: 16, right: 16, bottom: 20, top: "auto", width: "auto" } : isCentered ? { left: "calc(50% - 150px)", top: "38%", transform: "translateY(-50%)", width: 300 } : { left: spotlightRect.x + spotlightRect.w + 20, top: Math.max(12, spotlightRect.y + spotlightRect.h / 2 - 140), width: 300 }), background: dark ? "#1a1a1a" : "#ffffff", border: `1px solid ${d.border}`, borderRadius: 16, padding: "22px 22px 18px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", animation: "fadeIn 0.2s ease both", zIndex: 2001 }}>
              <button onClick={closeTour} style={{ position: "absolute", top: 12, right: 14, background: "none", border: "none", color: d.muted, fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
              <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>{TOUR_STEPS.map((_, i) => <div key={i} onClick={() => setTourStep(i)} style={{ height: 3, flex: i === tourStep ? 2 : 1, borderRadius: 4, background: i === tourStep ? d.accent : (i < tourStep ? (dark ? "#444" : "#cbd5e1") : d.border), transition: "all 0.3s ease", cursor: "pointer" }} />)}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: dark ? "#262626" : "#f1f5f9", border: `1px solid ${d.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{currentStep.icon}</div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: d.text, lineHeight: 1.25 }}>{currentStep.title}</h2>
              </div>
              <p style={{ fontSize: 13, color: d.muted, lineHeight: 1.7, marginBottom: 18 }}>{currentStep.desc}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: d.muted }}>{tourStep + 1} / {TOUR_STEPS.length}</span>
                <div style={{ display: "flex", gap: 7 }}>
                  {tourStep > 0 && <button onClick={prevStep} style={{ padding: "7px 14px", background: "transparent", border: `1px solid ${d.border}`, borderRadius: 8, color: d.muted, fontSize: 12, fontWeight: 500, cursor: "pointer" }} onMouseOver={e => { e.currentTarget.style.borderColor = d.accent; e.currentTarget.style.color = d.accent; }} onMouseOut={e => { e.currentTarget.style.borderColor = d.border; e.currentTarget.style.color = d.muted; }}>← Atrás</button>}
                  <button onClick={nextStep} style={{ padding: "7px 16px", background: d.accent, border: "none", borderRadius: 8, color: d.accentFg, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{tourStep === TOUR_STEPS.length - 1 ? "¡Empezar! 🚀" : "Siguiente →"}</button>
                </div>
              </div>
              {tourStep < TOUR_STEPS.length - 1 && <div style={{ textAlign: "center", marginTop: 12 }}><button onClick={closeTour} style={{ background: "none", border: "none", color: d.muted, fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>Omitir tour</button></div>}
            </div>
          </div>
        );
      })()}

      {/* BOTTOM NAV MÓVIL */}
      {isMobile && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, background: d.sidebar, borderTop: `1px solid ${d.border}`, display: "flex", alignItems: "center", height: 60, paddingBottom: "env(safe-area-inset-bottom)" }}>
          {[
            { id: "dashboard", label: "Inicio", icon: "▦" },
            { id: "reviews",   label: "Reseñas", icon: "★", badge: pendingCount },
            { id: "autopilot", label: "IA", icon: "⚡" },
            { id: "analytics", label: "Datos", icon: "◎" },
            { id: "qr",        label: "Crece", icon: "📱" },
          ].map(item => {
            const isActive = activeNav === item.id && !accountSection;
            return (
              <button key={item.id} onClick={() => { setActiveNav(item.id); setAccountSection(null); }} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, height: "100%", background: "none", border: "none", cursor: "pointer", position: "relative", color: isActive ? d.accent : d.muted }}>
                <div style={{ position: "relative" }}>
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
                  {item.badge > 0 && <span style={{ position: "absolute", top: -4, right: -8, width: 14, height: 14, borderRadius: "50%", background: d.accent, color: d.accentFg, fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.badge}</span>}
                </div>
                <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 400, letterSpacing: "0.01em" }}>{item.label}</span>
                {isActive && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 24, height: 2, borderRadius: "0 0 2px 2px", background: d.accent }} />}
              </button>
            );
          })}
        </nav>
      )}

      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }} />
      )}

      <aside style={{ width: 220, background: d.sidebar, borderRight: `1px solid ${d.border}`, display: "flex", flexDirection: "column", flexShrink: 0, ...(isMobile ? { position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 301, transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.25s ease", boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,0.4)" : "none" } : {}) }}>

        {/* Logo */}
        <div style={{ padding: "18px 16px 14px", borderBottom: `1px solid ${d.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 30, height: 30, background: d.accent, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: d.accentFg, fontSize: 13, fontWeight: 700 }}>R</span>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: d.text }}>RevGo<span style={{ color: d.accent }}>.app</span></span>
          </div>
        </div>

        {/* ── Selector de negocio / Botón conectar ── */}
        <div style={{ padding: "10px 12px 6px", position: "relative" }}>
          {reviewSlug ? (
            <>
              <div
                onClick={e => { e.stopPropagation(); setShowBusinessMenu(!showBusinessMenu); }}
                style={{ background: d.surface, borderRadius: 8, padding: "10px 12px", cursor: "pointer", border: `1px solid ${showBusinessMenu ? d.accent : d.border}` }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: d.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentBusiness?.name}</div>
                    <div style={{ fontSize: 10, color: d.muted, marginTop: 1 }}>Plan {currentBusiness?.plan} · Activo</div>
                  </div>
                  <span style={{ color: d.muted, fontSize: 10, display: "inline-block", transform: showBusinessMenu ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
                </div>
              </div>
              {showBusinessMenu && (
                <div onClick={e => e.stopPropagation()} style={{ position: "absolute", top: "calc(100% - 4px)", left: 12, right: 12, background: d.card, border: `1px solid ${d.border}`, borderRadius: 10, zIndex: 50, overflow: "hidden", animation: "slideDown 0.2s ease", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
                  {BUSINESSES.map(biz => (
                    <div key={biz.id} style={{ position: "relative" }}>
                      <div onClick={() => { if (!biz.locked) { setActiveBusiness(biz.id); setShowBusinessMenu(false); } }} style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 9, cursor: biz.locked ? "default" : "pointer", background: activeBusiness === biz.id ? d.hover : "transparent", opacity: biz.locked ? 0.5 : 1, filter: biz.locked ? "blur(1px)" : "none" }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: biz.locked ? d.subtle : (activeBusiness === biz.id ? "#4ade80" : d.muted), flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: d.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{biz.name}</div>
                          <div style={{ fontSize: 10, color: d.muted }}>Plan {biz.plan}</div>
                        </div>
                        {activeBusiness === biz.id && <span style={{ color: d.accent, fontSize: 10 }}>✓</span>}
                        {biz.locked && <span style={{ fontSize: 11 }}>🔒</span>}
                      </div>
                      {biz.locked && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 10 }}>
                          <button onClick={() => setShowBusinessMenu(false)} style={{ fontSize: 10, fontWeight: 700, color: d.accent, background: dark ? "rgba(255,230,0,0.1)" : "#fefce8", border: `1px solid ${dark ? "rgba(255,230,0,0.2)" : "#fde68a"}`, borderRadius: 6, padding: "3px 8px", cursor: "pointer", whiteSpace: "nowrap" }}>Suscribirse</button>
                        </div>
                      )}
                    </div>
                  ))}
                  <div style={{ padding: "8px 12px", borderTop: `1px solid ${d.border}` }}>
                    <button style={{ width: "100%", padding: "7px", background: "transparent", border: `1px dashed ${d.border}`, borderRadius: 7, color: d.muted, fontSize: 11, cursor: "pointer" }}>+ Agregar negocio</button>
                  </div>
                </div>
              )}
            </>
          ) : (
            // ── Sin negocio conectado: botón conectar ──
            <button
              onClick={() => setShowConnectModal(true)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, background: dark ? "rgba(66,133,244,0.08)" : "#eff6ff", border: `1px solid ${dark ? "rgba(66,133,244,0.25)" : "#bfdbfe"}`, borderRadius: 8, padding: "10px 12px", cursor: "pointer", transition: "all 0.15s" }}
              onMouseOver={e => e.currentTarget.style.borderColor = "#4285F4"}
              onMouseOut={e => e.currentTarget.style.borderColor = dark ? "rgba(66,133,244,0.25)" : "#bfdbfe"}
            >
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "#fff", border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#4285F4" }}>+ Conectar negocio</div>
                <div style={{ fontSize: 10, color: d.muted, marginTop: 2 }}>Google Business Profile</div>
              </div>
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ padding: "4px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map(item => (
            <button key={item.id} ref={navRefs[item.id]} onClick={() => { setActiveNav(item.id); setAccountSection(null); if (isMobile) setSidebarOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 7, cursor: "pointer", background: activeNav === item.id && !accountSection ? (dark ? "#262626" : "#f1f5f9") : "transparent", border: "none", color: activeNav === item.id && !accountSection ? d.text : d.muted, fontSize: 13, fontWeight: activeNav === item.id && !accountSection ? 600 : 400, width: "100%", textAlign: "left", transition: "all 0.15s" }}>
              <span style={{ fontSize: 14, width: 16, textAlign: "center" }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge > 0 && <span style={{ background: d.accent, color: d.accentFg, fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10 }}>{item.badge}</span>}
              {item.pro && !isPro && <span style={{ fontSize: 10 }}>🔒</span>}
            </button>
          ))}
        </nav>

        {/* Autopiloto widget */}
        <div style={{ padding: "8px 12px 12px" }}>
          <div style={{ background: autopilot ? (dark ? "#1a1700" : "#fefce8") : d.surface, border: `1px solid ${autopilot ? (dark ? "#3a3400" : "#fde68a") : d.border}`, borderRadius: 9, padding: "10px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: autopilot ? d.accent : d.muted }}>⚡ Autopiloto</div>
                <div style={{ fontSize: 10, color: d.muted, marginTop: 1 }}>{autopilot ? `${TONES.find(t=>t.key===tone)?.label}` : "Manual"}</div>
              </div>
              <button onClick={() => setAutopilot(!autopilot)} style={{ width: 36, height: 20, borderRadius: 10, border: "none", background: autopilot ? d.accent : d.subtle, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                <div style={{ position: "absolute", top: 2, left: autopilot ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: autopilot ? d.accentFg : "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </button>
            </div>
            {autopilot && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${dark ? "#3a3400" : "#fde68a"}` }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {TONES.map(t => {
                    const locked = !availableTones.includes(t.key);
                    return <button key={t.key} onClick={() => { if (!locked) setTone(t.key); }} style={{ flex: 1, padding: "5px 2px", borderRadius: 6, border: `1px solid ${tone === t.key ? d.accent : d.border}`, background: tone === t.key ? (dark ? "rgba(255,230,0,0.1)" : "#fefce8") : "transparent", color: locked ? d.subtle : (tone === t.key ? d.accent : d.muted), fontSize: 9, fontWeight: tone === t.key ? 700 : 400, cursor: locked ? "not-allowed" : "pointer", textAlign: "center", transition: "all 0.15s" }}>{locked ? "🔒" : t.key.charAt(0).toUpperCase() + t.key.slice(1)}</button>;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ height: 56, borderBottom: `1px solid ${d.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: d.sidebar, flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: 15, fontWeight: 700, color: d.text }}>
              {accountSection === "config" && "Mi cuenta"}{accountSection === "billing" && "Pagos y planes"}{accountSection === "invoices" && "Facturas"}
              {!accountSection && activeNav === "dashboard" && "Resumen"}{!accountSection && activeNav === "reviews" && "Reseñas"}{!accountSection && activeNav === "analytics" && "Analytics"}{!accountSection && activeNav === "autopilot" && "Autopiloto"}{!accountSection && activeNav === "qr" && "Mi QR"}
            </h1>
            <p style={{ fontSize: 11, color: d.muted, marginTop: 1 }}>
              {accountSection === "config" && "Gestiona tu información personal y conexiones"}{accountSection === "billing" && "Plan actual y método de pago"}{accountSection === "invoices" && "Historial de pagos"}
              {!accountSection && activeNav === "dashboard" && `${pendingCount} pendientes · ${respondedToday} respondidas`}{!accountSection && activeNav === "reviews" && `${pendingCount} sin responder`}{!accountSection && activeNav === "analytics" && "Últimos 30 días"}{!accountSection && activeNav === "qr" && "Tu código QR listo para imprimir"}{!accountSection && activeNav === "autopilot" && (autopilot ? `Activo · Tono ${tone}` : "Inactivo")}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {autopilot && <div style={{ fontSize: 11, color: d.accent, padding: "4px 10px", background: dark ? "#1a1700" : "#fefce8", borderRadius: 7, border: `1px solid ${dark ? "#3a3400" : "#fde68a"}`, fontWeight: 600 }}>⚡ Autopiloto ON</div>}
            {!isPro && <button onClick={() => setAccountSection("billing")} style={{ fontSize: 11, color: dark ? "#000" : "#fff", padding: "5px 12px", background: d.accent, borderRadius: 7, border: "none", fontWeight: 700, cursor: "pointer" }}>Upgrade →</button>}
            <button onClick={() => setDark(!dark)} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${d.border}`, background: d.surface, color: d.muted, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{dark ? "☀️" : "🌙"}</button>
            <div style={{ position: "relative" }}>
              <div onClick={e => { e.stopPropagation(); setShowUserMenu(!showUserMenu); }} style={{ width: 32, height: 32, borderRadius: "50%", background: d.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: d.accentFg, cursor: "pointer", border: showUserMenu ? `2px solid ${d.text}` : "2px solid transparent" }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              {showUserMenu && (
                <div onClick={e => e.stopPropagation()} style={{ position: "absolute", top: 42, right: 0, width: 220, background: d.card, border: `1px solid ${d.border}`, borderRadius: 12, zIndex: 200, overflow: "hidden", animation: "slideDown 0.2s ease", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
                  <div style={{ padding: "14px 16px", borderBottom: `1px solid ${d.border}` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: d.text }}>{userName}</div>
                    <div style={{ fontSize: 11, color: d.muted, marginTop: 2 }}>{userEmail}</div>
                    <div style={{ marginTop: 6, display: "inline-block", fontSize: 10, fontWeight: 700, color: d.accent, background: dark ? "rgba(255,230,0,0.1)" : "#fefce8", border: `1px solid ${dark ? "rgba(255,230,0,0.2)" : "#fde68a"}`, borderRadius: 6, padding: "2px 8px" }}>Plan {plan.charAt(0).toUpperCase() + plan.slice(1)}</div>
                  </div>
                  <div style={{ padding: "6px 8px", borderBottom: `1px solid ${d.border}` }}>
                    <div style={{ fontSize: 10, color: d.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", padding: "6px 8px 4px" }}>Configuración</div>
                    <button onClick={() => { setAccountSection("config"); setShowUserMenu(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 7, border: "none", background: "transparent", color: d.text, fontSize: 13, cursor: "pointer", textAlign: "left" }} onMouseOver={e => e.currentTarget.style.background = d.hover} onMouseOut={e => e.currentTarget.style.background = "transparent"}><span>🏢</span><span>Mi cuenta</span></button>
                  </div>
                  <div style={{ padding: "6px 8px", borderBottom: `1px solid ${d.border}` }}>
                    <div style={{ fontSize: 10, color: d.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", padding: "6px 8px 4px" }}>Pagos y planes</div>
                    {[{ icon: "💳", label: "Facturación", section: "billing" }, { icon: "🧾", label: "Pedidos y facturas", section: "invoices" }].map(item => (
                      <button key={item.section} onClick={() => { setAccountSection(item.section); setShowUserMenu(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 7, border: "none", background: "transparent", color: d.text, fontSize: 13, cursor: "pointer", textAlign: "left" }} onMouseOver={e => e.currentTarget.style.background = d.hover} onMouseOut={e => e.currentTarget.style.background = "transparent"}><span>{item.icon}</span><span>{item.label}</span></button>
                    ))}
                  </div>
                  <div style={{ padding: "6px 8px" }}>
                    <button onClick={() => signOut({ callbackUrl: "/" })} style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 7, border: "none", background: "transparent", color: "#f87171", fontSize: 13, cursor: "pointer", textAlign: "left" }} onMouseOver={e => e.currentTarget.style.background = dark ? "rgba(248,113,113,0.08)" : "#fef2f2"} onMouseOut={e => e.currentTarget.style.background = "transparent"}><span>🚪</span><span>Cerrar sesión</span></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div style={{ flex: 1, overflow: "auto", padding: "20px 24px", paddingBottom: isMobile ? "80px" : "20px" }}>

          {/* ── Banner modo demo ── */}
          {isDemo && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: dark ? "#1a1700" : "#fefce8", border: `1px solid ${dark ? "#3a3400" : "#fde68a"}`, borderRadius: 12, padding: "10px 16px", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16 }}>👀</span>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: d.accent }}>Estás viendo datos de ejemplo </span>
                  <span style={{ fontSize: 13, color: dark ? "#a89060" : "#854d0e" }}>— conecta tu negocio para ver los tuyos reales.</span>
                </div>
              </div>
              <button
                onClick={() => setShowConnectModal(true)}
                style={{ flexShrink: 0, padding: "7px 14px", background: d.accent, border: "none", borderRadius: 8, color: d.accentFg, fontSize: 12, fontWeight: 700, cursor: "pointer" }}
              >
                Conectar ahora →
              </button>
            </div>
          )}

          {!accountSection && activeNav === "dashboard" && (
            <div style={{ animation: "fadeIn 0.4s ease both" }}>
              {urgentReview && (
                <div style={{ background: dark ? "rgba(248,113,113,0.08)" : "#fef2f2", border: `1px solid ${dark ? "rgba(248,113,113,0.25)" : "#fecaca"}`, borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>⚠️</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#f87171" }}>Reseña negativa sin responder</div>
                      <div style={{ fontSize: 12, color: d.muted, marginTop: 1 }}>{urgentReview.name} dejó 1 estrella hace {urgentReview.time.toLowerCase()} — "{urgentReview.text.substring(0, 60)}..."</div>
                    </div>
                  </div>
                  <button onClick={() => { setActiveNav("reviews"); setSelected(urgentReview.id); setEditText(""); }} style={{ padding: "7px 14px", background: "#f87171", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Responder ahora →</button>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                {STATS.map((s, i) => (
                  <div key={i} style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 12, padding: "16px 18px", animation: `fadeIn 0.4s ease ${i * 0.06}s both` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <span style={{ fontSize: 18 }}>{s.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: s.up ? "#4ade80" : "#f87171", background: s.up ? (dark ? "rgba(74,222,128,0.1)" : "#f0fdf4") : (dark ? "rgba(248,113,113,0.1)" : "#fef2f2"), padding: "2px 7px", borderRadius: 8 }}>{s.change}</span>
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: d.text, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: d.muted }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ padding: "14px 16px", borderBottom: `1px solid ${d.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: d.text }}>Últimas reseñas</div>
                    <button onClick={() => setActiveNav("reviews")} style={{ fontSize: 11, color: d.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Ver todas →</button>
                  </div>
                  {reviews.slice(0, 4).map((r, i) => (
                    <div key={r.id} style={{ padding: "11px 16px", borderBottom: i < 3 ? `1px solid ${d.border}` : "none", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: r.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{r.avatar}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: d.text }}>{r.name}</span>
                          <Stars count={r.stars} size={11} />
                        </div>
                        <div style={{ fontSize: 11, color: d.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.text}</div>
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 8, flexShrink: 0, background: r.status === "pending" ? (dark ? "rgba(251,188,4,0.15)" : "#fefce8") : (dark ? "rgba(74,222,128,0.1)" : "#f0fdf4"), color: r.status === "pending" ? "#FBBC04" : "#4ade80" }}>{r.status === "pending" ? "Pendiente" : "OK"}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: "16px" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: d.text, marginBottom: 12 }}>Estado del sistema</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {[
                        { label: "Autopiloto", value: autopilot ? `ON · ${tone}` : "OFF · Manual", color: autopilot ? "#4ade80" : "#FBBC04", dot: autopilot ? "#4ade80" : "#FBBC04" },
                        { label: "Google Business", value: reviewSlug ? "Conectado" : "No conectado", color: reviewSlug ? "#4ade80" : "#f87171", dot: reviewSlug ? "#4ade80" : "#f87171" },
                        { label: "Pendientes", value: `${pendingCount} reseñas`, color: pendingCount > 0 ? "#FBBC04" : "#4ade80", dot: pendingCount > 0 ? "#FBBC04" : "#4ade80" },
                        { label: "Plan activo", value: plan.charAt(0).toUpperCase() + plan.slice(1), color: d.accent, dot: "#4ade80" },
                      ].map((item, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: item.dot }} /><span style={{ fontSize: 12, color: d.text }}>{item.label}</span></div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: item.color }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <UpgradeOverlay dark={dark} d={d} blur={!isPro}>
                    <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: d.text }}>Resumen Analytics</div>
                        <button onClick={() => setActiveNav("analytics")} style={{ fontSize: 11, color: d.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Ver más →</button>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {[{ label: "de clientes leen tus respuestas", pct: 97, color: "#FBBC04" }, { label: "prefieren negocios que responden", pct: 88, color: "#4ade80" }, { label: "regresan si solucionas el problema", pct: 79, color: "#60a5fa" }].map((item, i) => (
                          <div key={i}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 11, color: d.muted }}>{item.label}</span><span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.pct}%</span></div>
                            <div style={{ height: 4, background: d.surface, borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 4 }} /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </UpgradeOverlay>
                </div>
              </div>
            </div>
          )}

          {!accountSection && activeNav === "reviews" && (
            <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 16, animation: "fadeIn 0.4s ease both" }}>
              <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", padding: "0 16px", borderBottom: `1px solid ${d.border}`, gap: 4 }}>
                  {[{ key: "all", label: "Todas" }, { key: "pending", label: "Pendientes", count: pendingCount }, { key: "responded", label: "Respondidas" }].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: "14px 12px", border: "none", background: "none", fontSize: 13, fontWeight: activeTab === tab.key ? 600 : 400, color: activeTab === tab.key ? d.text : d.muted, borderBottom: `2px solid ${activeTab === tab.key ? d.accent : "transparent"}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                      {tab.label}{tab.count > 0 && <span style={{ background: dark ? "#1a1700" : "#fefce8", color: dark ? "#FFE600" : "#854d0e", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 8 }}>{tab.count}</span>}
                    </button>
                  ))}
                </div>
                <div style={{ overflow: "auto", maxHeight: "calc(100vh - 200px)" }}>
                  {filtered.map((r) => (
                    <div key={r.id} onClick={() => { setSelected(selected === r.id ? null : r.id); setEditText(r.response || ""); }} style={{ padding: "14px 16px", borderBottom: `1px solid ${d.border}`, cursor: "pointer", background: selected === r.id ? d.hover : "transparent", transition: "background 0.15s" }} onMouseOver={e => { if (selected !== r.id) e.currentTarget.style.background = d.hover; }} onMouseOut={e => { if (selected !== r.id) e.currentTarget.style.background = "transparent"; }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: r.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{r.avatar}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 13, fontWeight: 600, color: d.text }}>{r.name}</span><Stars count={r.stars} /></div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 11, color: d.muted }}>{r.time}</span><span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 8, background: r.status === "pending" ? (dark ? "rgba(251,188,4,0.15)" : "#fefce8") : (dark ? "rgba(74,222,128,0.1)" : "#f0fdf4"), color: r.status === "pending" ? "#FBBC04" : "#4ade80" }}>{r.status === "pending" ? "Pendiente" : "Respondida"}</span></div>
                          </div>
                          <p style={{ fontSize: 12, color: d.muted, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.text}</p>
                          {r.status === "responded" && r.response && <div style={{ marginTop: 6, padding: "5px 10px", background: d.surface, borderRadius: 6, borderLeft: `3px solid ${d.accent}` }}><p style={{ fontSize: 11, color: d.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>↩ {r.response}</p></div>}
                        </div>
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && <div style={{ padding: "48px 20px", textAlign: "center" }}><div style={{ fontSize: 32, marginBottom: 10 }}>🎉</div><div style={{ fontSize: 14, color: d.muted }}>¡Todo al día!</div></div>}
                </div>
              </div>
              {selected && selectedReview && (
                <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: "20px", display: "flex", flexDirection: "column", gap: 14, animation: "fadeIn 0.2s ease", overflow: "auto", maxHeight: "calc(100vh - 160px)" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: selectedReview.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>{selectedReview.avatar}</div>
                      <div><div style={{ fontSize: 14, fontWeight: 600, color: d.text }}>{selectedReview.name}</div><div style={{ display: "flex", alignItems: "center", gap: 6 }}><Stars count={selectedReview.stars} /><span style={{ fontSize: 11, color: d.muted }}>{selectedReview.time}</span></div></div>
                    </div>
                    <p style={{ fontSize: 13, color: d.muted, lineHeight: 1.6, background: d.surface, padding: "12px 14px", borderRadius: 9 }}>"{selectedReview.text}"</p>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: d.muted, marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Tono</div>
                    <div style={{ display: "flex", gap: 5 }}>
                      {TONES.map(t => { const locked = !availableTones.includes(t.key); return <button key={t.key} onClick={() => { if (!locked) setTone(t.key); }} style={{ flex: 1, padding: "6px 4px", borderRadius: 7, border: `1px solid ${tone === t.key ? d.accent : d.border}`, background: tone === t.key ? (dark ? "rgba(255,230,0,0.1)" : "#fefce8") : "transparent", color: locked ? d.subtle : (tone === t.key ? d.accent : d.muted), fontSize: 10, fontWeight: tone === t.key ? 700 : 400, cursor: locked ? "not-allowed" : "pointer", textAlign: "center", opacity: locked ? 0.6 : 1 }}>{locked ? "🔒" : t.label}</button>; })}
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: d.text, textTransform: "uppercase", letterSpacing: "0.06em" }}>Tu respuesta</span>
                      <button onClick={() => generateAI(selectedReview)} disabled={generating} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: generating ? d.surface : d.text, border: "none", borderRadius: 7, color: generating ? d.muted : d.bg, fontSize: 11, fontWeight: 600, cursor: generating ? "not-allowed" : "pointer" }}>
                        {generating ? (<><div style={{ width: 9, height: 9, border: `1.5px solid ${d.muted}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Generando...</>) : "✦ Generar con IA"}
                      </button>
                    </div>
                    <textarea value={editText} onChange={e => setEditText(e.target.value)} placeholder="Escribe o genera una respuesta con IA..." style={{ width: "100%", minHeight: 110, padding: "11px 13px", border: `1.5px solid ${d.border}`, borderRadius: 9, fontSize: 13, color: d.text, lineHeight: 1.6, resize: "vertical", fontFamily: "'DM Sans', sans-serif", background: d.surface }} onFocus={e => e.target.style.borderColor = d.accent} onBlur={e => e.target.style.borderColor = d.border} />
                    <div style={{ fontSize: 10, color: d.muted, textAlign: "right", marginTop: 3 }}>{editText.length} caracteres</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <div style={{ position: "relative" }}>
                      <button
                        onClick={() => !isDemo && editText && publish(selected)}
                        disabled={!editText || generating || isDemo}
                        style={{ width: "100%", padding: "11px", background: editText && !generating && !isDemo ? d.accent : d.subtle, border: "none", borderRadius: 9, color: editText && !generating && !isDemo ? d.accentFg : d.muted, fontSize: 13, fontWeight: 700, cursor: editText && !generating && !isDemo ? "pointer" : "not-allowed" }}
                      >
                        {isDemo ? "🔒 Conecta tu negocio para publicar" : "Publicar en Google →"}
                      </button>
                      {isDemo && (
                        <div
                          onClick={() => setShowConnectModal(true)}
                          style={{ position: "absolute", inset: 0, borderRadius: 9, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        />
                      )}
                    </div>
                    <button onClick={() => { setSelected(null); setEditText(""); }} style={{ padding: "9px", background: "transparent", border: `1px solid ${d.border}`, borderRadius: 9, color: d.muted, fontSize: 12, cursor: "pointer" }}>Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!accountSection && activeNav === "analytics" && (
            <UpgradeOverlay dark={dark} d={d} blur={!isPro}>
              <div style={{ animation: "fadeIn 0.4s ease both" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div><h2 style={{ fontSize: 18, fontWeight: 700, color: d.text, marginBottom: 4 }}>Analytics</h2><p style={{ fontSize: 13, color: d.muted }}>Rendimiento de tu reputación en los últimos 30 días</p></div>
                  {canDownloadPDF ? <button onClick={() => showToast("Generando reporte PDF con IA... ✨")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", background: d.accent, border: "none", borderRadius: 9, color: d.accentFg, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>📄 Exportar PDF</button> : <div style={{ position: "relative" }}><button style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", background: d.subtle, border: "none", borderRadius: 9, color: d.muted, fontSize: 13, fontWeight: 700, cursor: "not-allowed", opacity: 0.6 }}>📄 Exportar PDF 🔒</button><div style={{ position: "absolute", top: -32, left: "50%", transform: "translateX(-50%)", background: dark ? "#1a1a1a" : "#0f172a", color: "#fff", fontSize: 11, padding: "4px 10px", borderRadius: 6, whiteSpace: "nowrap", pointerEvents: "none" }}>Disponible en plan Growth+</div></div>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
                  {[{ label: "Total reseñas", value: "47", icon: "⭐", color: "#FBBC04" }, { label: "Rating promedio", value: "4.3", icon: "📈", color: "#4ade80" }, { label: "Tasa respuesta", value: "89%", icon: "💬", color: "#60a5fa" }, { label: "Tiempo respuesta", value: "< 2h", icon: "⚡", color: dark ? "#FFE600" : "#1d4ed8" }].map((s, i) => (
                    <div key={i} style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 12, padding: "16px" }}>
                      <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
                      <div style={{ fontSize: 26, fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: d.muted }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: "18px" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: d.text, marginBottom: 4 }}>Evolución del rating</div>
                    <div style={{ fontSize: 12, color: d.muted, marginBottom: 14 }}>Últimos 6 meses</div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
                      {[{mes:"Oct",pct:68},{mes:"Nov",pct:72},{mes:"Dic",pct:76},{mes:"Ene",pct:80},{mes:"Feb",pct:84},{mes:"Mar",pct:88}].map((item, i) => (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <div style={{ width: "100%", height: `${item.pct}%`, background: i === 5 ? d.accent : d.subtle, borderRadius: "4px 4px 0 0", opacity: i === 5 ? 1 : 0.5 }} />
                          <div style={{ fontSize: 10, color: d.muted }}>{item.mes}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: "18px" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: d.text, marginBottom: 4 }}>Distribución de estrellas</div>
                    <div style={{ fontSize: 12, color: d.muted, marginBottom: 14 }}>47 reseñas totales</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[{stars:5,count:24,pct:51},{stars:4,count:12,pct:26},{stars:3,count:6,pct:13},{stars:2,count:3,pct:6},{stars:1,count:2,pct:4}].map(item => (
                        <div key={item.stars} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 11, color: "#FBBC04", width: 56, flexShrink: 0 }}>{"★".repeat(item.stars)}</span>
                          <div style={{ flex: 1, height: 7, background: d.surface, borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", width: `${item.pct}%`, background: item.stars >= 4 ? "#4ade80" : item.stars === 3 ? "#FBBC04" : "#f87171", borderRadius: 4 }} /></div>
                          <span style={{ fontSize: 11, color: d.muted, width: 20, textAlign: "right" }}>{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </UpgradeOverlay>
          )}

          {!accountSection && activeNav === "autopilot" && (
            <div style={{ animation: "fadeIn 0.4s ease both" }}>
              <div style={{ marginBottom: 20 }}><h2 style={{ fontSize: 18, fontWeight: 700, color: d.text, marginBottom: 4 }}>Configuración de Autopiloto</h2><p style={{ fontSize: 13, color: d.muted }}>Decide cómo responde RevGo y previsualiza el tono en tiempo real</p></div>
              <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div><div style={{ fontSize: 14, fontWeight: 700, color: d.text }}>⚡ Autopiloto</div><div style={{ fontSize: 12, color: d.muted, marginTop: 2 }}>{autopilot ? "Respondiendo automáticamente" : "Modo manual activo"}</div></div>
                      <button onClick={() => setAutopilot(!autopilot)} style={{ width: 48, height: 26, borderRadius: 13, border: "none", background: autopilot ? d.accent : d.subtle, cursor: "pointer", position: "relative", transition: "background 0.2s" }}><div style={{ position: "absolute", top: 3, left: autopilot ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: autopilot ? d.accentFg : "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} /></button>
                    </div>
                    <div style={{ borderTop: `1px solid ${d.border}`, paddingTop: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: d.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Tono de respuesta</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {TONES.map(t => { const locked = !availableTones.includes(t.key); return <button key={t.key} onClick={() => { if (!locked) setTone(t.key); }} style={{ padding: "12px 14px", borderRadius: 9, border: `1px solid ${tone === t.key ? d.accent : d.border}`, background: tone === t.key ? (dark ? "rgba(255,230,0,0.08)" : "#fefce8") : d.surface, color: locked ? d.subtle : (tone === t.key ? d.accent : d.text), fontSize: 13, fontWeight: tone === t.key ? 700 : 400, cursor: locked ? "not-allowed" : "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", opacity: locked ? 0.6 : 1 }}><span>{t.label}</span>{locked ? <span style={{ fontSize: 11 }}>🔒 Pro</span> : tone === t.key && <span>✓</span>}</button>; })}
                      </div>
                    </div>
                  </div>
                  <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: "20px" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: d.text, marginBottom: 12 }}>Reglas de autopiloto</div>
                    {[{ label: "Responder reseñas de 5 estrellas", active: true }, { label: "Responder reseñas de 4 estrellas", active: true }, { label: "Responder reseñas de 3 estrellas", active: true }, { label: "Responder reseñas de 1-2 estrellas", active: false }].map((rule, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${d.border}` : "none" }}>
                        <span style={{ fontSize: 13, color: d.text }}>{rule.label}</span>
                        <div style={{ width: 36, height: 20, borderRadius: 10, background: rule.active ? d.accent : d.subtle, cursor: "pointer", position: "relative" }}><div style={{ position: "absolute", top: 2, left: rule.active ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: rule.active ? d.accentFg : "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} /></div>
                      </div>
                    ))}
                    <div style={{ marginTop: 12, padding: "10px 12px", background: dark ? "rgba(251,188,4,0.08)" : "#fefce8", borderRadius: 8, border: `1px solid ${dark ? "rgba(251,188,4,0.2)" : "#fde68a"}` }}>
                      <p style={{ fontSize: 11, color: d.muted, lineHeight: 1.6 }}><span style={{ color: d.accent, fontWeight: 700 }}>Recomendación:</span> Las reseñas de 1-2 estrellas requieren atención especial. Te recomendamos revisarlas manualmente.</p>
                    </div>
                  </div>
                </div>
                <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", borderBottom: `1px solid ${d.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div><div style={{ fontSize: 14, fontWeight: 700, color: d.text }}>Vista previa del tono</div><div style={{ fontSize: 12, color: d.muted, marginTop: 2 }}>Así responderá la IA con el tono <span style={{ color: d.accent, fontWeight: 600 }}>{tone}</span></div></div>
                    <div style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, background: dark ? "rgba(255,230,0,0.1)" : "#fefce8", color: d.accent, fontWeight: 700, border: `1px solid ${dark ? "rgba(255,230,0,0.2)" : "#fde68a"}` }}>{TONES.find(t => t.key === tone)?.label}</div>
                  </div>
                  <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
                    <p style={{ fontSize: 12, color: d.muted, fontStyle: "italic", lineHeight: 1.6, padding: "10px 12px", background: d.surface, borderRadius: 8, border: `1px solid ${d.border}` }}>💡 La IA adapta cada respuesta al contexto de la reseña. Estos son ejemplos representativos del tono seleccionado.</p>
                    {TONE_PREVIEWS[tone].map((preview, i) => (
                      <div key={i} style={{ animation: "fadeIn 0.3s ease both", animationDelay: `${i * 0.08}s` }}>
                        <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: preview.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{preview.name.split(" ").map(n => n[0]).join("")}</div>
                          <div style={{ flex: 1, background: d.surface, borderRadius: "0 10px 10px 10px", padding: "10px 12px", border: `1px solid ${d.border}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><span style={{ fontSize: 12, fontWeight: 600, color: d.text }}>{preview.name}</span><span style={{ fontSize: 11, letterSpacing: -1 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= preview.stars ? "#FBBC04" : "#cbd5e1" }}>★</span>)}</span></div>
                            <p style={{ fontSize: 12, color: d.muted, lineHeight: 1.5 }}>{preview.text}</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 10, paddingLeft: 20 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 7, background: d.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: d.accentFg, flexShrink: 0 }}>R</div>
                          <div style={{ flex: 1, background: dark ? "rgba(255,230,0,0.05)" : "#fefce8", borderRadius: "0 10px 10px 10px", padding: "10px 12px", border: `1px solid ${dark ? "rgba(255,230,0,0.15)" : "#fde68a"}` }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: d.accent, marginBottom: 5, letterSpacing: "0.06em" }}>REVGO AI · {tone.toUpperCase()}</div>
                            <p style={{ fontSize: 12, color: dark ? "#c0b870" : "#713f12", lineHeight: 1.6 }}>{preview.response}</p>
                          </div>
                        </div>
                        {i < TONE_PREVIEWS[tone].length - 1 && <div style={{ height: 1, background: d.border, marginTop: 16 }} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {accountSection === "config" && (
            <div style={{ animation: "fadeIn 0.4s ease both", maxWidth: 560 }}>
              <button onClick={() => setAccountSection(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: d.muted, fontSize: 13, cursor: "pointer", marginBottom: 20, padding: 0 }} onMouseOver={e => e.currentTarget.style.color = d.text} onMouseOut={e => e.currentTarget.style.color = d.muted}>← Volver</button>
              <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: "20px", marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: d.text, marginBottom: 16 }}>Información personal</div>
                {[{ label: "Nombre completo", value: userName }, { label: "Correo electrónico", value: userEmail }, { label: "Nombre del negocio", value: currentBusiness?.name }].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 2 ? `1px solid ${d.border}` : "none" }}>
                    <div><div style={{ fontSize: 12, color: d.muted, marginBottom: 2 }}>{item.label}</div><div style={{ fontSize: 14, color: d.text, fontWeight: 500 }}>{item.value}</div></div>
                    <button style={{ fontSize: 12, color: d.accent, background: "none", border: `1px solid ${d.border}`, borderRadius: 7, padding: "6px 12px", cursor: "pointer", fontWeight: 600 }}>Editar</button>
                  </div>
                ))}
              </div>
              <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: "20px", marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: d.text, marginBottom: 16 }}>Servicios conectados</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e0e0e0" }}>
                      <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-4z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C40.9 35.2 44 30 44 24c0-1.3-.1-2.7-.4-4z"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: d.text }}>Google Business Profile</div>
                      <div style={{ fontSize: 11, color: reviewSlug ? "#4ade80" : "#f87171", marginTop: 1 }}>{reviewSlug ? `✓ Conectado · ${currentBusiness?.name}` : "✗ No conectado"}</div>
                    </div>
                  </div>
                  {reviewSlug
                    ? <button style={{ fontSize: 12, color: "#f87171", background: "none", border: `1px solid ${dark ? "rgba(248,113,113,0.3)" : "#fca5a5"}`, borderRadius: 7, padding: "6px 12px", cursor: "pointer" }}>Desconectar</button>
                    : <button onClick={() => setShowConnectModal(true)} style={{ fontSize: 12, color: d.accentFg, background: "#4285F4", border: "none", borderRadius: 7, padding: "6px 12px", cursor: "pointer", fontWeight: 600 }}>Conectar</button>
                  }
                </div>
              </div>
              <div style={{ background: dark ? "rgba(248,113,113,0.06)" : "#fef2f2", border: `1px solid ${dark ? "rgba(248,113,113,0.2)" : "#fecaca"}`, borderRadius: 14, padding: "18px 20px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f87171", marginBottom: 4 }}>Zona de peligro</div>
                <div style={{ fontSize: 12, color: d.muted, marginBottom: 12 }}>Eliminar tu cuenta borrará todos tus datos permanentemente.</div>
                <button style={{ fontSize: 12, color: "#f87171", background: "none", border: `1px solid ${dark ? "rgba(248,113,113,0.3)" : "#fca5a5"}`, borderRadius: 7, padding: "7px 14px", cursor: "pointer", fontWeight: 600 }}>Eliminar cuenta</button>
              </div>
            </div>
          )}

          {!accountSection && activeNav === "qr" && (
            <UpgradeOverlay dark={dark} d={d} blur={!isPro}>
              <div style={{ animation: "fadeIn 0.4s ease both" }}>
                <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${d.border}`, marginBottom: 20 }}>
                  {[{ key: "qr", label: "📱 Mi QR inteligente" }, { key: "complaints", label: `💬 Quejas internas ${complaints.length > 0 ? `(${complaints.length})` : ""}` }].map(tab => (
                    <button key={tab.key} onClick={() => setQrTab(tab.key)} style={{ padding: "10px 16px", border: "none", background: "none", fontSize: 13, fontWeight: qrTab === tab.key ? 600 : 400, color: qrTab === tab.key ? d.text : d.muted, borderBottom: `2px solid ${qrTab === tab.key ? d.accent : "transparent"}`, cursor: "pointer" }}>
                      {tab.label}
                    </button>
                  ))}
                </div>
                {qrTab === "qr" && (
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "300px 1fr", gap: 24 }}>
                    <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 16, padding: "28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: d.text, marginBottom: 4 }}>Tu QR inteligente</div>
                      <div style={{ width: 180, height: 180, background: "#ffffff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", padding: 12, border: `2px solid ${d.border}` }}>
                        <QRCodeCanvas value={`https://revgo.app/r/${reviewSlug || "mi-negocio"}`} size={156} bgColor="#ffffff" fgColor="#000000" level="H" />
                      </div>
                      <div style={{ width: "100%", background: d.surface, border: `1px solid ${d.border}`, borderRadius: 8, padding: "10px 12px" }}>
                        <div style={{ fontSize: 10, color: d.muted, marginBottom: 3 }}>Tu link de reseñas</div>
                        <div style={{ fontSize: 12, color: d.accent, fontWeight: 600, wordBreak: "break-all" }}>revgo.app/r/{reviewSlug || currentBusiness?.name?.toLowerCase().replace(/\s+/g, "-") || "mi-negocio"}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
                        <button
                          onClick={() => isDemo ? setShowConnectModal(true) : showToast("Descargando QR... ✨")}
                          style={{ width: "100%", padding: "11px", background: isDemo ? d.subtle : d.accent, border: "none", borderRadius: 9, color: isDemo ? d.muted : d.accentFg, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                        >
                          {isDemo ? "🔒 Conecta para descargar" : "📥 Descargar QR"}
                        </button>
                        <button
                          onClick={() => isDemo ? setShowConnectModal(true) : (navigator.clipboard?.writeText(`https://revgo.app/r/${reviewSlug}`), showToast("Link copiado ✓"))}
                          style={{ width: "100%", padding: "10px", background: "transparent", border: `1px solid ${d.border}`, borderRadius: 9, color: isDemo ? d.muted : d.muted, fontSize: 12, cursor: "pointer", opacity: isDemo ? 0.5 : 1 }}
                        >
                          🔗 Copiar link
                        </button>
                        <button
                          onClick={() => isDemo ? setShowConnectModal(true) : showToast("Generando kit PDF completo... 🎨")}
                          style={{ width: "100%", padding: "10px", background: "transparent", border: `1px solid ${d.border}`, borderRadius: 9, color: d.muted, fontSize: 12, cursor: "pointer", opacity: isDemo ? 0.5 : 1 }}
                        >
                          🖨️ Descargar kit imprimible
                        </button>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: "20px" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: d.text, marginBottom: 14 }}>⚡ Cómo funciona tu QR inteligente</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {[{ icon: "1️⃣", title: "Cliente escanea el QR", desc: "Se abre una página con la pregunta: ¿Cómo fue tu experiencia?" }, { icon: "2️⃣", title: "Filtro inteligente", desc: "Experiencia buena → va directo a Google Maps. Mala → formulario interno." }, { icon: "3️⃣", title: "Más reseñas 5 estrellas", desc: "Solo los clientes felices llegan a Google. Las quejas las recibes tú primero." }].map((item, i) => (
                            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                              <div><div style={{ fontSize: 13, fontWeight: 600, color: d.text, marginBottom: 2 }}>{item.title}</div><div style={{ fontSize: 12, color: d.muted, lineHeight: 1.5 }}>{item.desc}</div></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                        {[{ label: "Escaneos este mes", value: "0", icon: "📲" }, { label: "Reseñas por QR", value: "0", icon: "⭐" }, { label: "Quejas filtradas", value: complaints.length.toString(), icon: "🛡️" }].map((s, i) => (
                          <div key={i} style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 12, padding: "16px", textAlign: "center" }}>
                            <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: d.accent, marginBottom: 4 }}>{s.value}</div>
                            <div style={{ fontSize: 11, color: d.muted }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: "20px" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: d.text, marginBottom: 14 }}>💡 ¿Dónde ponerlo?</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {[{ icon: "🧾", place: "Cuenta o boleta", tip: "El momento perfecto — el cliente acaba de pagar satisfecho" }, { icon: "🪧", place: "Carpa de mesa", tip: "Visible durante toda la experiencia del cliente" }, { icon: "🚪", place: "Puerta de salida", tip: "El cliente satisfecho sale y escanea en segundos" }, { icon: "📦", place: "Empaque o bolsa", tip: "Ideal para delivery — lo ven cuando abren el pedido" }].map((item, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                              <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                              <div><div style={{ fontSize: 13, fontWeight: 600, color: d.text }}>{item.place}</div><div style={{ fontSize: 12, color: d.muted, marginTop: 2 }}>{item.tip}</div></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {qrTab === "complaints" && (
                  <div>
                    {complaints.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "48px 20px", background: d.card, border: `1px solid ${d.border}`, borderRadius: 14 }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🛡️</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: d.text, marginBottom: 6 }}>Sin quejas por ahora</div>
                        <div style={{ fontSize: 13, color: d.muted }}>Cuando un cliente deje una queja interna a través del QR, aparecerá aquí.</div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {complaints.map((c, i) => (
                          <div key={i} style={{ background: d.card, border: `1px solid ${c.status === "pending" ? (dark ? "rgba(248,113,113,0.3)" : "#fecaca") : d.border}`, borderRadius: 14, padding: "18px 20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: c.status === "pending" ? (dark ? "rgba(248,113,113,0.15)" : "#fef2f2") : (dark ? "rgba(74,222,128,0.1)" : "#f0fdf4"), color: c.status === "pending" ? "#f87171" : "#4ade80" }}>{c.status === "pending" ? "Sin leer" : "Resuelto"}</div>
                                <div style={{ display: "flex", gap: 1 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 11, color: s <= (c.stars || 1) ? "#FBBC04" : "#2a2a2a" }}>★</span>)}</div>
                              </div>
                              <span style={{ fontSize: 11, color: d.muted }}>{new Date(c.created_at).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })}</span>
                            </div>
                            <p style={{ fontSize: 13, color: d.text, lineHeight: 1.65, marginBottom: 12 }}>"{c.message}"</p>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button onClick={() => showToast("Marcado como resuelto ✓")} style={{ padding: "7px 14px", background: "transparent", border: `1px solid ${d.border}`, borderRadius: 8, color: d.muted, fontSize: 12, cursor: "pointer" }}>✓ Marcar resuelto</button>
                              <button onClick={() => showToast("Respuesta enviada ✓")} style={{ padding: "7px 14px", background: d.accent, border: "none", borderRadius: 8, color: d.accentFg, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Responder →</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </UpgradeOverlay>
          )}

          {accountSection === "billing" && (
            <div style={{ animation: "fadeIn 0.4s ease both", maxWidth: 640 }}>
              <button onClick={() => setAccountSection(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: d.muted, fontSize: 13, cursor: "pointer", marginBottom: 20, padding: 0 }} onMouseOver={e => e.currentTarget.style.color = d.text} onMouseOut={e => e.currentTarget.style.color = d.muted}>← Volver</button>
              <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: "22px", marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 11, color: d.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Plan activo</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 22 }}>👑</span><span style={{ fontSize: 22, fontWeight: 700, color: d.text }}>RevGo {plan.charAt(0).toUpperCase() + plan.slice(1)}</span></div>
                  </div>
                  <button style={{ padding: "8px 16px", background: "transparent", border: `1px solid ${d.border}`, borderRadius: 9, color: d.muted, fontSize: 12, cursor: "pointer" }}>Cancelar plan</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div style={{ background: d.surface, borderRadius: 10, padding: "14px" }}>
                    <div style={{ fontSize: 11, color: d.muted, marginBottom: 4 }}>📅 Se renueva el</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: d.text }}>5 de abril de 2026</div>
                    <div style={{ fontSize: 11, color: d.accent, marginTop: 4, cursor: "pointer" }}>Cambiar a anual (ahorra 28%)</div>
                  </div>
                  <div style={{ background: d.surface, borderRadius: 10, padding: "14px" }}>
                    <div style={{ fontSize: 11, color: d.muted, marginBottom: 4 }}>💰 Precio</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: d.text }}>{PLAN_PRICES[plan] || "S/39"} al mes</div>
                    <div style={{ fontSize: 11, color: d.muted, marginTop: 4 }}>Se renueva automáticamente</div>
                  </div>
                </div>
              </div>
              <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: "22px", marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: d.text, marginBottom: 6 }}>Cambiar de plan</div>
                <div style={{ fontSize: 12, color: d.muted, marginBottom: 18 }}>El cambio se aplica de inmediato. LemonSqueezy prorratea la diferencia automáticamente.</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { key: "starter", label: "Starter", price: "S/39", desc: "1 negocio · 50 respuestas/mes", icon: "🌱" },
                    { key: "growth", label: "Growth", price: "S/79", desc: "3 negocios · 200 respuestas/mes", icon: "🚀" },
                    { key: "pro", label: "Pro", price: "S/149", desc: "5 negocios · ilimitado", icon: "⚡" },
                    { key: "agencia", label: "Agencia", price: "S/349", desc: "20 negocios · white-label", icon: "🏢" },
                  ].map(p => {
                    const isCurrent = plan === p.key;
                    return (
                      <div key={p.key} style={{ padding: "16px", borderRadius: 12, border: `2px solid ${isCurrent ? d.accent : d.border}`, background: isCurrent ? (dark ? "rgba(255,230,0,0.05)" : "#fefce8") : d.surface, position: "relative" }}>
                        {isCurrent && <div style={{ position: "absolute", top: -10, left: 12, fontSize: 10, fontWeight: 700, color: dark ? "#000" : "#fff", background: d.accent, padding: "2px 10px", borderRadius: 20 }}>Plan actual</div>}
                        <div style={{ fontSize: 18, marginBottom: 6 }}>{p.icon}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: d.text }}>{p.label}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: isCurrent ? d.accent : d.text, margin: "4px 0" }}>{p.price}<span style={{ fontSize: 11, fontWeight: 400, color: d.muted }}>/mes</span></div>
                        <div style={{ fontSize: 11, color: d.muted, marginBottom: 12, lineHeight: 1.5 }}>{p.desc}</div>
                        {isCurrent
                          ? <div style={{ fontSize: 12, color: d.accent, fontWeight: 600, textAlign: "center", padding: "8px", background: dark ? "rgba(255,230,0,0.08)" : "#fefce8", borderRadius: 8 }}>✓ Plan activo</div>
                          : <button onClick={() => openCheckout(p.key)} style={{ width: "100%", padding: "9px", background: d.accent, border: "none", borderRadius: 8, color: d.accentFg, fontSize: 12, fontWeight: 700, cursor: "pointer" }} onMouseOver={e => e.currentTarget.style.opacity = "0.85"} onMouseOut={e => e.currentTarget.style.opacity = "1"}>Cambiar a {p.label} →</button>
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: "22px", marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: d.text }}>Capacidad de uso IA</div>
                  <div style={{ fontSize: 11, color: d.muted }}>Se restablece el 31 de mar</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 12, color: d.muted }}>Respuestas generadas este mes</span><span style={{ fontSize: 12, fontWeight: 600, color: d.text }}>12 / 50</span></div>
                <div style={{ height: 6, background: d.surface, borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", width: "24%", background: d.accent, borderRadius: 4 }} /></div>
                <div style={{ fontSize: 11, color: d.muted, marginTop: 6 }}>24% de uso mensual</div>
              </div>
              <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: "22px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: d.text, marginBottom: 16 }}>Método de pago</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: d.surface, borderRadius: 10, padding: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 28, background: dark ? "#2a2a2a" : "#e2e8f0", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>💳</div>
                    <div><div style={{ fontSize: 13, fontWeight: 600, color: d.text }}>Tarjeta •••• 8609</div><div style={{ fontSize: 11, color: d.muted }}>Vence noviembre 2027</div></div>
                  </div>
                  <button style={{ fontSize: 12, color: d.accent, background: "none", border: `1px solid ${d.border}`, borderRadius: 7, padding: "6px 12px", cursor: "pointer", fontWeight: 600 }}>Cambiar</button>
                </div>
              </div>
            </div>
          )}

          {accountSection === "invoices" && (
            <div style={{ animation: "fadeIn 0.4s ease both" }}>
              <button onClick={() => setAccountSection(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: d.muted, fontSize: 13, cursor: "pointer", marginBottom: 20, padding: 0 }} onMouseOver={e => e.currentTarget.style.color = d.text} onMouseOut={e => e.currentTarget.style.color = d.muted}>← Volver</button>
              <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, overflow: "hidden" }}>
                {isMobile ? (
                  [{ id: "04811-49982808", date: "5 mar 2026", amount: "S/29.00" }, { id: "04783-48690067", date: "5 feb 2026", amount: "S/29.00" }, { id: "04752-39196969", date: "5 ene 2026", amount: "S/29.00" }, { id: "04721-43596554", date: "5 dic 2025", amount: "S/29.00" }, { id: "04691-43136295", date: "5 nov 2025", amount: "S/29.00" }, { id: "04660-31602700", date: "5 oct 2025", amount: "S/29.00" }].map((inv, i, arr) => (
                    <div key={i} style={{ padding: "16px", borderBottom: i < arr.length - 1 ? `1px solid ${d.border}` : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: d.text }}>Suscripción RevGo {plan.charAt(0).toUpperCase() + plan.slice(1)}</div>
                          <div style={{ fontSize: 11, color: d.muted, marginTop: 2 }}>{inv.id}</div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#4ade80", background: dark ? "rgba(74,222,128,0.1)" : "#f0fdf4", padding: "3px 9px", borderRadius: 20, flexShrink: 0 }}>Pagado</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: 12 }}>
                          <span style={{ fontSize: 12, color: d.muted }}>{inv.date}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: d.text }}>{inv.amount}</span>
                        </div>
                        <button style={{ fontSize: 12, color: d.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Ver factura</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 120px 120px 100px", padding: "12px 20px", borderBottom: `1px solid ${d.border}`, background: d.surface }}>
                      {["Descripción", "Fecha", "Estado", "Total", "Acciones"].map(h => <div key={h} style={{ fontSize: 11, fontWeight: 700, color: d.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</div>)}
                    </div>
                    {[{ id: "04811-49982808", date: "5 mar 2026", amount: "S/29.00" }, { id: "04783-48690067", date: "5 feb 2026", amount: "S/29.00" }, { id: "04752-39196969", date: "5 ene 2026", amount: "S/29.00" }, { id: "04721-43596554", date: "5 dic 2025", amount: "S/29.00" }, { id: "04691-43136295", date: "5 nov 2025", amount: "S/29.00" }, { id: "04660-31602700", date: "5 oct 2025", amount: "S/29.00" }].map((inv, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 160px 120px 120px 100px", padding: "14px 20px", borderBottom: i < 5 ? `1px solid ${d.border}` : "none", alignItems: "center" }} onMouseOver={e => e.currentTarget.style.background = d.hover} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                        <div><div style={{ fontSize: 13, fontWeight: 500, color: d.text }}>Suscripción RevGo {plan.charAt(0).toUpperCase() + plan.slice(1)}</div><div style={{ fontSize: 11, color: d.muted, marginTop: 2 }}>{inv.id}</div></div>
                        <div style={{ fontSize: 13, color: d.muted }}>{inv.date}</div>
                        <div><span style={{ fontSize: 11, fontWeight: 700, color: "#4ade80", background: dark ? "rgba(74,222,128,0.1)" : "#f0fdf4", padding: "3px 9px", borderRadius: 20 }}>Pagado</span></div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: d.text }}>{inv.amount}</div>
                        <button style={{ fontSize: 12, color: d.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600, textAlign: "left" }}>Ver factura</button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── Modal: Conectar Google Business ── */}
      {showConnectModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={() => setShowConnectModal(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "relative", background: d.card, border: `1px solid ${d.border}`, borderRadius: 20, width: "100%", maxWidth: 420, padding: "28px 28px 24px", boxShadow: "0 24px 64px rgba(0,0,0,0.5)", animation: "connectModalIn 0.22s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <button onClick={() => setShowConnectModal(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: d.muted, fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 24 }}>
              <div style={{ width: 60, height: 60, background: dark ? "#1e1e1e" : "#f8fafc", border: `1px solid ${d.border}`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: d.text, marginBottom: 6 }}>Conecta tu Google Business</h2>
              <p style={{ fontSize: 13, color: d.muted, lineHeight: 1.6, maxWidth: 320 }}>Sigue estos 3 pasos para empezar a ver y responder tus reseñas.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              {[
                { icon: "🔐", title: "Autoriza el acceso", desc: "Se abrirá Google para que nos des permiso de leer y responder tus reseñas." },
                { icon: "🏢", title: "Elige tu negocio", desc: "Selecciona el perfil de Google Business Profile que quieres conectar." },
                { icon: "✅", title: "¡Listo!", desc: "Tus reseñas aparecerán automáticamente. Puedes activar el Autopiloto cuando quieras." },
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: dark ? "#262626" : "#f1f5f9", border: `1px solid ${d.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{step.icon}</div>
                  <div style={{ paddingTop: 2 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: d.text, marginBottom: 2 }}>{step.title}</div>
                    <div style={{ fontSize: 12, color: d.muted, lineHeight: 1.55 }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: dark ? "rgba(251,188,4,0.07)" : "#fefce8", border: `1px solid ${dark ? "rgba(251,188,4,0.2)" : "#fde68a"}`, borderRadius: 10, padding: "10px 14px", marginBottom: 20, display: "flex", gap: 10 }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>ℹ️</span>
              <p style={{ fontSize: 12, color: dark ? "#c0b060" : "#854d0e", lineHeight: 1.6 }}>
                Solo pedimos acceso de <strong>lectura y respuesta de reseñas</strong>. Nunca publicamos nada sin tu aprobación.
              </p>
            </div>
            <button
              onClick={handleConnectBusiness}
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "13px", background: d.text, border: "none", borderRadius: 12, color: d.bg, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
              onMouseOver={e => e.currentTarget.style.opacity = "0.88"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Conectar con Google Business
            </button>
            <p style={{ textAlign: "center", fontSize: 11, color: d.muted, marginTop: 10 }}>Serás redirigido a Google de forma segura</p>
          </div>
        </div>
      )}

    </div>
  );
}