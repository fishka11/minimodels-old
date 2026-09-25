// src/app/[locale]/baby/[slug]/page.js

import { sanityFetch } from "@/sanity/lib/client";
import {
  ALL_BABY_SLUGS_QUERY,
  MODEL_WITH_SIBLINGS_QUERY,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { Model } from "@/components/model";
import { LOCALES } from "@/lib/locales";
import { cache } from "react";

// 🔒 BLOKADA SSR — wymusza SSG/ISR
export const dynamic = "error";

// ⏱ ISR fallback (bezpieczne)
// export const revalidate = 3600;

export const getData = cache(async (slug) => {
  const cutoffDate = new Date();
  cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);

  const data = await sanityFetch({
    query: MODEL_WITH_SIBLINGS_QUERY,
    params: { slug, cutoffDate: cutoffDate.toISOString() },
    tags: [`model:${slug}`, `category:baby`],
  });

  return data;
});

export async function generateStaticParams() {
  const models = await sanityFetch({ query: ALL_BABY_SLUGS_QUERY });

  return models.flatMap(({ slug }) =>
    LOCALES.map((locale) => ({ locale, slug })),
  );
}

// -------------------------------------------------------
// Metadata
// -------------------------------------------------------
export async function generateMetadata({ params }) {
  const { locale, slug } = await params;

  // const model = await getData(slug);

  const t = {
    pl: {
      title: "Niemowlę do reklam i sesji zdjęciowych | MiniModels",
      // title:
      //   `${model?.name} - małe dziecko do reklam i sesji zdjęciowych | MiniModels` ||
      //   "Małe dziecko do reklam i sesji zdjęciowych | MiniModels",
      description:
        "Oferujemy szeroką bazę niemowalków - małych modeli, którzy spełnią oczekiwania nawet najbardziej wymagających klientów. Skontaktuj się z nami, aby znaleźć idealne niemowlę do swojego projektu i stworzyć niezapomniane kampanie reklamowe z udziałem najmłodszych talentów.",
      keywords:
        "niemowlę do reklam,dziecko do reklam,niemowlę do sesji zdjęciowych,baby model,niemowlę do kampanii reklamowych,dziecięce sesje fotograficzne,niemowlak do reklam telewizyjnych,reklama z niemowlęciem,dziecko do katalogów,agencja dziecięca,dziecięcy modeling,MiniModels",
    },
    en: {
      title: "Small child for commercials and photo shoots | MiniModels",
      // title:
      //   `${model?.name} - a small child for commercials and photo shoots | MiniModels` ||
      //   "A small child for commercials and photo shoots | MiniModels",
      description:
        "We offer a wide selection of baby models to meet the expectations of even the most discerning customers. Contact us to find the perfect baby for your project and create unforgettable advertising campaigns featuring our youngest talents.",
      keywords:
        "baby for commercials, baby for commercials, baby for photo shoots, baby model, baby for advertising campaigns, baby photo shoots, baby for TV commercials, baby advertising, baby for catalogs, children's agency, children's modeling, MiniModels",
    },
  };
  const tr = t[locale];

  return {
    title: tr.title,
    description: tr.description,
    keywords: tr.keywords,
  };
}

export default async function ModelPage({ params }) {
  const { locale, slug } = await params;

  if (!LOCALES.includes(locale)) notFound();

  const model = await getData(slug);

  if (!model) notFound();

  return (
    <Model
      model={model}
      locale={locale}
      slug={slug}
      siblings={model.siblings}
    />
  );
}
