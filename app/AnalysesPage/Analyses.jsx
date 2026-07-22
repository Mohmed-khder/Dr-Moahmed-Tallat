"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Link, useRouter, usePathname } from "../../i18n/routing";
import { useParams, useSearchParams } from "next/navigation";
import ApiEmptyState from "../Components/ApiEmptyState";
import NewsletterGatePopup from "../Components/Popup/NewsletterGatePopup";
import {
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
} from "react-icons/md";
import {
  FaRegCalendarAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaStar,
  FaTwitter,
  FaHistory,
} from "react-icons/fa";
import { GrScheduleNew } from "react-icons/gr";

function getLocalizedSlug(slug, locale) {
  if (!slug) return "";
  if (typeof slug === "string") return slug;
  return slug?.[locale] || slug?.["en"] || slug?.["ar"] || "";
}

const Analyses = ({
  articles,
  pagination,
  translations,
  locale,
  isRTL,
  currentType,
}) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const type = params ? params.type : null;
  const [brokenImages, setBrokenImages] = React.useState({});
  const [newsletterGateOpen, setNewsletterGateOpen] = React.useState(false);
  const [pendingArticleHref, setPendingArticleHref] = React.useState("");

  useEffect(() => {
    if (!currentType || !type) return;
    const correctSlug = getLocalizedSlug(currentType.slug, locale);
    const decodedCorrect = correctSlug ? decodeURIComponent(correctSlug) : "";
    const decodedCurrent = decodeURIComponent(type);
    if (decodedCorrect && decodedCorrect !== decodedCurrent) {
      router.replace(`/analyses/${correctSlug}`, { scroll: false });
    }
  }, [currentType, type, locale, router]);

  const handlePageChange = (page) => {
    if (!pagination || page < 1 || page > pagination.last_page) return;
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries()),
    );
    currentParams.set("page", page.toString());

    router.push(`${pathname}?${currentParams.toString()}`, {
      scroll: false,
    });
    window.setTimeout(() => {
      router.refresh();
    }, 0);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleArticleClick = (event, href) => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("newsletter-article-gate-done") === "1") {
      return;
    }

    event.preventDefault();
    setPendingArticleHref(href);
    setNewsletterGateOpen(true);
  };

  const handleNewsletterSuccess = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("newsletter-article-gate-done", "1");
    }

    const href = pendingArticleHref;
    setNewsletterGateOpen(false);
    setPendingArticleHref("");

    if (href) {
      router.push(href);
    }
  };

  if (!articles || articles.length === 0) {
    const searchQuery = searchParams.get("search");

    if (searchQuery) {
      return (
        <ApiEmptyState
          title={isRTL ? `لا توجد نتائج لـ "${searchQuery}"` : `No results for "${searchQuery}"`}
          description={
            isRTL
              ? "لم نجد أي تحليلات تطابق بحثك. جرب استخدام كلمات مفتاحية مختلفة أو العودة لكافة التحليلات."
              : "We couldn't find any analyses matching your search. Try different keywords or go back to all analyses."
          }
          ctaLabel={isRTL ? "مسح البحث" : "Clear Search"}
          ctaHref="/analyses"
          isRTL={isRTL}
        />
      );
    }

    return (
      <ApiEmptyState
        title={
          translations.noItems ||
          (isRTL ? "لا توجد تحليلات متاحة" : "No Analyses Available")
        }
        description={
          isRTL
            ? "نعمل حالياً على إعداد محتوى تحليلي جديد. يرجى مراجعة هذه الصفحة لاحقاً أو استكشاف الأرشيف."
            : "We're currently preparing new analytical content. Please check back soon or explore the archive."
        }
        ctaLabel={isRTL ? "كافة التحليلات" : "Explore Archive"}
        ctaHref="/analyses?is_old=1"
        isRTL={isRTL}
      />
    );
  }

  return (
    <div className="py-20 relative">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article) => {
            const title = article.title?.[locale] || article.title?.["en"];
            const subtitle =
              article.subtitle?.[locale] || article.subtitle?.["en"];
            const description =
              article.description?.[locale] || article.description?.["en"];
            const articleSlug = article.slug?.[locale] || article.slug?.["en"];
            const hasValidImage =
              typeof article.image_url === "string" &&
              article.image_url.trim().length > 0;
            const imageSrc =
              brokenImages[article.id] || !hasValidImage
                ? "/Home/stepn.jpg"
                : article.image_url;

            const isFeatured = article.is_featured;
            const isOld = article.is_old;
            const publishedAt = article.published_at;
            const socialPlatforms = article.social_platforms || [];

            const getPlatformIcon = (platform) => {
              switch (platform.toLowerCase()) {
                case "facebook":
                  return <FaFacebook className="w-3.5 h-3.5 text-[#1877F2]" />;
                case "twitter":
                case "x":
                  return <FaTwitter className="w-3.5 h-3.5 text-black" />;
                case "instagram":
                  return <FaInstagram className="w-3.5 h-3.5 text-[#E4405F]" />;
                case "linkedin":
                  return <FaLinkedin className="w-3.5 h-3.5 text-[#0A66C2]" />;
                default:
                  return null;
              }
            };

            return (
              <div
                key={article.id}
                className="group bg-white rounded-4xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 border border-slate-50 flex flex-col h-full relative"
              >
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={title || "Article Image"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`group-hover:scale-110 transition-transform duration-1000 ease-out ${
                      imageSrc === "/Home/talaat-logo.png"
                        ? "object-contain p-6 bg-slate-50"
                        : "object-contain"
                    }`}
                    onError={() =>
                      setBrokenImages((prev) => ({ ...prev, [article.id]: true }))
                    }
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />

                  {/* Badges */}
                  <div className="absolute top-6 left-6 rtl:right-6 rtl:left-auto flex flex-col gap-2 z-20">
                    <span className="bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg text-xs font-black text-primary uppercase tracking-[0.15em] border border-primary/10">
                      {article.type?.name?.[locale] ||
                        article.type?.name?.["en"]}
                    </span>
                    {isFeatured && (
                      <span className="bg-green-600 w-fit px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-[0.15em] shadow-lg flex items-center gap-1.5">
                        <FaStar className="w-2.5 h-2.5" />
                        {isRTL ? "تحليل مميز" : "Prime"}
                      </span>
                    )}
                    {isOld === false && (
                      <span className="bg-blue-600 w-fit px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-[0.15em] shadow-lg flex items-center gap-1.5">
                        <GrScheduleNew className="w-2.5 h-2.5" />
                        {isRTL ? "مقال حديث" : "Latest Article"}
                      </span>
                    )}
                    {isOld === true && (
                      <span className="bg-amber-600 w-fit px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-[0.15em] shadow-lg flex items-center gap-1.5">
                        <FaHistory className="w-2.5 h-2.5" />
                        {isRTL ? "مقال قديم" : "Old Article"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8  flex-1 flex flex-col relative z-20 bg-white">
                  {/* <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100/50">
                      <FaRegCalendarAlt className="text-primary" />
                      <span>{article.created_at}</span>
                    </div>
                  </div> */}

                  <Link
                    href={`/analyses/article/${articleSlug}`}
                    onClick={(event) =>
                      handleArticleClick(
                        event,
                        `/analyses/article/${articleSlug}`,
                      )
                    }
                  >
                    <h3 className="text-xl font-black text-baseTwo mb-3 line-clamp-2 leading-tight hover:text-primary transition-colors cursor-pointer group-hover:text-primary decoration-primary/30 underline-offset-8 decoration-2 group-hover:underline">
                      {title}
                    </h3>
                  </Link>

                  {subtitle && (
                    <p className="text-sm font-bold text-primary mb-4 line-clamp-1 opacity-80 uppercase tracking-tighter">
                      {subtitle}
                    </p>
                  )}

                  <p className="text-slate-500 text-sm mb-8 line-clamp-3 leading-relaxed font-medium">
                    {description}
                  </p>

                  <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                    <Link
                      href={`/analyses/article/${articleSlug}`}
                      onClick={(event) =>
                        handleArticleClick(
                          event,
                          `/analyses/article/${articleSlug}`,
                        )
                      }
                      className="flex items-center gap-4 group/btn"
                    >
                      <span className="text-xs font-black text-baseTwo uppercase tracking-[0.15em] transition-colors border-b-2 border-transparent group-hover/btn:border-primary group-hover/btn:text-primary">
                        {translations.readMore ||
                          (isRTL ? "التفاصيل الكاملة" : "Read Full Analysis")}
                      </span>

                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary group-hover/btn:bg-primary group-hover/btn:text-white transition-all duration-500 shadow-inner group-hover/btn:shadow-lg group-hover/btn:shadow-primary/30 group-hover/btn:rotate-360">
                        {isRTL ? (
                          <MdOutlineKeyboardDoubleArrowLeft />
                        ) : (
                          <MdOutlineKeyboardDoubleArrowRight />
                        )}
                      </div>
                    </Link>

                    {socialPlatforms?.length > 0 && (
                      <div className="flex items-center gap-2.5 bg-slate-50/50 p-2 rounded-xl">
                        {socialPlatforms.map((platform) => (
                          <span
                            key={platform}
                            title={platform}
                            className="hover:scale-125 transition-transform duration-300"
                          >
                            {getPlatformIcon(platform)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {pagination && pagination.last_page > 1 && (
          <div className="mt-24 flex justify-center items-center gap-3 flex-wrap">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className={`px-8 h-14 flex items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                pagination.current_page === 1
                  ? "bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100"
                  : "bg-white text-baseTwo border border-slate-100 hover:border-primary hover:text-primary hover:shadow-xl hover:shadow-slate-100 active:scale-95"
              }`}
            >
              {translations.prev || (isRTL ? "السابق" : "Prev")}
            </button>

            {/* Page Numbers with Sliding Window */}
            {(() => {
              const current = pagination.current_page;
              const last = pagination.last_page;
              const delta = 2; // Number of pages to show on each side of current
              const range = [];
              const rangeWithDots = [];
              let l;

              for (let i = 1; i <= last; i++) {
                if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
                  range.push(i);
                }
              }

              for (let i of range) {
                if (l) {
                  if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                  } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                  }
                }
                rangeWithDots.push(i);
                l = i;
              }

              return rangeWithDots.map((p, index) => (
                <React.Fragment key={index}>
                  {p === '...' ? (
                    <span className="w-10 h-10 flex items-center justify-center text-slate-400 font-bold">
                      ...
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(p)}
                      className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl font-black transition-all ${
                        current === p
                          ? "bg-primary text-white shadow-xl shadow-primary/30 scale-110"
                          : "bg-white text-slate-600 border border-slate-100 hover:border-primary/40 hover:bg-slate-50"
                      }`}
                    >
                      {p < 10 ? `0${p}` : p}
                    </button>
                  )}
                </React.Fragment>
              ));
            })()}

            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className={`px-8 h-14 flex items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                pagination.current_page === pagination.last_page
                  ? "bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100"
                  : "bg-white text-baseTwo border border-slate-100 hover:border-primary hover:text-primary hover:shadow-xl hover:shadow-slate-100 active:scale-95"
              }`}
            >
              {translations.next || (isRTL ? "التالي" : "Next")}
            </button>
          </div>
        )}
      </div>
      <NewsletterGatePopup
        isOpen={newsletterGateOpen}
        onClose={() => setNewsletterGateOpen(false)}
        onSuccess={handleNewsletterSuccess}
        isRTL={isRTL}
      />
    </div>
  );
};

export default Analyses;
