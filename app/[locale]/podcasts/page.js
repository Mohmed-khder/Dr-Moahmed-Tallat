import PodcastsHeader from "@/app/podcastsPage/PodcastsHeader";
import Podcasts from "@/app/podcastsPage/Podcasts";
import { fetchPodcasts, fetchSettings } from "@/app/lib/server-api";
import { getTranslations } from "next-intl/server";
import { getCanonicalUrl, getLanguageAlternates } from "@/app/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "podcasts" });
  const settings = await fetchSettings();

  const siteName = settings?.site_name
    ? locale === "ar"
      ? settings.site_name.ar
      : settings.site_name.en
    : "Dr. Mohamed Talaat";

  const title = t("title");

  return {
    title: `${title}`,
    description: t("seo_description"),
    alternates: {
      canonical: getCanonicalUrl(locale, "podcasts"),
      languages: getLanguageAlternates({ ar: "podcasts", en: "podcasts" }),
    },
    openGraph: {
      title: title,
      description: t("seo_description"),
      url: getCanonicalUrl(locale, "podcasts"),
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

export default async function PodcastsPage({ params, searchParams }) {
  const { locale } = await params;
  const { page = 1 } = await searchParams;

  const podcastsData = await fetchPodcasts({ page });

  return (
    <main className="pt-20">
      <PodcastsHeader />
      <Podcasts data={podcastsData} initialPage={parseInt(page)} />
    </main>
  );
}
