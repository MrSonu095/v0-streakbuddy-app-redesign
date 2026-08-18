"use client";

import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  isPro?: boolean;
}

const freeGlowVariants = {
  pulse: {
    opacity: [0.35, 0.65, 0.35],
    scale: [1, 1.03, 1],
    transition: {
      duration: 10,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

const premiumWaveVariants = {
  drift: {
    x: ["-10%", "10%", "-10%"],
    y: ["-10%", "10%", "-10%"],
    rotate: [0, 5, 0],
    transition: {
      duration: 12,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

export default function AnimatedBackground({ isPro = false }: AnimatedBackgroundProps) {
  const particles = [
    { top: "12%", left: "18%", size: 8, opacity: 0.5 },
    { top: "22%", left: "72%", size: 6, opacity: 0.45 },
    { top: "48%", left: "35%", size: 10, opacity: 0.6 },
    { top: "72%", left: "60%", size: 7, opacity: 0.4 },
    { top: "80%", left: "28%", size: 5, opacity: 0.35 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {!isPro ? (
        <>
          <motion.div
            className="absolute inset-0"
            variants={freeGlowVariants}
            animate="pulse"
            style={{
              background: "radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.35), transparent 35%), radial-gradient(circle at 70% 70%, rgba(99, 102, 241, 0.2), transparent 30%)",
              filter: "blur(80px)",
              mixBlendMode: "screen",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0))",
            }}
          />
        </>
      ) : (
        <>
          <motion.div
            className="absolute inset-0"
            variants={premiumWaveVariants}
            animate="drift"
            style={{
              background: "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.35), transparent 18%), radial-gradient(circle at 80% 25%, rgba(236, 72, 153, 0.28), transparent 16%), radial-gradient(circle at 50% 80%, rgba(168, 85, 247, 0.25), transparent 20%)",
              filter: "blur(85px)",
              mixBlendMode: "screen",
            }}
          />
          <motion.div
            className="absolute inset-0"
            variants={premiumWaveVariants}
            animate="drift"
            style={{
              background: "linear-gradient(120deg, rgba(16, 185, 129, 0.14) 0%, rgba(59, 130, 246, 0.08) 40%, rgba(236, 72, 153, 0.12) 100%)",
              mixBlendMode: "color-dodge",
            }}
          />
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, transparent 45%, rgba(15, 23, 42, 0.85) 100%)" }} />
          {particles.map((particle, index) => (
            <motion.span
              key={index}
              className="absolute rounded-full bg-white"
              animate={{
                opacity: [particle.opacity, particle.opacity * 0.35, particle.opacity],
                scale: [0.7, 1.1, 0.7],
              }}
              transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
              style={{
                top: particle.top,
                left: particle.left,
                width: particle.size,
                height: particle.size,
                filter: "blur(1px)",
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
