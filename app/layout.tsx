import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pablo Sarmiento | Software Empresarial, IA y Ciberseguridad",
  description:
    "Portfolio de Pablo José Sarmiento Moreno: desarrollador de software empresarial, soluciones IA, automatización y ciberseguridad.",
  openGraph: {
    title: "Pablo Sarmiento | Software Empresarial, IA y Ciberseguridad",
    description:
      "Desarrollo de software empresarial, asistentes IA, automatización, QA y enfoque SOC/ciberseguridad.",
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
