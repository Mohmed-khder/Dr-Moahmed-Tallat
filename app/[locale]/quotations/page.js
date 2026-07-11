import React from "react";
import { fetchSettings, fetchTestimonials } from "../../lib/server-api";
import { getTranslations } from "next-intl/server";
import QuotationsHeader from "../../QuotationsPage/QuotationsHeader";
import Quotations from "../../QuotationsPage/Quotations";
import { getCanonicalUrl, getLanguageAlternates } from "../../lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();

  const siteName = settings?.site_name
    ? locale === "ar"
      ? settings.site_name.ar
      : settings.site_name.en
    : "Dr. Mohamed Talaat";

  const title = t("quotations.title");
  const description = t("quotations.seo_description") || t("quotations.title");

  return {
    title: `${title} - ${siteName}`,
    description: description,
    alternates: {
      canonical: getCanonicalUrl(locale, "quotations"),
      languages: getLanguageAlternates({ ar: "quotations", en: "quotations" }),
    },
    openGraph: {
      title: title,
      description: description,
      url: getCanonicalUrl(locale, "quotations"),
      type: "website",
      ...(settings?.logo && { images: [settings.logo] }),
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      ...(settings?.logo && { images: [settings.logo] }),
    },
  };
}

const QuotationsPage = async (props) => {
  const searchParams = await props.searchParams;
  const { page = 1 } = searchParams;
  
  const quotationsData = await fetchTestimonials({ page });

  return (
    <div className="quotations-page-container mt-20">
      <QuotationsHeader />
      <Quotations data={quotationsData} />
    </div>
  );
};

export default QuotationsPage;
