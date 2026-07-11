import GalleriesHeader from "@/app/GalleriesPage/GalleriesHeader";
import Galleries from "@/app/GalleriesPage/Galleries";
import { fetchGalleries, fetchSettings } from "@/app/lib/server-api";
import { getTranslations } from "next-intl/server";
import { getCanonicalUrl, getLanguageAlternates } from "@/app/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "galleries" });
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
      canonical: getCanonicalUrl(locale, "galleries"),
      languages: getLanguageAlternates({ ar: "galleries", en: "galleries" }),
    },
    openGraph: {
      title: title,
      description: t("seo_description"),
      url: getCanonicalUrl(locale, "galleries"),
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

export default async function GalleriesPage({ params, searchParams }) {
  const { locale } = await params;
  const { page = 1 } = await searchParams;

  const galleriesData = await fetchGalleries({ page });

  return (
    <main className="pt-20">
      <GalleriesHeader />
      <Galleries data={galleriesData} initialPage={parseInt(page)} />
    </main>
  );
}
