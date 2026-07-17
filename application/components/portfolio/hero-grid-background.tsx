"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect } from "react";

import { useReducedMotion } from "@/components/motion/motion-config";

const HERO_ID = "hero";

const HILL_LAYERS = [
  { scale: 1.6, radius: 100, opacity: 1.6 },
  { scale: 1.35, radius: 190, opacity: 1.35 },
  { scale: 1.26, radius: 290, opacity: 1.2 },
];

interface HillLayerProps {
  scale: number;
  radius: number;
  opacity: number;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  springOpacity: MotionValue<number>;
}

function HillLayer({
  scale,
  radius,
  opacity,
  springX,
  springY,
  springOpacity,
}: HillLayerProps) {
  const layerOpacity = useTransform(
    springOpacity,
    (latest) => latest * opacity,
  );
  const transformOrigin = useMotionTemplate`${springX}px ${springY}px`;
  const mask = useMotionTemplate`radial-gradient(circle ${radius}px at ${springX}px ${springY}px, rgb(0 0 0 / 100%) 0%, rgb(0 0 0 / 35%) 65%, transparent 100%)`;

  return (
    <motion.div
      className="absolute inset-0 grid-lines"
      style={{
        opacity: layerOpacity,
        transformOrigin,
        transform: `scale(${scale})`,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}

export function HeroGridBackground() {
  const reducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const opacity = useMotionValue(0);

  const springConfig = { stiffness: 120, damping: 25 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  const springOpacity = useSpring(opacity, { stiffness: 200, damping: 30 });

  useEffect(() => {
    if (reducedMotion) {
      opacity.set(0);
      return;
    }

    const hero = document.getElementById(HERO_ID);
    if (!hero) return;

    const handleMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      opacity.set(inside ? 1 : 0);

      if (inside) {
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY, opacity, reducedMotion]);

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 grid-lines" />
      {HILL_LAYERS.map((layer, index) => (
        <HillLayer
          key={index}
          scale={layer.scale}
          radius={layer.radius}
          opacity={layer.opacity}
          springX={springX}
          springY={springY}
          springOpacity={springOpacity}
        />
      ))}
    </div>
  );
}
