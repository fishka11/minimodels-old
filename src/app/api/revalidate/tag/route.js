import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

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

    const doc = body?.document;
    const prev = body?.previous;

    // Wyciąganie slug i category niezależnie od eventu
    const changedSlug = doc?.slug?.current ?? prev?.slug?.current;
    const category = doc?.category?.title ?? prev?.category?.title;

    const revalidatedTags = [];

    // 1. Rewalidacja kategorii (odświeża listy i nawigację w kategorii)
    if (category) {
      const categoryTag = `category:${category}`;
      revalidateTag(categoryTag);
      revalidatedTags.push(categoryTag);
    }

    // 2. Rewalidacja zmienionego modelu
    if (changedSlug) {
      const modelTag = `model:${changedSlug}`;
      revalidateTag(modelTag);
      revalidatedTags.push(modelTag);
    }

    // 3. Obsługa tagów przesłanych bezpośrednio z Sanity
    if (Array.isArray(body?.tags) && body.tags.length > 0) {
      body.tags.forEach((tag) => {
        revalidateTag(tag);
        revalidatedTags.push(tag);
      });
    }

    if (revalidatedTags.length > 0) {
      return NextResponse.json({
        ok: true,
        revalidated: revalidatedTags,
      });
    }

    return NextResponse.json({
      ok: true,
      message: "No slug, category or tags found",
    });
  } catch (err) {
    console.error("Webhook revalidation error:", err);
    return new Response(err.message, { status: 500 });
  }
}
