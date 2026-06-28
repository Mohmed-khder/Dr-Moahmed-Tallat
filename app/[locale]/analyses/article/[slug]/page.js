import {
  fetchSettings,
  fetchArticleDetails,
  fetchArticlesList,
} from "../../../../lib/server-api";
import { getTranslations } from "next-intl/server";
// import AnalysesHeader from "../../../../AnalysesPage/AnalysesHeader";
import AnalysesDetails from "../../../../AnalysesPage/AnalysesDetails";

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();

  const article = await fetchArticleDetails(slug);

  const siteName = settings?.site_name
    ? locale === "ar"
      ? settings.site_name.ar
      : settings.site_name.en
    : "Dr. Mohamed Talaat";

  const title = article
    ? article.meta_title?.[locale] ||
      article.meta_title?.["en"] ||
      article.title?.[locale] ||
      article.title?.["en"]
    : t("analyses.title");

  // Custom description logic: Meta Description or Content Snippet
  let description = article
    ? article.meta_description?.[locale] || article.meta_description?.["en"]
    : null;
  if (!description && article?.content?.[locale]) {
    description = stripHtml(article.content[locale]).substring(0, 160);
  }
  if (!description && article?.content?.["en"]) {
    description = stripHtml(article.content["en"]).substring(0, 160);
  }
  description = description || t("navbar.seo_description");

  const image = article
    ? article.meta_image_url || article.image_url
    : settings?.logo;

  const arSlug = article?.slug?.["ar"] || article?.slug?.["en"] || slug;
  const enSlug = article?.slug?.["en"] || article?.slug?.["ar"] || slug;
  const canonicalSlug = article?.slug?.[locale] || article?.slug?.["en"] || slug;

  const baseUrl = "https://mohamedtalat.com";
  const canonicalUrl = `${baseUrl}/${locale}/analyses/article/${canonicalSlug}`;

  return {
    title: `${title} | ${siteName}`,
    description: description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ar: `${baseUrl}/ar/analyses/article/${arSlug}`,
        en: `${baseUrl}/en/analyses/article/${enSlug}`,
      },
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
  const articlesData = await fetchArticlesList(null, { per_page: 12 });
  const recommendedArticles = Array.isArray(articlesData?.data)
    ? articlesData.data
    : Array.isArray(articlesData)
      ? articlesData
      : [];

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

  const title = article
    ? article.title?.[locale] || article.title?.["en"]
    : t("analyses.title");
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
