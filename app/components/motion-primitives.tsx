"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type MotionValue,
  type Variants
} from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Motion primitives shared by every animated section.
 * The spring + blur language follows Apple product pages:
 * elements decelerate softly, never bounce cartoonishly.
 */

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: number;
  once?: boolean;
  amount?: number;
};

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 32,
  blur = 10,
  once = true,
  amount = 0.25
}: FadeInProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  step?: number;
  y?: number;
  once?: boolean;
  amount?: number;
  as?: "div" | "ul" | "ol";
  itemAs?: "div" | "li" | "article";
};
const CONTAINER_TAGS = { div: motion.div, ul: motion.ul, ol: motion.ol } as const;
const ITEM_TAGS = { div: motion.div, li: motion.li, article: motion.article } as const;

export function Stagger({
  children,
  className,
  step = 0.12,
  y = 36,
  once = true,
  amount = 0.2,
  as = "div",
  itemAs = "div"
}: StaggerProps) {
  const reduced = useReducedMotion();

  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : step } }
  };

  const item: Variants = {
    hidden: { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: EASE_OUT }
    }
  };

  const Container = CONTAINER_TAGS[as];
  const Item = ITEM_TAGS[itemAs];
  const items = Array.isArray(children) ? children : [children];

  return (
    <Container
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: Math.min(amount, 0.15) }}
    >
      {items.map((child, index) => (
        <Item key={index} variants={item} className="staggerItem">
          {child}
        </Item>
      ))}
    </Container>
  );
}

/**
 * Parallax con scroll: el contenido se desplaza y desvanece suavemente
 * mientras su sección sale del viewport (estilo product page de Apple).
 * El wrapper externo mide la posición; solo el hijo interno se transforma.
 */
type ScrollDriftProps = {
  children: ReactNode;
  className?: string;
  distance?: number;
  fadeTo?: number;
};

export function ScrollDrift({
  children,
  className,
  distance = 80,
  fadeTo = 0.2
}: ScrollDriftProps) {
  const reduced = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end start"]
  });
  const rawY = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const y = useSpring(rawY, { stiffness: 140, damping: 30, mass: 0.35 });
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, fadeTo]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className} ref={outerRef}>
      <motion.div style={{ y, opacity }}>{children}</motion.div>
    </div>
  );
}

type ScrollWordsProps = {
  text: string;
  className?: string;
};

/**
 * Apple-style scroll-linked statement: each word lights up progressively
 * while the paragraph travels through the viewport. It is fully driven by
 * scroll position — reversible, smooth, and never runs on its own clock.
 */
export function ScrollWords({ text, className }: ScrollWordsProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // Empieza cuando el párrafo entra por abajo y termina cuando su borde
    // inferior alcanza el 55% del viewport: revela durante toda la lectura.
    offset: ["start 0.85", "end 0.55"]
  });

  const words = text.split(" ");

  if (reduced) {
    return <p className={className}>{text}</p>;
  }

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <ScrollWord
          key={`${word}-${index}`}
          progress={scrollYProgress}
          range={[index / words.length, (index + 1) / words.length]}
        >
          {word}
        </ScrollWord>
      ))}
    </p>
  );
}

function ScrollWord({
  children,
  progress,
  range
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [12, 0]);

  return (
    <motion.span className="scrollWord" style={{ opacity, y }}>
      {children}
      {"\u00A0"}
    </motion.span>
  );
}

type ScrollScaleProps = {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
};

/**
 * Apple product-tile effect: the block grows from slightly scaled down
 * to full size while it enters the viewport.
 */
export function ScrollScale({
  children,
  className,
  from = 0.92,
  to = 1
}: ScrollScaleProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: from, y: 48, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, scale: to, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

type MotionLinkProps = Omit<HTMLMotionProps<"a">, "children"> & {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
};

/**
 * Button with a physical press: springs down on tap, springs back on release.
 */
export function MotionLink({ variant = "primary", children, className, ...rest }: MotionLinkProps) {
  return (
    <motion.a
      className={`button ${variant}${className ? ` ${className}` : ""}`}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ y: 1, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      {...rest}
    >
      {children}
    </motion.a>
  );
}
