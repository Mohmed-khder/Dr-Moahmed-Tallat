import PoliticalMandate from "../../InformationPages/PoliticalMandate";
import { fetchPages, fetchSettings } from "../../lib/server-api";
import { getCanonicalUrl, getLanguageAlternates } from "../../lib/seo";

const fallbackData = {
  id: 14,
  title: {
    ar: "التكليف السياسي",
    en: "Political Mandate",
  },
  slug: "political-mandate",
  content: {
    ar: "«نَحْنُ لَا نَسْعَى لِتَشْكِيلِ الرَّأْيِ العَامِ، بَلْ لِتَحْصِينِ العَقْلِ الِاسْتْرَاتِيجِيِّ لِلأُمَّةِ.»\n•\tالمَسْؤُولِيَّةُ القَوْمِيَّةُ العُلْيَا: يَنْطَلِقُ كَيَانُنَا مِنْ تَفْوِيضٍ فِكْرِيٍّ يَرْتَكِزُ عَلَى حِمَايَةِ المَصَالِحِ العُلْيَا، حَيْثُ نَعْمَلُ كَـ «خَطِّ دِفَاعٍ مَعْرِفِيٍّ» يُقَدِّمُ إِرْشَاداً اسْتْرَاتِيجِيّاً يَحْمِي مُقَدَّرَاتِ الوَعْيِ الجَمْعِيِّ مِنَ التَّلَاعُبِ المُمَنْهَجِ.\n•\tالِانْسِحَابُ التَّكْتِيكِيُّ نَحْوَ الرَّصَانَةِ: نُؤْمِنُ بِأَنَّ الضَّجِيجَ الغَوْغَائِيَّ هُوَ مَقْبَرَةُ الحَقَائِقِ؛ لِذَا نُمَارِسُ «انْسِحَاباً تَقْنِيّاً» مِنَ الِاسْتِقْطَابَاتِ السَّطْحِيَّةِ لِنَسْتَقِرَّ فِي مِسَاحَةِ «الرَّصَانَةِ التَّحْلِيلِيَّةِ»، مِمَّا يَجْعَلُ طَرْحَنَا مُتَرَفِّعاً عَنِ الآيُدولُوجْيَا وَمُنْحَازاً فَقَطْ لِلحَقِيقَةِ المُجَرَّدَةِ.\n•\tبِنَاءُ المَرْجِعِيَّةِ المَعْرِفِيَّةِ: هَدَفُنَا هُوَ تَحْوِيلُ المَنْصَّةِ إِلَى «خَزَّانِ فِكْرٍ سِيَادِيٍّ» يُقَدِّمُ لِلنُّخَبِ وَصُنَّاعِ القَرَارِ بَدَائِلَ تَحْلِيلِيَّةً تَتَّسِمُ بِالعُمْقِ وَالبُرْهَانِ، بِمَا يَضْمَنُ اسْتِقْلَالِيَّةَ الرُّؤْيَةِ فِي ظِلِّ الِاضْطِرَابِ المَعْلُومَاتِيِّ العَالَمِيِّ.",
    en: "\"We do not seek to influence public opinion; we aim to fortify the nation's strategic intellect.\"\n•\tSupreme National Responsibility: Our entity operates under an intellectual mandate rooted in the preservation of supreme interests. We function as a \"Cognitive Defense Line,\" providing strategic guidance to safeguard the collective consciousness against systematic manipulation.\n•\tTactical Withdrawal Toward Rigor: We maintain that demagogic noise is the graveyard of truth. Consequently, we execute a \"Tactical Withdrawal\" from superficial polarizations to occupy the sphere of \"Analytical Rigor,\" ensuring our discourse transcends ideology and remains exclusively aligned with objective reality.\n•\tEstablishing Cognitive Authority: Our objective is to evolve this platform into a \"Sovereign Think-Tank\" that provides elites and decision-makers with high-fidelity analytical alternatives. We ensure the autonomy of strategic vision amidst global informational volatility through substantiated depth and evidence-based logic.",
  },
  pdf_url: null,
  images_urls: [],
  created_at: "2026-04-25",
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const pages = await fetchPages();
  const settings = await fetchSettings();
  let data = pages.find((p) => p.slug === "political-mandate");

  if (!data) data = fallbackData;

  const title = data?.title?.[locale] || "Political Mandate";
  const content = data?.content?.[locale] || "";
  const siteTitle = settings?.site_name?.[locale] || "Dr. Mohamed Talaat";
  const siteDescription = settings?.site_description?.[locale] || "";
  const ogImage = data?.images_urls?.[0] || settings?.logo || "";

  return {
    title,
    description: content.substring(0, 160) || siteDescription,
    alternates: {
      canonical: getCanonicalUrl(locale, "political-mandate"),
      languages: getLanguageAlternates({
        ar: "political-mandate",
        en: "political-mandate",
      }),
    },
    openGraph: {
      title: `${title} | ${siteTitle}`,
      description: content.substring(0, 160) || siteDescription,
      url: getCanonicalUrl(locale, "political-mandate"),
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

export default async function PoliticalMandatePage() {
  const pages = await fetchPages();
  let data = pages.find((p) => p.slug === "political-mandate");

  if (!data) data = fallbackData;

  return <PoliticalMandate data={data} />;
}
