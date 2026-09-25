import { ImageResponse } from "next/og";

export const alt = "Pablo Sarmiento | Software Empresarial, IA y Ciberseguridad";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 84px",
          background: "linear-gradient(135deg, #08090d 0%, #151720 62%, #10131c 100%)",
          color: "white",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 28,
              background: "rgba(255,255,255,0.08)",
              fontSize: 22,
              fontWeight: 700
            }}
          >
            PS
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
            Pablo Sarmiento
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 74,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 940
            }}
          >
            Sistemas inteligentes para operaciones que no pueden fallar.
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {["Software empresarial", "Soluciones IA", "Ciberseguridad"].map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  border: "1px solid rgba(255,255,255,0.22)",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.07)",
                  fontSize: 24,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.85)"
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 24, color: "rgba(255,255,255,0.55)" }}>
          github.com/pabloios · Machala, Ecuador
        </div>
      </div>
    ),
    size
  );
}
