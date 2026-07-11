import { fetchSettings } from "../../lib/server-api";
import { getTranslations } from "next-intl/server";
import FaqHeader from "../../FaqPage/FaqHeader";
import FaqSection from "../../FaqPage/FaqSection";
import { getCanonicalUrl, getLanguageAlternates } from "../../lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();

  const title = t("faq.title");
  const description = t("faq.subtitle");

  return {
    title: title,
    description: description,
    alternates: {
      canonical: getCanonicalUrl(locale, "faq"),
      languages: getLanguageAlternates({ ar: "faq", en: "faq" }),
    },
    openGraph: {
      title: title,
      description: description,
      url: getCanonicalUrl(locale, "faq"),
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

export default function FaqPage() {
  return (
    <div className="faq-page-container mt-20">
      <FaqHeader />
      <FaqSection />
    </div>
  );
}
