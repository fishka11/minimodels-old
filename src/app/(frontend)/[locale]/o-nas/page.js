import { sanityFetch } from "@/sanity/lib/client";
import { ABOUTUS_PAGE_QUERY } from "@/sanity/lib/queries";
import { LOCALES } from "@/lib/locales";
import { notFound } from "next/navigation";
import placeholder from "@/assets/images/about_bg.jpg";
import { PageHeader } from "@/components/pageHeader";
import RichTextRenderer from "@/components/richTextRenderer";
import { cache } from "react";

// BLOKADA SSR — wymusza SSG/ISR
export const dynamic = "error";

// ISR fallback w sekundach (1 godzina)
export const revalidate = 3600;

// Module-level cache przechowujący dane pobrane podczas builda (klucz: locale)
const PAGE_CACHE = new Map();

// -------------------------------------------------------
// Prefetch danych podczas builda dla wszystkich locale
// -------------------------------------------------------
export async function generateStaticParams() {
  await Promise.all(
    LOCALES.map(async (locale) => {
      try {
        const data = await sanityFetch({
          query: ABOUTUS_PAGE_QUERY,
          tags: ["aboutUsPage"],
        });

        PAGE_CACHE.set(locale, data || null);
      } catch (err) {
        PAGE_CACHE.set(locale, null);
      }
    }),
  );

  return LOCALES.map((locale) => ({ locale }));
}

// -------------------------------------------------------
// Bezpieczne getData z cache i fallbackiem
// -------------------------------------------------------
export const getData = cache(async (locale) => {
  const cached = PAGE_CACHE.get(locale);
  if (cached) return cached;

  const data = await sanityFetch({
    query: ABOUTUS_PAGE_QUERY,
    params: { locale },
    tags: ["aboutUsPage"],
  });

  PAGE_CACHE.set(locale, data || null);
  return data || null;
});

// -------------------------------------------------------
// Metadata
// -------------------------------------------------------
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const data = PAGE_CACHE.get(locale) || (await getData(locale));
  const seo = data?.seo || {};

  return {
    title: seo?.[locale]?.title ?? seo?.title ?? "MiniModels",
    description: seo?.[locale]?.description ?? seo?.description ?? "",
    keywords: seo?.[locale]?.keywords ?? seo?.keywords ?? "",
  };
}

// -------------------------------------------------------
// Strona główna (SSG/ISR)
// -------------------------------------------------------
export default async function Page({ params }) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  if (!LOCALES.includes(locale)) notFound();

  const data = await getData();

  return (
    <main className="mx-auto min-h-screen bg-white pt-14 lg:pt-20 pb-12">
      {/* Header */}
      <PageHeader
        bgImage={placeholder}
        title={data?.pageTitle[locale]}
        subTitle={data?.pageSubtitle[locale]}
      />
      <section className="mx-auto container max-w-4xl py-12 lg:py-24 px-4">
        {data?.body[locale] ? (
          <div className="">
            <RichTextRenderer value={data.body[locale]} />
          </div>
        ) : null}
      </section>
    </main>
  );
}
