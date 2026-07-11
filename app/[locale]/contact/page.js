import { fetchSettings } from "../../lib/server-api";
import { getTranslations } from "next-intl/server";
import HeadContact from "../../ContactPage/HeadContact";
import ContactForm from "../../ContactPage/ContactForm";
import Map from "../../ContactPage/Map";
import { getCanonicalUrl, getLanguageAlternates } from "../../lib/seo";
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await fetchSettings();

  const title = t("headContact.title");
  const description = t("contactForm.description");

  return {
    title: title,
    description: description,
    alternates: {
      canonical: getCanonicalUrl(locale, "contact"),
      languages: getLanguageAlternates({ ar: "contact", en: "contact" }),
    },
    openGraph: {
      title: title,
      description: description,
      url: getCanonicalUrl(locale, "contact"),
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

export default function ContactPage() {
  return (
    <div className="contact-page-container">
      <HeadContact />
      <ContactForm />
      <Map />
    </div>
  );
}
