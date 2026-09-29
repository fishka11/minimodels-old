// src/app/[locale]/mini-girls/[slug]/page.js

import { getCutoffDate } from "@/lib/cutoffDate";
import { sanityFetch } from "@/sanity/lib/client";
import {
  ALL_TEENS_SLUGS_QUERY,
  MODEL_WITH_SIBLINGS_QUERY,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { Model } from "@/components/model";
import { LOCALES } from "@/lib/locales";
import { cache } from "react";

// 🔒 BLOKADA SSR — wymusza SSG/ISR
export const dynamic = "error";

// ⏱ ISR fallback (bezpieczne)
export const revalidate = 3600;

export const getData = cache(async (slug) => {
  const data = await sanityFetch({
    query: MODEL_WITH_SIBLINGS_QUERY,
    params: { slug, cutoffDate: getCutoffDate() },
    revalidate: 3600,
    tags: [`model:${slug}`, `category:nastolatki`],
  });

  return data;
});

export async function generateStaticParams() {
  const models = await sanityFetch({ query: ALL_TEENS_SLUGS_QUERY });

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
      title:
        "Nastolatka / nastolatek do reklam i sesji zdjęciowych | MiniModels",
      // title:
      //   `${model?.name} - nastolatek / nastolatka do reklam i sesji zdjęciowych | MiniModels` ||
      //   "Nastolatek / nastolatka do reklam i sesji zdjęciowych | MiniModels",
      description:
        "Oferujemy szeroką bazę nastolatków - modelek i modeli, które spełnią oczekiwania nawet najbardziej wymagających klientów. Skontaktuj się z nami, aby znaleźć idealną nastolatkę lub nastolatka do swojego projektu i stworzyć niezapomniane kampanie reklamowe z udziałem naszych młodych talentów.",
      keywords:
        "nastolatka do reklam,nastolatek do reklam,młodzież do reklam,nastoletni model,nastoletnia modelka,młodzieżowe sesje zdjęciowe,młody aktor,młoda aktorka,nastolatek do filmów,nastolatka do filmów,nastolatek do seriali,nastolatka do seriali,młody model,młoda modelka,casting dla nastolatków,reklamy z młodzieżą,agencja modeli nastoletnich,MiniModels",
    },
    en: {
      title: "Teenager for Commercials and Photoshoots | MiniModels",
      // title:
      //   `${model?.name} - a teenager for Commercials and Photoshoots | MiniModels` ||
      //   "Teenager for Commercials and Photoshoots | MiniModels",
      description:
        "We offer a wide range of teenage models who will meet the expectations of even the most discerning clients. Contact us to find the perfect teenager for your project and create unforgettable advertising campaigns featuring our young talents.",
      keywords:
        "Teenager for commercials, youth for commercials, teen model, youth photo shoots, young actor, young actress, teenager for films, teenager for TV series, young model, young model, casting for teenagers, youth commercials, teen model agency, MiniModels",
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
