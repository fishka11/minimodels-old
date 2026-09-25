// src/app/[locale]/page.js
import { ParallaxSection } from "@/components/parallaxSection";
import { LOCALES } from "@/lib/locales";
import { sanityFetch } from "@/sanity/lib/client";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import imgCollage from "@/assets/images/lay_mini-boy-girl.webp";
import imgDreams from "@/assets/images/lay_marzenia-zdj.webp";
import imgShowBusiness from "@/assets/images/lay_show_biznes.webp";
import { SectionContent } from "@/components/sectionContent";
import { slides } from "@/lib/logotypes";
import { Hero } from "@/components/hero";
import { cache } from "react";
import { urlFor } from "@/sanity/lib/image";

// BLOKADA SSR — wymusza SSG/ISR
export const dynamic = "error";

// ISR fallback w sekundach (1 godzina)
// export const revalidate = 3600;

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
          query: HOME_PAGE_QUERY,
          params: { locale },
          tags: ["homePage"],
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
    query: HOME_PAGE_QUERY,
    params: { locale },
    tags: ["homePage"],
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
  const { locale } = await params;

  if (!LOCALES.includes(locale)) notFound();

  const data = await getData(locale);

  if (!data) notFound();

  const [section1, section2, section3, section4, section5, section6] =
    data?.sections ?? [];

  const imgSection1Bg = urlFor(section1?.bgImage)
    .auto("format")
    .quality(80)
    .url();

  const imgSection2Bg = urlFor(section2?.bgImage)
    .auto("format")
    .quality(80)
    .url();

  const imgSection3Bg = urlFor(section3?.bgImage)
    .auto("format")
    .quality(80)
    .url();

  const imgSection4Bg = urlFor(section4?.bgImage)
    .auto("format")
    .quality(80)
    .url();

  const imgSection5Bg = urlFor(section5?.bgImage)
    .auto("format")
    .quality(80)
    .url();

  const imgSection6Bg = urlFor(section6?.bgImage)
    .auto("format")
    .quality(80)
    .url();

  const imgPartnersUp = urlFor(section1?.bgImage2)
    .auto("format")
    .quality(80)
    .url();

  const imgPartnersDown = urlFor(section2?.bgImage2)
    .auto("format")
    .quality(80)
    .url();

  return (
    <main>
      <Hero
        locale={locale}
        texts={section1?.texts}
        video={section1?.video}
        bgImage={imgSection1Bg}
        image={imgPartnersUp}
        button={section1?.button}
      />
      <ParallaxSection
        bgImage={imgSection2Bg}
        parallaxAnchor="section2"
        sectionEnlargment="300"
      >
        <div className="mx-auto h-full grid grid-cols-1 place-content-between text-center gap-10">
          <div
            className="w-full h-48"
            style={{ backgroundImage: `url(${imgPartnersDown})` }}
          ></div>
          {/* <Image
            src={imgPartnersDown}
            alt={`${locale === "pl" ? "Logotypy partnerów Minimodels" : "Logos of Minimodels partners"}`}
          /> */}
          <SectionContent
            texts={section2?.texts}
            locale={locale}
            image={imgCollage}
            imageAlt={
              locale === "pl" ? "Kolaż mini-modeli" : "Collage of minimodels"
            }
            imageLeft={true}
            loraFontFirst={false}
            anchor="section3"
            textBreak={false}
          />
        </div>
      </ParallaxSection>
      <ParallaxSection
        bgImage={imgSection3Bg}
        parallaxAnchor="section3"
        sectionEnlargment="300"
      >
        <div className="mx-auto h-full grid grid-cols-1 place-content-end text-center gap-10">
          <SectionContent
            texts={section3?.texts}
            locale={locale}
            image={imgDreams}
            imageAlt={locale === "pl" ? "Marzenia" : "Dreams"}
            imageLeft={false}
            loraFontFirst={false}
            anchor="section4"
            textBreak={false}
          />
        </div>
      </ParallaxSection>
      <ParallaxSection
        bgImage={imgSection4Bg}
        parallaxAnchor="section4"
        sectionEnlargment="300"
      >
        <div className="mx-auto h-full grid grid-cols-1 place-content-end text-center gap-10">
          <SectionContent
            texts={section4?.texts}
            locale={locale}
            slides={slides}
            imageLeft={true}
            loraFontFirst={false}
            anchor="section5"
            textBreak={false}
          />
        </div>
      </ParallaxSection>
      <ParallaxSection
        bgImage={imgSection5Bg}
        parallaxAnchor="section5"
        sectionEnlargment="300"
      >
        <div className="mx-auto h-full grid grid-cols-1 place-content-end text-center gap-10">
          <SectionContent
            texts={section5?.texts}
            locale={locale}
            image={imgShowBusiness}
            imageAlt={locale === "pl" ? "Show Business" : "Show Business"}
            imageLeft={false}
            loraFontFirst={false}
            button={section5?.button}
            anchor="section6"
            textBreak={false}
          />
        </div>
      </ParallaxSection>
      <ParallaxSection
        bgImage={imgSection6Bg}
        parallaxAnchor="section6"
        sectionEnlargment="300"
      >
        <div className="mx-auto h-full grid grid-cols-1 place-content-end text-center gap-10">
          <SectionContent
            texts={section6?.texts}
            locale={locale}
            video={section6?.video}
            imageLeft={true}
            loraFontFirst={true}
            anchor="section7"
            textBreak={true}
          />
        </div>
      </ParallaxSection>
    </main>
  );
}
