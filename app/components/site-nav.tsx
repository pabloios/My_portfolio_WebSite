"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "./motion-primitives";

const links = [
  { href: "#especialidades", label: "Especialidades" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#trayectoria", label: "Trayectoria" },
  { href: "#gemelo-ia", label: "Pablo AI" }
] as const;

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`topbar${scrolled ? " scrolled" : ""}`}
      aria-label="Navegación principal"
      initial={reduced ? false : { y: -56, opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ y: 0, opacity: 1, backdropFilter: "blur(20px)" }}
      transition={{ duration: 1, delay: 0.35, ease: EASE_OUT }}
    >
      <motion.a
        className="brand"
        href="#top"
        aria-label="Inicio"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        <span>PS</span>
        <strong>Pablo Sarmiento</strong>
      </motion.a>

      <div className="navlinks">
        {links.map((link, index) => (
          <motion.a
            key={link.href}
            href={link.href}
            initial={reduced ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 + index * 0.08, ease: EASE_OUT }}
          >
            {link.label}
          </motion.a>
        ))}
      </div>
    </motion.nav>
  );
}
