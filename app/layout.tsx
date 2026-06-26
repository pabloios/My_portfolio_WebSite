import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pablo José Sarmiento Moreno | Cybersecurity & Agentic Engineering",
  description:
    "Portfolio profesional de Pablo José Sarmiento Moreno, perfil junior en ciberseguridad, SOC, automatización y agentic engineering.",
  openGraph: {
    title: "Pablo José Sarmiento Moreno",
    description:
      "Cybersecurity Analyst, SOC Analyst Junior, Agentic Engineer y Programador Junior.",
    type: "website"
  }
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
