import { sanityFetch } from "@/sanity/lib/client";
import { LOCALES } from "@/lib/locales";
import { CONTACT_PAGE_QUERY_WITH_TEAM } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/pageHeader";
import RichTextRenderer from "@/components/richTextRenderer";
import { cache } from "react";
import { Phone } from "lucide-react";
import Link from "next/link";
import { lora, shadowsIntoLightTwo } from "@/lib/fonts";
import Image from "next/image";

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
          query: CONTACT_PAGE_QUERY_WITH_TEAM,
          revalidate: 86400,
          tags: ["contactPage"],
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
    query: CONTACT_PAGE_QUERY_WITH_TEAM,
    params: { locale },
    tags: ["contactPage"],
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

  const { bodySections } = data.contactPage || {};
  const leftBodySections =
    bodySections &&
    bodySections.filter((section) => section.sectionTitle.startsWith("left"));
  const rightBodySections =
    bodySections &&
    bodySections.filter((section) => section.sectionTitle.startsWith("right"));

  return (
    <main className="mx-auto bg-white pt-14 lg:pt-20 pb-12">
      <PageHeader
        title={data?.contactPage?.pageTitle[locale]}
        subTitle={data?.contactPage?.pageSubtitle[locale]}
      />
      <section className="mx-auto container max-w-7xl px-4 mb-12 lg:mb-16">
        {leftBodySections && (
          <div className="mb-6 lg:mb-12">
            <RichTextRenderer value={leftBodySections[0].texts[locale]} />
          </div>
        )}
        <div className="sm:grid sm:grid-cols-2 sm:gap-5 lg:gap-14 mb-6 lg:mb-14">
          <div>
            <div className="mb-6 lg:mb-12">
              {data?.contactPage?.sections[0]?.phones &&
                data.contactPage.sections[0].phones[locale].map(
                  (phone, index) => (
                    <a
                      href={`tel:${phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-row justify-start items-center gap-3 mb-6"
                      key={index}
                    >
                      <Phone size={34} className="text-pink-500 " />
                      <p className="text-xl lg:text-2xl font-light text-slate-700 hover:text-pink-500 transition-colors duration-200 ease-in">
                        {phone}
                      </p>
                    </a>
                  ),
                )}
            </div>
            <div className="mb-6 lg:mb-12">
              {leftBodySections && (
                <div className="mb-6 lg:mb-12">
                  <RichTextRenderer value={leftBodySections[1].texts[locale]} />
                </div>
              )}
            </div>
            <div className="py-4">
              {data?.contactPage?.sections[0]?.button && (
                <Link
                  href={data.contactPage.sections[0].button.url}
                  className="px-8 py-3 border-2 border-sky-500 text-sky-500 hover:border-black hover:text-black text-lg font-bold uppercase transition-colors duration-200 ease-in"
                >
                  {data.contactPage.sections[0].button.label[locale]}
                </Link>
              )}
            </div>
          </div>
          <div>
            {rightBodySections && (
              <div>
                <RichTextRenderer value={rightBodySections[0].texts[locale]} />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          {data?.contactPage?.sections[0]?.texts[locale] && (
            <p className="text-xl lg:text-2xl text-slate-700">
              {data.contactPage.sections[0].texts[locale][0].replaceAll(
                ", ",
                " • ",
              )}
            </p>
          )}
        </div>
      </section>
      <section className="mx-auto container max-w-7xl px-4 mb-10 lg:mb-18">
        {/* {data?.teamSection?.title && (
          <div className="mb-6 lg:mb-12 flex flex-row gap-5 justify-center items-center">
            <hr className="text-black w-1/8" />
            <h2
              className={`${lora.className} text-[40px] lg:text-6xl font-light text-center leading-tight lg:py-3 text-black`}
            >
              {data.teamSection.title[locale]}
            </h2>
            <hr className="text-black w-1/8" />
          </div>
        )} */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-12 justify-center items-center">
          {data.teamSection.members.map((member, index) => (
            <div key={index} className="text-center cursor-pointer">
              <Image
                src={member.photo.asset.url}
                alt={member.content[locale].name}
                className="w-md h-64 rounded-none hover:rounded-4xl mx-auto mb-4 object-cover transition-[border-radius] duration-200 ease-in"
                width={member.photo.asset.metadata.dimensions.width}
                height={member.photo.asset.metadata.dimensions.height}
              />
              <h3 className={`${lora.className} text-4xl text-gray-800`}>
                {member.content[locale].name}
              </h3>
              <p
                className={`${shadowsIntoLightTwo.className} text-xl uppercase text-sky-500 my-2`}
              >
                {member.content[locale].description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
