"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { HeroSlide } from "@/lib/types";

interface Props {
  slides: HeroSlide[];
}

export default function HeroSlider({ slides }: Props) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? "next" : "prev");
      setCurrent(index);
    },
    [current]
  );

  const goNext = useCallback(() => {
    setDirection("next");
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setDirection("prev");
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden" aria-label="באנרים" aria-roledescription="קרוסלה">
      {/* Slide */}
      <div
        key={slide.id}
        className={`bg-gradient-to-l ${slide.bgGradient} py-16 md:py-28 transition-all duration-500 animate-fade-in`}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-right">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl text-primary/70 mb-8 max-w-lg md:max-w-none">
              {slide.subtitle}
            </p>
            <Link
              href={slide.href}
              className="inline-block bg-primary text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              {slide.cta}
            </Link>
          </div>
          <div className="text-[100px] md:text-[160px] leading-none shrink-0">
            {slide.emoji}
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={goPrev}
        className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/60 hover:bg-white text-primary flex items-center justify-center transition-colors shadow-sm"
        aria-label="הקודם"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <button
        onClick={goNext}
        className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/60 hover:bg-white text-primary flex items-center justify-center transition-colors shadow-sm"
        aria-label="הבא"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 h-3 bg-primary"
                : "w-3 h-3 bg-primary/25 hover:bg-primary/40"
            }`}
            aria-label={`סלייד ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
