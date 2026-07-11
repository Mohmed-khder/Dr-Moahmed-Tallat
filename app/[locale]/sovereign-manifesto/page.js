import SovereignManifesto from "../../InformationPages/SovereignManifesto";
import { fetchPages, fetchSettings } from "../../lib/server-api";
import { getCanonicalUrl, getLanguageAlternates } from "../../lib/seo";

const fallbackData = {
  id: 11,
  title: {
    ar: "المِيثاقُ السِّيادِيُّ لِبَيانِ المُبادأةِ الفِكْرِيَّةِ",
    en: "The Sovereign Manifesto of Intellectual Initiative",
  },
  slug: "sovereign-manifesto",
  content: {
    ar: '"بَيانُ المُبادأةِ: مِيثاقُ السِّيادَةِ المَعْرِفِيَّةِ وَهَنْدَسَةِ الوَعْيِ"\nهَذا المَوْقِعُ لا يُعدُ مِساحَةً فكريةً لِلنَّشْرِ، بَلْ هُوَ مَحْضَنٌ لِلْمُبادأةِ الاسْتِراتِيجِيَّةِ وَمَنْبَرٌ لِلكَلِمَةِ الحُرَّةِ الَّتِي لا تَعْرِفُ المَهادَنَةَ أَوْ الارْتِهانَ لِحِساباتِ البَراغْماتِيَّةِ الضَّيِّقَةِ. فهو مَنَصَّةٌ للسِّيادَةِ المَعْرِفِيَّةِ، حَيْثُ يَتَحَرَّرُ العَقْلُ مِنْ قُيُودِ الإذْعانِ. ولقد \n شَيَّدْنا هَذَا الفَضاءَ لِيَكُونَ جَبْهَةً فِكْرِيَّةً عَرَبِيَّةً عابِرَةً لِلْحُدُودِ، تَسْتَهْدِفُ تَفْكِيكَ مَصْفُوفاتِ (احْتِلالِ الوَعْيِ) وَالتَّصَدِّي لِحُرُوبِ الهُوِيَّةِ المُمَنْهَجَةِ.\nلذا فإِنَّنَا نَدْعُو نُخْبَةَ العُقُولِ مِنْ خُبَراءِ الحُرُوبِ الهَجِينَةِ، وَعُلَماءِ النَّفْسِ السِّياسِيِّ، وَالمُنَظِّرِينَ الجِيُوبُولِيتِيكِيِّينَ، لِلانْخِراطِ فِي" الخَزْنَةِ البَحْثِيَّةِ"؛ لِنَجْعَلَ مِنْها زَكاةً مَعْرِفِيَّةً، وَمَرْجِعاً سِيادِيًّا، يُتِيحُ لِلْبَاحِثِ المُجْتَهِدِ، وَطالِبِ العِلْمِ الوُلُوجَ إِلى أَعْمَقِ الدِّراساتِ الفَنِّيَّةِ الاسْتِراتِيجِيَّةِ، بَعِيداً عَنْ غُرَفِ المُرَاقَبَةِ أَوْ التَّحَفُّظاتِ الدِّبْلُومَاسِيَّةِ. \nهُنا، نَصْنَعُ اليَقِينَ.. وَنَفْرِضُ الإِرادَةَ."',
    en: "The Charter of Cognitive Sovereignty and Consciousness Architecture\nStrategic Intelligence & Doctrine Standard\n\"This platform is not merely a conventional intellectual space for publication; it is an Incubator for Strategic Initiative and a bastion for the Free Word—uncompromising and unyielding to the constraints of narrow pragmatism. It stands as a Platform for Cognitive Sovereignty, where the intellect transcends the chains of compliance. We have architected this domain to serve as a Transnational Arab Intellectual Front, dedicated to deconstructing the matrices of 'Consciousness Occupation' and countering systematic identity warfare.\nTherefore, we summon the elite minds-experts in hybrid warfare, political psychologists, and geopolitical theorists-to engage within 'The Research Vault.' Our mission is to transform this repository into a 'Cognitive Alms' and a sovereign reference, granting dedicated researchers and scholars access to the most profound technical strategic studies, far removed from surveillance corridors or diplomatic reservations.\nHere, we forge certainty... and we impose the Will.\"",
  },
  pdf_url: null,
  images_urls: [
    "https://api.mohamedtalat.org/uploads/pages/images/evleOvpNzJC1oy1ZOPrp.jpg",
  ],
  created_at: "2026-04-22",
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const pages = await fetchPages();
  const settings = await fetchSettings();
  let data = pages.find((p) => p.slug === "sovereign-manifesto");

  if (!data) data = fallbackData;

  const title = data?.title?.[locale] || "Sovereign Manifesto";
  const content = data?.content?.[locale] || "";
  const siteTitle = settings?.site_name?.[locale] || "Dr. Mohamed Talaat";
  const siteDescription = settings?.site_description?.[locale] || "";
  const ogImage = data?.images_urls?.[0] || settings?.logo || "";

  return {
    title,
    description: content.substring(0, 160) || siteDescription,
    alternates: {
      canonical: getCanonicalUrl(locale, "sovereign-manifesto"),
      languages: getLanguageAlternates({
        ar: "sovereign-manifesto",
        en: "sovereign-manifesto",
      }),
    },
    openGraph: {
      title: `${title} | ${siteTitle}`,
      description: content.substring(0, 160) || siteDescription,
      url: getCanonicalUrl(locale, "sovereign-manifesto"),
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

export default async function SovereignManifestoPage() {
  const pages = await fetchPages();
  let data = pages.find((p) => p.slug === "sovereign-manifesto");

  if (!data) data = fallbackData;

  return <SovereignManifesto data={data} />;
}
