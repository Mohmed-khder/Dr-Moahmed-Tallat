"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";

const AnalysesFilter = ({ isRTL }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isFeatured = searchParams.get("is_featured") === "1";
  const isOldValue = searchParams.get("is_old");
  const isOld = isOldValue === "1";
  const isNew = !isFeatured && (isOldValue === "0" || isOldValue === null);
  const initialSearch = searchParams.get("search") || "";

  const [searchValue, setSearchValue] = useState(initialSearch);

  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  const handleFilter = (filterType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.delete("is_featured");
    params.delete("is_old");

    if (filterType === "featured") {
      params.set("is_featured", "1");
    } else if (filterType === "old") {
      params.set("is_old", "1");
    } else if (filterType === "new") {
      params.set("is_old", "0");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (searchValue) {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearSearch = () => {
    setSearchValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-8 md:mb-6 mb-0">
      {/* Search Bar Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full max-w-xl group"
        >
          <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-focus-within:bg-primary/10 transition-all opacity-0 group-focus-within:opacity-100" />
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={isRTL ? "ابحث عن المقالات والتحليلات..." : "Search for articles and analyses..."}
              className={`w-full bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl py-4 ${isRTL ? "pr-14 pl-14" : "pl-14 pr-14"} text-sm font-bold text-baseTwo focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm outline-none placeholder:text-slate-400`}
            />
            <FiSearch
              className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-5" : "left-5"} text-slate-400 group-focus-within:text-primary transition-colors`}
              size={20}
            />
            {searchValue && (
              <button
                type="button"
                onClick={clearSearch}
                className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-4" : "right-4"} w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all`}
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </form>

        {/* Filter Buttons Group */}
        <div className="flex flex-wrap items-center gap-4">
          {false && (
          <button
            onClick={() => handleFilter("all")}
            className={`px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2.5 ${
              !isFeatured && isOldValue === null
                ? "bg-primary text-white shadow-xl shadow-primary/30 -translate-y-1"
                : "bg-white text-slate-600 border border-slate-200 hover:border-primary/30 hover:bg-primary/5 shadow-sm"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${!isFeatured && isOldValue === null ? "bg-white animate-pulse" : "bg-slate-300"}`}
            />
            {isRTL ? "الكل" : "All"}
          </button>
          )}

          <button
            onClick={() => handleFilter("new")}
            className={`px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2.5 ${
              isNew
                ? "bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-xl shadow-blue-600/30 -translate-y-1"
                : "bg-white text-slate-600 border border-slate-200 hover:border-blue-400/30 hover:bg-blue-50 shadow-sm"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${isNew ? "bg-white animate-pulse" : "bg-blue-300"}`}
            />
            {isRTL ? "حديثة" : "Recent"}
          </button>

          <button
            onClick={() => handleFilter("old")}
            className={`px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2.5 ${
              isOld
                ? "bg-linear-to-r from-amber-600 to-amber-500 text-white shadow-xl shadow-amber-600/30 -translate-y-1"
                : "bg-white text-slate-600 border border-slate-200 hover:border-amber-400/30 hover:bg-amber-50 shadow-sm"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${isOld ? "bg-white animate-pulse" : "bg-amber-300"}`}
            />
            {isRTL ? "أرشيف" : "Archive"}
          </button>

          <button
            onClick={() => handleFilter("featured")}
            className={`px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2.5 ${
              isFeatured
                ? "bg-linear-to-r from-emerald-600 to-emerald-500 text-white shadow-xl shadow-emerald-600/30 -translate-y-1"
                : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-400/30 hover:bg-emerald-50 shadow-sm"
            }`}
          >
            <FiSearch
              className={`${isFeatured ? "text-white" : "text-emerald-500"}`}
              size={14}
            />
            {isRTL ? "مميزة" : "Featured"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysesFilter;
