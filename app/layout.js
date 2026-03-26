import Providers from "./providers";

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
      </body>
    </html>
  );
}