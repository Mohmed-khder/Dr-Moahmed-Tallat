import StrategicForesight from "../../InformationPages/StrategicForesight";
import { fetchPages, fetchSettings } from "../../lib/server-api";
import { getCanonicalUrl, getLanguageAlternates } from "../../lib/seo";

const fallbackData = {
  id: 15,
  title: {
    ar: "الاستشراف الاستراتيجي",
    en: "Strategic Foresight",
  },
  slug: "strategic-foresight",
  content: {
    ar: "«رَصْدُ مَا وَرَاءَ الأُفُقِ: قِرَاءَةُ الإِشَارَاتِ الخَفِيَّةِ قَبْلَ التَّحَوُّلَاتِ النَّوْعِيَّةِ»\nلَا نَنْتَظِرُ وُقُوعَ الحَدَثِ لِنُحَلِّلَهُ، بَلْ نَمْتَلِكُ أَدَوَاتِ «الإِنْذَارِ المُبَكِّرِ». \nنَعْتَمِدُ عَلَى مَصْفُوفَاتٍ اسْتِشْرَافِيَّةٍ تَرْصُدُ «التَّحَوُّلَاتِ فِي مَوَازِينِ القُوَى النَّاعِمَةِ» وَ «الِاهْتِزَازَاتِ الجِيُوبُولِيتِيكِيَّةِ».\nهَدَفُنَا هُوَ تَزْوِيدُ النُّخَبِ بِـ «البَصِيرَةِ الِاسْتِبَاقِيَّةِ» الَّتِي تَحُولُ دُونَ المُفَاجَآتِ الِاسْتْرَاتِيجِيَّةِ، مِمَّا يَجْعَلُنَا المَرْجِعَ الأَوَّلَ فِي اسْتِشْرَافِ مَلَامِحِ النِّظَامِ الدَّوْلِيِّ القَادِمِ.",
    en: "“Monitoring Beyond the Horizon: Interpreting Hidden Signals Before Transformational Shifts”\n\nWe do not wait for events to occur in order to analyze them; rather, we possess early warning tools.\nWe rely on forward-looking matrices that track shifts in the balance of soft power and geopolitical tremors.\n\nOur goal is to equip decision-makers with proactive insight that prevents strategic surprises—positioning us as the leading reference in anticipating the contours of the emerging global order.",
  },
  pdf_url: null,
  images_urls: [],
  created_at: "2026-04-25",
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const pages = await fetchPages();
  const settings = await fetchSettings();
  let data = pages.find((p) => p.slug === "strategic-foresight");

  if (!data) data = fallbackData;

  const title = data?.title?.[locale] || "Strategic Foresight";
  const content = data?.content?.[locale] || "";
  const siteTitle = settings?.site_name?.[locale] || "Dr. Mohamed Talaat";
  const siteDescription = settings?.site_description?.[locale] || "";
  const ogImage = data?.images_urls?.[0] || settings?.logo || "";

  return {
    title,
    description: content.substring(0, 160) || siteDescription,
    alternates: {
      canonical: getCanonicalUrl(locale, "strategic-foresight"),
      languages: getLanguageAlternates({
        ar: "strategic-foresight",
        en: "strategic-foresight",
      }),
    },
    openGraph: {
      title: `${title} | ${siteTitle}`,
      description: content.substring(0, 160) || siteDescription,
      url: getCanonicalUrl(locale, "strategic-foresight"),
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

export default async function StrategicForesightPage() {
  const pages = await fetchPages();
  let data = pages.find((p) => p.slug === "strategic-foresight");

  if (!data) data = fallbackData;

  return <StrategicForesight data={data} />;
}
