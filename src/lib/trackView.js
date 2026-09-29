// src/lib/trackView.js
import { isBot } from "@/lib/isBot";
import { writeClient } from "@/sanity/lib/writeClient";

export async function trackView(modelId, userAgent) {
  return;
  // if (isBot(userAgent)) {
  //   return;
  // }

  // await writeClient
  //   .patch(modelId)
  //   .setIfMissing({ viewsAll: 0, viewsHuman: 0 })
  //   .inc({ viewsAll: 1, viewsHuman: bot ? 0 : 1 })
  //   .commit();
}
