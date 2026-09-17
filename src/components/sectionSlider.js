"use client";
// src/components/sectionSlider.js
import Image from "next/image";
import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function SectionSlider({ slides, locale }) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + slides.length) % slides.length),
    [slides.length],
  );

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    [slides.length],
  );

  if (!slides?.length) return null;

  return (
    <div className="relative max-w-146 w-9/12 max-lg:w-9/12 mx-auto">
      <div className="overflow-hidden select-none">
        {/* Slajdy */}
        <div
          className="flex transition-transform duration-200 ease-in max-w-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="grid grid-cols-3 grid-rows-3 gap-2 w-full shrink-0"
            >
              {slide.logos.map((logo, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center w-full"
                >
                  <Image
                    src={logo.url}
                    alt={logo.alt || ""}
                    className="w-30"
                    sizes="100vw"
                    priority={i === 0 && idx === 0}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Przyciski */}
      <button
        onClick={prev}
        aria-label="Poprzedni slajd"
        className="absolute -left-10 top-1/2 -translate-y-1/2 hover:bg-sky-500/60 bg-sky-500/20 transition-colors duration-200 ease-in rounded-full p-2 shadow-md cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5 text-slate-700" />
      </button>

      <button
        onClick={next}
        aria-label="Następny slajd"
        className="absolute -right-10 top-1/2 -translate-y-1/2 hover:bg-sky-500/60 bg-sky-500/20 transition-colors duration-200 ease-in rounded-full p-2 shadow-md cursor-pointer"
      >
        <ChevronRight className="w-5 h-5 text-slate-700" />
      </button>

      {/* Kropki */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slajd ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ease-in ${
              i === current ? "bg-sky-500/60" : "bg-sky-500/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
