import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { EXPIRED_MODELS_QUERY } from "@/sanity/lib/queries";

// import { Resend } from "resend";
import { apiVersion, dataset, projectId } from "@/sanity/env";
const token = process.env.SANITY_WRITE_TOKEN;
const cleanupSecret = process.env.CLEANUP_SECRET;

if (!projectId || !dataset || !token || !cleanupSecret) {
  throw new Error("Missing Sanity environment variables");
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false,
});

// Klient Resend (powiadomienia)
// const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req) {
  // Autoryzacja tokenem
  const secret = req.headers.get("x-cleanup-secret");
  if (!secret || secret !== cleanupSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1 rok
  const now = new Date();
  const limitDate = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate(),
  );

  try {
    // Pobierz modele z wygasłą umową
    const expiredModels = await client.fetch(EXPIRED_MODELS_QUERY, {
      limitDate: limitDate.toISOString(),
    });

    if (!expiredModels.length) {
      return NextResponse.json({
        status: "ok",
        message: "Brak modeli do dezaktywowania",
      });
    }

    // Usuń dokumenty
    // const deleteOps = expiredModels.map((m) => client.delete(m._id));
    // await Promise.all(deleteOps);

    // Soft-delete modeli (ustawienie active: false)
    await Promise.all(
      expiredModels.map((m) =>
        client.patch(m._id).set({ active: false }).commit(),
      ),
    );

    // 🔥 AUTOMATYCZNE REVALIDACJE
    expiredModels.forEach((m) => {
      // Strona pojedynczego modela
      if (m.slug?.current) {
        revalidateTag(`model:${m.slug.current}`);
      }

      // Strona kategorii
      if (m.category?.title) {
        revalidateTag(`category:${m.category.title}`);
      }
    });

    // Zbierz assety z photos[] i gallery[]
    // const assets = expiredModels.flatMap((m) => [
    //   ...(m.gallery?.map((g) => g.asset._id) || []),
    // ]);

    // Usuń assety
    // await Promise.all(assets.map((id) => client.delete(id)));

    // Powiadomienie mailowe
    // await resend.emails.send({
    //   from: "Cleanup <noreply@minimodels.com.pl>",
    //   to: "marketing@minimodels.com.pl",
    //   subject: "Automatyczne czyszczenie modeli",
    //   html: `
    //     <h2>Dezaktywowano ${expiredModels.length} modeli</h2>
    //     <p><strong>Wyłączone modele:</strong><br>${expiredModels
    //       .map((m) => m.name)
    //       .join("<br>")}</p>
    //   `,
    // });

    return NextResponse.json({
      status: "done",
      deactivatedModels: expiredModels.length,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { status: "error", message: "Błąd podczas czyszczenia" },
      { status: 500 },
    );
  }
}
