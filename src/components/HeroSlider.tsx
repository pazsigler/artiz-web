"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroSlide } from "@/lib/types";

interface Props {
  slides: HeroSlide[];
}

// Rotating gradient themes for each slide
const themes = [
  {
    gradient: "linear-gradient(135deg, #384850 0%, #2d3d44 30%, #1a2a30 60%, #384850 100%)",
    accent: "bg-pink/20",
    accent2: "bg-sky/15",
    accent3: "bg-purple-soft/10",
    btnBg: "bg-pink hover:bg-pink/90",
    btnText: "text-white",
    dotActive: "bg-pink",
  },
  {
    gradient: "linear-gradient(135deg, #1a2a30 0%, #2a3840 30%, #384850 60%, #1a2a30 100%)",
    accent: "bg-sky/25",
    accent2: "bg-teal/15",
    accent3: "bg-green-soft/10",
    btnBg: "bg-sky hover:bg-sky/90",
    btnText: "text-primary",
    dotActive: "bg-sky",
  },
  {
    gradient: "linear-gradient(135deg, #2d3040 0%, #352d42 30%, #1e1a2a 60%, #2d3040 100%)",
    accent: "bg-lavender/25",
    accent2: "bg-purple-soft/15",
    accent3: "bg-pink/10",
    btnBg: "bg-lavender hover:bg-lavender/90",
    btnText: "text-primary",
    dotActive: "bg-lavender",
  },
  {
    gradient: "linear-gradient(135deg, #2a3530 0%, #1e2e28 30%, #1a2820 60%, #2a3530 100%)",
    accent: "bg-green-soft/25",
    accent2: "bg-teal/15",
    accent3: "bg-yellow-soft/10",
    btnBg: "bg-green-soft hover:bg-green-soft/90",
    btnText: "text-primary",
    dotActive: "bg-green-soft",
  },
];

export default function HeroSlider({ slides }: Props) {
  const [current, setCurrent] = useState(0);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext]);

  if (slides.length === 0) return null;

  const activeTheme = themes[current % themes.length];

  return (
    <section className="relative overflow-hidden" aria-label="באנרים" aria-roledescription="קרוסלה">
      <div className="relative h-[420px] md:h-[520px]">

        {/* All slides stacked — crossfade between them */}
        {slides.map((slide, i) => {
          const theme = themes[i % themes.length];
          const productImage = slide.imageDesktop || slide.imageMobile;
          const isActive = i === current;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              {/* Gradient background */}
              <div
                className="absolute inset-0 hero-gradient-animate"
                style={{ backgroundImage: theme.gradient, backgroundSize: "200% 200%" }}
              />

              {/* Animated background shapes */}
              <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full ${theme.accent} blur-3xl hero-float`} />
                <div className={`absolute bottom-[-60px] right-[20%] w-[300px] h-[300px] rounded-full ${theme.accent2} blur-2xl hero-float-delayed`} />
                <div className={`absolute top-[30%] left-[40%] w-[200px] h-[200px] rounded-full ${theme.accent3} blur-2xl hero-float-slow`} />
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(255,255,255,0.5) 60px, rgba(255,255,255,0.5) 61px)`,
                }} />
                <div className="absolute inset-0 opacity-[0.04]" style={{
                  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }} />
              </div>

              {/* Content */}
              <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center relative z-10">
                <div className="flex flex-col md:flex-row items-center w-full gap-4 md:gap-8">

                  {/* Text - right side in RTL */}
                  <div className={`flex-1 text-center md:text-right order-2 md:order-1 transition-all duration-1000 delay-200 ${
                    isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                  }`}>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-5 leading-tight drop-shadow-sm">
                      {slide.title}
                    </h1>
                    <p className="text-base md:text-xl text-white/80 mb-5 md:mb-8 max-w-lg md:max-w-xl mx-auto md:mx-0 leading-relaxed">
                      {slide.subtitle}
                    </p>
                    <Link
                      href={slide.href}
                      className={`inline-block px-8 md:px-10 py-3 md:py-3.5 rounded-full text-base md:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${theme.btnBg} ${theme.btnText}`}
                    >
                      {slide.cta}
                    </Link>
                  </div>

                  {/* Product image - left side in RTL */}
                  <div className={`flex-shrink-0 order-1 md:order-2 w-[220px] h-[220px] md:w-[420px] md:h-[440px] lg:w-[500px] lg:h-[500px] relative transition-all duration-1000 delay-100 ${
                    isActive ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-8"
                  }`}>
                    <div className={`absolute inset-4 md:inset-8 rounded-full ${theme.accent} blur-2xl hero-pulse`} />
                    {productImage ? (
                      <div className="relative w-full h-full hero-float-product">
                        <Image
                          src={productImage}
                          alt={slide.title}
                          fill
                          className="object-contain drop-shadow-2xl"
                          priority={i === 0}
                          sizes="(max-width: 768px) 220px, (max-width: 1024px) 420px, 500px"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center hero-float-product">
                        <span className="text-[80px] md:text-[120px] drop-shadow-lg">🎁</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom bar: dots + arrows */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 flex items-center gap-3 z-20">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-500 ${
                  i === current
                    ? `w-8 h-3 ${activeTheme.dotActive}`
                    : "w-3 h-3 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`סלייד ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goPrev}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all backdrop-blur-sm"
            aria-label="הקודם"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={goNext}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all backdrop-blur-sm"
            aria-label="הבא"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
