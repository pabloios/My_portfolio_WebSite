"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

/**
 * Avatar "Pablo AI" con parecido real (retratos IA generados desde su foto).
 *
 * Movimiento:
 * - Parallax continuo: todo el retrato se desliza hacia el cursor (sensación
 *   de que te sigue) sin cambiar de imagen.
 * - Inclinación 3D del marco (rotateX/rotateY), no giro plano.
 * - Cambio de retrato (left/right/down) solo en zonas claras, con histéresis:
 *   hay que salir bien de la zona para volver al centro, así no parpadea en
 *   los bordes.
 * - Al salir el cursor de la ventana, todo regresa suavemente al centro.
 */

const AVATAR_IMAGES = {
  center: "/assets/pablo-avatar-center.jpg",
  left: "/assets/pablo-avatar-left.jpg",
  right: "/assets/pablo-avatar-right.jpg",
  down: "/assets/pablo-avatar-down.jpg"
} as const;

type Gaze = keyof typeof AVATAR_IMAGES;

export default function AvatarLook() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const gazeRef = useRef<Gaze>("center");

  // -1..1 relativo al centro del avatar.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Muelles suaves: respuesta viva pero sin nerviosismo.
  const x = useSpring(rawX, { stiffness: 70, damping: 15, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 70, damping: 15, mass: 0.5 });

  // El retrato se desplaza dentro del marco fijo: horizontal en espejo
  // (mouse a la derecha, la cara gira a la derecha => la foto va a la
  // izquierda) y vertical hacia el cursor.
  const slideX = useTransform(x, (v) => v * -34);
  const slideY = useTransform(y, (v) => v * 26);

  const [gaze, setGaze] = useState<Gaze>("center");

  useEffect(() => {
    if (reduced) {
      return;
    }

    // Histéresis: entra a una zona al cruzar un umbral lejano y sale en una
    // banda amplia cerca del centro. Evita parpadeos en las fronteras.
    function updateGaze(nx: number, ny: number) {
      const current = gazeRef.current;
      let next = current;

      if (current === "center") {
        if (nx < -0.38) {
          next = "left";
        } else if (nx > 0.38) {
          next = "right";
        } else if (ny > 0.42) {
          next = "down";
        }
      } else {
        const backToCenter =
          (current === "left" && nx > -0.16) ||
          (current === "right" && nx < 0.16) ||
          (current === "down" && ny < 0.2);

        if (backToCenter) {
          next = "center";
        } else if (current === "left" && nx > 0.55) {
          next = "right";
        } else if (current === "right" && nx < -0.55) {
          next = "left";
        }
      }

      if (next !== current) {
        gazeRef.current = next;
        setGaze(next);
      }
    }

    function center() {
      rawX.set(0);
      rawY.set(0);
      gazeRef.current = "center";
      setGaze("center");
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
        // Radio fijo corto: el avatar responde con recorrer ~130px del mouse.
        const radius = 260;
        const nx = Math.max(-1, Math.min(1, (event.clientX - cx) / radius));
        const ny = Math.max(-1, Math.min(1, (event.clientY - cy) / radius));

        rawX.set(nx);
        rawY.set(ny);
        updateGaze(nx, ny);
      }

      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", center);

      return () => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", center);
      };
    }

    // Pantallas táctiles: deriva autónoma lenta.
    let drift = 0;

    const interval = window.setInterval(() => {
      drift += 1;
      const nx = Math.sin(drift * 1.3) * 0.45;
      const ny = Math.sin(drift * 0.7 + 1) * 0.3;

      rawX.set(nx);
      rawY.set(ny);
      updateGaze(nx, ny);
    }, 2600);

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
      <div className="avatarTilt">
        <div className="avatarFrame">
          <motion.div
            className="avatarSlide"
            style={reduced ? undefined : { x: slideX, y: slideY }}
          >
            {layers.map((layer) => (
              <motion.img
                key={layer.key}
                src={layer.src}
                alt=""
                draggable={false}
                className="avatarImage"
                initial={false}
                animate={{ opacity: layer.visible ? 1 : 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
