// src/sanity/schemaTypes/modelCategoryType.js
import { defineField, defineType } from "sanity";

export const modelCategoryType = defineType({
  name: "modelCategory",
  title: "Kategoria modela",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nazwa kategorii",
      type: "string",
      options: {
        list: [
          { title: "Baby", value: "baby" },
          { title: "Mini Girls", value: "mini-girls" },
          { title: "Mini Boys", value: "mini-boys" },
          { title: "Nastolatki / Teenagers", value: "nastolatki" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "pageTitle",
      title: "Tytuł strony / Page title",
      type: "object",
      fields: [
        defineField({
          name: "pl",
          title: "Polski",
          type: "string",
          description: 'np. "Nastolatki"',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "en",
          title: "English",
          type: "string",
          description: 'e.g. "Teenagers"',
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    defineField({
      name: "pageSubtitle",
      title: "Podtytuł strony / Page subtitle",
      type: "object",
      fields: [
        defineField({
          name: "pl",
          title: "Polski",
          type: "string",
          description: 'np. "Nastolatki"',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "en",
          title: "English",
          type: "string",
          description: 'e.g. "Teenagers"',
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    // SEO
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
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
      title: "pageTitle.pl",
      subtitle: "title",
    },
  },
});
