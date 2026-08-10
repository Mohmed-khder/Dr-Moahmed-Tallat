"use client";

import React, { useEffect, useState } from "react";
import { useVault } from "../Context/VaultContext";
import { useRouter, usePathname } from "../../i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { FaEye, FaFilePdf, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import ApiEmptyState from "../Components/ApiEmptyState";

const getReadableFileUrl = (file) => {
  const url = file?.preview_url || file?.view_url || file?.download_url || "";
  if (!url) return "";

  const separator = url.includes("#") ? "&" : "#";
  return `${url}${separator}toolbar=0&navpanes=0&scrollbar=1&statusbar=0&messages=0`;
};

const FileSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 bg-slate-200 rounded-2xl shrink-0"></div>
        <div className="flex-1 pt-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-12 bg-slate-200 rounded-full"></div>
            <div className="h-4 w-16 bg-slate-200 rounded-full"></div>
          </div>
          <div className="h-6 w-full bg-slate-200 rounded-xl mb-2"></div>
          <div className="h-6 w-2/3 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
      <div className="mt-auto pt-6 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4">
        <div className="h-4 w-24 bg-slate-200 rounded-full"></div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-20 bg-slate-200 rounded-xl"></div>
          <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

const PaginationSkeleton = () => {
  return (
    <div className="mt-16 flex justify-center items-center gap-2 md:gap-4 flex-wrap animate-pulse">
      <div className="w-24 h-12 md:h-14 bg-slate-200 rounded-2xl"></div>
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="w-12 h-12 md:w-14 md:h-14 bg-slate-200 rounded-2xl"
        ></div>
      ))}
      <div className="w-24 h-12 md:h-14 bg-slate-200 rounded-2xl"></div>
    </div>
  );
};

