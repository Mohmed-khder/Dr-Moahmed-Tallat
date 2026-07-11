import {
  fetchArticleTypes,
  fetchArticlesList,
  fetchPages,
} from "../lib/server-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const baseUrl = "https://mohamedtalat.com";
const defaultLastModified = new Date("2026-07-11T00:00:00.000Z");

function getLastModified(source, fallback = defaultLastModified) {
  const value =
    source?.updated_at ||
    source?.updatedAt ||
    source?.published_at ||
    source?.publishedAt ||
    source?.created_at ||
    source?.createdAt;

  if (!value) return fallback;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateSitemapXml(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${entries
    .map(
      (entry) => `
  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;
}

async function fetchAllArticles(typeSlug = null) {
  const articles = [];
  let page = 1;
  let lastPage = 1;

  do {
    const res = await fetchArticlesList(typeSlug, { page, per_page: 100 });
    const pageArticles = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res)
        ? res
        : [];

    articles.push(...pageArticles);

    lastPage = Number(res?.last_page || page);
    page += 1;
  } while (page <= lastPage && page <= 100);

  return articles;
}

export async function GET() {
  const locales = ["ar", "en"];

  // 1. Static Routes
  const staticPaths = [
    "",
    "/about",
    "/contact",
    "/analyses",
    "/galleries",
    "/podcasts",
    "/quotations",
    "/meetings-conferences",
    "/research-archive",
  ];

  const staticEntries = [];
  locales.forEach((locale) => {
    staticPaths.forEach((path) => {
      staticEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: defaultLastModified,
        changeFrequency: "weekly",
        priority: path === "" ? 1.0 : 0.8,
      });
    });
  });

  // 2. Information Pages (Dynamic from API)
  let infoPages = [];
  try {
    infoPages = await fetchPages();
  } catch (err) {
    console.error("Sitemap: Failed to fetch pages", err);
  }

  const infoPageEntries = [];
  infoPages.forEach((page) => {
    locales.forEach((locale) => {
      const slugValue =
        typeof page.slug === "string"
          ? page.slug
          : page.slug[locale] || page.slug["en"] || page.slug["ar"];
      if (slugValue) {
        infoPageEntries.push({
          url: `${baseUrl}/${locale}/${slugValue}`,
          lastModified: getLastModified(page),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    });
  });

  // 3. Strategic Analyses (Types and Articles)
  const analysisEntries = [];
  try {
    const analysisTypes = await fetchArticleTypes();

    for (const type of analysisTypes) {
      for (const locale of locales) {
        const typeSlug =
          type.slug[locale] || type.slug["en"] || type.slug["ar"];
        if (typeSlug) {
          analysisEntries.push({
            url: `${baseUrl}/${locale}/analyses/${typeSlug}`,
            lastModified: getLastModified(type),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      }
    }

    const articles = await fetchAllArticles();
    const articleUrls = new Set();

    articles.forEach((article) => {
      locales.forEach((locale) => {
        const articleSlug =
          article.slug?.[locale] ||
          article.slug?.["en"] ||
          article.slug?.["ar"];

        if (!articleSlug) return;

        const url = `${baseUrl}/${locale}/analyses/article/${articleSlug}`;
        if (articleUrls.has(url)) return;
        articleUrls.add(url);

        analysisEntries.push({
          url,
          lastModified: getLastModified(article),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      });
    });
  } catch (err) {
    console.error("Sitemap: Failed to fetch analyses", err);
  }

  const allEntries = [
    ...staticEntries,
    ...infoPageEntries,
    ...analysisEntries,
  ];

  const xml = generateSitemapXml(allEntries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
