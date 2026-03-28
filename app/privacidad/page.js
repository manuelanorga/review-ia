"use client";
import { useRouter } from "next/navigation";

const Y = "#FFE600";
const BG = "#0A0A0A";
const SURF = "#111100";
const TEXT = "#F0F0EC";
const MUTED = "#A0A090";
const LIGHT = "#D8D8D0";
const BORDER = "#2a2800";

export default function Privacidad() {
  const router = useRouter();
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

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "100px 6% 80px" }}>
        <span style={{ fontSize: 11, color: Y, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>Legal</span>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "16px 0 8px", color: TEXT }}>Política de Privacidad</h1>
        <p style={{ fontSize: 13, color: MUTED, marginBottom: 48 }}>Última actualización: marzo 2026</p>

        {[
          {
            title: "1. Quiénes somos",
            content: "RevGo.app es un servicio de gestión automatizada de reseñas de Google para negocios, operado desde Lima, Perú. Nos comprometemos a proteger la privacidad de nuestros usuarios y a tratar sus datos con responsabilidad y transparencia."
          },
          {
            title: "2. Datos que recopilamos",
            content: "Recopilamos únicamente la información necesaria para brindarte el servicio:\n\n• Nombre y correo electrónico (a través de Google OAuth al registrarte)\n• Información de tu negocio que ingresas voluntariamente (nombre, rubro, sitio web)\n• Datos de uso de la plataforma (reseñas gestionadas, respuestas generadas)\n• Información de facturación procesada de forma segura a través de LemonSqueezy\n\nNo tenemos acceso a tu contraseña de Google en ningún momento."
          },
          {
            title: "3. Cómo usamos tus datos",
            content: "Usamos tu información exclusivamente para:\n\n• Brindarte el servicio de gestión de reseñas con IA\n• Personalizar las respuestas generadas según el tono de tu marca\n• Enviarte notificaciones sobre tu cuenta y el servicio\n• Mejorar la calidad y precisión de nuestras respuestas con IA\n• Procesar tus pagos de forma segura\n\nNunca vendemos, alquilamos ni compartimos tus datos personales con terceros con fines comerciales."
          },
          {
            title: "4. Google OAuth y permisos",
            content: "Al conectar tu Google Business Profile, utilizamos el protocolo OAuth de Google. Esto significa que Google actúa como intermediario seguro y nosotros recibimos únicamente los permisos necesarios para leer y responder reseñas. Nunca vemos ni almacenamos tu contraseña de Google. Puedes revocar este acceso en cualquier momento desde tu cuenta de Google."
          },
          {
            title: "5. Almacenamiento y seguridad",
            content: "Tus datos se almacenan en servidores seguros a través de Supabase, con cifrado en tránsito (HTTPS/TLS) y en reposo. Implementamos medidas técnicas y organizativas para proteger tu información contra acceso no autorizado, pérdida o alteración."
          },
          {
            title: "6. Cookies",
            content: "Usamos cookies esenciales para el funcionamiento del servicio (autenticación de sesión). No usamos cookies de seguimiento ni publicitarias. Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar el funcionamiento de la plataforma."
          },
          {
            title: "7. Tus derechos",
            content: "Tienes derecho a:\n\n• Acceder a los datos personales que tenemos sobre ti\n• Solicitar la corrección de datos inexactos\n• Solicitar la eliminación de tu cuenta y datos\n• Exportar tus datos en formato portable\n• Revocar el acceso a tu Google Business en cualquier momento\n\nPara ejercer cualquiera de estos derechos, contáctanos a hola@revgo.app."
          },
          {
            title: "8. Retención de datos",
            content: "Conservamos tus datos mientras tu cuenta esté activa. Si cancelas tu suscripción, conservamos tus datos por 30 días adicionales para permitirte reactivar tu cuenta. Tras ese período, eliminamos permanentemente tu información personal."
          },
          {
            title: "9. Cambios a esta política",
            content: "Podemos actualizar esta política ocasionalmente. Te notificaremos por correo electrónico ante cambios significativos. El uso continuado del servicio tras los cambios implica aceptación de la nueva política."
          },
          {
            title: "10. Contacto",
            content: "Si tienes preguntas sobre esta política o sobre cómo tratamos tus datos, escríbenos a hola@revgo.app o contáctanos por WhatsApp al +51 931 067 775."
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 36, paddingBottom: 36, borderBottom: i < 9 ? `1px solid ${BORDER}` : "none" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 14, letterSpacing: "-0.02em" }}>{section.title}</h2>
            <p style={{ fontSize: 14, color: LIGHT, lineHeight: 1.85, whiteSpace: "pre-line" }}>{section.content}</p>
          </div>
        ))}
      </div>

      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "24px 6%", textAlign: "center" }}>
        <span style={{ fontSize: 12, color: MUTED }}>© 2026 RevGo · Lima, Perú · <span style={{ cursor: "pointer", color: MUTED }} onClick={() => router.push("/terminos")}>Términos</span> · <span style={{ cursor: "pointer", color: MUTED }} onClick={() => router.push("/contacto")}>Contacto</span></span>
      </footer>
    </div>
  );
}