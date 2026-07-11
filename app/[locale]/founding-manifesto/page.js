import FoundingManifesto from "../../InformationPages/FoundingManifesto";
import { fetchPages, fetchSettings } from "../../lib/server-api";
import { getCanonicalUrl, getLanguageAlternates } from "../../lib/seo";

const fallbackData = {
  id: 12,
  title: {
    ar: "البيان التأسيسي للمُؤَسِّس",
    en: "Founding Manifesto",
  },
  slug: "founding-manifesto",
  content: {
    ar: "«إِنَّ بِنَاءَ السِّيَادَةِ لَا يَبْدَأُ مِنَ الحُدُودِ الجُغْرَافِيَّةِ، بَلْ مِنْ تُخُومِ الوَعْيِ؛ وَلِأَنَّنَا نَعِيشُ فِي عَصْرِ «السُّيُولَةِ الِاسْتْرَاتِيجِيَّةِ»، كَانَ لَا بُدَّ مِنْ كَيَانٍ يَمْتَلِكُ شَجَاعَةَ المُبَادَأَةِ.\nإِنَّ هَذَا المَوْقِعُ يَنْبَثِقُ كَضَرُورَةٍ حَتْمِيَّةٍ لِمُوَاجَهَةِ أَنْمَاطِ «الاغْتِرَابِ الوِجْدَانِيِّ القَسْرِيِّ» الَّتِي تُفْرَضُ عَلَى النُّخَبِ العَرَبِيَّةِ. لذا فإننا هُنَا لَا نَنْقُلُ الخَبَرَ، لَكِننا نُعِيدُ «هَنْدَسَةَ سِيَاقِهِ الجِيُوبُولِيتِيكِيِّ».\nإِنَّ التِزَامِي كَمُؤَسِّسٍ يَرْتَكِزُ عَلَى تَحْوِيلِ \"المَعْرِفَةِ الخَامِّ\" إِلَى «سِلَاحٍ اسْتْرَاتِيجِيٍّ» يَسْتَعِيدُ لِلْمِنْطَقَةِ إِرَادَتَهَا المَسْلُوبَةَ، وَيَضَعُ حَدّاً لِمُحَاوَلَاتِ «تَآكُلِ اليَقِينِ الذَّاتِيِّ» أَمَامَ الأَمْوَاجِ العَاتِيَةِ لِلنِّظَامِ الدَّوْلِيِّ الجَدِيدِ.\nتَقَبَّلُوا وَافِرَ امْتِنَانِي.\nمُحَمَّد طَلْعَت عَبْد العَزِيز",
    en: "\"The architecture of Sovereignty does not commence at geographic borders; it originates at the frontiers of Consciousness. In an era defined by 'Geopolitical Liquidity,' the emergence of an entity possessing the audacity of 'The Initiative' is no longer optional-it is a strategic imperative.\"\n\"This platform is engineered as a vital defensive response to the patterns of 'Forced Emotional Estrangement' imposed upon the Arab elite. Our objective transcends the mere transmission of information; we are here to execute the 'Geopolitical Re-engineering' of its entire context.\"\n\"My commitment as Founder is anchored in the transmutation of 'Raw Knowledge' into a 'Strategic Weapon'- designed to reclaim the region's hijacked will and to terminate all systematic attempts to induce the 'Erosion of Self-Certainty' amidst the volatile tides of the New International Order.\"\nWith utmost esteem,\nMohamed Talaat AbdulAziz",
  },
  pdf_url: null,
  images_urls: [
    "https://api.mohamedtalat.org/uploads/pages/images/pmvSFuXWI7Z9Wch2zCaE.jpg",
  ],
  created_at: "2026-04-25",
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const pages = await fetchPages();
  const settings = await fetchSettings();
  let data = pages.find((p) => p.slug === "founding-manifesto");

  if (!data) data = fallbackData;

  const title = data?.title?.[locale] || "Founding Manifesto";
  const content = data?.content?.[locale] || "";
  const siteTitle = settings?.site_name?.[locale] || "Dr. Mohamed Talaat";
  const siteDescription = settings?.site_description?.[locale] || "";
  const ogImage = data?.images_urls?.[0] || settings?.logo || "";

  return {
    title,
    description: content.substring(0, 160) || siteDescription,
    alternates: {
      canonical: getCanonicalUrl(locale, "founding-manifesto"),
      languages: getLanguageAlternates({
        ar: "founding-manifesto",
        en: "founding-manifesto",
      }),
    },
    openGraph: {
      title: `${title} | ${siteTitle}`,
      description: content.substring(0, 160) || siteDescription,
      url: getCanonicalUrl(locale, "founding-manifesto"),
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

export default async function FoundingManifestoPage() {
  const pages = await fetchPages();
  let data = pages.find((p) => p.slug === "founding-manifesto");

  if (!data) data = fallbackData;

  return <FoundingManifesto data={data} />;
}
