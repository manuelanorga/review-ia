"use client";
import { useRouter } from "next/navigation";

const Y = "#FFE600";
const BG = "#0A0A0A";
const TEXT = "#F0F0EC";
const MUTED = "#A0A090";
const BORDER = "#2a2800";

export default function Terminos() {
  const router = useRouter();

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      {/* Nav */}
      <nav style={{ borderBottom: `1px solid ${BORDER}`, padding: "0 6%", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => router.push("/")} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
          <div style={{ width: 28, height: 28, background: Y, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: BG, fontSize: 13, fontWeight: 700 }}>R</span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>RevGo<span style={{ color: Y }}>.app</span></span>
        </div>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: MUTED, fontSize: 13, cursor: "pointer" }}>← Volver al inicio</button>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 6% 80px" }}>
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, color: Y, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Legal</p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12 }}>Términos de Servicio</h1>
          <p style={{ fontSize: 14, color: MUTED }}>Última actualización: 31 de marzo de 2026</p>
        </div>

        {[
          {
            title: "1. Aceptación de los términos",
            content: `Al registrarte y usar RevGo.app ("el Servicio"), aceptas estos Términos de Servicio. Si no estás de acuerdo con alguna parte, no uses el Servicio.\n\nRevGo.app es operado por Manuel Anorga, Lima, Perú. Puedes contactarnos en soporte@revgo.app.`
          },
          {
            title: "2. Descripción del servicio",
            content: `RevGo es una plataforma SaaS que permite a negocios:\n\n• Visualizar y gestionar reseñas de Google Business Profile\n• Generar respuestas automáticas o asistidas por inteligencia artificial\n• Publicar respuestas directamente en Google Business Profile\n• Activar un modo "Autopiloto" para responder reseñas automáticamente\n• Generar códigos QR para captar más reseñas\n\nEl Servicio requiere que el usuario conecte su cuenta de Google Business Profile mediante OAuth 2.0.`
          },
          {
            title: "3. Registro y cuenta",
            content: `Para usar RevGo debes:\n\n• Tener al menos 18 años de edad\n• Proporcionar información veraz y actualizada al registrarte\n• Mantener la confidencialidad de tu cuenta\n• Ser el propietario o tener autorización del propietario del Google Business Profile que conectes\n\nEres responsable de todas las actividades que ocurran bajo tu cuenta.`
          },
          {
            title: "4. Uso de Google Business Profile API",
            content: `Al conectar tu Google Business Profile a RevGo, autorizas expresamente a RevGo a:\n\n• Leer las reseñas de tu perfil de negocio\n• Publicar respuestas a reseñas en tu nombre cuando uses la función manual o actives el Autopiloto\n\nRevGo NO está autorizado a:\n\n• Modificar la información de tu perfil de negocio (nombre, dirección, horarios, etc.)\n• Publicar fotos, posts o cualquier otro contenido fuera de respuestas a reseñas\n• Acceder a datos de otros negocios que no hayas conectado explícitamente\n\nEl uso de la API de Google Business Profile está sujeto adicionalmente a los Términos de Servicio de Google.`
          },
          {
            title: "5. Autopiloto",
            content: `La función de Autopiloto permite que RevGo publique respuestas automáticamente en tu nombre. Al activar esta función:\n\n• Confirmas que has revisado y aprobado el tono y estilo de respuestas configurado\n• Aceptas que las respuestas generadas por IA y publicadas automáticamente son tu responsabilidad\n• Puedes desactivar el Autopiloto en cualquier momento desde tu panel\n• RevGo no se hace responsable por respuestas publicadas mientras el Autopiloto esté activo`
          },
          {
            title: "6. Planes y pagos",
            content: `RevGo ofrece planes de suscripción mensual procesados por LemonSqueezy:\n\n• Starter ($9 USD/mes): 1 negocio, hasta 50 reseñas/mes\n• Growth ($29 USD/mes): hasta 3 negocios, hasta 300 reseñas/mes\n• Pro ($59 USD/mes): negocios ilimitados, reseñas ilimitadas\n• Agencia ($160 USD/mes): multi-cuenta, white label\n\nLos precios pueden cambiar con 30 días de aviso previo. Las suscripciones se renuevan automáticamente. Puedes cancelar en cualquier momento desde tu panel sin penalidades. No se realizan reembolsos por períodos parciales.`
          },
          {
            title: "7. Prueba gratuita",
            content: `El plan Starter incluye 7 días de prueba gratuita. Se requiere tarjeta de crédito para activar la prueba. Si no cancelas antes del día 7, se realizará el cargo correspondiente al plan seleccionado. Puedes cancelar en cualquier momento desde tu panel.`
          },
          {
            title: "8. Uso aceptable",
            content: `Aceptas no usar RevGo para:\n\n• Publicar respuestas falsas, engañosas o difamatorias\n• Violar los Términos de Servicio de Google\n• Intentar acceder a cuentas de otros usuarios\n• Usar el servicio para actividades ilegales\n• Generar contenido que viole derechos de terceros\n• Hacer ingeniería inversa o intentar extraer el código fuente del Servicio`
          },
          {
            title: "9. Propiedad intelectual",
            content: `RevGo y todos sus componentes (código, diseño, marca, logotipos) son propiedad de Manuel Anorga. Al usar el Servicio, no adquieres ningún derecho de propiedad sobre el mismo.\n\nEl contenido que generes (respuestas a reseñas) es tuyo. RevGo no reclama propiedad sobre el contenido que publicas en Google Business Profile.`
          },
          {
            title: "10. Limitación de responsabilidad",
            content: `RevGo se proporciona "tal como está". No garantizamos que el Servicio esté libre de errores o disponible de forma ininterrumpida.\n\nRevGo no es responsable por:\n\n• Cambios en la API de Google Business Profile que afecten la disponibilidad del Servicio\n• Respuestas publicadas mediante el Autopiloto\n• Pérdida de datos por causas fuera de nuestro control\n• Daños indirectos, incidentales o consecuentes derivados del uso del Servicio\n\nLa responsabilidad máxima de RevGo se limita al monto pagado en los últimos 3 meses de suscripción.`
          },
          {
            title: "11. Cancelación y terminación",
            content: `Puedes cancelar tu cuenta en cualquier momento desde tu panel. Al cancelar:\n\n• Mantienes acceso al Servicio hasta el final del período pagado\n• Tus datos se eliminan en un plazo máximo de 30 días\n\nRevGo puede suspender o terminar tu cuenta si:\n\n• Violas estos Términos de Servicio\n• Tu cuenta presenta actividad fraudulenta o sospechosa\n• Tu pago falla reiteradamente`
          },
          {
            title: "12. Cambios al servicio",
            content: `RevGo puede modificar, suspender o discontinuar cualquier parte del Servicio con aviso previo de 30 días. Para cambios significativos, te notificaremos por correo electrónico.`
          },
          {
            title: "13. Ley aplicable",
            content: `Estos Términos se rigen por las leyes de la República del Perú. Cualquier disputa será sometida a la jurisdicción de los tribunales de Lima, Perú.`
          },
          {
            title: "14. Contacto",
            content: `Para cualquier consulta sobre estos Términos:\n\nRevGo.app\nLima, Perú\nsoporte@revgo.app\nWhatsApp: +51 931 067 775`
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 36, paddingBottom: 36, borderBottom: i < 13 ? `1px solid ${BORDER}` : "none" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 14, letterSpacing: "-0.02em" }}>{section.title}</h2>
            <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.8, whiteSpace: "pre-line" }}>{section.content}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: "24px 6%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontSize: 12, color: MUTED }}>© 2026 RevGo · Lima, Perú</span>
        <div style={{ display: "flex", gap: 24 }}>
          <span onClick={() => router.push("/privacidad")} style={{ fontSize: 13, color: MUTED, cursor: "pointer" }}>Política de Privacidad</span>
          <span onClick={() => router.push("/")} style={{ fontSize: 13, color: MUTED, cursor: "pointer" }}>Inicio</span>
        </div>
      </div>
    </div>
  );
}