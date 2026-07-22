"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiX,
  FiArrowRight,
  FiArrowLeft,
  FiClock,
} from "react-icons/fi";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "../../../i18n/routing";
import Image from "next/image";
import { fetchArticlesList } from "../../lib/server-api";

const SearchPopup = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = useTranslations("navbar");
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    let timeoutId;
    if (isOpen) {
      document.body.style.overflow = "hidden";
      timeoutId = setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "unset";
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsLoading(true);
        try {
          const data = await fetchArticlesList(null, {
            search: query,
            limit: 5,
          });
          setResults(data?.data || []);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleClose = () => {
    onClose();
  };

  const handleResultClick = (slug) => {
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10"
          >
            {/* Header / Input */}
            <div className="p-6 border-b border-gray-100 flex items-center gap-4">
              <FiSearch className="text-gray-400 shrink-0" size={24} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-baseTwo placeholder:text-gray-400"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="text-gray-400" size={20} />
                </button>
              )}
              <button
                onClick={handleClose}
                className="text-sm font-bold text-gray-500 hover:text-primary transition-colors"
              >
                {t("esc")}
              </button>
            </div>

            {/* Results Section */}
            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-sm font-bold text-gray-400 animate-pulse uppercase tracking-widest">
                    {t("searching")}
                  </p>
                </div>
              ) : query.trim() === "" ? (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <FiSearch className="text-gray-200" size={40} />
                  </div>
                  <h3 className="text-lg font-bold text-baseTwo mb-2">
                    {t("startSearching")}
                  </h3>
                  <p className="text-sm text-gray-400 max-w-[250px]">
                    {t("searchHint")}
                  </p>
                </div>
              ) : results.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 mb-2">
                    {t("searchResults")}
                  </p>
                  {results.map((article) => {
                    const title =
                      article.title?.[locale] || article.title?.["en"];
                    const slug = article.slug?.[locale] || article.slug?.["en"];
                    const type =
                      article.type?.name?.[locale] ||
                      article.type?.name?.["en"];
                    const date = article.published_at || article.created_at;

                    return (
                      <Link
                        key={article.id}
                        href={`/analyses/article/${slug}`}
                        onClick={() => handleResultClick(slug)}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-100"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 bg-gray-100 shadow-sm">
                          <Image
                            src={article.image_url || "/Home/stepn.jpg"}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md">
                              {type}
                            </span>
                            <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase">
                              <FiClock size={10} />
                              <span>{date}</span>
                            </div>
                          </div>
                          <h4 className="text-md font-bold text-baseTwo truncate group-hover:text-primary transition-colors">
                            {title}
                          </h4>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                          {isRTL ? <FiArrowLeft /> : <FiArrowRight />}
                        </div>
                      </Link>
                    );
                  })}
                  <div className="mt-4 p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-500">
                      {t("showingResults", { count: results.length })}
                    </p>
                    <Link
                      href={`/analyses?search=${query}`}
                      onClick={handleClose}
                      className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
                    >
                      {t("viewAll")}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <FiX className="text-red-200" size={40} />
                  </div>
                  <h3 className="text-lg font-bold text-baseTwo mb-2">
                    {t("noSearchResults")}
                  </h3>
                  <p className="text-sm text-gray-400 max-w-[250px]">
                    {t("noSearchHint")}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchPopup;
