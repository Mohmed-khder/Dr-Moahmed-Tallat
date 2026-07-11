import { fetchSettings } from "../../lib/server-api";
import { getTranslations } from "next-intl/server";
import HeadAbout from "../../AboutPage/HeadAbout";
import AboutTwo from "../../HomePage/AboutTwo";
import TallatCvServer from "@/app/HomePage/TallatCvServer";
import { getCanonicalUrl, getLanguageAlternates } from "../../lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();

  const title = t("about.title") || t("navbar.about");
  const description = t("about.description");

  return {
    title: title,
    description: description,
    alternates: {
      canonical: getCanonicalUrl(locale, "about"),
      languages: getLanguageAlternates({ ar: "about", en: "about" }),
    },
    openGraph: {
      title: title,
      description: description,
      url: getCanonicalUrl(locale, "about"),
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

export default function AboutPage() {
  return (
    <div className="about-page-container mt-20">
      <HeadAbout />
      <div className="pt-20">
        <AboutTwo />
        <TallatCvServer />
      </div>
    </div>
  );
}
