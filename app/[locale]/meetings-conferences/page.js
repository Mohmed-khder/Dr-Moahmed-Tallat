import React from "react";
import { fetchSettings, fetchConferences } from "../../lib/server-api";
import { getTranslations } from "next-intl/server";
import MeetingsAndConferencesHeader from "../../MeetingsAndConferencesPage/MeetingsAndConferencesHeader";
import MeetingsAndConferences from "../../MeetingsAndConferencesPage/MeetingsAndConferences";
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

  const title = t("meetings.title");
  const description = t("meetings.seo_description");

  return {
    title: `${title} - ${siteName}`,
    description: description,
    alternates: {
      canonical: getCanonicalUrl(locale, "meetings-conferences"),
      languages: getLanguageAlternates({
        ar: "meetings-conferences",
        en: "meetings-conferences",
      }),
    },
    openGraph: {
      title: title,
      description: description,
      url: getCanonicalUrl(locale, "meetings-conferences"),
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

const MeetingsAndConferencesPage = async (props) => {
  const searchParams = await props.searchParams;
  const { page = 1 } = searchParams;
  
  const meetingsData = await fetchConferences({ page });

  return (
    <div className="meetings-page-container mt-20">
      <MeetingsAndConferencesHeader />
      <MeetingsAndConferences data={meetingsData} />
    </div>
  );
};

export default MeetingsAndConferencesPage;
