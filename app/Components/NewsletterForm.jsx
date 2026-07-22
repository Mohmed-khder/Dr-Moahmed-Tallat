"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { FaEnvelope, FaPaperPlane, FaPhoneAlt, FaSpinner } from "react-icons/fa";
import { subscribeNewsletter } from "../lib/server-api";
import { trackMetaCustomEvent, trackMetaEvent } from "../lib/tracking";

const NewsletterForm = ({ variant = "footer", onSuccess }) => {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const isPopup = variant === "popup";

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mathQuestion, setMathQuestion] = useState("");
  const [mathAnswer, setMathAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [extraKey, setExtraKey] = useState("");

  const generateMathQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ["+", "-", "*"];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    if (operation === "+") {
      setMathQuestion(`${num1} + ${num2} = ?`);
      setCorrectAnswer(num1 + num2);
    } else if (operation === "-") {
      const [largerNum, smallerNum] =
        num1 >= num2 ? [num1, num2] : [num2, num1];
      setMathQuestion(`${largerNum} - ${smallerNum} = ?`);
      setCorrectAnswer(largerNum - smallerNum);
    } else {
      setMathQuestion(`${num1} × ${num2} = ?`);
      setCorrectAnswer(num1 * num2);
    }

    setMathAnswer("");
  };

  useEffect(() => {
    generateMathQuestion();
  }, []);

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePhone = (value) => /^[\d\s\-+()]+$/.test(value);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = t("footer.newsletterErrorRequired");
    } else if (!validateEmail(email)) {
      newErrors.email = t("footer.newsletterErrorInvalid");
    }

    if (!phone.trim()) {
      newErrors.phone = t("contactForm.errorPhoneRequired");
    } else if (!validatePhone(phone)) {
      newErrors.phone = t("contactForm.errorPhoneInvalid");
    }

    if (extraKey.trim()) {
      newErrors.extraKey =
        t("contactForm.errorInvalidSubmission") ||
        "Invalid submission detected";
    }

    if (!mathAnswer.trim()) {
      newErrors.mathAnswer =
        t("contactForm.errorMathRequired") || "Math answer is required";
    } else if (parseInt(mathAnswer, 10) !== correctAnswer) {
      newErrors.mathAnswer =
        t("contactForm.errorMathIncorrect") || "Incorrect math answer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") setEmail(value);
    if (name === "phone") setPhone(value);
    if (name === "mathAnswer") setMathAnswer(value);
    if (name === "extra_key") setExtraKey(value);

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(
        t("contactForm.errorValidation") || "Please fix the errors below",
        {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 5000,
        },
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await subscribeNewsletter(email, phone);

      if (response.ok) {
        trackMetaEvent("Subscribe", { subscription_type: "newsletter" });
        trackMetaCustomEvent("NewsletterSignup", {
          subscription_type: "newsletter",
        });

        toast.success(t("footer.newsletterSuccess"), {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 5000,
        });

        setEmail("");
        setPhone("");
        setExtraKey("");
        setMathAnswer("");
        setErrors({});
        generateMathQuestion();
        onSuccess?.();
      } else {
        let errorMsg = t("footer.newsletterError");

        try {
          const errorData = await response.json();
          errorMsg =
            errorData?.errors?.email?.[0] || errorData?.message || errorMsg;
        } catch {
          errorMsg = t("footer.newsletterError");
        }

        toast.error(errorMsg, {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 7000,
        });
      }
    } catch (error) {
      const status = error?.response?.status;
      const serverMsg = error?.response?.data?.message;
      const emailValidationMsg = error?.response?.data?.data?.email?.[0];

      let msg = serverMsg || t("footer.newsletterError");

      if (status === 422) {
        msg =
          emailValidationMsg ||
          serverMsg ||
          t("footer.newsletterErrorConflict");
      } else if (status === 409) {
        msg = serverMsg || t("footer.newsletterErrorConflict");
      } else if (status === 401 || status === 403) {
        msg = serverMsg || t("footer.newsletterErrorAuth");
      } else if (status >= 500) {
        msg = serverMsg || t("footer.newsletterErrorServer");
      } else if (!error.response) {
        msg =
          error.code === "ECONNABORTED"
            ? t("footer.newsletterErrorTimeout")
            : t("footer.newsletterErrorNetwork");
      }

      toast.error(msg, {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 7000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-lg border-2 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 ${
    isPopup
      ? "bg-white border-slate-200 text-baseTwo placeholder:text-slate-400"
      : "bg-white/10 backdrop-blur-sm border-black/20 text-black placeholder-black/50 focus:bg-white/15"
  }`;
  const errorClass = isPopup ? "text-red-600" : "text-red-300";

  return (
    <form onSubmit={handleSubscribe} className="space-y-3">
      <div className="hidden">
        <input
          type="text"
          name="extra_key"
          value={extraKey}
          onChange={handleInputChange}
          tabIndex="-1"
          autoComplete="off"
          aria-hidden="true"
        />
      </div>

      <div className="relative">
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          placeholder={t("footer.newsletterPlaceholder")}
          className={`${inputClass} ${
            errors.email ? "border-red-400/60 bg-red-500/10" : ""
          } ${isRTL ? "text-right pr-10" : "text-left pl-10"}`}
          disabled={isLoading}
          autoComplete="email"
          aria-invalid={!!errors.email}
        />
        <FaEnvelope
          className={`absolute top-3.5 w-4 h-4 pointer-events-none ${
            isPopup ? "text-slate-500" : "text-black"
          } ${isRTL ? "right-3" : "left-3"}`}
        />
        {errors.email && (
          <p className={`${errorClass} text-xs mt-1 ${isRTL ? "text-right" : "text-left"}`}>
            {errors.email}
          </p>
        )}
      </div>

      <div className="relative">
        <input
          type="tel"
          name="phone"
          value={phone}
          onChange={handleInputChange}
          placeholder={t("contactForm.placeholderPhone")}
          className={`${inputClass} ${
            errors.phone ? "border-red-400/60 bg-red-500/10" : ""
          } ${isRTL ? "text-right pr-10" : "text-left pl-10"}`}
          disabled={isLoading}
          autoComplete="tel"
          aria-invalid={!!errors.phone}
        />
        <FaPhoneAlt
          className={`absolute top-3.5 w-4 h-4 pointer-events-none ${
            isPopup ? "text-slate-500" : "text-black"
          } ${isRTL ? "right-3" : "left-3"}`}
        />
        {errors.phone && (
          <p className={`${errorClass} text-xs mt-1 ${isRTL ? "text-right" : "text-left"}`}>
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-black">
          {t("footer.mathCaptchaLabel") || "Verify you're human"}{" "}
          <span dir="ltr" className="inline-block font-sans">
            ({mathQuestion})
          </span>
        </label>
        <input
          type="number"
          name="mathAnswer"
          value={mathAnswer}
          onChange={handleInputChange}
          placeholder={t("footer.mathPlaceholder") || "Enter answer"}
          className={`${inputClass} ${
            errors.mathAnswer ? "border-red-400/60 bg-red-500/10" : ""
          } ${isRTL ? "text-right" : "text-left"}`}
          disabled={isLoading}
          min="0"
          aria-invalid={!!errors.mathAnswer}
        />
        {errors.mathAnswer && (
          <p className={`${errorClass} text-xs mt-1 ${isRTL ? "text-right" : "text-left"}`}>
            {errors.mathAnswer}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin w-4 h-4" />
            <span>{t("footer.newsletterSending")}</span>
          </>
        ) : (
          <>
            <FaPaperPlane className="w-4 h-4" />
            <span>{t("footer.newsletterSubscribe")}</span>
          </>
        )}
      </button>
    </form>
  );
};

export default NewsletterForm;
