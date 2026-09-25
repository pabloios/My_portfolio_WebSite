"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform
} from "motion/react";

/**
 * Retrato vectorial de Pablo en composición grande, construido con los datos
 * medidos de su foto real:
 * - Paleta: cabello #423d40, piel #88675e, camisa #798bab, bigote #5c4d49.
 * - Cabello corto y pegado: la línea superior solo cubre el centro (sienes despejadas).
 * - Rostro ovalado: ancho máximo en pómulos (~42% del encuadre) que se afina
 *   hacia un mentón angosto.
 * - Bigote oscuro y cejas gruesas.
 *
 * Los ojos, cejas, cabeza y torso siguen el cursor con resortes; parpadea solo
 * y, en pantallas táctiles, mira alrededor de forma autónoma.
 */

const HAIR = "#423d40";
const HAIR_LIGHT = "#544d50";
const SKIN = "#88675e";
const SKIN_SHADOW = "#775850";
const BROW = "#35302f";
const STUBBLE = "#4e4442";
const SHIRT = "#798bab";
const SHIRT_DARK = "#63749a";

export default function AvatarLook() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<SVGGElement>(null);

  // -1..1 en ambos ejes, relativo al centro del avatar.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const spring = { stiffness: 120, damping: 14, mass: 0.5 };
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);

  // Amplitudes para lienzo 200x200: los ojos viajan más que la cabeza.
  const eyeX = useTransform(x, (v) => v * 8);
  const eyeY = useTransform(y, (v) => v * 5);
  const pupilX = useTransform(x, (v) => v * 12);
  const pupilY = useTransform(y, (v) => v * 7);
  const browX = useTransform(x, (v) => v * 6.5);
  const browY = useTransform(y, (v) => v * 4);
  const headX = useTransform(x, (v) => v * 14);
  const headY = useTransform(y, (v) => v * 8);
  const faceX = useTransform(x, (v) => v * 5);
  const faceY = useTransform(y, (v) => v * 3);
  const smileY = useTransform(y, (v) => v * 2.5);
  const shirtX = useTransform(x, (v) => v * 7);
  const bodyY = useTransform(y, (v) => v * -3);

  // Parpadeo aleatorio: escala Y del grupo de párpados (ambos ojos a la vez,
  // colapsan hacia su línea central y=96).
  useEffect(() => {
    if (reduced) {
      return;
    }

    let cancelled = false;
    let timer = 0;

    function scheduleBlink() {
      timer = window.setTimeout(() => {
        if (!cancelled && lidRef.current) {
          animate(lidRef.current, { scaleY: [1, 0.06, 1] }, { duration: 0.22, ease: "easeInOut" });
        }

        scheduleBlink();
      }, 2600 + Math.random() * 3400);
    }

    scheduleBlink();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [reduced]);

  // Seguimiento del cursor en toda la ventana. En pantallas táctiles
  // (sin puntero fino), el avatar mira alrededor de forma autónoma.
  useEffect(() => {
    if (reduced) {
      return;
    }

    if (window.matchMedia("(pointer: fine)").matches) {
      function onMove(event: PointerEvent) {
        const node = rootRef.current;

        if (!node) {
          return;
        }

        const rect = node.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const max = Math.max(window.innerWidth, window.innerHeight) * 0.5;

        rawX.set(Math.max(-1, Math.min(1, (event.clientX - cx) / max)));
        rawY.set(Math.max(-1, Math.min(1, (event.clientY - cy) / max)));
      }

      window.addEventListener("pointermove", onMove, { passive: true });

      return () => window.removeEventListener("pointermove", onMove);
    }

    let drift = 0;

    const interval = window.setInterval(() => {
      drift += 1;
      rawX.set(Math.sin(drift * 1.7) * 0.6 + Math.cos(drift * 0.6) * 0.25);
      rawY.set(Math.sin(drift * 0.9) * 0.4);
    }, 1800);

    return () => window.clearInterval(interval);
  }, [reduced, rawX, rawY]);

  return (
    <div ref={rootRef} className="avatarLook" aria-hidden="true">
      <svg viewBox="0 0 200 200" role="presentation">
        <defs>
          <clipPath id="avatar-clip">
            <circle cx="100" cy="100" r="98" />
          </clipPath>
          <linearGradient id="avatar-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#202a38" />
            <stop offset="100%" stopColor="#0e1119" />
          </linearGradient>
          <radialGradient id="avatar-halo" cx="0.5" cy="0.2" r="0.75">
            <stop offset="0%" stopColor="rgba(0, 166, 214, 0.4)" />
            <stop offset="100%" stopColor="rgba(0, 166, 214, 0)" />
          </radialGradient>
        </defs>

        <g clipPath="url(#avatar-clip)">
          <rect x="0" y="0" width="200" height="200" fill="url(#avatar-bg)" />
          <rect x="0" y="0" width="200" height="200" fill="url(#avatar-halo)" />
          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1.2" />
          <circle cx="100" cy="100" r="74" fill="none" stroke="rgba(0,166,214,0.16)" strokeWidth="1.2" />

          {/* Torso y hombros */}
          <motion.g style={{ x: shirtX, y: bodyY }}>
            <path d="M28 212 C30 168 58 148 100 148 C142 148 170 168 172 212 Z" fill={SHIRT} />
            <path d="M84 150 L100 170 L96 148 Z" fill={SHIRT_DARK} />
            <path d="M116 150 L100 170 L104 148 Z" fill={SHIRT_DARK} />
          </motion.g>

          {/* Cabeza */}
          <motion.g style={{ x: headX, y: headY }}>
            {/* Cuello */}
            <rect x="90" y="124" width="20" height="30" rx="9" fill={SKIN_SHADOW} />

            {/* Orejas */}
            <ellipse cx="57" cy="100" rx="7" ry="10" fill="#7d5c54" />
            <ellipse cx="143" cy="100" rx="7" ry="10" fill="#7d5c54" />

            {/* Rostro */}
            <motion.g style={{ x: faceX, y: faceY }}>
              {/* Ovalo con mentón angosto (medido de la foto) */}
              <path
                d="M58 92 C58 58 74 46 100 46 C126 46 142 58 142 92 C142 112 126 132 100 134 C74 132 58 112 58 92 Z"
                fill={SKIN}
              />

              {/* Sombra de barba en la mandíbula */}
              <path
                d="M64 104 C70 126 84 136 100 137 C116 136 130 126 136 104 C134 124 120 140 100 141 C80 140 66 124 64 104 Z"
                fill={STUBBLE}
                opacity="0.2"
              />

              {/* Cabello corto: cubre arriba, sienes despejadas */}
              <path
                d="M60 90 C58 52 76 42 100 42 C124 42 142 52 140 90 C136 66 124 58 100 58 C76 58 64 66 60 90 Z"
                fill={HAIR}
              />
              <path
                d="M62 78 C68 56 80 48 100 48 C120 48 132 56 138 78 C130 62 116 56 100 56 C84 56 70 62 62 78 Z"
                fill={HAIR_LIGHT}
              />
              {/* Patillas cortas */}
              <path d="M60 86 C61 96 62 100 64 104 L60 102 Z" fill={HAIR} opacity="0.85" />
              <path d="M140 86 C139 96 138 100 136 104 L140 102 Z" fill={HAIR} opacity="0.85" />

              {/* Cejas gruesas */}
              <motion.g style={{ x: browX, y: browY }}>
                <rect x="73" y="85" width="21" height="3.6" rx="1.8" fill={BROW} transform="rotate(-4 83.5 86.8)" />
                <rect x="106" y="85" width="21" height="3.6" rx="1.8" fill={BROW} transform="rotate(4 116.5 86.8)" />
              </motion.g>

              {/* Ojos */}
              <motion.g style={{ x: eyeX, y: eyeY }}>
                <g transform="translate(84 96)">
                  <ellipse cx="0" cy="0" rx="8" ry="5.4" fill="#ffffff" />
                  <motion.circle cx="0" cy="0" r="3.6" fill="#2c2624" style={{ x: pupilX, y: pupilY }} />
                  <circle cx="1.4" cy="-1.4" r="1.1" fill="#ffffff" opacity="0.9" />
                </g>
                <g transform="translate(116 96)">
                  <ellipse cx="0" cy="0" rx="8" ry="5.4" fill="#ffffff" />
                  <motion.circle cx="0" cy="0" r="3.6" fill="#2c2624" style={{ x: pupilX, y: pupilY }} />
                  <circle cx="1.4" cy="-1.4" r="1.1" fill="#ffffff" opacity="0.9" />
                </g>

                {/* Párpados: ambos ojos parpadean juntos */}
                <g ref={lidRef} style={{ transformOrigin: "100px 96px" }}>
                  <ellipse cx="84" cy="96" rx="8.6" ry="6" fill={SKIN} />
                  <ellipse cx="116" cy="96" rx="8.6" ry="6" fill={SKIN} />
                </g>
              </motion.g>

              {/* Nariz */}
              <path
                d="M100 100 C97 108 95 112 100 113.5 C105 112 103 108 100 100 Z"
                fill="#6f5049"
                opacity="0.85"
              />

              {/* Bigote */}
              <path d="M86 119 C92 114.5 108 114.5 114 119 C110 122.5 90 122.5 86 119 Z" fill={STUBBLE} />

              {/* Boca: sigue sutilmente la mirada */}
              <motion.path
                d="M91 127 C95 130.5 105 130.5 109 127"
                stroke="#5d4038"
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
                style={{ y: smileY }}
              />
            </motion.g>
          </motion.g>
        </g>
      </svg>
    </div>
  );
}
