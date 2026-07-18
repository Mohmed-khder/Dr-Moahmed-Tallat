import AIUsagePolicy from "../../InformationPages/AIUsagePolicy";
import { fetchPages, fetchSettings } from "../../lib/server-api";
import { getCanonicalUrl, getLanguageAlternates } from "../../lib/seo";

function findAiPolicyPage(pages) {
  return pages.find((p) => p.slug === "ai-policy" || p.slug === "ai-poilcy");
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const pages = await fetchPages();
  const settings = await fetchSettings();
  const data = findAiPolicyPage(pages);

  const title = data?.title?.[locale] || "AI Usage Policy";
  const content = data?.content?.[locale] || "";
  const siteTitle = settings?.site_name?.[locale] || "Dr. Mohamed Talaat";
  const siteDescription = settings?.site_description?.[locale] || "";
  const ogImage = settings?.logo || "";

  return {
    title,
    description: content.substring(0, 160) || siteDescription,
    alternates: {
      canonical: getCanonicalUrl(locale, "ai-policy"),
      languages: getLanguageAlternates({ ar: "ai-policy", en: "ai-policy" }),
    },
    openGraph: {
      title: `${title} | ${siteTitle}`,
      description: content.substring(0, 160) || siteDescription,
      url: getCanonicalUrl(locale, "ai-policy"),
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

export default async function AIPolicyPage() {
  const pages = await fetchPages();
  const data = findAiPolicyPage(pages);

  if (!data) return <div>Page not found</div>;

  return <AIUsagePolicy data={data} />;
}
