"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

const CounterItem = ({ value, label, hasPlus = true }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const numericValue = useMemo(() => parseInt(value, 10) || 0, [value]);
  const startValue = numericValue > 0 ? 1 : 0;
  const springValue = useSpring(startValue, {
    stiffness: 70,
    damping: 18,
    restDelta: 0.001,
  });
  const displayValue = useTransform(springValue, (latest) =>
    Math.max(startValue, Math.round(latest)),
  );

  useEffect(() => {
    if (isInView) {
      springValue.set(numericValue);
    }
  }, [isInView, numericValue, springValue]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center text-center"
    >
      <div className="flex items-center gap-1 group">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-black text-primary transition-transform duration-500 group-hover:scale-110"
        >
          {displayValue}
        </motion.span>
        {hasPlus && (
          <span className="text-4xl md:text-5xl font-black text-primary/80 mb-2">
            +
          </span>
        )}
      </div>
      <p className="text-slate-600 text-lg md:text-xl font-bold mt-4 tracking-wide uppercase">
        {label}
      </p>
      {/* Decorative line below */}
      <div className="mt-6 w-12 h-1 bg-primary/10 rounded-full group-hover:w-20 group-hover:bg-primary/30 transition-all duration-500"></div>
    </div>
  );
};

const Counter = () => {
  const t = useTranslations("counter");

  const counters = [
    {
      id: "experience",
      value: t("experience"),
      label: t("experienceLabel"),
      hasPlus: true,
    },
    {
      id: "articles",
      value: t("articles"),
      label: t("articlesLabel"),
      hasPlus: true,
    },
    {
      id: "research",
      value: t("research"),
      label: t("researchLabel"),
      hasPlus: true,
    },
  ];

  return (
    <section className="relative py-10 bg-[#FCFDFF] overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 md:gap-12">
          {counters.map((counter) => (
            <CounterItem
              key={counter.id}
              value={counter.value}
              label={counter.label}
              hasPlus={counter.hasPlus}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        section {
          background-image: radial-gradient(
            circle at 50% 50%,
            rgba(197, 160, 89, 0.05) 0%,
            transparent 100%
          );
        }
      `}</style>
    </section>
  );
};

export default Counter;
