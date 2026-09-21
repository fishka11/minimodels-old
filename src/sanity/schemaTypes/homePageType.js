// src/sanity/schemaTypes/homePageType.js
import { defineField, defineType, defineArrayMember } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const homePageType = defineType({
  name: "homePage",
  title: "Strona główna / Home Page",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tytuł strony (wewnętrzny)",
      type: "string",
      initialValue: "Strona główna",
      readOnly: true,
    }),

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

    defineField({
      name: "sections",
      title: "Sekcje / Sections",
      type: "array",
      of: [
        defineArrayMember({
          name: "section",
          title: "Sekcja",
          type: "object",
          fields: [
            defineField({
              name: "sectionTitle",
              title: "Nazwa sekcji (wewnętrzna)",
              type: "string",
              description: 'np. "Sekcja#1"',
              validation: (rule) => rule.required(),
            }),

            // Tytuł sekcji PL/EN
            defineField({
              name: "title",
              title: "Tytuł sekcji / Section title",
              type: "object",
              fields: [
                defineField({ name: "pl", title: "Polski", type: "string" }),
                defineField({ name: "en", title: "English", type: "string" }),
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

            // Drugi obraz tła
            defineField({
              name: "bgImage2",
              title: "Drugi obraz tła / Second background image",
              type: "image",
              options: { hotspot: true },
              description:
                "Drugi obraz tła sekcji (zalecane: szerokość min. 2000px)",
            }),

            // Trzeci obraz tła
            defineField({
              name: "bgImage3",
              title: "Trzeci obraz tła / Third background image",
              type: "image",
              options: { hotspot: true },
              description:
                "Trzeci obraz tła sekcji (zalecane: szerokość min. 2000px)",
            }),

            // Teksty — dwujęzyczne
            defineField({
              name: "texts",
              title: "Teksty / Texts",
              type: "object",
              fields: [
                defineField({
                  name: "pl",
                  title: "Polski",
                  type: "array",
                  of: [defineArrayMember({ type: "text", rows: 3 })],
                  description: "Każdy element to osobny akapit",
                }),
                defineField({
                  name: "en",
                  title: "English",
                  type: "array",
                  of: [defineArrayMember({ type: "text", rows: 3 })],
                  description: "Each item is a separate paragraph",
                }),
              ],
            }),

            // Przycisk
            defineField({
              name: "button",
              title: "Przycisk / Button",
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Tekst przycisku / Button label",
                  type: "object",
                  fields: [
                    defineField({
                      name: "pl",
                      title: "Polski",
                      type: "string",
                    }),
                    defineField({
                      name: "en",
                      title: "English",
                      type: "string",
                    }),
                  ],
                }),
                defineField({
                  name: "url",
                  title: "URL",
                  type: "string",
                  description: 'np. "/baby" lub "https://..."',
                }),
              ],
            }),

            // Video — PL / EN
            defineField({
              name: "video",
              title: "Video",
              type: "object",
              fields: [
                // POLSKI
                defineField({
                  name: "pl",
                  title: "Polski",
                  type: "object",
                  fields: [
                    defineField({
                      name: "url",
                      title: "Link do video — Polski",
                      type: "url",
                      description: "YouTube, Vimeo lub inny link do video",
                    }),
                    defineField({
                      name: "title",
                      title: "Tytuł video — Polski",
                      type: "string",
                    }),
                  ],
                }),

                // ENGLISH
                defineField({
                  name: "en",
                  title: "English",
                  type: "object",
                  fields: [
                    defineField({
                      name: "url",
                      title: "Video URL — English",
                      type: "url",
                      description: "YouTube, Vimeo or another video link",
                    }),
                    defineField({
                      name: "title",
                      title: "Video title — English",
                      type: "string",
                    }),
                  ],
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "sectionTitle",
              // media: "backgroundImage",
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
