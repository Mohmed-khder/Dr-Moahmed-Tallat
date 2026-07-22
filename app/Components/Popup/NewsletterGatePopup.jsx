"use client";

import React from "react";
import { FaEnvelope, FaTimes } from "react-icons/fa";
import NewsletterForm from "../NewsletterForm";

const NewsletterGatePopup = ({ isOpen, onClose, onSuccess, isRTL }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close newsletter popup"
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
      />

      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-primary/20"
      >
        <div className="h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-primary hover:text-white`}
          aria-label="Close"
        >
          <FaTimes size={14} />
        </button>

        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FaEnvelope size={20} />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                {isRTL ? "النشرة البريدية" : "Newsletter"}
              </p>
              <h3 className="mt-1 text-xl font-black text-baseTwo">
                {isRTL
                  ? "اشترك قبل قراءة التفاصيل"
                  : "Subscribe before reading"}
              </h3>
            </div>
          </div>

          <p
            className={`mb-5 text-sm leading-7 text-slate-600 ${isRTL ? "text-right" : "text-left"}`}
          >
            {isRTL
              ? "سجّل بريدك ورقم هاتفك لتصلك أحدث التحليلات والرؤى الاستراتيجية."
              : "Add your email and phone number to receive the latest strategic analyses and updates."}
          </p>

          <NewsletterForm variant="popup" onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
};

export default NewsletterGatePopup;
