import { defineQuery } from "next-sanity";

export const BABIES_WITH_CATEGORY_QUERY = defineQuery(`
  {
    "models": *[_type == "model" 
      && category->title == "baby" 
      && active == true
      && defined(contractDate)
      && dateTime(contractDate + "T00:00:00Z") > dateTime($cutoffDate)
    ]
    // | order(_createdAt desc) {
    | order(
        dateTime(contractDate + "T00:00:00Z") desc,
        _createdAt desc
      ) {
      _id, name, slug, birthDate, contractDate, _createdAt, profileImage,
      "category": {
        "title": category->title,
        "displayName": category->displayName
      }
    },
    "categoryInfo": *[_type == "modelCategory" && title == "baby"][0] {
      _id,
      title,
      seo,
      pageTitle,
      pageSubtitle
    }
  }
`);

export const MINIBOYS_WITH_CATEGORY_QUERY = defineQuery(`
  {
    "models": *[_type == "model" 
      && category->title == "mini-boys" 
      && active == true
      && defined(contractDate)
      && dateTime(contractDate + "T00:00:00Z") > dateTime($cutoffDate)
    ]
    // | order(_createdAt desc) {
    | order(
        dateTime(contractDate + "T00:00:00Z") desc,
        _createdAt desc
      ) {
      _id, name, slug, birthDate, contractDate, _createdAt, profileImage,
      "category": {
        "title": category->title,
        "displayName": category->displayName
      }
    },
    "categoryInfo": *[_type == "modelCategory" && title == "mini-boys"][0] {
      _id,
      title,
      seo,
      pageTitle,
      pageSubtitle
    }
  }
`);

export const MINIGIRLS_WITH_CATEGORY_QUERY = defineQuery(`
  {
    "models": *[_type == "model" 
      && category->title == "mini-girls" 
      && active == true
      && defined(contractDate)
      && dateTime(contractDate + "T00:00:00Z") > dateTime($cutoffDate)
    ]
    // | order(_createdAt desc) {
    | order(
        dateTime(contractDate + "T00:00:00Z") desc,
        _createdAt desc
      ) {
      _id, name, slug, birthDate, contractDate, _createdAt, profileImage,
      "category": {
        "title": category->title,
        "displayName": category->displayName
      }
    },
    "categoryInfo": *[_type == "modelCategory" && title == "mini-girls"][0] {
      _id,
      title,
      seo,
      pageTitle,
      pageSubtitle
    }
  }
`);

export const TEENS_WITH_CATEGORY_QUERY = defineQuery(`
  {
    "models": *[_type == "model" 
      && category->title == "nastolatki" 
      && active == true
      && defined(contractDate)
      && dateTime(contractDate + "T00:00:00Z") > dateTime($cutoffDate)
    ]
    // | order(_createdAt desc) {
    | order(
        dateTime(contractDate + "T00:00:00Z") desc,
        _createdAt desc
      ) {
      _id, name, slug, birthDate, contractDate, _createdAt, profileImage,
      "category": {
        "title": category->title,
        "displayName": category->displayName
      }
    },
    "categoryInfo": *[_type == "modelCategory" && title == "nastolatki"][0] {
      _id,
      title,
      seo,
      pageTitle,
      pageSubtitle
    }
  }
`);

export const MODEL_WITH_SIBLINGS_QUERY = defineQuery(`
  *[_type == "model" && slug.current == $slug][0] {
    _id,
    _createdAt,
    name,
    slug,
    contractDate,
    birthDate,
    "category": category->title,
    profileImage,
    gallery[defined(asset)] {
      asset-> {
        _id,
        url,
        alt,
        metadata {
          dimensions { width, height, aspectRatio }
        }
      },
      _key,
      _type,
      alt
    },
    eyeColor,
    hairColor,
    hairLength,
    hairType,
    "siblings": {
      "prev": *[_type == "model"
        && category->title == ^.category->title
        && active == true
        && defined(contractDate)
        && dateTime(contractDate + "T00:00:00Z") > dateTime($cutoffDate)
        // && _createdAt > ^._createdAt
        && (
          dateTime(contractDate + "T00:00:00Z") < dateTime(^.contractDate + "T00:00:00Z")
          ||
          (
            contractDate == ^.contractDate
            && _createdAt < ^._createdAt
          )
        )
      ]
      // | order(_createdAt asc)[0] {
      | order(
          dateTime(contractDate + "T00:00:00Z") desc,
          _createdAt desc
        )[0] {
        name,
        slug,
        profileImage
      },
      
      "next": *[_type == "model"
        && category->title == ^.category->title
        && active == true
        && defined(contractDate)
        && dateTime(contractDate + "T00:00:00Z") > dateTime($cutoffDate)
        // && _createdAt < ^._createdAt
        && (
          dateTime(contractDate + "T00:00:00Z") > dateTime(^.contractDate + "T00:00:00Z")
          ||
          (
            contractDate == ^.contractDate
            && _createdAt > ^._createdAt
          )
        )
      ]
      // | order(_createdAt desc)[0] {
      | order(
          dateTime(contractDate + "T00:00:00Z") asc,
          _createdAt asc
        )[0] {
        name,
        slug,
        profileImage
      }
    }
  }
`);

