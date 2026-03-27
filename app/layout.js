import Providers from "./providers";
import Script from "next/script";

export const metadata = {
  title: "RevGo.app",
  description: "Gestiona tus reseñas de Google con IA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          {children}
        </Providers>
        <Script src="https://assets.lemonsqueezy.com/lemon.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}