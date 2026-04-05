"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroSlide } from "@/lib/types";

interface Props {
  slides: HeroSlide[];
}

// Base is always #384850, accent "lighting" changes per slide
const BASE = "#384850";
const themes = [
  {
    accent: "bg-accent/25",
    accent2: "bg-accent/15",
    accent3: "bg-lavender/10",
    btnBg: "bg-accent hover:bg-accent/90",
    btnText: "text-white",
    dotActive: "bg-accent",
  },
  {
    accent: "bg-sky/35",
    accent2: "bg-sky/20",
    accent3: "bg-success/10",
    btnBg: "bg-sky hover:bg-sky/90",
    btnText: "text-primary",
    dotActive: "bg-sky",
  },
  {
    accent: "bg-lavender/30",
    accent2: "bg-lavender/18",
    accent3: "bg-accent/10",
    btnBg: "bg-lavender hover:bg-lavender/90",
    btnText: "text-primary",
    dotActive: "bg-lavender",
  },
  {
    accent: "bg-warm/30",
    accent2: "bg-warm/18",
    accent3: "bg-success/10",
    btnBg: "bg-warm hover:bg-warm/90",
    btnText: "text-primary",
    dotActive: "bg-warm",
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
    <section className="relative overflow-hidden -mt-[56px] md:-mt-[62px]" aria-label="באנרים" aria-roledescription="קרוסלה">
      <div className="relative h-[560px] md:h-[660px] pt-[140px]">

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
              {/* Solid base background */}
              <div
                className="absolute inset-0"
                style={{ backgroundColor: BASE }}
              />

              {/* Colored lighting over base */}
              <div className="absolute inset-0 overflow-hidden">
                <div className={`absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full ${theme.accent} blur-[100px] hero-float`} />
                <div className={`absolute bottom-[-80px] right-[10%] w-[450px] h-[450px] rounded-full ${theme.accent2} blur-[80px] hero-float-delayed`} />
                <div className={`absolute top-[20%] left-[35%] w-[350px] h-[350px] rounded-full ${theme.accent3} blur-[90px] hero-float-slow`} />
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

        {/* Dots - centered */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-500 ${
                i === current
                  ? `w-6 h-2 ${activeTheme.dotActive}`
                  : "w-2 h-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`סלייד ${i + 1}`}
            />
          ))}
        </div>

        {/* Arrows - left side */}
        <div className="absolute bottom-4 md:bottom-6 left-4 md:left-8 flex items-center gap-1 z-20">
          <button
            onClick={goPrev}
            className="w-8 h-8 rounded-full text-white/50 hover:text-white flex items-center justify-center transition-colors"
            aria-label="הקודם"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={goNext}
            className="w-8 h-8 rounded-full text-white/50 hover:text-white flex items-center justify-center transition-colors"
            aria-label="הבא"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
