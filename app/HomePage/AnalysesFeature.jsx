"use client";
import React from "react";
import Image from "next/image";
import { Link, useRouter } from "../../i18n/routing";
import { useLocale } from "next-intl";
import NewsletterGatePopup from "../Components/Popup/NewsletterGatePopup";
import {
  FaRegCalendarAlt,
  FaArrowRight,
  FaArrowLeft,
  FaStar,
} from "react-icons/fa";
import {
  HiOutlineArrowNarrowRight,
  HiOutlineArrowNarrowLeft,
} from "react-icons/hi";

const AnalysesFeature = ({ articles, translations }) => {
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "ar";
  const [brokenImages, setBrokenImages] = React.useState({});
  const [newsletterGateOpen, setNewsletterGateOpen] = React.useState(false);
  const [pendingArticleHref, setPendingArticleHref] = React.useState("");

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

  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text p-2 bg-gradient-to-r from-primary to-slate-400 mb-6">
            {isRTL
              ? "أحدث التحليلات الاستراتيجية"
              : "Latest Strategic Analyses"}
          </h2>
          <p className="max-w-2xl mx-auto text-slate-500 font-medium leading-relaxed">
            {isRTL
              ? "رؤى معمقة وتحليلات رصينة حول القضايا الراهنة والتحولات الاستراتيجية في المنطقة والعالم."
              : "Deep insights and robust analyses on current issues and strategic shifts in the region and the world."}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0, 6).map((article) => {
            const title = article.title?.[locale] || article.title?.["en"];
            const subtitle =
              article.subtitle?.[locale] || article.subtitle?.["en"];
            const slug = article.slug?.[locale] || article.slug?.["en"];
            const hasValidImage =
              typeof article.image_url === "string" &&
              article.image_url.trim().length > 0;
            const imageSrc =
              brokenImages[article.id] || !hasValidImage
                ? "/Home/stepn.jpg"
                : article.image_url;

            return (
              <div
                key={article.id}
                className="group bg-white  border border-primary/50 rounded-[2.5rem] overflow-hidden  hover:border-primary/20 hover:shadow-[0_20px_50px_rgba(197,160,89,0.15)] transition-all duration-700 flex flex-col h-full"
              >
                {/* Image Wrap */}
                <div className="relative h-70 overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={title || "Article Image"}
                    fill
                    className={`group-hover:scale-110 transition-transform duration-1000 ease-out object-contain ${
                      imageSrc === "/Home/talaat-logo.png"
                        ? "p-8 object-contain bg-slate-50"
                        : ""
                    }`}
                    onError={() =>
                      setBrokenImages((prev) => ({
                        ...prev,
                        [article.id]: true,
                      }))
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

                  {/* Category Badge */}
                  <div
                    className={`absolute top-6 ${isRTL ? "right-6" : "left-6"} z-20`}
                  >
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest shadow-lg border border-white/20">
                      {article.type?.name?.[locale] ||
                        article.type?.name?.["en"]}
                    </span>
                  </div>

                  {/* Featured Icon */}
                  <div
                    className={`absolute top-6 ${isRTL ? "left-6" : "right-6"} z-20`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center text-white shadow-lg ">
                      <FaStar size={12} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                  {/* <div className="flex items-center gap-3 text-slate-700 text-[12px] font-black uppercase tracking-widest mb-4">
                    <FaRegCalendarAlt className="text-primary" size={20} />
                    <span>{article.published_at}</span>
                  </div> */}

                  <Link
                    href={`/analyses/article/${slug}`}
                    onClick={(event) =>
                      handleArticleClick(event, `/analyses/article/${slug}`)
                    }
                  >
                    <h3 className="text-xl font-black text-baseTwo mb-3 line-clamp-2 leading-tight hover:text-primary transition-colors cursor-pointer group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300">
                      {title}
                    </h3>
                  </Link>

                  {subtitle && (
                    <p className="text-sm font-bold text-primary mb-6 line-clamp-1 opacity-80 italic">
                      {subtitle}
                    </p>
                  )}

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <Link
                      href={`/analyses/article/${slug}`}
                      onClick={(event) =>
                        handleArticleClick(event, `/analyses/article/${slug}`)
                      }
                      className="flex items-center gap-2 group/btn"
                    >
                      <span className="text-xs font-black text-baseTwo uppercase tracking-widest border-b border-transparent group-hover/btn:border-primary group-hover/btn:text-primary transition-all">
                        {isRTL ? "اقرأ التحليل" : "Read Analysis"}
                      </span>
                      <div className="text-primary group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform">
                        {isRTL ? (
                          <HiOutlineArrowNarrowLeft />
                        ) : (
                          <HiOutlineArrowNarrowRight />
                        )}
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-16 text-center">
          <Link
            href="/analyses"
            className="inline-flex items-center gap-3 bg-primary border-2 border-primary text-white hover:bg-white hover:text-primary px-8 py-3 rounded-full font-bold text-lg  transition-all duration-500 hover:shadow-xl group"
          >
            <span>{isRTL ? "استعراض كافة المقالات" : "View All Analyses"}</span>
            <div className="transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
              {isRTL ? <FaArrowLeft size={10} /> : <FaArrowRight size={10} />}
            </div>
          </Link>
        </div>
      </div>
      <NewsletterGatePopup
        isOpen={newsletterGateOpen}
        onClose={() => setNewsletterGateOpen(false)}
        onSuccess={handleNewsletterSuccess}
        isRTL={isRTL}
      />
    </section>
  );
};

export default AnalysesFeature;