const ResearchArchive = () => {
  const { isUnlocked, vaultData, isInitializing, loading, refreshVault } =
    useVault();
  const [previewUrl, setPreviewUrl] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const t = useTranslations("navbar");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const currentPage = Number(searchParams.get("page") || 1);

  // Redirect if not unlocked (after initialization)
  useEffect(() => {
    if (!isInitializing && !isUnlocked) {
      router.push("/");
    }
  }, [isInitializing, isUnlocked, router]);

  useEffect(() => {
    if (!isInitializing && isUnlocked) {
      refreshVault(currentPage);
    }
  }, [currentPage, isInitializing, isUnlocked, refreshVault]);

  const handlePageChange = (page) => {
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries()),
    );
    currentParams.set("page", page.toString());

    router.push(`${pathname}?${currentParams.toString()}`, {
      scroll: false,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isInitializing || (loading && !vaultData)) {
    return (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <FileSkeleton key={i} />
            ))}
          </div>
          <PaginationSkeleton />
        </div>
      </div>
    );
  }

  if (!isUnlocked || !vaultData) return null;

  const files = Array.isArray(vaultData.data)
    ? vaultData.data
    : vaultData.data?.data || [];

  const pagination = vaultData.data?.current_page
    ? vaultData.data
    : vaultData || {};

  const pillarsData = t.raw("vault.pillars");

  return (
    <div className="min-h-screen">
      {/* Strategic Header Section */}
      <section className="relative pt-32 pb-24 bg-white overflow-hidden border-b border-gray-100">
        {/* Background Decorative Gradients - Lighter */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-100/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div
            className={`flex flex-col lg:flex-row items-center gap-16 ${isRTL ? "lg:flex-row-reverse text-right" : "text-left"}`}
          >
            {/* Left/Right Column: Strategic Intro */}
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <FaShieldAlt className="text-primary text-xs" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                      {t("vault.authorizedOnly")}
                    </span>
                  </div>
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-baseTwo mb-8 leading-tight">
                  {t("vault.introTitle")}
                </h2>

                <div
                  className={`space-y-6 mb-12 ${isRTL ? "border-r-2 border-primary/30 pr-8" : "border-l-2 border-primary/30 pl-8"}`}
                >
                  <h3 className="text-primary font-black uppercase tracking-widest text-sm">
                    {t("vault.strategicDefinitionLabel")}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed font-medium">
                    {t("vault.strategicDefinitionText")}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Pillar Grid - Light Theme */}
            <div className="lg:w-1/2 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.isArray(pillarsData) &&
                  pillarsData.map((pill, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all group"
                    >
                      <h4 className="text-primary font-black text-sm mb-2 uppercase tracking-wide">
                        {pill.title}
                      </h4>
                      <p className="text-gray-500 text-xs leading-relaxed font-medium">
                        {pill.description}
                      </p>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* File List Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex flex-col  items-center justify-center mx-aut mb-12`}
          >
            <h2 className="text-2xl font-black text-baseTwo">
              {t("vault.allFiles")}
            </h2>
            <span className="h-1  bg-primary w-30 mt-2 "></span>
          </div>
          {files.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full relative overflow-hidden"
                  >
                    {/* Decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full group-hover:bg-primary/10 transition-colors" />

                    <div className="flex items-start gap-4 mb-6 relative z-10">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                        <FaFilePdf className="text-primary text-2xl" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full uppercase tracking-widest leading-none">
                            {file.type || "PDF"}
                          </span>
                          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                            {file.size}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-baseTwo leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {file.title?.[locale] ||
                            file.title?.["en"] ||
                            file.title?.["ar"]}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4 relative z-10">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-primary/40" />
                        {file.created_at}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewUrl(getReadableFileUrl(file))
                          }
                          disabled={!getReadableFileUrl(file)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 text-primary text-xs font-black rounded-xl hover:bg-primary hover:text-white transition-all"
                        >
                          <FaEye className="text-[10px]" />
                          <span>{t("vault.view")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {pagination && pagination.last_page > 1 && (
                <div className="mt-20 flex justify-center items-center gap-2 md:gap-4 flex-wrap">
                  <button
                    onClick={() =>
                      handlePageChange(pagination.current_page - 1)
                    }
                    disabled={pagination.current_page === 1}
                    className={`px-4 h-12 md:h-14 flex items-center justify-center rounded-2xl font-bold transition-all border border-slate-100 ${
                      pagination.current_page === 1
                        ? "bg-slate-50 text-slate-400 cursor-not-allowed opacity-70"
                        : "bg-white text-slate-600 hover:border-primary/40 hover:bg-primary hover:text-white"
                    }`}
                  >
                    {t("prev") || (isRTL ? "السابق" : "Prev")}
                  </button>

                  {/* Page Numbers with Sliding Window */}
                  {(() => {
                    const current = pagination.current_page;
                    const last = pagination.last_page;
                    const delta = 2;
                    const range = [];
                    const rangeWithDots = [];
                    let l;

                    for (let i = 1; i <= last; i++) {
                      if (
                        i === 1 ||
                        i === last ||
                        (i >= current - delta && i <= current + delta)
                      ) {
                        range.push(i);
                      }
                    }

                    for (let i of range) {
                      if (l) {
                        if (i - l === 2) {
                          rangeWithDots.push(l + 1);
                        } else if (i - l !== 1) {
                          rangeWithDots.push("...");
                        }
                      }
                      rangeWithDots.push(i);
                      l = i;
                    }

                    return rangeWithDots.map((p, index) => (
                      <React.Fragment key={index}>
                        {p === "..." ? (
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
                            {p}
                          </button>
                        )}
                      </React.Fragment>
                    ));
                  })()}

                  <button
                    onClick={() =>
                      handlePageChange(pagination.current_page + 1)
                    }
                    disabled={pagination.current_page === pagination.last_page}
                    className={`px-4 h-12 md:h-14 flex items-center justify-center rounded-2xl font-bold transition-all border border-slate-100 ${
                      pagination.current_page === pagination.last_page
                        ? "bg-slate-50 text-slate-400 cursor-not-allowed opacity-70"
                        : "bg-white text-slate-600 hover:border-primary/40 hover:bg-primary hover:text-white"
                    }`}
                  >
                    {t("next") || (isRTL ? "التالي" : "Next")}
                  </button>
                </div>
              )}
            </>
          ) : (
            <ApiEmptyState
              title={t("vault.noFiles")}
              description={t("vault.noFilesSubtitle")}
              isRTL={isRTL}
            />
          )}
        </div>

        {/* PDF Preview Modal */}
        {previewUrl && (
          <div
            className="fixed inset-0 z-2000 flex items-center justify-center p-4 md:p-10"
            onContextMenu={(event) => event.preventDefault()}
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setPreviewUrl(null)}
            />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full h-full max-w-6xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <h3 className="font-black text-baseTwo uppercase tracking-widest text-sm">
                  {t("vault.preview")}
                </h3>
                <button
                  onClick={() => setPreviewUrl(null)}
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all font-bold"
                >
                  ✕
                </button>
              </div>

              <iframe
                src={previewUrl}
                className="w-full flex-1 border-none"
                title="PDF Preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchArchive;
