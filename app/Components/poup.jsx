"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const SESSION_KEY = "official-letter-popup-dismissed";

const letterParagraphs = [
  "بسم الله الرحمن الرحيم",
  "إلى المقام السامي لحضرة صاحب الجلالة الملك حمد بن عيسى آل خليفة، ملك مملكة البحرين المعظم حفظه الله ورعاه",
  "السلام عليكم ورحمة الله وبركاته،",
  "ببالغ الاعتزاز والتشريف تلقيت كتاب جلالتكم الكريم، الذي كان محل فخر كبير لي، لما حمله من كلمات سامية تعكس النهج الأصيل الذي أرساه جلالتكم في توثيق جسور التواصل بين القيادة وأبنائها، وترسيخ قيم الوفاء والانتماء والمسؤولية الوطنية.",
  "وأتشرف بأن أرفع إلى مقام جلالتكم أسمى آيات الشكر والعرفان على كريم تفضلكم بهذا الرد السامي، مؤكداً أن ما قدمناه وسنظل نقدمه ليس إلا واجباً وطنياً تمليه علينا قيم المواطنة الصادقة، وإيماننا الراسخ بأن خدمة البحرين وصون أمنها واستقرارها والمحافظة على مكتسباتها مسؤولية مشتركة وشرف يعتز به كل مخلص لهذا الوطن العزيز.",
  "وإننا، إذ نجدد لجلالتكم خالص الولاء والوفاء، نعاهد الله تعالى ثم نعاهد جلالتكم على أن نظل أوفياء لقيادتكم الحكيمة، داعمين لمسيرة الإصلاح والتنمية، ومسهمين بكل ما نملك من علم وخبرة وفكر في خدمة وطننا الغالي، وتعزيز مكانته الإقليمية والدولية، وترسيخ وحدته الوطنية وتماسك نسيجه المجتمعي.",
  "نسأل الله العلي القدير أن يحفظ جلالتكم، وأن يديم عليكم موفور الصحة والعافية، وأن يبارك في جهودكم، وأن يحفظ مملكة البحرين عزيزةً آمنةً مستقرةً، وأن يوفقكم دائماً لما فيه خير الوطن ورفعة شعبه. وتفضلوا، يا صاحب الجلالة، بقبول فائق الاحترام والتقدير.",
  "والسلام عليكم ورحمة الله وبركاته.",
];

const Poup = () => {
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
      className="fixed inset-0 z-[99998] flex items-center justify-center bg-baseTwo/55 px-3 py-6 backdrop-blur-sm sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-label="خطاب رسمي"
      dir="rtl"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[1.75rem] border border-primary/25 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-primary" />

        <button
          type="button"
          onClick={handleClose}
          aria-label="إغلاق الخطاب"
          className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-white text-primary shadow-lg transition-all hover:bg-primary hover:text-white"
        >
          <FaTimes size={15} />
        </button>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[320px] overflow-hidden bg-third sm:min-h-[420px] lg:min-h-[560px]">
            <Image
              src="/Home/خطاب-رسمي.jpg"
              alt="خطاب رسمي"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-contain p-3 sm:p-5"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-baseTwo/15 via-transparent to-transparent" />
            {/* <div className="absolute bottom-4 right-4 left-4 border-r-4 border-primary bg-white/90 p-4 shadow-xl backdrop-blur-sm sm:bottom-8 sm:right-8 sm:left-8 sm:p-5">
              <p className="text-sm font-black text-primary">خطاب رسمي</p>
              <h2 className="mt-2 text-lg font-black leading-snug text-baseTwo sm:text-2xl">
                رسالة شكر وولاء إلى المقام السامي
              </h2>
            </div> */}
          </div>

          <div className="min-h-0 overflow-y-auto px-5 pb-6 pt-8 sm:px-8 lg:px-10 lg:pt-16">
            <div className="mx-auto max-w-2xl">
              <div className="mb-6 border-b border-primary/20 pb-5 text-center">
                <p className="text-sm font-black text-primary">خطاب رسمي</p>
                <h1 className="mt-3 text-2xl font-black leading-snug text-baseTwo sm:text-3xl">
                  رسالة شكر وولاء إلى المقام السامي
                </h1>
                <p className="mt-3 text-sm font-bold text-slate-500">
                  البحرين في ٥ يوليو ٢٠٢٦
                </p>
              </div>

              <div className="space-y-4 text-right text-[15px] font-semibold leading-8 text-slate-700 sm:text-base sm:leading-9">
                {letterParagraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className={
                      paragraph === "بسم الله الرحمن الرحيم"
                        ? "text-center text-lg font-black text-baseTwo"
                        : ""
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 border-t border-primary/20 pt-6 text-right">
                <p className="text-sm font-bold text-slate-500">
                  المخلص لجلالتكم
                </p>
                <p className="mt-1 text-xl font-black text-baseTwo">
                  محمد طلعت عبدالعزيز
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="mt-8 w-full rounded-xl bg-primary px-6 py-4 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-baseTwo"
              >
                إغلاق الخطاب
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poup;
