import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pablo Sarmiento | Software Empresarial, IA y Ciberseguridad",
    template: "%s | Pablo Sarmiento"
  },
  description:
    "Portfolio de Pablo José Sarmiento Moreno: desarrollador de software empresarial, soluciones IA, automatización y ciberseguridad.",
  keywords: [
    "Pablo Sarmiento",
    "SOC analyst junior",
    "ciberseguridad Ecuador",
    "automatización CRM",
    "agentic engineering",
    "desarrollador Next.js",
    "QA funcional",
    "Machala"
  ],
  authors: [{ name: "Pablo José Sarmiento Moreno" }],
  creator: "Pablo José Sarmiento Moreno",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Pablo Sarmiento | Software Empresarial, IA y Ciberseguridad",
    description:
      "Desarrollo de software empresarial, asistentes IA, automatización, QA y enfoque SOC/ciberseguridad.",
    url: siteUrl,
    siteName: "Pablo Sarmiento Portfolio",
    locale: "es_EC",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Pablo Sarmiento | Software Empresarial, IA y Ciberseguridad",
    description:
      "Desarrollo de software empresarial, asistentes IA, automatización, QA y enfoque SOC/ciberseguridad."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" }
  }
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pablo José Sarmiento Moreno",
  alternateName: "Pablo Sarmiento",
  jobTitle: "Software Empresarial, Soluciones IA y Ciberseguridad",
  email: "mailto:pablo521@hotmail.com",
  url: siteUrl,
  image: `${siteUrl}/assets/pablo-profile.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Machala",
    addressCountry: "EC"
  },
  knowsLanguage: ["es", "en", "de"],
  knowsAbout: [
    "Ciberseguridad",
    "SOC",
    "SIEM",
    "Análisis de logs",
    "Respuesta ante incidentes",
    "Automatización de procesos",
    "Agentic engineering",
    "Next.js",
    "QA funcional"
  ],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Universidad Internacional de La Rioja (UNIR)" },
    { "@type": "CollegeOrUniversity", name: "Laneway Education" },
    { "@type": "CollegeOrUniversity", name: "ESPOL" }
  ],
  sameAs: [
    "https://github.com/pabloios",
    "https://linkedin.com/in/pablo-jos%C3%A9-sarmiento-moreno-7041b0119"
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
