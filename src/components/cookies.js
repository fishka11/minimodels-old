"use client";
import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Sprawdź czy użytkownik już wybrał
    const consent = document.cookie
      .split("; ")
      .find((row) => row.startsWith("cookie-consent="));

    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      document.cookie = "cookie-consent=accepted; path=/; max-age=31536000";
      // await setCookieConsent("accepted");
      setShowBanner(false);
    } catch (error) {
      console.error("Error setting cookie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    setIsLoading(true);
    try {
      document.cookie = "cookie-consent=declined; path=/; max-age=31536000";
      // await setCookieConsent("declined");
      setShowBanner(false);
    } catch (error) {
      console.error("Error setting cookie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-0 left-0 z-50 w-full bg-slate-800 p-4 text-white shadow-lg"
      role="dialog"
      aria-live="polite"
      aria-label="Zgoda na cookies"
    >
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm font-light">
          Ta strona używa plików cookies w celach statystycznych, reklamowych
          oraz funkcjonalnych. Dzięki nim możemy indywidualnie dostosować stronę
          do Twoich potrzeb.{" "}
          <a
            href="/files/rodominimodels.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 underline transition-colors hover:text-pink-300"
          >
            Dowiedz się więcej
          </a>
          .
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            disabled={isLoading}
            className="rounded-md bg-slate-500 px-6 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Odrzuć cookies"
          >
            {isLoading ? "Zapisywanie..." : "Odrzuć"}
          </button>

          <button
            onClick={handleAccept}
            disabled={isLoading}
            className="rounded-md bg-pink-500 px-6 py-2 text-sm font-medium whitespace-nowrap text-white  transition-colors hover:bg-pink-800 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Zaakceptuj cookies"
          >
            {isLoading ? "Zapisywanie..." : "Akceptuję"}
          </button>
        </div>
      </div>
    </div>
  );
}
