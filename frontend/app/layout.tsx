import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import BottomNav from "./components/BottomNav";

export const metadata = {
  title: "Nutriabb",
  description: "Seguimiento nutricional",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
        <AuthProvider>
          {children}
          {/* Barra de navegación inferior */}
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
