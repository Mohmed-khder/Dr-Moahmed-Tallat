import {
  fetchSettings,
  fetchArticleDetails,
  fetchArticlesList,
  fetchArticleTypes,
} from "../../../../lib/server-api";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
// import AnalysesHeader from "../../../../AnalysesPage/AnalysesHeader";
import AnalysesDetails from "../../../../AnalysesPage/AnalysesDetails";
import { getCanonicalUrl, getLanguageAlternates } from "../../../../lib/seo";

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getLocalizedSlug(slug, locale) {
  if (!slug) return "";
  if (typeof slug === "string") return slug;
  return slug?.[locale] || slug?.["en"] || slug?.["ar"] || "";
}

function getArticleTypeSlug(article, locale) {
  return (
    getLocalizedSlug(article?.type?.slug, locale) ||
    article?.type_slug ||
    article?.article_type_slug ||
    getLocalizedSlug(article?.article_type?.slug, locale)
  );
}

function getArticleParentTypeSlug(article, locale) {
  return (
    getLocalizedSlug(article?.type?.parent?.slug, locale) ||
    getLocalizedSlug(article?.parent_type?.slug, locale) ||
    getLocalizedSlug(article?.article_type?.parent?.slug, locale) ||
    article?.parent_type_slug ||
    ""
  );
}

function getSlugValues(slug) {
  if (!slug) return [];
  if (typeof slug === "string") return [slug];
  return Object.values(slug).filter(Boolean);
}

function slugMatches(slug, targetSlug) {
  if (!targetSlug) return false;
  return getSlugValues(slug).some((value) => value === targetSlug);
}

function getArticleTypeIds(article) {
  return [
    article?.type?.id,
    article?.article_type?.id,
    article?.type_id,
    article?.article_type_id,
  ].filter(Boolean);
}

function typeMatchesArticle(type, targetSlug, targetIds) {
  return (
    slugMatches(type?.slug, targetSlug) ||
    (type?.id && targetIds.includes(type.id))
  );
}

function findRootArticleType(types, article, targetSlug) {
  if (!targetSlug || !Array.isArray(types)) return null;

  const targetIds = getArticleTypeIds(article);

  for (const type of types) {
    if (typeMatchesArticle(type, targetSlug, targetIds)) return type;

    const children = Array.isArray(type?.children) ? type.children : [];
    const isChildMatch = children.some((child) =>
      typeMatchesArticle(child, targetSlug, targetIds),
    );

    if (isChildMatch) return type;
  }

  return null;
}

function getTypeFamilySlugs(type, locale) {
  if (!type) return [];

  const family = [
    getLocalizedSlug(type?.slug, locale),
    ...(Array.isArray(type?.children)
      ? type.children.map((child) => getLocalizedSlug(child?.slug, locale))
      : []),
  ];

  return [...new Set(family.filter(Boolean))];
}

function normalizeArticlesData(articlesData) {
  if (Array.isArray(articlesData?.data)) return articlesData.data;
  if (Array.isArray(articlesData)) return articlesData;
  return [];
}

function uniqueArticles(articles) {
  const seen = new Set();

  return articles.filter((article) => {
    const key =
      article?.id ||
      article?.slug?.["en"] ||
      article?.slug?.["ar"] ||
      JSON.stringify(article?.slug);

    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const article = await fetchArticleDetails(slug);
  if (!article) {
    notFound();
  }

  const t = await getTranslations({ locale });
  const settings = await fetchSettings();

  const siteName = settings?.site_name
    ? locale === "ar"
      ? settings.site_name.ar
      : settings.site_name.en
    : "Dr. Mohamed Talaat";

  const title =
    article.meta_title?.[locale] ||
    article.meta_title?.["en"] ||
    article.title?.[locale] ||
    article.title?.["en"];

  // Custom description logic: Meta Description or Content Snippet
  let description =
    article.meta_description?.[locale] || article.meta_description?.["en"];
  if (!description && article?.content?.[locale]) {
    description = stripHtml(article.content[locale]).substring(0, 160);
  }
  if (!description && article?.content?.["en"]) {
    description = stripHtml(article.content["en"]).substring(0, 160);
  }
  description = description || t("navbar.seo_description");

  const image = article.meta_image_url || article.image_url || settings?.logo;

  const arSlug = article?.slug?.["ar"] || article?.slug?.["en"] || slug;
  const enSlug = article?.slug?.["en"] || article?.slug?.["ar"] || slug;
  const canonicalSlug = article?.slug?.[locale] || article?.slug?.["en"] || slug;

  const canonicalPath = `analyses/article/${canonicalSlug}`;
  const canonicalUrl = getCanonicalUrl(locale, canonicalPath);

  return {
    title: `${title} | ${siteName}`,
    description: description,
    alternates: {
      canonical: canonicalUrl,
      languages: getLanguageAlternates({
        ar: `analyses/article/${arSlug}`,
        en: `analyses/article/${enSlug}`,
      }),
    },
    openGraph: {
      title: title,
      description: description,
      url: canonicalUrl,
      type: "article",
      ...(image && { images: [image] }),
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      ...(image && { images: [image] }),
    },
  };
}

const ArticleDetailsPage = async ({ params }) => {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const isRTL = locale === "ar";

  const article = await fetchArticleDetails(slug);
  if (!article) {
    notFound();
  }

  const articleTypeSlug = getArticleTypeSlug(article, locale);
  const directParentTypeSlug = getArticleParentTypeSlug(article, locale);
  const articleTypes = await fetchArticleTypes();
  const rootArticleType = findRootArticleType(
    articleTypes,
    article,
    directParentTypeSlug || articleTypeSlug,
  );
  const recommendationTypeSlugs = getTypeFamilySlugs(
    rootArticleType,
    locale,
  );

  const recommendationRequests = recommendationTypeSlugs.length
    ? recommendationTypeSlugs
    : [articleTypeSlug].filter(Boolean);

  const recommendationResponses = await Promise.all(
    recommendationRequests.map((typeSlug) =>
      fetchArticlesList(typeSlug, { per_page: 12 }),
    ),
  );

  const recommendedArticles = uniqueArticles(
    recommendationResponses.flatMap(normalizeArticlesData),
  ).slice(0, 12);

  const translations = {
    attachments: t("analyses.attachments"),
    noItems: t("analyses.noItems"),
    files: {
      policy_paper: t("analyses.files.policy_paper"),
      strategic_fact_sheets: t("analyses.files.strategic_fact_sheets"),
      strategic_brief: t("analyses.files.strategic_brief"),
      analytical_infographic: t("analyses.files.analytical_infographic"),
      analytical_article: t("analyses.files.analytical_article"),
    },
  };

  // const breadcrumbCurrent = title;

  return (
    <div className="analyses-details-page-container mt-20">
      {/* <AnalysesHeader 
        title={title}
        breadcrumbHome={t("navbar.home")}
        breadcrumbCurrent={breadcrumbCurrent}
        isRTL={isRTL}
      /> */}
      <AnalysesDetails
        article={article}
        recommendedArticles={recommendedArticles}
        translations={translations}
        locale={locale}
        isRTL={isRTL}
      />
    </div>
  );
};

export default ArticleDetailsPage;
