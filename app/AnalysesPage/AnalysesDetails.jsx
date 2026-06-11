"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Link, useRouter } from "../../i18n/routing";
import { useParams } from "next/navigation";
import {
  FaFilePdf,
  FaDownload,
  FaRegCalendarAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaHistory,
  FaStar,
  FaTags,
  FaQuoteLeft,
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
} from "react-icons/fa";
import { GrScheduleNew } from "react-icons/gr";
import { RiAiGenerate } from "react-icons/ri";
import {
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlineInformationCircle,
  HiOutlineClipboardCheck,
  HiSparkles,
  HiOutlineMenuAlt2,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { BiBullseye } from "react-icons/bi";
import TalatAIChat from "./TalatAIChat";

const SUGGESTION_VISIBLE_MS = 15000;
const SUGGESTION_HIDDEN_MS = 180000;
const SUGGESTION_INITIAL_DELAY_MS = 6000;

function stripHtml(value) {
  if (!value) return "";
  return value.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
}

const TimedArticleSuggestion = ({
  article,
  recommendedArticles = [],
  locale,
  isRTL,
}) => {
  const [imageBroken, setImageBroken] = React.useState(false);
  const [suggestedArticle, setSuggestedArticle] = React.useState(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const [progress, setProgress] = React.useState(100);
  const lastSuggestedIdRef = React.useRef(null);
  const articleSlug = article.slug?.[locale] || article.slug?.["en"];

  const recommendationPool = React.useMemo(
    () =>
      recommendedArticles.filter((item) => {
        const itemSlug = item.slug?.[locale] || item.slug?.["en"];
        return item?.id !== article.id && itemSlug && itemSlug !== articleSlug;
      }),
    [recommendedArticles, article.id, articleSlug, locale],
  );

  const pickRandomSuggestion = React.useCallback(() => {
    if (!recommendationPool.length) return null;

    const filteredPool =
      recommendationPool.length > 1
        ? recommendationPool.filter(
            (item) => item.id !== lastSuggestedIdRef.current,
          )
        : recommendationPool;

    const nextArticle =
      filteredPool[Math.floor(Math.random() * filteredPool.length)];
    lastSuggestedIdRef.current = nextArticle?.id || null;
    return nextArticle || null;
  }, [recommendationPool]);

  useEffect(() => {
    if (!recommendationPool.length) return undefined;

    let showTimeout;
    let hideTimeout;
    let progressInterval;
    let isCancelled = false;

    const clearTimers = () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
      clearInterval(progressInterval);
    };

    const scheduleSuggestion = (delay) => {
      showTimeout = setTimeout(() => {
        if (isCancelled) return;

        const nextArticle = pickRandomSuggestion();
        if (!nextArticle) return;

        setSuggestedArticle(nextArticle);
        setImageBroken(false);
        setProgress(100);
        setIsVisible(true);

        const startedAt = Date.now();
        progressInterval = setInterval(() => {
          const elapsed = Date.now() - startedAt;
          setProgress(
            Math.max(0, 100 - (elapsed / SUGGESTION_VISIBLE_MS) * 100),
          );
        }, 120);

        hideTimeout = setTimeout(() => {
          clearInterval(progressInterval);
          if (isCancelled) return;
          setIsVisible(false);
          setProgress(0);
          scheduleSuggestion(SUGGESTION_HIDDEN_MS);
        }, SUGGESTION_VISIBLE_MS);
      }, delay);
    };

    scheduleSuggestion(SUGGESTION_INITIAL_DELAY_MS);

    return () => {
      isCancelled = true;
      clearTimers();
    };
  }, [recommendationPool.length, pickRandomSuggestion]);

  if (!suggestedArticle) return null;

  const suggestedContent = {
    title: suggestedArticle.title?.[locale] || suggestedArticle.title?.["en"],
    subtitle:
      suggestedArticle.subtitle?.[locale] || suggestedArticle.subtitle?.["en"],
    description: stripHtml(
      suggestedArticle.description?.[locale] ||
        suggestedArticle.description?.["en"],
    ),
    slug: suggestedArticle.slug?.[locale] || suggestedArticle.slug?.["en"],
    type:
      suggestedArticle.type?.name?.[locale] ||
      suggestedArticle.type?.name?.["en"],
    image:
      imageBroken || !suggestedArticle.image_url?.trim()
        ? "/Home/stepn.jpg"
        : suggestedArticle.image_url,
  };

  const hideCurrentSuggestion = () => {
    setIsVisible(false);
    setProgress(0);
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-4 z-[950] px-3 transition-all duration-500 md:bottom-6 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-8 opacity-0"
      }`}
    >
      <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-primary/20 bg-white shadow-[0_20px_70px_rgba(0,0,0,0.18)]">
        <div className="h-1 w-full bg-slate-100">
          <div
            className="h-full bg-primary transition-[width] duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-stretch gap-3 p-3 sm:gap-5 sm:p-4">
          <Link
            href={`/analyses/article/${suggestedContent.slug}`}
            onClick={hideCurrentSuggestion}
            className="group flex min-w-0 flex-1 items-center gap-3 sm:gap-5"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-24 sm:w-28">
              <Image
                src={suggestedContent.image}
                alt={suggestedContent.title || "Suggested article"}
                fill
                sizes="112px"
                className="object-contain transition-transform duration-700 group-hover:scale-110"
                onError={() => setImageBroken(true)}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                  {isRTL ? "مقترح لك" : "Suggested for you"}
                </span>
                {suggestedContent.type && (
                  <span className="hidden rounded-full bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:inline-flex">
                    {suggestedContent.type}
                  </span>
                )}
              </div>
              <h3 className="line-clamp-2 text-sm font-black leading-snug text-baseTwo transition-colors group-hover:text-primary sm:text-lg">
                {suggestedContent.title}
              </h3>
              {(suggestedContent.subtitle || suggestedContent.description) && (
                <p className="mt-1 line-clamp-1 text-xs font-semibold text-slate-500 sm:text-sm">
                  {suggestedContent.subtitle || suggestedContent.description}
                </p>
              )}
            </div>
            <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform group-hover:scale-105 sm:flex">
              {isRTL ? <FaArrowLeft /> : <FaArrowRight />}
            </div>
          </Link>
          <button
            type="button"
            onClick={hideCurrentSuggestion}
            aria-label={isRTL ? "إغلاق الاقتراح" : "Close suggestion"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-primary hover:text-white"
          >
            <FaTimes size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

const AnalysesDetails = ({
  article,
  recommendedArticles = [],
  translations,
  locale,
  isRTL,
}) => {
  const router = useRouter();
  const params = useParams();
  const slug = params ? params.slug : null;
  const [imageBroken, setImageBroken] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(null);
  const containerRef = React.useRef(null);

  useEffect(() => {
    if (!article || !slug) return;
    const correctSlug = article.slug?.[locale] || article.slug?.["en"];
    const decodedCorrect = correctSlug ? decodeURIComponent(correctSlug) : "";
    const decodedCurrent = decodeURIComponent(slug);
    if (decodedCorrect && decodedCorrect !== decodedCurrent) {
      router.replace(`/analyses/article/${correctSlug}`, { scroll: false });
    }
  }, [article, slug, locale, router]);

  if (!article) return null;

  const content = {
    title: article.title?.[locale] || article.title?.["en"],
    subtitle: article.subtitle?.[locale] || article.subtitle?.["en"],
    sovereignMetaBar:
      article.sovereign_meta_bar?.[locale] ||
      article.sovereign_meta_bar?.["en"],
    institutionalAlignment:
      article.institutional_alignment?.[locale] ||
      article.institutional_alignment?.["en"],
    centralHypothesis:
      article.central_hypothesis?.[locale] ||
      article.central_hypothesis?.["en"],
    strategicThesis:
      article.description?.[locale] || article.description?.["en"],
    articleBody: article.article_body?.[locale] || article.article_body?.["en"],
    actorDeconstruction:
      article.actor_deconstruction?.[locale] ||
      article.actor_deconstruction?.["en"],
    influenceMechanisms:
      article.mechanisms_of_influence?.[locale] ||
      article.mechanisms_of_influence?.["en"],
    structuralContext:
      article.structural_context?.[locale] ||
      article.structural_context?.["en"],
    implications:
      article.implications_consequences?.[locale] ||
      article.implications_consequences?.["en"],
    strategicForesight:
      article.strategic_foresight?.[locale] ||
      article.strategic_foresight?.["en"],
    glossary:
      article.central_concepts?.[locale] || article.central_concepts?.["en"],
    analyticalMechanism:
      article.analytical_mechanism?.[locale] ||
      article.analytical_mechanism?.["en"],
    riskIndex: article.risk_index_color,
    analyticalPositioning: article.analytical_positioning,
    quotations:
      article.strategic_quotations?.[locale] ||
      article.strategic_quotations?.["en"],
    publishedAt: article.published_at,
  };

  const hasValidImage =
    typeof article.image_url === "string" &&
    article.image_url.trim().length > 0;
  const heroImageSrc =
    imageBroken || !hasValidImage ? "/Home/stepn.jpg" : article.image_url;

  const tabs = [
    {
      id: "article_body",
      label: isRTL ? "نص المقال" : "Article Body",
      icon: <HiOutlineDocumentText />,
      content: content.articleBody,
    },
    {
      id: "subtitle",
      label: isRTL ? "العنوان التحليلي" : "Analytical Title",
      icon: <HiOutlineMenuAlt2 />,
      content: content.subtitle,
    },
    {
      id: "sovereign_meta_bar",
      label: isRTL ? "شريط البيانات السيادي" : "Sovereign Meta Bar",
      icon: <HiOutlineClipboardCheck />,
      content: content.sovereignMetaBar,
    },
    {
      id: "institutional_alignment",
      label: isRTL ? "خط الانتماء المؤسسي" : "Institutional Alignment",
      icon: <HiOutlineAcademicCap />,
      content: content.institutionalAlignment,
    },
    {
      id: "central_hypothesis",
      label: isRTL ? "الفرضية المركزية" : "Central Hypothesis",
      icon: <BiBullseye />,
      content: content.centralHypothesis,
    },
    {
      id: "description",
      label: isRTL ? "الأطروحة الاستراتيجية" : "Strategic Thesis",
      icon: <HiSparkles />,
      content: content.strategicThesis,
    },
    {
      id: "actor_deconstruction",
      label: isRTL ? "تفكيك الفاعلين" : "Actor Deconstruction",
      icon: <HiOutlineInformationCircle />,
      content: content.actorDeconstruction,
    },
    {
      id: "mechanisms_of_influence",
      label: isRTL ? "آليات التأثير" : "Influence Mechanisms",
      icon: <RiAiGenerate />,
      content: content.influenceMechanisms,
    },
    {
      id: "structural_context",
      label: isRTL ? "السياق البنيوي" : "Structural Context",
      icon: <HiOutlineExclamationCircle />,
      content: content.structuralContext,
    },
    {
      id: "implications",
      label: isRTL ? "النتائج والتداعيات" : "Implications & Consequences",
      icon: <FaHistory />,
      content: content.implications,
    },
    {
      id: "strategic_foresight",
      label: isRTL ? "الاستشراف المستقبلي" : "Strategic Foresight",
      icon: <FaStar />,
      content: content.strategicForesight,
    },
    {
      id: "glossary",
      label: isRTL ? "قاموس المصطلحات" : "Glossary",
      icon: <HiOutlineDocumentText />,
      content: content.glossary,
    },
    {
      id: "analytical_mechanism",
      label: isRTL ? "الآلية التحليلية" : "Analytical Mechanism",
      icon: <HiOutlineMenuAlt2 />,
      content: content.analyticalMechanism,
    },
    {
      id: "risk_index",
      label: isRTL ? "مؤشر الخطورة والأهمية" : "Risk Index",
      icon: <HiOutlineExclamationCircle />,
      content: content.riskIndex,
      type: "risk",
    },
    {
      id: "positioning",
      label: isRTL ? "زاوية التموضع" : "Positioning",
      icon: <HiOutlineInformationCircle />,
      content: content.analyticalPositioning,
    },
    {
      id: "quotations",
      label: isRTL ? "المقولات المأثورة" : "Strategic Quotations",
      icon: <FaQuoteLeft />,
      content: content.quotations,
    },
    {
      id: "infographics",
      label: isRTL ? "نظام الإنفوجرافيك" : "Infographics",
      icon: <FaFilePdf />,
      content: article.attachments,
      type: "attachments",
    },
  ].filter((tab) => tab.content);

  const activeTabData = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="py-20 min-h-screen bg-slate-50/30">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Right Column: Main Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
              <div className="relative w-full h-[350px] md:h-[500px] group">
                <Image
                  src={heroImageSrc}
                  alt={content.title || "Article Image"}
                  fill
                  priority
                  className={`group-hover:scale-105 transition-transform duration-1000 ${
                    heroImageSrc === "/Home/stepn.jpg"
                      ? "object-contain"
                      : "object-contain"
                  }`}
                  onError={() => setImageBroken(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />

                {/* <div
                  className={`absolute bottom-8 ${isRTL ? "right-8" : "left-8"} flex items-center gap-3 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl border border-white/20`}
                >
                  <FaRegCalendarAlt className="text-primary" />
                  <span className="text-xs font-black text-baseTwo uppercase tracking-widest">
                    {content.publishedAt || article.created_at}
                  </span>
                </div> */}
              </div>

              <div ref={containerRef} className="p-5 md:p-12 space-y-6 md:space-y-8">
                <h2 className={`text-xl sm:text-3xl leading-4xl  md:text-5xl font-black text-baseTwo  ${isRTL ? "text-right" : "text-left"}`}>
                  {content.title}
                </h2>

                {/* Active Tab Content */}
                {activeTabData && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-5 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] bg-slate-50/50 border border-slate-100 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.03] pointer-events-none scale-125 md:scale-150 text-primary">
                        {activeTabData.icon}
                      </div>

                      <div className="flex items-center gap-3 mb-6 md:mb-8 relative">
                        <div className="w-1.5 h-6 md:w-2 md:h-8 bg-primary rounded-full" />
                        <h4 className="text-xl md:text-2xl font-black text-baseTwo uppercase tracking-tight">
                          {activeTabData.label}
                        </h4>
                      </div>

                      <div className={`relative text-slate-700 leading-[1.8] text-base md:text-lg font-medium ${isRTL ? "text-right" : "text-left"}`}>
                        {activeTabData.id === "article_body" ? (
                          <div
                            className={`prose prose-sm sm:prose-base md:prose-lg max-w-none text-slate-600 leading-[1.8] md:leading-[2] font-medium whitespace-pre-line ${isRTL ? "text-right" : "text-left"}`}
                            dangerouslySetInnerHTML={{
                              __html: activeTabData.content,
                            }}
                          />
                        ) : activeTabData.type === "risk" ? (
                          <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div
                              className="w-16 h-16 rounded-full shadow-lg border-4 border-white"
                              style={{ backgroundColor: activeTabData.content }}
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                {isRTL ? "مؤشر الخطورة" : "Risk Index"}
                              </span>
                              <span className="font-black text-primary text-2xl uppercase tracking-widest">
                                {content.analyticalPositioning ||
                                  (isRTL ? "مؤشر استراتيجي" : "Strategic Index")}
                              </span>
                            </div>
                          </div>
                        ) : activeTabData.type === "attachments" ? (
                          <div className="space-y-8">
                            {Object.entries(activeTabData.content || {}).map(
                              ([key, url]) =>
                                url && (
                                  <div
                                    key={key}
                                    className="flex flex-col gap-6"
                                  >
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-100 hover:border-primary hover:shadow-xl transition-all group/file"
                                    >
                                      <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover/file:bg-primary group-hover/file:text-white transition-all">
                                          <FaFilePdf className="text-primary group-hover/file:text-white text-xl" />
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            {isRTL ? "ملف مرفق" : "Attachment"}
                                          </span>
                                          <span className="text-base font-black text-baseTwo uppercase tracking-wide">
                                            {key.replace(/_/g, " ")}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover/file:border-primary group-hover/file:text-primary transition-all">
                                        <FaDownload size={14} />
                                      </div>
                                    </a>

                                    {/* Preview */}
                                    {url.match(
                                      /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i,
                                    ) ? (
                                      <div className="w-full rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm bg-white">
                                        <Image
                                          src={url}
                                          alt={key}
                                          className="w-full h-auto"
                                          width={1200}
                                          height={1200}
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-full h-[70vh] min-h-[600px] rounded-[2rem] overflow-hidden border border-slate-100 bg-white shadow-inner relative">
                                        <iframe
                                          src={`${url}#view=FitH`}
                                          className="w-full h-full border-0"
                                          title={key}
                                          allowFullScreen
                                          loading="lazy"
                                        />
                                      </div>
                                    )}
                                  </div>
                                ),
                            )}
                          </div>
                        ) : (
                          <div
                            className={`whitespace-pre-line leading-relaxed text-base md:text-lg ${isRTL ? "text-right" : "text-left"}`}
                            dangerouslySetInnerHTML={{
                              __html: activeTabData.content,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Chat Support */}
            <div className="border-2 border-primary/20 rounded-[2.5rem] p-1">
              <div className="bg-white rounded-[2.4rem] p-2 md:p-5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <HiSparkles className="text-primary text-2xl animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-baseTwo">
                      Talat AI
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {isRTL ? "المساعد الذكي" : "Smart Analysis Assistant"}
                    </p>
                  </div>
                </div>
                <TalatAIChat
                  articleId={article.id}
                  articleTitle={content.title}
                  isRTL={isRTL}
                />
              </div>
            </div>
          </div>

          {/* Left Column: Interactive Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-8">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                <h3 className="text-sm font-black text-baseTwo uppercase tracking-widest mb-8 flex items-center gap-2">
                  <HiOutlineMenuAlt2 />
                  {isRTL
                    ? "محاور التحليل الاستراتيجي"
                    : "Strategic Analysis Axes"}
                </h3>

                {/* Buttons Grid */}
                <div className="grid lg:grid-cols-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mb-10">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        if (containerRef.current) {
                          const offset = 100; // Adjust for navbar height
                          const bodyRect = document.body.getBoundingClientRect().top;
                          const elementRect =
                            containerRef.current.getBoundingClientRect().top;
                          const elementPosition = elementRect - bodyRect;
                          const offsetPosition = elementPosition - offset;

                          window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth",
                          });
                        }
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 gap-3 group ${
                        activeTab === tab.id
                          ? "bg-primary border-primary shadow-lg shadow-primary/20"
                          : "bg-slate-50 border-slate-100 hover:bg-white hover:border-primary/30"
                      }`}
                    >
                      <div
                        className={`text-xl transition-colors duration-300 ${
                          activeTab === tab.id
                            ? "text-white"
                            : "text-primary group-hover:scale-110"
                        }`}
                      >
                        {tab.icon}
                      </div>
                      <span
                        className={`text-[11px] font-black uppercase text-center leading-tight transition-colors duration-300 ${
                          activeTab === tab.id ? "text-white" : "text-slate-500"
                        }`}
                      >
                        {tab.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Active Content Box moved to Main Column */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <TimedArticleSuggestion
        article={article}
        recommendedArticles={recommendedArticles}
        locale={locale}
        isRTL={isRTL}
      />
    </div>
  );
};

export default AnalysesDetails;
