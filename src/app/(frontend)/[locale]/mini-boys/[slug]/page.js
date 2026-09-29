// src/app/[locale]/mini-boys/[slug]/page.js

import { getCutoffDate } from "@/lib/cutoffDate";
import { sanityFetch } from "@/sanity/lib/client";
import {
  ALL_MINIBOYS_SLUGS_QUERY,
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
  const data = await sanityFetch({
    query: MODEL_WITH_SIBLINGS_QUERY,
    params: { slug, cutoffDate: getCutoffDate() },
    revalidate: 3600,
    tags: [`model:${slug}`, `category:mini-boys`],
  });

  return data;
});

export async function generateStaticParams() {
  const models = await sanityFetch({ query: ALL_MINIBOYS_SLUGS_QUERY });

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
      title: "Mały chłopiec do reklam i sesji zdjęciowych | MiniModels",
      // title:
      //   `${model?.name} - chłopiec do reklam i sesji zdjęciowych | MiniModels` ||
      //   "Chłopiec do reklam i sesji zdjęciowych | MiniModels",
      description:
        "Oferujemy szeroką bazę chłopców - modeli, którzy spełnią oczekiwania nawet najbardziej wymagających klientów. Skontaktuj się z nami, aby znaleźć idealnego chłopca do swojego projektu i stworzyć niezapomniane kampanie reklamowe z udziałem naszych młodych talentów.",
      keywords:
        "chłopiec do reklam,model dziecięcy,chłopiec do sesji zdjęciowych,dziecięcy modeling,chłopiec do kampanii reklamowych,reklamy z dziećmi,mały model,chłopiec do katalogów,dziecko do reklam telewizyjnych,dziecięca agencja modelingowa,młody  aktor,Mini Boy",
    },
    en: {
      title: "Mini-boy for commercials and photo shoots | MiniModels",
      // title:
      //   `${model?.name} - a mini-boy for commercials and photo shoots | MiniModels` ||
      //   "A mini-boy for commercials and photo shoots | MiniModels",
      description:
        "We offer a wide selection of male models who will meet the expectations of even the most discerning clients. Contact us to find the perfect male model for your project and create unforgettable advertising campaigns featuring our young talents.",
      keywords:
        "boy for commercials, child model, boy for photo shoots, child modeling, boy for advertising campaigns, commercials with children, little model, boy for catalogs, child for TV commercials, children's modeling agency, young actor, Mini Boy",
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
