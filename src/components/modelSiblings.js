// src/components/modelSiblings.js
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const t = {
  pl: { prev: "Poprzedni", next: "Następny" },
  en: { prev: "Previous", next: "Next" },
};

export function ModelSiblings({ siblings, locale, category }) {
  const tr = t[locale] ?? t.pl;
  const { prev, next } = siblings ?? {};

  return (
    <section className="container bg-white max-w-7xl mx-auto py-4 md:py-6">
      <nav className="flex justify-between items-center pt-6 border-t border-slate-300">
        {next ? (
          <Link
            href={`/${locale}/${category}/${next.slug.current}`}
            className="flex items-center gap-3 group text-right"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-pink-500 transition-colors duration-200 ease-in" />
            <div>
              <p className="text-xs text-slate-400">{tr.next}</p>
              <p className="text-sm font-semibold text-slate-700 group-hover:text-pink-500 transition-colors duration-200 ease-in">
                {next.name}
              </p>
            </div>
            {next.profileImage && (
              <Image
                src={urlFor(next.profileImage)
                  .width(48)
                  .height(48)
                  .fit("crop")
                  .url()}
                width={48}
                height={48}
                alt={next.name}
                className="rounded-full object-cover"
              />
            )}
          </Link>
        ) : (
          <div />
        )}

        {prev ? (
          <Link
            href={`/${locale}/${category}/${prev.slug.current}`}
            className="flex items-center gap-3 group"
          >
            {prev.profileImage && (
              <Image
                src={urlFor(prev.profileImage)
                  .width(48)
                  .height(48)
                  .fit("crop")
                  .url()}
                width={48}
                height={48}
                alt={prev.name}
                className="rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-xs text-slate-500">{tr.prev}</p>
              <p className="text-sm font-semibold text-slate-800 group-hover:text-pink-500 transition-colors duration-200 ease-in">
                {prev.name}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-pink-500 transition-colors duration-200 ease-in" />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </section>
  );
}
