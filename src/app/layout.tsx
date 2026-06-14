import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LexMonitor Ecuador",
  description:
    "Plataforma LegalTech para control y monitoreo inteligente de procesos judiciales en Ecuador."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