export const ALL_BABY_SLUGS_QUERY =
  defineQuery(`*[_type == "model" && category->title == "baby" && active == true && defined(slug.current)] {
    "slug": slug.current
  }`);

export const ALL_MINIBOYS_SLUGS_QUERY =
  defineQuery(`*[_type == "model" && category->title == "mini-boys" && active == true && defined(slug.current)] {
    "slug": slug.current
  }`);

export const ALL_MINIGIRLS_SLUGS_QUERY =
  defineQuery(`*[_type == "model" && category->title == "mini-girls" && active == true && defined(slug.current)] {
    "slug": slug.current
  }`);

export const ALL_TEENS_SLUGS_QUERY =
  defineQuery(`*[_type == "model" && category->title == "nastolatki" && active == true && defined(slug.current)] {
    "slug": slug.current
  }`);

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage" && _id == "homePage"][0] {
    title,
    seo,
    sections[] {
      sectionTitle,
      texts,
      button,
      video
    }
  }
`);

export const CASTING_PAGE_QUERY = defineQuery(`
  *[_type=="castingPage"][0]{
  title,
  seo,
  pageTitle,
  pageSubtitle,
  body,
  sections[] {
    sectionTitle,
    texts,
    button,
    video,
    email
  }
}
`);

export const ABOUTUS_PAGE_QUERY = defineQuery(`
  *[_type=="aboutUsPage"][0]{
  title,
  seo,
  pageTitle,
  pageSubtitle,
  body,
  sections[] {
    sectionTitle,
    texts,
    button,
    video,
    email
  }
}
`);

export const FAQ_PAGE_QUERY = defineQuery(`
  *[_type == "faqPage"][0]{
    title,
    seo,
    pageTitle,
    pageSubtitle,
    faq[] {
      _key,
      question,
      answer
    }
  }
`);

export const CONTACT_PAGE_QUERY = defineQuery(`
  *[_type == "contactPage"][0]{
    title,
    seo,
    pageTitle,
    pageSubtitle,
    bodySections,
    sections[] {
      sectionTitle,
      texts,
      phones,
      button,
      video,
      email
    } 
  }
`);

export const EXPIRED_MODELS_QUERY = defineQuery(`
  *[
    _type == "model" &&
    active == true &&
    defined(contractDate) &&
    dateTime(contractDate + "T00:00:00Z") < dateTime($limitDate)
  ]{
    _id,
    name,
    contractDate,
    slug,
    "categoryTitle": category->title
  }
`);

export const CASTING_SECTION_QUERY = defineQuery(`
  *[_type == "castingSection"][0]{
    title,
    headline { pl, en },
    subheadline { pl, en },
    blocks[] {
      internalTitle,
      title { pl, en },
      logo {
        pl { image { asset->{_id, url, alt, metadata { dimensions { width, height, aspectRatio } }} }, alt },
        en { image { asset->{_id, url, alt, metadata { dimensions { width, height, aspectRatio } }} }, alt },
      },
      description { pl[], en[] },
      button { label { pl, en }, url }
    }
  }
`);

export const TEAM_SECTION_QUERY = defineQuery(`*[_type == "teamSection"][0]{
    title{
      pl,
      en
    },
    members[]{
      photo{
        asset->{
          _id,
          url,
          alt,
          metadata {
            dimensions { width, height, aspectRatio }
          }
        }
      },
      content{
        pl{
          name,
          description,
          alt,
          active
        },
        en{
          name,
          description,
          alt,
          active
        }
      }
    }
  }
`);

export const CONTACT_PAGE_QUERY_WITH_TEAM = defineQuery(`
{
  "contactPage": *[_type == "contactPage"][0]{
    title,
    seo,
    pageTitle,
    pageSubtitle,
    bodySections,
    sections[]{
      sectionTitle,
      texts,
      phones,
      button,
      video,
      email
    }
  },
  "teamSection": *[_type == "teamSection"][0]{
    title{
      pl,
      en
    },
    members[]{
      photo{
        asset->{
          _id,
          url,
          alt,
          metadata{
            dimensions{
              width,
              height,
              aspectRatio
            }
          }
        }
      },
      content{
        pl{
          name,
          description,
          alt,
          active
        },
        en{
          name,
          description,
          alt,
          active
        }
      }
    }
  }
}
`);
