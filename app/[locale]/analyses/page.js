import React from "react";
import { fetchSettings, fetchArticlesList } from "../../lib/server-api";
import { getTranslations } from "next-intl/server";
import AnalysesHeader from "../../AnalysesPage/AnalysesHeader";
import Analyses from "../../AnalysesPage/Analyses";
import AnalysesFilter from "../../AnalysesPage/AnalysesFilter";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();

  const siteName = settings?.site_name
    ? locale === "ar"
      ? settings.site_name.ar
      : settings.site_name.en
    : "Dr. Mohamed Talaat";

  const title = t("navbar.allAnalyses");

  const baseUrl = "https://mohamedtalat.com";

  return {
    title: `${title} | ${siteName}`,
    description: t("navbar.seo_description"),
    alternates: {
      canonical: `${baseUrl}/${locale}/analyses`,
    },
    openGraph: {
      title: title,
      url: `${baseUrl}/${locale}/analyses`,
      type: "website",
      ...(settings?.logo && { images: [settings.logo] }),
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      ...(settings?.logo && { images: [settings.logo] }),
    },
  };
}

const AnalysesAllPage = async (props) => {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { locale } = params;
  const { is_featured, is_old, page, search } = searchParams;
  const articleAgeFilter = is_old === "1" ? "1" : "0";

  const t = await getTranslations({ locale });
  const isRTL = locale === "ar";

  const title = t("navbar.allAnalyses");

  // Fetch all articles (passing null/undefined for typeSlug parameter)
  const articlesData = await fetchArticlesList(null, { 
    is_featured, 
    is_old: articleAgeFilter,
    search,
    page: page || 1 
  });

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
        title={title}
        breadcrumbHome={t("navbar.home")}
        breadcrumbCurrent={title}
        isRTL={isRTL}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <AnalysesFilter isRTL={isRTL} />
      </div>
      <Analyses
        articles={articles}
        pagination={pagination}
        translations={translations}
        locale={locale}
        isRTL={isRTL}
      />
    </div>
  );
};

export default AnalysesAllPage;
