// src/components/modelGallery.js
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export function ModelGallery({ model }) {
  if (!model.gallery?.length) return null;

  return (
    <section className="container bg-white mx-auto max-w-7xl py-4 md:py-6">
      <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-4 mx-auto">
        {model.gallery.map((photo, i) => {
          if (!photo?.asset) return null;

          // Wyciągamy oryginalne wymiary z metadanych Sanity (dla zachowania proporcji Aspect Ratio)
          const width = photo.asset.metadata?.dimensions?.width || 640;
          const height = photo.asset.metadata?.dimensions?.height || 360;

          // Wygenerowanie przyciętego/zoptymalizowanego adresu bezpośrednio na CDN Sanity
          const imageUrl = urlFor(photo)
            .height(720) // Wysarczająca jakość dla max-h-90 (360px w 2x Retina)
            .quality(80)
            .auto("format") // Wymusza WebP/AVIF prosto z Sanity
            .url();

          return (
            <figure className="overflow-hidden mx-auto" key={photo._key || i}>
              <Image
                src={imageUrl}
                width={width}
                height={height}
                quality={80}
                alt={photo.alt || `${model.name} ${i + 1}`}
                unoptimized
                className="w-auto max-h-90 max-w-full"
              />
            </figure>
          );
        })}
      </div>
    </section>
  );
}
