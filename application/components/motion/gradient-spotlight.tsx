"use client";

import { motion } from "framer-motion";

import { useReducedMotion } from "./motion-config";

interface GradientSpotlightProps {
  className?: string;
  color?: "cyan" | "green" | "mixed";
  size?: number;
  animate?: boolean;
}

export function GradientSpotlight({
  className,
  color = "cyan",
  size = 400,
  animate = true,
}: GradientSpotlightProps) {
  const reducedMotion = useReducedMotion();

  const getGradient = () => {
    switch (color) {
      case "green":
        return "bg-secondary/15";
      case "mixed":
        return "bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(0,245,255,0.2)_360deg)]";
      default:
        return "bg-primary-container/15";
    }
  };

  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-[120px] ${getGradient()} ${className}`}
      style={{ width: size, height: size }}
      animate={
        animate && !reducedMotion
          ? {
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }
          : undefined
      }
      transition={
        animate && !reducedMotion
          ? {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : undefined
      }
    />
  );
}
