// src/sanity/schemaTypes/homePageType.js
import { defineField, defineType, defineArrayMember } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const castingPageType = defineType({
  name: "castingPage",
  title: "Castingi / Castings",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tytuł strony (wewnętrzny)",
      type: "string",
      initialValue: "Castingi",
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
                "Page title for search engines (approx. 60 characters)",
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

    defineField({
      name: "body",
      title: "Treść strony / Page content",
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

            // ✉️ EMAIL — opis PL/EN + adres
            defineField({
              name: "email",
              title: "Email",
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Opis / Label",
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
                  name: "address",
                  title: "Adres email",
                  type: "string",
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
