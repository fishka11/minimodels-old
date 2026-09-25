// src/sanity/lib/client.js
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

export async function sanityFetch({
  query,
  params = {},
  revalidate = 3600, // default revalidation time in seconds
  useCdn = true,
  // tags = [],
}) {
  return client.fetch(query, params, {
    useCdn,
    next: {
      // revalidate: tags.length ? false : revalidate, // for simple, time-based revalidation
      // tags, // for tag-based revalidation
      revalidate,
    },
  });
}
