import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { sanityFetch } from "@/sanity/lib/client";
import { cache } from "react";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

const SIBLINGS_GROQ = `{
  "prev": *[_type == "model"
    && category->title == $category
    && active == true
    && defined(contractDate)
    && dateTime(contractDate + "T00:00:00Z") > dateTime($cutoffDate)
    && (
      dateTime(contractDate + "T00:00:00Z") < dateTime(^.contractDate + "T00:00:00Z")
      ||
      (
        contractDate == ^.contractDate
        && _createdAt < ^._createdAt
      )
    )
  ]
  | order(dateTime(contractDate + "T00:00:00Z") desc, _createdAt desc)[0..1]
  { "slug": slug.current },

  "next": *[_type == "model"
    && category->title == $category
    && active == true
    && defined(contractDate)
    && dateTime(contractDate + "T00:00:00Z") > dateTime($cutoffDate)
    && (
      dateTime(contractDate + "T00:00:00Z") > dateTime(^.contractDate + "T00:00:00Z")
      ||
      (
        contractDate == ^.contractDate
        && _createdAt > ^._createdAt
      )
    )
  ]
  | order(dateTime(contractDate + "T00:00:00Z") asc, _createdAt asc)[0..1]
  { "slug": slug.current }
}`;

export async function POST(req) {
  try {
    if (!process.env.SANITY_REVALIDATE_SECRET) {
      return new Response(
        "Missing environment variable SANITY_REVALIDATE_SECRET",
        { status: 500 },
      );
    }

    const { isValidSignature, body } = await parseBody(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      true,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { ok: false, error: "Invalid signature", body },
        { status: 401 },
      );
    }

    const event = body?.event;
    const doc = body?.document;
    const prev = body?.previous;

    // Wyciąganie slug i category niezależnie od eventu
    const changedSlug = doc?.slug?.current ?? prev?.slug?.current;
    const category = doc?.category?.title ?? prev?.category?.title;

    // Rewalidacja kategorii zawsze jeśli istnieje
    if (category) revalidateTag(`category:${category}`);

    // Jeśli istnieje slug, rewalidacja modela i jego sąsiadów
    if (changedSlug) {
      // rewalidacja samego modelu
      revalidateTag(`model:${changedSlug}`);

      // Pobieranie cutoffDate (tak jak w app)
      const cutoffDate = new Date();
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);

      // Pobieranie sąsiadów z Sanity
      const siblings = await sanityFetch({
        query: SIBLINGS_GROQ,
        params: {
          slug: changedSlug,
          category,
          cutoffDate: cutoffDate.toISOString(),
        },
      }).catch((err) => {
        console.error("Failed to fetch siblings:", err);
        return null;
      });

      // Zbieranie wszystkich slugów do rewalidacji (model + sąsiedzi)
      const slugs = new Set();
      slugs.add(changedSlug);
      if (Array.isArray(siblings?.prev))
        siblings.prev.forEach((s) => s?.slug && slugs.add(s.slug));
      if (Array.isArray(siblings?.next))
        siblings.next.forEach((s) => s?.slug && slugs.add(s.slug));

      // Rewalidacja każdego zebranego modela
      for (const slug of slugs) {
        try {
          revalidateTag(`model:${slug}`);
        } catch (e) {
          console.error("revalidateTag failed for", slug, e);
        }
      }

      return NextResponse.json({
        ok: true,
        revalidated: Array.from(slugs),
        category,
      });
    }

    // 🟥 DELETE — Sanity nie wysyła tags
    // if (event === "delete") {
    //   const slug = prev?.slug?.current;
    //   const category = prev?.category?.title;

    //   if (slug) revalidateTag(`model:${slug}`);
    //   if (category) revalidateTag(`category:${category}`);

    //   return NextResponse.json({
    //     ok: true,
    //     event,
    //     revalidated: [`model:${slug}`, `category:${category}`],
    //   });
    // }

    // 🟦 CREATE / UPDATE
    // if (event === "create" || event === "update") {
    //   const slug = doc?.slug?.current;
    //   const category = doc?.category?.title;

    //   if (slug) revalidateTag(`model:${slug}`);
    //   if (category) revalidateTag(`category:${category}`);
    // }

    // 🟩 PUBLISH / UNPUBLISH
    // if (event === "publish" || event === "unpublish") {
    //   const slug = doc?.slug?.current;
    //   const category = doc?.category?.title;

    //   if (slug) revalidateTag(`model:${slug}`);
    //   if (category) revalidateTag(`category:${category}`);
    // }

    // 🟨 Jeśli Sanity wysłało tags — też revalidujemy
    // if (Array.isArray(body?.tags) && body.tags.length > 0) {
    //   body.tags.forEach((tag) => revalidateTag(tag));
    // }

    // return NextResponse.json({ ok: true, event });

    // fallback: jeśli Sanity wysłało tagi — revalidujemy je
    if (Array.isArray(body?.tags) && body.tags.length > 0) {
      body.tags.forEach((tag) => revalidateTag(tag));
      return NextResponse.json({ ok: true, revalidated: body.tags });
    }

    return NextResponse.json({ ok: true, message: "No slug or tags found" });
  } catch (err) {
    console.error(err);
    return new Response(err.message, { status: 500 });
  }
}
