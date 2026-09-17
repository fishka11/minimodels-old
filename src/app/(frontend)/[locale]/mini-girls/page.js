// src/app/[locale]/mini-girls/page.js
import { getCutoffDate } from "@/lib/cutoffDate";
import { sanityFetch } from "@/sanity/lib/client";
import { MINIGIRLS_WITH_CATEGORY_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { ModelCard } from "@/components/modelCard";
import { NameColorSwitcher } from "@/lib/nameColorSwitcher";
import placeholder from "@/assets/images/reservation_bg.jpg";
import { PageHeader } from "@/components/pageHeader";
import { cache } from "react";
import { LOCALES } from "@/lib/locales";

const t = {
  pl: { noModels: "Brak modeli w tej kategorii." },
  en: { noModels: "No models in this category." },
};

export const getData = cache(async () => {
  const data = await sanityFetch({
    query: MINIGIRLS_WITH_CATEGORY_QUERY,
    params: { cutoffDate: getCutoffDate() },
    tags: ["category:mini-girls"],
  });

  return data;
});

// -------------------------------------------------------
// Metadata
// -------------------------------------------------------
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const data = await getData();
  const seo = data?.categoryInfo?.seo?.[locale];

  return {
    title: seo?.title,
    description: seo?.description,
    keywords: seo?.keywords,
  };
}

// -------------------------------------------------------
// Strona
// -------------------------------------------------------
export default async function MiniBoysPage({ params }) {
  const { locale } = await params;

  if (!LOCALES.includes(locale)) notFound();

  const tr = t[locale];
  const nameColor = NameColorSwitcher("mini-girls");

  const data = await getData();
  const models = data?.models;
  const category = data?.categoryInfo;

  return (
    <main className="mx-auto min-h-screen bg-white pt-14 lg:pt-20 pb-12">
      {/* Header */}
      <PageHeader bgImage={placeholder} title={category?.pageTitle[locale]} />
      <section className="mx-auto container max-w-7xl pt-12">
        {models?.length === 0 ? (
          <p className="text-center text-slate-400 py-20">{tr.noModels}</p>
        ) : (
          <div className="flex flex-row flex-wrap justify-center gap-2 transition-all duration-200 ease-in">
            {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"> */}
            {models?.map((model) => (
              <ModelCard
                key={model._id}
                model={model}
                locale={locale}
                category="mini-girls"
                nameColor={nameColor}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
