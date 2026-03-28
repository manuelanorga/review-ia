"use client";
import { useRouter } from "next/navigation";

const Y = "#FFE600";
const BG = "#0A0A0A";
const TEXT = "#F0F0EC";
const MUTED = "#A0A090";
const LIGHT = "#D8D8D0";
const BORDER = "#2a2800";

export default function Terminos() {
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
        <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "16px 0 8px", color: TEXT }}>Términos de Servicio</h1>
        <p style={{ fontSize: 13, color: MUTED, marginBottom: 48 }}>Última actualización: marzo 2026</p>

        {[
          {
            title: "1. Aceptación de los términos",
            content: "Al registrarte y usar RevGo.app, aceptas estos Términos de Servicio. Si no estás de acuerdo con alguna parte, no debes usar el servicio. Estos términos constituyen un acuerdo legal entre tú y RevGo."
          },
          {
            title: "2. Descripción del servicio",
            content: "RevGo es una plataforma SaaS que utiliza inteligencia artificial para generar y publicar respuestas automáticas a las reseñas de Google de tu negocio. El servicio incluye:\n\n• Respuestas automáticas generadas por IA a reseñas de Google Business Profile\n• Panel de analíticas de reputación\n• Configuración de tonos de respuesta\n• Reportes y exportación de datos\n\nEl servicio está sujeto a disponibilidad y puede modificarse o descontinuarse con previo aviso."
          },
          {
            title: "3. Registro y cuenta",
            content: "Para usar RevGo debes:\n\n• Tener al menos 18 años de edad\n• Proporcionar información veraz al registrarte\n• Ser el propietario o representante autorizado del negocio que conectas\n• Mantener la seguridad de tu cuenta\n\nEres responsable de todas las actividades realizadas desde tu cuenta. Notifícanos inmediatamente si sospechas acceso no autorizado a hola@revgo.app."
          },
          {
            title: "4. Planes y pagos",
            content: "RevGo ofrece planes de suscripción mensual con precios en soles peruanos (S/). Los pagos se procesan de forma segura a través de LemonSqueezy.\n\n• El plan Starter incluye 7 días de prueba gratuita. Se requiere tarjeta de crédito.\n• Los cargos son recurrentes y se cobran mensualmente.\n• Puedes cancelar en cualquier momento desde tu dashboard antes de la fecha de renovación.\n• No realizamos reembolsos por períodos parciales ya facturados.\n• Nos reservamos el derecho de modificar precios con 30 días de aviso previo."
          },
          {
            title: "5. Uso aceptable",
            content: "Te comprometes a usar RevGo únicamente para fines legítimos de gestión de reputación de tu negocio. Está prohibido:\n\n• Usar el servicio para generar reseñas falsas o manipular ratings de Google\n• Publicar respuestas que contengan información falsa, difamatoria o engañosa\n• Intentar acceder a cuentas de otros usuarios\n• Usar el servicio para actividades ilegales o que violen las políticas de Google\n• Revender o sublicenciar el acceso al servicio sin autorización escrita\n\nEl incumplimiento puede resultar en la suspensión o cancelación inmediata de tu cuenta."
          },
          {
            title: "6. Propiedad intelectual",
            content: "RevGo y todo su contenido, tecnología y marca son propiedad de RevGo y están protegidos por leyes de propiedad intelectual. No se te concede ningún derecho sobre la plataforma más allá del uso del servicio según estos términos.\n\nLas respuestas generadas por IA para tu negocio son tuyas. RevGo no reclama propiedad sobre el contenido publicado en nombre de tu negocio."
          },
          {
            title: "7. Limitación de responsabilidad",
            content: "RevGo proporciona el servicio 'tal como está'. No garantizamos resultados específicos en términos de mejora de ratings, posicionamiento en Google Maps ni incremento de clientes.\n\nRevGo no se responsabiliza por:\n\n• Decisiones de Google que afecten la visibilidad de tu perfil\n• Interrupciones del servicio por mantenimiento o causas de fuerza mayor\n• Daños indirectos o consecuentes derivados del uso del servicio\n\nNuestra responsabilidad máxima se limita al monto pagado por el servicio en los últimos 3 meses."
          },
          {
            title: "8. Cancelación y terminación",
            content: "Puedes cancelar tu suscripción en cualquier momento desde tu dashboard en Configuración → Facturación. El acceso se mantiene hasta el final del período ya pagado.\n\nNos reservamos el derecho de suspender o cancelar cuentas que violen estos términos, con o sin previo aviso según la gravedad del incumplimiento."
          },
          {
            title: "9. Cambios a los términos",
            content: "Podemos actualizar estos términos ocasionalmente. Te notificaremos por correo con al menos 30 días de anticipación ante cambios materiales. El uso continuado del servicio constituye aceptación de los nuevos términos."
          },
          {
            title: "10. Ley aplicable",
            content: "Estos términos se rigen por las leyes de la República del Perú. Cualquier disputa será sometida a la jurisdicción de los tribunales de Lima, Perú.\n\nPara consultas legales: hola@revgo.app"
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 36, paddingBottom: 36, borderBottom: i < 9 ? `1px solid ${BORDER}` : "none" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 14, letterSpacing: "-0.02em" }}>{section.title}</h2>
            <p style={{ fontSize: 14, color: LIGHT, lineHeight: 1.85, whiteSpace: "pre-line" }}>{section.content}</p>
          </div>
        ))}
      </div>

      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "24px 6%", textAlign: "center" }}>
        <span style={{ fontSize: 12, color: MUTED }}>© 2026 RevGo · Lima, Perú · <span style={{ cursor: "pointer", color: MUTED }} onClick={() => router.push("/privacidad")}>Privacidad</span> · <span style={{ cursor: "pointer", color: MUTED }} onClick={() => router.push("/contacto")}>Contacto</span></span>
      </footer>
    </div>
  );
}