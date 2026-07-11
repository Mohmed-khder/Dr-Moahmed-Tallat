import AxiologicalandStrategicObjectives from "../../InformationPages/AxiologicalandStrategicObjectives";
import { fetchPages, fetchSettings } from "../../lib/server-api";
import { getCanonicalUrl, getLanguageAlternates } from "../../lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const pages = await fetchPages();
  const settings = await fetchSettings();
  const data = pages.find((p) => p.slug === "axiologicalandstrategic-objectives");

  const title = data?.title?.[locale] || "Axiological and Strategic Objectives";
  const content = data?.content?.[locale] || "";
  const siteTitle = settings?.site_name?.[locale] || "Dr. Mohamed Talaat";
  const siteDescription = settings?.site_description?.[locale] || "";
  const ogImage = settings?.logo || "";

  return {
    title,
    description: content.substring(0, 160) || siteDescription,
    alternates: {
      canonical: getCanonicalUrl(locale, "axiologicalandstrategic-objectives"),
      languages: getLanguageAlternates({
        ar: "axiologicalandstrategic-objectives",
        en: "axiologicalandstrategic-objectives",
      }),
    },
    openGraph: {
      title: `${title} | ${siteTitle}`,
      description: content.substring(0, 160) || siteDescription,
      url: getCanonicalUrl(locale, "axiologicalandstrategic-objectives"),
      ...(ogImage && { images: [ogImage] }),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteTitle}`,
      description: content.substring(0, 160) || siteDescription,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function ObjectivesPage() {
  const pages = await fetchPages();
  const data = pages.find((p) => p.slug === "axiologicalandstrategic-objectives");

  if (!data) return <div>Page not found</div>;

  return <AxiologicalandStrategicObjectives data={data} />;
}
