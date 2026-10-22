"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "motion/react";

const fmt = new Intl.NumberFormat("cs-CZ");

export function AnimatedNumber({ value, className, format = (n: number) => fmt.format(n) }: { value: number; className?: string; format?: (n: number) => string }) {
  const spring = useSpring(value, { stiffness: 90, damping: 18 });
  const text = useTransform(spring, (v) => format(Math.round(v)));
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);
  return <motion.span className={className}>{text}</motion.span>;
}
