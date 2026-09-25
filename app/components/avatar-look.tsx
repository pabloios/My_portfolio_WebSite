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
 * Avatar vectorial de Pablo construido con la paleta muestreada de su foto
 * real (cabello #423d40, piel #88675e, camisa #78849f). Los ojos, cejas,
 * cabeza y boca siguen el cursor con resortes; parpadea solo y, en pantallas
 * táctiles, mira alrededor de forma autónoma.
 */

const HAIR = "#423d40";
const SKIN = "#88675e";
const SHIRT = "#78849f";

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

  // Amplitudes: los ojos viajan más que la cabeza, la cara menos que el torso.
  const eyeOffsetX = useTransform(x, (v) => v * 5.2);
  const eyeOffsetY = useTransform(y, (v) => v * 3.4);
  const pupilX = useTransform(x, (v) => v * 7.6);
  const pupilY = useTransform(y, (v) => v * 4.6);
  const browX = useTransform(x, (v) => v * 4.2);
  const browY = useTransform(y, (v) => v * 2.6);
  const headX = useTransform(x, (v) => v * 9);
  const headY = useTransform(y, (v) => v * 5);
  const faceX = useTransform(x, (v) => v * 3.4);
  const faceY = useTransform(y, (v) => v * 2);
  const smileY = useTransform(y, (v) => v * 1.6);
  const shirtX = useTransform(x, (v) => v * 4);
  const bodyY = useTransform(y, (v) => v * -1.5);

  // Parpadeo aleatorio: escala Y del grupo de párpados (colapsa ambos ojos
  // hacia su propia línea central y=47).
  useEffect(() => {
    if (reduced) {
      return;
    }

    let cancelled = false;
    let timer = 0;

    function scheduleBlink() {
      timer = window.setTimeout(() => {
        if (!cancelled && lidRef.current) {
          animate(lidRef.current, { scaleY: [1, 0.08, 1] }, { duration: 0.22, ease: "easeInOut" });
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
      <svg viewBox="0 0 120 120" role="presentation">
        <defs>
          <clipPath id="avatar-clip">
            <rect x="0" y="0" width="120" height="120" rx="26" />
          </clipPath>
          <linearGradient id="avatar-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1d2531" />
            <stop offset="100%" stopColor="#10141c" />
          </linearGradient>
          <radialGradient id="avatar-halo" cx="0.5" cy="0.24" r="0.7">
            <stop offset="0%" stopColor="rgba(0, 166, 214, 0.35)" />
            <stop offset="100%" stopColor="rgba(0, 166, 214, 0)" />
          </radialGradient>
        </defs>

        <g clipPath="url(#avatar-clip)">
          <rect x="0" y="0" width="120" height="120" fill="url(#avatar-bg)" />
          <rect x="0" y="0" width="120" height="120" fill="url(#avatar-halo)" />

          {/* Torso */}
          <motion.g style={{ x: shirtX, y: bodyY }}>
            <path d="M28 122 C28 96 44 84 60 84 C76 84 92 96 92 122 Z" fill={SHIRT} />
            <path d="M52 86 L60 96 L68 86 C68 86 64 90 60 90 C56 90 52 86 52 86 Z" fill="#5f6c85" />
          </motion.g>

          {/* Cabeza */}
          <motion.g style={{ x: headX, y: headY }}>
            <rect x="53" y="72" width="14" height="14" rx="6" fill="#775850" />
            <ellipse cx="34" cy="52" rx="5" ry="7" fill="#7d5c54" />
            <ellipse cx="86" cy="52" rx="5" ry="7" fill="#7d5c54" />

            {/* Rostro */}
            <motion.g style={{ x: faceX, y: faceY }}>
              <ellipse cx="60" cy="48" rx="26" ry="29" fill={SKIN} />

              {/* Cabello */}
              <path
                d="M32 46 C30 22 46 14 60 14 C74 14 90 22 88 46 C88 34 80 28 60 28 C40 28 32 34 32 46 Z"
                fill={HAIR}
              />
              <path
                d="M33 40 C36 26 48 18 60 18 C72 18 84 26 87 40 C80 30 70 26 60 26 C50 26 40 30 33 40 Z"
                fill="#524b4e"
              />

              {/* Cejas */}
              <motion.g style={{ x: browX, y: browY }}>
                <rect x="41" y="38" width="13" height="2.6" rx="1.3" fill={HAIR} />
                <rect x="66" y="38" width="13" height="2.6" rx="1.3" fill={HAIR} />
              </motion.g>

              {/* Ojos */}
              <motion.g style={{ x: eyeOffsetX, y: eyeOffsetY }}>
                <g transform="translate(47.5 47)">
                  <ellipse cx="0" cy="0" rx="6.4" ry="4.6" fill="#ffffff" />
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="2.9"
                    fill="#2c2624"
                    style={{ x: pupilX, y: pupilY }}
                  />
                  <circle cx="1.1" cy="-1.2" r="0.9" fill="#ffffff" opacity="0.9" />
                </g>
                <g transform="translate(72.5 47)">
                  <ellipse cx="0" cy="0" rx="6.4" ry="4.6" fill="#ffffff" />
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="2.9"
                    fill="#2c2624"
                    style={{ x: pupilX, y: pupilY }}
                  />
                  <circle cx="1.1" cy="-1.2" r="0.9" fill="#ffffff" opacity="0.9" />
                </g>

                {/* Párpados: ambos ojos parpadean juntos */}
                <g ref={lidRef} style={{ transformOrigin: "60px 47px" }}>
                  <ellipse cx="47.5" cy="47" rx="7" ry="5.2" fill={SKIN} />
                  <ellipse cx="72.5" cy="47" rx="7" ry="5.2" fill={SKIN} />
                </g>
              </motion.g>

              {/* Nariz */}
              <path
                d="M60 52 C58.5 56 57 58 60 58.6 C63 58 61.5 56 60 52 Z"
                fill="#6f5049"
                opacity="0.85"
              />

              {/* Boca: sigue sutilmente la mirada */}
              <motion.path
                d="M52.5 64 C56 67.4 64 67.4 67.5 64"
                stroke="#5d4038"
                strokeWidth="2.4"
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
