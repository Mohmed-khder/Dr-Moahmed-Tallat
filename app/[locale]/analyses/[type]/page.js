import {
  fetchSettings,
  fetchArticleTypes,
  fetchArticlesList,
} from "../../../lib/server-api";
import { getTranslations } from "next-intl/server";
import AnalysesHeader from "../../../AnalysesPage/AnalysesHeader";
import Analyses from "../../../AnalysesPage/Analyses";
import { getCanonicalUrl, getLanguageAlternates } from "../../../lib/seo";

function getLocalizedSlug(slug, locale) {
  if (!slug) return "";
  if (typeof slug === "string") return slug;
  return slug?.[locale] || slug?.["en"] || slug?.["ar"] || "";
}

function typeMatchesSlug(articleType, decodedType, locale) {
  if (typeof articleType.slug === "string") {
    return articleType.slug === decodedType;
  }

  return (
    articleType.slug?.[locale] === decodedType ||
    articleType.slug?.["en"] === decodedType ||
    articleType.slug?.["ar"] === decodedType
  );
}

export async function generateMetadata({ params }) {
  const { locale, type } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();
  const decodedType = decodeURIComponent(type);

  // Find the type to get its metadata
  const types = await fetchArticleTypes();
  const currentType = types.find((t) => typeMatchesSlug(t, decodedType, locale));

  const siteName = settings?.site_name
    ? locale === "ar"
      ? settings.site_name.ar
      : settings.site_name.en
    : "Dr. Mohamed Talaat";

  const fallbackName = decodedType
    ? decodedType.replace(/-/g, " ")
    : t("analyses.title");
  const typeName = currentType
    ? currentType.name?.[locale] || currentType.name?.["en"]
    : fallbackName;
  const title = `${typeName} - ${t("analyses.title")}`;

  // Use category-specific metadata if available
  const description =
    currentType?.meta_description?.[locale] ||
    currentType?.meta_description?.["en"] ||
    currentType?.description?.[locale] ||
    t("navbar.seo_description");
  const image =
    currentType?.meta_image_url || currentType?.image_url || settings?.logo;

  const arSlug = currentType
    ? getLocalizedSlug(currentType.slug, "ar")
    : decodedType;
  const enSlug = currentType
    ? getLocalizedSlug(currentType.slug, "en")
    : decodedType;

  const canonicalTypeSlug = currentType
    ? getLocalizedSlug(currentType.slug, locale)
    : decodedType;
  const canonicalPath = `analyses/${canonicalTypeSlug}`;

  return {
    title: `${title} | ${siteName}`,
    description: description,
    alternates: {
      canonical: getCanonicalUrl(locale, canonicalPath),
      languages: getLanguageAlternates({
        ar: `analyses/${arSlug}`,
        en: `analyses/${enSlug}`,
      }),
    },
    openGraph: {
      title: title,
      description: description,
      url: getCanonicalUrl(locale, canonicalPath),
      type: "website",
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

const AnalysesListPage = async (props) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { locale, type } = params;
  const { page, search } = searchParams;
  const t = await getTranslations({ locale });
  const isRTL = locale === "ar";

  const decodedType = decodeURIComponent(type);

  const types = await fetchArticleTypes();
  const currentType = types.find((t) => typeMatchesSlug(t, decodedType, locale));

  const fallbackName = decodedType
    ? decodedType.replace(/-/g, " ")
    : t("analyses.title");
  const typeName = currentType
    ? currentType.name?.[locale] || currentType.name?.["en"]
    : fallbackName;

  const articlesData = await fetchArticlesList(
    currentType ? getLocalizedSlug(currentType.slug, locale) : decodedType,
    { page: page || 1, search },
  );

  const articles = articlesData?.data || [];
  const pagination = articlesData || null;

  const translations = {
    noItems: t("analyses.noItems"),
    readMore: t("analyses.readMore"),
    prev: t("pagination.prev"),
    next: t("pagination.next"),
  };

  return (
    <div className="analyses-page-container mt-20">
      <AnalysesHeader
        title={typeName}
        breadcrumbHome={t("navbar.home")}
        breadcrumbCurrent={typeName}
        isRTL={isRTL}
      />
      <Analyses
        articles={articles}
        pagination={pagination}
        translations={translations}
        locale={locale}
        isRTL={isRTL}
        currentType={currentType}
      />
    </div>
  );
};

export default AnalysesListPage;
