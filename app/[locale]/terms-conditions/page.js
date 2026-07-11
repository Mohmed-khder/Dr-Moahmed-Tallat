import TermsOfUse from "../../InformationPages/TermsOfUse";
import { fetchPages, fetchSettings } from "../../lib/server-api";
import { getCanonicalUrl, getLanguageAlternates } from "../../lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const pages = await fetchPages();
  const settings = await fetchSettings();
  const data = pages.find((p) => p.slug === "terms-conditions");

  const title = data?.title?.[locale] || "Terms of Use";
  const content = data?.content?.[locale] || "";
  const siteTitle = settings?.site_name?.[locale] || "Dr. Mohamed Talaat";
  const siteDescription = settings?.site_description?.[locale] || "";
  const ogImage = settings?.logo || "";

  return {
    title,
    description: content.substring(0, 160) || siteDescription,
    alternates: {
      canonical: getCanonicalUrl(locale, "terms-conditions"),
      languages: getLanguageAlternates({
        ar: "terms-conditions",
        en: "terms-conditions",
      }),
    },
    openGraph: {
      title: `${title} | ${siteTitle}`,
      description: content.substring(0, 160) || siteDescription,
      url: getCanonicalUrl(locale, "terms-conditions"),
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

export default async function TermsPage() {
  const pages = await fetchPages();
  const data = pages.find((p) => p.slug === "terms-conditions");

  if (!data) return <div>Page not found</div>;

  return <TermsOfUse data={data} />;
}
