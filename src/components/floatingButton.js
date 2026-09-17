"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function FloatingButton({ locale, button }) {
  if (!(locale || button)) return null;

  const buttonRef = useRef(null);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const el = buttonRef.current;

    // 1. IntersectionObserver — wykrywa moment przyklejenia
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.boundingClientRect.top <= 128) {
          setIsFixed((prev) => prev || true);
        }
      },
      { threshold: 0 },
    );

    observer.observe(el);

    // 2. Scroll listener — pilnuje powrotu
    const handleScroll = () => {
      const rect = el.getBoundingClientRect();

      // Jeśli element wrócił poniżej 100px → odklejamy
      if (rect.top > 128) {
        setIsFixed((prev) => (prev ? false : prev));
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    button && (
      <Link href={button?.url} className="flex mx-auto">
        <div className="w-full flex justify-center" ref={buttonRef}>
          <button
            className={`uppercase py-1 sm:py-4 px-4 sm:px-8  text-white font-bold sm:text-lg drop-shadow-md drop-shadow-slate-800/50 cursor-pointer transition-color ease-in duration-200 ${isFixed ? "fixed top-34 lg:top-24 bg-pink-500 hover:bg-sky-500 text-sm xl:top-32 left-1/2 -translate-x-1/2 z-50" : "bg-sky-500 hover:bg-pink-500"}`}
          >
            {button?.label[locale]}
          </button>
        </div>
      </Link>
    )
  );
}
