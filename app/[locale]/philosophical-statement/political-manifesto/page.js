import PoliticalManifesto from "../../../InformationPages/PoliticalManifesto";
import { fetchPages, fetchSettings } from "../../../lib/server-api";
import { getCanonicalUrl, getLanguageAlternates } from "../../../lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const pages = await fetchPages();
  const settings = await fetchSettings();
  const data = pages.find((p) => p.slug === "political-manifesto");

  const title = data?.title?.[locale] || "Political Manifesto";
  const content = data?.content?.[locale] || "";
  const siteTitle = settings?.site_name?.[locale] || "Dr. Mohamed Talaat";
  const siteDescription = settings?.site_description?.[locale] || "";
  const ogImage = settings?.logo || "";

  return {
    title,
    description: content.substring(0, 160) || siteDescription,
    alternates: {
      canonical: getCanonicalUrl(
        locale,
        "philosophical-statement/political-manifesto",
      ),
      languages: getLanguageAlternates({
        ar: "philosophical-statement/political-manifesto",
        en: "philosophical-statement/political-manifesto",
      }),
    },
    openGraph: {
      title: `${title} | ${siteTitle}`,
      description: content.substring(0, 160) || siteDescription,
      url: getCanonicalUrl(
        locale,
        "philosophical-statement/political-manifesto",
      ),
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

export default async function PoliticalManifestoPage() {
  const pages = await fetchPages();
  const data = pages.find((p) => p.slug === "political-manifesto");

  if (!data) return <div>Page not found</div>;

  return <PoliticalManifesto data={data} />;
}
