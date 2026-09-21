import { defineField, defineType, defineArrayMember } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const faqPageType = defineType({
  name: "faqPage",
  title: "Pomoc / FAQ",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tytuł strony (wewnętrzny)",
      type: "string",
      initialValue: "Pomoc",
      readOnly: true,
    }),

    // SEO
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        // SEO PL
        defineField({
          name: "pl",
          title: "Polski",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "SEO Title",
              type: "string",
              description: "Tytuł strony dla wyszukiwarek (ok. 60 znaków)",
            }),
            defineField({
              name: "description",
              title: "SEO Description",
              type: "text",
              rows: 3,
              description: "Opis strony dla wyszukiwarek (ok. 155 znaków)",
            }),
            defineField({
              name: "keywords",
              title: "SEO Keywords",
              type: "array",
              of: [{ type: "string" }],
              options: { layout: "tags" },
            }),
          ],
        }),

        // SEO EN
        defineField({
          name: "en",
          title: "English",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "SEO Title",
              type: "string",
              description:
                "Page title for search engines (approx. 60 characters)",
            }),
            defineField({
              name: "description",
              title: "SEO Description",
              type: "text",
              rows: 3,
              description:
                "Page description for search engines (approx. 155 characters)",
            }),
            defineField({
              name: "keywords",
              title: "SEO Keywords",
              type: "array",
              of: [{ type: "string" }],
              options: { layout: "tags" },
            }),
          ],
        }),
      ],
    }),

    // PAGE TITLE
    defineField({
      name: "pageTitle",
      title: "Tytuł strony / Page title",
      type: "object",
      fields: [
        defineField({
          name: "pl",
          title: "Polski",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "en",
          title: "English",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    // PAGE SUBTITLE
    defineField({
      name: "pageSubtitle",
      title: "Podtytuł strony / Page subtitle",
      type: "object",
      fields: [
        defineField({
          name: "pl",
          title: "Polski",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "en",
          title: "English",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    // 🔥 UPROSZCZONA LISTA FAQ
    defineField({
      name: "faq",
      title: "FAQ — lista pytań i odpowiedzi",
      type: "array",
      of: [
        defineArrayMember({
          name: "faqItem",
          title: "Pytanie i odpowiedź",
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Pytanie / Question",
              type: "object",
              fields: [
                defineField({
                  name: "pl",
                  title: "Polski",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "en",
                  title: "English",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
              ],
            }),

            defineField({
              name: "answer",
              title: "Odpowiedź / Answer",
              type: "object",
              fields: [
                defineField({
                  name: "pl",
                  title: "Polski",
                  type: "blockContent",
                }),
                defineField({
                  name: "en",
                  title: "English",
                  type: "blockContent",
                }),
              ],
            }),
          ],

          preview: {
            select: {
              title: "question.pl",
            },
          },
        }),
      ],
    }),
    // Obraz tła
    defineField({
      name: "bgImage",
      title: "Obraz tła / Background image",
      type: "image",
      options: { hotspot: true },
      description: "Obraz tła sekcji (zalecane: szerokość min. 2000px)",
    }),
  ],

  preview: {
    select: {
      title: "title",
    },
  },
});
