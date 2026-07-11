import OperationalParadigm from "../../InformationPages/OperationalParadigm";
import { fetchPages, fetchSettings } from "../../lib/server-api";
import { getCanonicalUrl, getLanguageAlternates } from "../../lib/seo";

const fallbackData = {
  id: 13,
  title: {
    ar: "الأنموذج التنفيذي",
    en: "Operational Paradigm",
  },
  slug: "operational-paradigm",
  content: {
    ar: "الأُنْمُوذَجُ التَّنْفِيذِيُّ: هَنْدَسَةُ صِنَاعَةِ المَعْرِفَةِ الرَّصِينَةِ\n«نَحْنُ لَا نَقْتَصِرُ عَلَى رَصْدِ المَعْلُومَاتِ، بَلْ نُعِيدُ صِيَاغَةَ العَلَاقَاتِ بَيْنَ البَيَانَاتِ لِتَوْلِيدِ رُؤًى تَتَجَاوَزُ المَأْلُوفَ.»\n•\tبِيئَةُ النُّظُمِ المُؤَسَّسِيَّةِ المُغْلَقَةِ: نَعْتَمِدُ مَنْهَجِيَّةَ «الأَنْسَاقِ المَغْلُقَةِ» فِي مُعَالَجَةِ المَعْلُومَاتِ لِضَمَانِ أَعْلَى مَعَايِيرِ التَّحَقُّقِ وَعَزْلِ \"الضَّجِيجِ المَعْلُومَاتِيِّ\"، مِمَّا يَمْنَحُ مُخْرَجَاتِنَا حَصَانَةً ضِدَّ التَّضْلِيلِ وَيُحَقِّقُ لَهَا سِيَادَةً نُخْبَوِيَّةً.\n•\tآلِيَّةُ الرَّبْطِ الِاسْتِنْتَاجِيِّ العَمِيقِ: نَعْمَلُ عَلَى تَجَاوُزِ ظَوَاهِرِ الأَحْدَاثِ لِتَحْلِيلِ «الأَسْبَابِ الكَامِنَةِ»؛ حَيْثُ نَدْمِجُ بَيْنَ الِاسْتِخْبَارَاتِ مَفْتُوحَةِ المَصْدَرِ (OSINT) وَبَيْنَ الدَّوَافِعِ الجِيُوبُولِيتِيكِيَّةِ المُسْتَتِرَةِ، لِكَشْفِ مَسَارَاتِ الأَزَمَاتِ قَبْلَ نُضُوجِهَا.\n•\tالتَّشْخِيصُ بِالدِّقَّةِ الجِرَاحِيَّةِ: نُطَبِّقُ مَعَايِيرَ «الهَنْدَسَةِ العَكْسِيَّةِ» لِتَفْكِيكِ التَّهْدِيدَاتِ إِلَى عَنَاصِرِهَا الأَوَّلِيَّةِ، مِمَّا يُتِيحُ لِلنُّخَبِ وَصُنَّاعِ القَرَارِ فَهْمَ جَوْهَرِ الصِّرَاعِ وَتَحْدِيدِ نِقَاطِ الِارْتِكَازِ الِاسْتْرَاتِيجِيَّةِ بِدِقَّةٍ مُتَنَاهِيَةٍ.",
    en: "Operational Paradigm: The Architecture of Rigorous Knowledge Production\n\"We do not merely monitor information; we restructure the relationships between data points to forge insights that transcend conventional analysis.\"\n•\tClosed Institutional Systems Environment: We implement a \"Closed-Loop System\" for information processing to ensure the highest standards of verification while isolating \"Informational Noise.\" This protocol immunizes our outputs against disinformation and secures elite-tier sovereign credibility.\n•\tDeep Deductive Correlation Mechanism: We transcend the surface level of events to analyze \"Latent Causality.\" By synthesizing Open-Source Intelligence (OSINT) with concealed geopolitical drivers, we expose crisis trajectories before they reach full maturation.\n•\tSurgical Precision in Diagnosis: We apply \"Reverse Engineering\" standards to dismantle threats into their primary components. This enables the elite and decision-makers to comprehend the core of conflicts and identify strategic leverage points with absolute precision.",
  },
  pdf_url: null,
  images_urls: [],
  created_at: "2026-04-25",
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const pages = await fetchPages();
  const settings = await fetchSettings();
  let data = pages.find((p) => p.slug === "operational-paradigm");

  if (!data) data = fallbackData;

  const title = data?.title?.[locale] || "Operational Paradigm";
  const content = data?.content?.[locale] || "";
  const siteTitle = settings?.site_name?.[locale] || "Dr. Mohamed Talaat";
  const siteDescription = settings?.site_description?.[locale] || "";
  const ogImage = data?.images_urls?.[0] || settings?.logo || "";

  return {
    title,
    description: content.substring(0, 160) || siteDescription,
    alternates: {
      canonical: getCanonicalUrl(locale, "operational-paradigm"),
      languages: getLanguageAlternates({
        ar: "operational-paradigm",
        en: "operational-paradigm",
      }),
    },
    openGraph: {
      title: `${title} | ${siteTitle}`,
      description: content.substring(0, 160) || siteDescription,
      url: getCanonicalUrl(locale, "operational-paradigm"),
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

export default async function OperationalParadigmPage() {
  const pages = await fetchPages();
  let data = pages.find((p) => p.slug === "operational-paradigm");

  if (!data) data = fallbackData;

  return <OperationalParadigm data={data} />;
}
