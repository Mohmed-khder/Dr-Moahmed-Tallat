"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const SESSION_KEY = "legal-disclaimer-popup-dismissed";

const content = {
  ar: {
    dir: "rtl",
    align: "text-right",
    eyebrow: "إخلاء مسؤولية قانونية ومهنية",
    title: "إخلاء مسؤولية قانونية",
    close: "إغلاق",
    paragraphs: [
      "أُعدَّ هذا التقرير استناداً إلى منهجية تحليل استراتيجي وجيوعسكري تعتمد على المعلومات والبيانات المتاحة من المصادر المفتوحة، بما في ذلك البيانات الرسمية، ووكالات الأنباء الدولية، والصحف والمؤسسات الإعلامية العالمية، والتقارير البحثية والأكاديمية، والدراسات المتخصصة، وغيرها من المصادر التي تُعد موثوقة وقت إعداد التقرير.",
      "ويؤكد الكاتب أن جميع التحليلات، والاستنتاجات، والفرضيات، والسيناريوهات، والتقديرات الواردة في هذا التقرير تمثل قراءة تحليلية واستشرافية مستقلة للواقع الجيوسياسي والجيوعسكري، وتعبر عن التقدير المهني للكاتب استناداً إلى المعلومات المتاحة وقت النشر، ولا تمثل حقائق قطعية أو معلومات استخباراتية رسمية أو بيانات صادرة عن أي حكومة أو مؤسسة عسكرية أو أمنية.",
      "كما أن الأرقام والتقديرات العملياتية الواردة في التقرير قد تختلف باختلاف المصادر، نظراً لطبيعة النزاعات المسلحة وما يصاحبها من تضارب في البيانات، أو تغيرها بصورة مستمرة، أو عدم اكتمال المعلومات المنشورة، ولذلك ينبغي التعامل معها في إطار التقدير التحليلي وليس باعتبارها توثيقاً رسمياً نهائياً.",
      "ويهدف هذا التقرير حصراً إلى الإسهام في تنوير الرأي العام العربي والدولي، وتعزيز الوعي الاستراتيجي، وإثراء النقاش العلمي والفكري في مجالات الدراسات الجيوسياسية والجيوعسكرية والأمن الإقليمي، وتشجيع الاجتهاد البحثي القائم على التحليل الموضوعي، بما يسهم في فهم التطورات الإقليمية والدولية، ودعم الجهود الرامية إلى حماية الأمن والاستقرار وصون مقدرات الدول والشعوب، ولا سيما في العالم العربي.",
      "ولا يجوز تفسير أي جزء من هذا التقرير على أنه دعوة إلى استخدام القوة، أو التحريض على العنف، أو تبني مواقف عدائية تجاه أي دولة أو جهة، كما لا يمثل تأييداً أو إدانة لأي طرف من أطراف النزاع، وإنما يندرج في إطار التحليل الأكاديمي والاستراتيجي المستقل.",
    ],
  },
  en: {
    dir: "ltr",
    align: "text-left",
    eyebrow: "Legal & Professional Disclaimer",
    title: "Legal Disclaimer",
    close: "Close",
    paragraphs: [
      "This assessment has been prepared using a strategic and geomilitary analytical methodology based exclusively on information available from open sources, including official government statements, international news agencies, reputable global newspapers and media organizations, academic and research publications, specialized strategic studies, and other sources considered reliable at the time of publication.",
      "The author affirms that all analyses, assessments, hypotheses, scenarios, conclusions, and judgments contained in this report constitute an independent strategic and forward-looking analytical interpretation of ongoing geopolitical and geomilitary developments. They reflect the professional judgment of the author based on information available at the time of writing and should not be interpreted as verified intelligence, official governmental positions, or authoritative military assessments.",
      "Operational figures, estimates, and conflict-related data presented in this report may vary among sources due to the dynamic nature of armed conflicts, conflicting reporting, incomplete information, and the continuous evolution of events. Accordingly, such information should be understood as analytical estimates rather than definitive or officially verified facts.",
      "The sole purpose of this publication is to promote strategic awareness, contribute to informed public understanding, and encourage scholarly discussion in the fields of geopolitics, geomilitary affairs, regional security, and strategic studies. It seeks to foster rigorous analytical thinking regarding contemporary security developments and to support constructive dialogue aimed at safeguarding regional stability, protecting national capabilities, and preserving the strategic interests of Arab states and the broader international community.",
      "Nothing contained in this report should be construed as advocating the use of force, encouraging hostility toward any state or actor, or endorsing or condemning any party to an armed conflict. It is intended solely as an independent academic and strategic analytical assessment prepared for research, educational, and public-awareness purposes.",
    ],
  },
};

const LegalDisclaimerPopup = () => {
  const locale = useLocale();
  const copy = content[locale] || content.ar;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = window.sessionStorage.getItem(SESSION_KEY);
    if (!isDismissed) {
      const timer = window.setTimeout(() => setIsVisible(true), 500);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, []);

  const handleClose = () => {
    window.sessionStorage.setItem(SESSION_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[99998] flex items-center justify-center bg-baseTwo/55 px-3 py-5 backdrop-blur-sm sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-label={copy.eyebrow}
      dir={copy.dir}
    >
      <div className="relative flex max-h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-[1.75rem] border border-primary/25 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-primary" />

        <button
          type="button"
          onClick={handleClose}
          aria-label={copy.close}
          className={`absolute top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-white text-primary shadow-lg transition-all hover:bg-primary hover:text-white ${
            copy.dir === "rtl" ? "left-4" : "right-4"
          }`}
        >
          <FaTimes size={15} />
        </button>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1.25fr_0.95fr]">
          <div className="relative min-h-[360px] overflow-hidden bg-third sm:min-h-[520px] lg:min-h-[720px]">
            <Image
              src="/Home/اخلاء-سبيل.png"
              alt={copy.eyebrow}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 56vw"
              className="object-contain p-1 sm:p-2"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-baseTwo/10 via-transparent to-transparent" />
          </div>

          <div className="min-h-0 overflow-y-auto px-5 pb-6 pt-8 sm:px-8 lg:px-9 lg:pt-14">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6 border-b border-primary/20 pb-5 text-center">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">
                  {copy.eyebrow}
                </p>
                <h1 className="mt-3 text-2xl font-black leading-snug text-baseTwo sm:text-3xl">
                  {copy.title}
                </h1>
              </div>

              <section dir={copy.dir} className={copy.align}>
                <div
                  className={`space-y-4 font-semibold text-slate-700 ${
                    copy.dir === "rtl"
                      ? "text-[14px] leading-8 sm:text-[15px]"
                      : "text-[13px] leading-7 sm:text-sm"
                  }`}
                >
                  {copy.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>

              <button
                type="button"
                onClick={handleClose}
                className="mt-8 w-full rounded-xl bg-primary px-6 py-4 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-baseTwo"
              >
                {copy.close}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalDisclaimerPopup;
