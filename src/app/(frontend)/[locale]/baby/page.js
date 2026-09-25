// src/app/[locale]/baby/page.js

import { getCutoffDate } from "@/lib/cutoffDate";
import { sanityFetch } from "@/sanity/lib/client";
import { BABIES_WITH_CATEGORY_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { ModelCard } from "@/components/modelCard";
import { NameColorSwitcher } from "@/lib/nameColorSwitcher";
import { PageHeader } from "@/components/pageHeader";
import { cache } from "react";
import { LOCALES } from "@/lib/locales";
import { urlFor } from "@/sanity/lib/image";

// BLOKADA SSR — wymusza SSG/ISR
export const dynamic = "error";

// ISR fallback w sekundach
// export const revalidate = 3600;

// Module-level cache przechowujący dane pobrane podczas builda
const CATEGORY_CACHE = new Map();

// -------------------------------------------------------
// generateStaticParams
// -------------------------------------------------------
export async function generateStaticParams() {
  // Pobieramy minimalne dane potrzebne do strony i metadata dla każdego locale
  // i zapisujemy je w module-level cache.
  await Promise.all(
    LOCALES.map(async (locale) => {
      try {
        const data = await sanityFetch({
          query: BABIES_WITH_CATEGORY_QUERY,
          params: { cutoffDate: getCutoffDate(), locale },
          tags: ["category:baby"],
        });

        const minimal = {
          models: data?.models || [],
          categoryInfo: data?.categoryInfo || null,
        };

        CATEGORY_CACHE.set(locale, minimal);
      } catch (err) {
        CATEGORY_CACHE.set(locale, { models: [], categoryInfo: null });
      }
    }),
  );

  return LOCALES.map((locale) => ({ locale }));
}

// -------------------------------------------------------
// Bezpieczne getData z cache i fallbackiem
// -------------------------------------------------------
export const getData = cache(async (locale) => {
  const cached = CATEGORY_CACHE.get(locale);
  if (cached) return cached;

  // Fallback: jeśli cache nie istnieje (np. lokalny dev bez builda), pobierz runtime
  const data = await sanityFetch({
    query: BABIES_WITH_CATEGORY_QUERY,
    params: { cutoffDate: getCutoffDate(), locale },
    tags: ["category:baby"],
  });

  const result = {
    models: data?.models || [],
    categoryInfo: data?.categoryInfo || null,
  };

  CATEGORY_CACHE.set(locale, result);
  return result;
});

// -------------------------------------------------------
// Metadata (odczyt z module cache lub fallback)
// -------------------------------------------------------
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const data = CATEGORY_CACHE.get(locale) || (await getData(locale));
  const seo = data?.categoryInfo?.seo?.[locale];

  return {
    title:
      seo?.title ||
      (locale === "pl"
        ? "Niemowlaki do reklam i sesji zdjęciowych | MiniModels"
        : "Small children for commercials and photo shoots | MiniModels"),
    description: seo?.description || "",
    keywords: seo?.keywords || "",
  };
}

// -------------------------------------------------------
// Strona
// -------------------------------------------------------
export default async function BabyPage({ params }) {
  const { locale } = await params;

  if (!LOCALES.includes(locale)) notFound();

  const tr = {
    pl: { noModels: "Brak modeli w tej kategorii." },
    en: { noModels: "No models in this category." },
  }[locale];

  const nameColor = NameColorSwitcher("baby");

  const data = await getData(locale);
  const models = data?.models;
  const category = data?.categoryInfo;

  const bgImage = category?.bgImage
    ? urlFor(category.bgImage).auto("format").quality(80).url()
    : null;

  return (
    <main className="mx-auto min-h-screen bg-white pt-14 lg:pt-20 pb-12">
      <PageHeader bgImage={bgImage} title={category?.pageTitle?.[locale]} />

      <section className="mx-auto container max-w-7xl pt-12">
        {models?.length === 0 ? (
          <p className="text-center text-slate-400 py-20">{tr.noModels}</p>
        ) : (
          <div className="flex flex-row flex-wrap justify-center gap-2 transition-all duration-200 ease-in">
            {models?.map((model) => (
              <ModelCard
                key={model._id}
                model={model}
                locale={locale}
                category="baby"
                nameColor={nameColor}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
