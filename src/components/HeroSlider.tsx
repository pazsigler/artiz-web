"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroSlide } from "@/lib/types";

interface Props {
  slides: HeroSlide[];
}

export default function HeroSlider({ slides }: Props) {
  const [current, setCurrent] = useState(0);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  return (
    <section className="relative overflow-hidden" aria-label="באנרים" aria-roledescription="קרוסלה">
      {/* All slides stacked absolutely, only current visible */}
      <div className="relative h-[350px] md:h-[500px]">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
          aria-hidden={i !== current}
        >
          {/* Background images */}
          {slide.imageMobile && (
            <Image
              src={slide.imageMobile}
              alt=""
              fill
              className="object-cover md:hidden"
              priority={i === 0}
            />
          )}
          {slide.imageDesktop && (
            <Image
              src={slide.imageDesktop}
              alt=""
              fill
              className="object-cover hidden md:block"
              priority={i === 0}
            />
          )}
          {/* Fallback background when no image */}
          {!slide.imageDesktop && !slide.imageMobile && (
            <div className="absolute inset-0 bg-gradient-to-l from-pink/20 to-sky/20" />
          )}
          {/* Dark overlay for text readability */}
          {(slide.imageDesktop || slide.imageMobile) && (
            <div className="absolute inset-0 bg-black/30" />
          )}

          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center md:items-start relative z-10 h-full justify-center">
            <div className="text-center md:text-right max-w-2xl">
              <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${
                slide.imageDesktop || slide.imageMobile ? "text-white drop-shadow-lg" : "text-primary"
              }`}>
                {slide.title}
              </h1>
              <p className={`text-lg md:text-xl mb-8 ${
                slide.imageDesktop || slide.imageMobile ? "text-white/90 drop-shadow" : "text-primary/70"
              }`}>
                {slide.subtitle}
              </p>
              <Link
                href={slide.href}
                className={`inline-block px-8 py-3 rounded-full text-lg font-semibold transition-colors shadow-lg ${
                  slide.imageDesktop || slide.imageMobile
                    ? "bg-white text-primary hover:bg-white/90"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        </div>
      ))}
      </div>

      {/* Arrows */}
      <button
        onClick={goPrev}
        className="absolute top-1/2 right-3 -translate-y-1/2 w-8 h-8 rounded-full bg-white/60 hover:bg-white text-primary flex items-center justify-center transition-colors shadow-sm z-20"
        aria-label="הקודם"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <button
        onClick={goNext}
        className="absolute top-1/2 left-3 -translate-y-1/2 w-8 h-8 rounded-full bg-white/60 hover:bg-white text-primary flex items-center justify-center transition-colors shadow-sm z-20"
        aria-label="הבא"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 h-3 bg-white"
                : "w-3 h-3 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`סלייד ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
