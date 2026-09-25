// src/app/[locale]/mini-girls/[slug]/page.js

import { sanityFetch } from "@/sanity/lib/client";
import {
  ALL_MINIGIRLS_SLUGS_QUERY,
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
    revalidate: 3600,
    useCdn: false,
    tags: [`model:${slug}`, `category:mini-girls`],
  });

  return data;
});

export async function generateStaticParams() {
  const models = await sanityFetch({ query: ALL_MINIGIRLS_SLUGS_QUERY });

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
      title: "Mała dziewczynka do reklam i sesji zdjęciowych | MiniModels",
      // title:
      //   `${model?.name} - dziewczynka do reklam i sesji zdjęciowych | MiniModels` ||
      //   "Dziewczynka do reklam i sesji zdjęciowych | MiniModels",
      description:
        "Oferujemy szeroką bazę dziewczynek - modelek, które spełnią oczekiwania nawet najbardziej wymagających klientów. Skontaktuj się z nami, aby znaleźć idealną dziewczynkę do swojego projektu i stworzyć niezapomniane kampanie reklamowe z udziałem naszych młodych talentów.",
      keywords:
        "dziewczynka do reklam,modelka dziecięca,dziewczynka do sesji zdjęciowych,dziecięcy modeling,dziewczynka do kampanii reklamowych,reklamy z dziećmi,mała modelka,dziewczynka do katalogów,dziecko do reklam telewizyjnych,dziecięca agencja modelingowa,młoda aktorka,Mini Girl",
    },
    en: {
      title: "Mini-girl for commercials and photo shoots | MiniModels",
      // title:
      //   `${model?.name} - a mini-girl for commercials and photo shoots | MiniModels` ||
      //   "A mini-girl for commercials and photo shoots | MiniModels",
      description:
        "We offer a wide range of models who will meet the expectations of even the most demanding clients. Contact us to find the perfect model for your project and create unforgettable advertising campaigns featuring our young talents.",
      keywords:
        "girl for commercials, child model, girl for photo shoots, child modeling, girl for advertising campaigns, commercials with children, little model, girl for catalogs, child for TV commercials, children's modeling agency, young actress, Mini Girl",
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
