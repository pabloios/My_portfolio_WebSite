"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

/**
 * Avatar "Pablo AI" con parecido real: usa retratos generados por IA a partir
 * de la foto de Pablo (misma persona, mismo estilo) en varias direcciones de
 * mirada. El componente elige el retrato según la posición del cursor y
 * funde entre ellos con transiciones suaves; además inclina el marco hacia
 * el cursor y desliza la imagen para aproximar la mirada hacia arriba.
 */

const AVATAR_IMAGES = {
  center: "/assets/pablo-avatar-center.jpg",
  left: "/assets/pablo-avatar-left.jpg",
  right: "/assets/pablo-avatar-right.jpg",
  down: "/assets/pablo-avatar-down.jpg"
} as const;

type Gaze = keyof typeof AVATAR_IMAGES;

function pickGaze(nx: number, ny: number): Gaze {
  if (nx < -0.35) {
    return "left";
  }

  if (nx > 0.35) {
    return "right";
  }

  if (ny > 0.45) {
    return "down";
  }

  // Mirar arriba se aproxima con parallax + retrato centrado.
  return "center";
}

export default function AvatarLook() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  // -1..1 relativo al centro del avatar.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const spring = { stiffness: 90, damping: 18, mass: 0.6 };
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);

  // Inclinación del marco y deslizamiento interno para "mirar arriba".
  const tilt = useTransform(x, (v) => v * 6);
  const tiltY = useTransform(y, (v) => v * -4);
  const slideY = useTransform(y, (v) => Math.min(0, v) * -14);
  const slideX = useTransform(x, (v) => v * -10);

  const [gaze, setGaze] = useState<Gaze>("center");

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
        const nx = Math.max(-1, Math.min(1, (event.clientX - cx) / max));
        const ny = Math.max(-1, Math.min(1, (event.clientY - cy) / max));

        rawX.set(nx);
        rawY.set(ny);
        setGaze(pickGaze(nx, ny));
      }

      window.addEventListener("pointermove", onMove, { passive: true });

      return () => window.removeEventListener("pointermove", onMove);
    }

    // Pantallas táctiles: mirada autónoma suave.
    let drift = 0;

    const interval = window.setInterval(() => {
      drift += 1;
      const nx = Math.sin(drift * 1.7) * 0.6 + Math.cos(drift * 0.6) * 0.25;
      const ny = Math.sin(drift * 0.9) * 0.4;

      rawX.set(nx);
      rawY.set(ny);
      setGaze(pickGaze(nx, ny));
    }, 2200);

    return () => window.clearInterval(interval);
  }, [reduced, rawX, rawY]);

  // Precarga para fundidos sin parpadeo.
  useEffect(() => {
    Object.values(AVATAR_IMAGES).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const layers = useMemo(
    () =>
      (Object.entries(AVATAR_IMAGES) as Array<[Gaze, string]>).map(([key, src]) => ({
        key,
        src,
        visible: key === gaze
      })),
    [gaze]
  );

  return (
    <div ref={rootRef} className="avatarLook" aria-hidden="true">
      <motion.div className="avatarTilt" style={{ rotateZ: reduced ? 0 : tilt, y: reduced ? 0 : tiltY }}>
        <div className="avatarFrame">
          <motion.div
            className="avatarSlide"
            style={{ x: reduced ? 0 : slideX, y: reduced ? 0 : slideY }}
          >
            {layers.map((layer) => (
              <motion.img
                key={layer.key}
                src={layer.src}
                alt=""
                draggable={false}
                className="avatarImage"
                initial={false}
                animate={{ opacity: layer.visible ? 1 : 0, scale: layer.visible ? 1.08 : 1.12 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
