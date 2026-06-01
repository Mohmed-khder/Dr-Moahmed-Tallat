"use client";
import React, { useState, useContext, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaPaperPlane,
  FaSpinner,
  FaFacebookF,
  FaInstagram,
  FaHeart,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6";
import { useTranslations, useLocale } from "next-intl";
import toast from "react-hot-toast";
import { subscribeNewsletter } from "../lib/server-api";
import { useSettings } from "../Context/SettingContext";
import { Link } from "../../i18n/routing";
import Image from "next/image";
import {
  trackMetaCustomEvent,
  trackMetaEvent,
} from "../lib/tracking";
import { formatWhatsAppUrl } from "../lib/whatsapp";
const Footer = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { settings } = useSettings();

  // Newsletter subscription state
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mathQuestion, setMathQuestion] = useState("");
  const [mathAnswer, setMathAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [extraKey, setExtraKey] = useState(""); // Honeypot field

  const isRTL = locale === "ar";

  const currentAddress = settings?.address?.[locale] || t("footer.address");
  const currentFooterText =
    settings?.footer_text?.[locale] || t("footer.legalText");

  const emailList = settings?.emails || [settings?.email || t("footer.email")];
  const currentPhone = settings?.phone || t("footer.phone");

  const facebookUrl = settings?.social_links?.facebook || "https://www.facebook.com/mohamedtalatabdulaziz";
  const instagramUrl = settings?.social_links?.instagram || "https://www.instagram.com/mohamedtalatabdulaziz/";
  const twitterUrl = settings?.social_links?.twitter || "https://x.com/mohdtalaat_gcc";
  const linkedinUrl = settings?.social_links?.linkedin || "https://www.linkedin.com/in/mohdtalat/";
  const youtubeUrl = settings?.social_links?.youtube || "https://www.youtube.com/@mohdtalaat";
  const whatsappUrl = formatWhatsAppUrl(settings?.whatsapp);

  // Math question generator helper function
  const generateMathQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ["+", "-", "*"];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let question, answer;

    switch (operation) {
      case "+":
        question = `${num1} + ${num2} = ?`;
        answer = num1 + num2;
        break;
      case "-":
        // Ensure positive result by swapping if needed
        const [largerNum, smallerNum] =
          num1 >= num2 ? [num1, num2] : [num2, num1];
        question = `${largerNum} - ${smallerNum} = ?`;
        answer = largerNum - smallerNum;
        break;
      case "*":
        question = `${num1} × ${num2} = ?`;
        answer = num1 * num2;
        break;
      default:
        question = `${num1} + ${num2} = ?`;
        answer = num1 + num2;
    }

    setMathQuestion(question);
    setCorrectAnswer(answer);
    setMathAnswer("");
  };

  // Generate initial math question
  useEffect(() => {
    generateMathQuestion();
  }, []);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => /^[\d\s\-+()]+$/.test(phone);

  // Comprehensive validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation
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

    // Honeypot validation
    if (extraKey && extraKey.trim() !== "") {
      newErrors.extraKey =
        t("contactForm.errorInvalidSubmission") ||
        "Invalid submission detected";
    }

    // Math CAPTCHA validation
    if (!mathAnswer.trim()) {
      newErrors.mathAnswer =
        t("contactForm.errorMathRequired") || "Math answer is required";
    } else if (parseInt(mathAnswer) !== correctAnswer) {
      newErrors.mathAnswer =
        t("contactForm.errorMathIncorrect") || "Incorrect math answer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "mathAnswer":
        setMathAnswer(value);
        break;
      case "extra_key":
        setExtraKey(value);
        break;
      default:
        break;
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle newsletter subscription
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
      console.log("Submitting newsletter data:", {
        email: email.trim(),
        phone: phone.trim(),
        extra_key: null,
      });

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

        // Reset form
        setEmail("");
        setPhone("");
        setExtraKey("");
        setMathAnswer("");
        setErrors({});

        // Generate new math question
        generateMathQuestion();
      } else {
        let errorMsg = t("footer.newsletterError");

        try {
          const errorData = await response.json();
          errorMsg =
            errorData?.errors?.email?.[0] ||
            errorData?.message ||
            errorMsg;
        } catch {
          errorMsg = t("footer.newsletterError");
        }

        toast.error(errorMsg, {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 7000,
        });
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);

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
        if (error.code === "ECONNABORTED") {
          msg = t("footer.newsletterErrorTimeout");
        } else {
          msg = t("footer.newsletterErrorNetwork");
        }
      }

      toast.error(msg, {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 7000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <footer className="relative  text-black  py-10 pb-6 px-4 md:px-8 overflow-hidden bg-third">
        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 mb-8 footer-grid">
            {/* Logo and About */}
            <div
              className={`text-center ${
                isRTL ? "lg:text-right" : "lg:text-left"
              }`}
            >
              <div
                className={`flex justify-center ${
                  isRTL ? "lg:justify-start" : "lg:justify-start"
                } mb-4`}
              >
                {settings?.footer_logo && (
                  <Image
                    src={settings.footer_logo}
                    alt="Dr. Mohamed Talaat Logo"
                    width={200}
                    height={200}
                    className="w-60"
                  />
                )}
              </div>
              <h3 className="text-2xl font-bold mb-3">
                {t("footer.companyName")}
              </h3>
              <p className="text-sm text-black/90 leading-relaxed mb-4 max-w-sm">
                {t("footer.aboutDescription")}
              </p>
              {(facebookUrl || instagramUrl || twitterUrl || linkedinUrl || youtubeUrl || whatsappUrl) && (
                <div className="flex flex-wrap md:justify-start justify-center items-center gap-3 mt-6">
                  {facebookUrl && (
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300 group"
                      aria-label="Visit our Facebook page"
                      title="Facebook"
                    >
                      <FaFacebookF className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                      <span className="sr-only">Facebook</span>
                    </a>
                  )}
                  {twitterUrl && (
                    <a
                      href={twitterUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300 group"
                      aria-label="Visit our X (Twitter) profile"
                      title="X (Twitter)"
                    >
                      <FaXTwitter className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                      <span className="sr-only">X (Twitter)</span>
                    </a>
                  )}
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300 group"
                      aria-label="Visit our Instagram profile"
                      title="Instagram"
                    >
                      <FaInstagram className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                      <span className="sr-only">Instagram</span>
                    </a>
                  )}
                  {linkedinUrl && (
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300 group"
                      aria-label="Visit our LinkedIn profile"
                      title="LinkedIn"
                    >
                      <FaLinkedinIn className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                  )}
                  {youtubeUrl && (
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300 group"
                      aria-label="Visit our YouTube channel"
                      title="YouTube"
                    >
                      <FaYoutube className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                      <span className="sr-only">YouTube</span>
                    </a>
                  )}
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white hover:-translate-y-1 transition-all duration-300 group"
                      aria-label="Contact us on WhatsApp"
                      title="WhatsApp"
                    >
                      <IoLogoWhatsapp className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                      <span className="sr-only">WhatsApp</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div
              className={`text-center ${
                isRTL ? "lg:text-right" : "lg:text-left"
              }`}
            >
              <h3 className="text-xl font-bold mb-6">
                {t("footer.quickLinks")}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-black hover:text-secondary transition-colors duration-200 text-md"
                  >
                    {t("navbar.home")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-black hover:text-secondary transition-colors duration-200 text-md"
                  >
                    {t("navbar.about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/analyses"
                    className="text-black hover:text-secondary transition-colors duration-200 text-md"
                  >
                    {t("navbar.strategicAnalyses")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/podcasts"
                    className="text-black hover:text-secondary transition-colors duration-200 text-md"
                  >
                    {t("navbar.podcasts.title")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/meetings-conferences"
                    className="text-black hover:text-secondary transition-colors duration-200 text-md"
                  >
                    {t("navbar.media.interviews")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/quotations"
                    className="text-black hover:text-secondary transition-colors duration-200 text-md"
                  >
                    {t("navbar.media.citations")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-black hover:text-secondary transition-colors duration-200 text-md"
                  >
                    {t("navbar.contact")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div
              className={`text-center ${
                isRTL ? "lg:text-right" : "lg:text-left"
              }`}
            >
              <h3 className="text-xl font-bold mb-6">
                {t("footer.contactInfo")}
              </h3>
              <ul className="space-y-4">
                <li
                  className={`flex items-start gap-3 justify-center ${
                    isRTL
                      ? "lg:justify-end flex-row-reverse"
                      : "lg:justify-start"
                  }`}
                >
                  <span className="text-md flex items-center gap-1 text-black leading-relaxed max-w-xs">
                    <FaMapMarkerAlt className="mt-1 text-primary flex-shrink-0 w-5 h-5" />
                    {currentAddress}
                  </span>
                </li>

                <li
                  className={`flex items-center gap-3 justify-center ${
                    isRTL
                      ? "lg:justify-end flex-row-reverse"
                      : "lg:justify-start"
                  }`}
                >
                  <a
                    href={`https://wa.me/${currentPhone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-md flex items-center gap-2 text-black hover:text-primary transition-colors duration-200"
                  >
                    <IoLogoWhatsapp className="text-primary flex-shrink-0 w-5 h-5" />
                    <span 
                      dir="ltr" 
                      className="inline-block font-sans tracking-wide"
                      style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
                    >
                      +{currentPhone.replace(/\D/g, "").replace(/^(973)(\d{4})(\d{4})$/, "$1 $2 $3")}
                    </span>
                  </a>
                </li>
                <li
                  className={`flex justify-center ${
                    isRTL ? "lg:justify-start" : "lg:justify-start"
                  }`}
                >
                  <div className={`flex flex-col gap-2 ${isRTL ? "items-center lg:items-start" : "items-center lg:items-start"}`}>
                    {emailList.map((email, idx) => (
                      <a
                        key={idx}
                        href={`mailto:${email}`}
                        onClick={() => {
                          navigator.clipboard.writeText(email);
                          toast.success(isRTL ? "تم نسخ الإيميل بنجاح!" : "Email copied!");
                        }}
                        className="text-sm font-medium flex items-center gap-2 text-black/80 bg-gray-100 hover:bg-primary/10 border border-black/5 hover:border-primary/20 hover:text-primary transition-all duration-300 py-1.5 px-3 rounded-xl w-fit"
                      >
                        <FaEnvelope className="text-primary flex-shrink-0 w-4 h-4" />
                        <span dir="ltr">{email}</span>
                      </a>
                    ))}
                  </div>
                </li>
              </ul>
            </div>

            {/* Newsletter Subscription */}
            <div
              className={`text-center ${
                isRTL ? "lg:text-right" : "lg:text-left"
              }`}
            >
              <div className="bg-gradient-to-br from-black/5 to-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-lg space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <FaEnvelope className="w-4 h-4 text-primary" />
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <h3 className="text-lg font-bold text-black">
                      {t("footer.newsletterTitle")}
                    </h3>
                  </div>
                </div>

                <p
                  className={`text-xs text-black leading-relaxed ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {t("footer.newsletterDescription")}
                </p>

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

                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleInputChange}
                      placeholder={t("footer.newsletterPlaceholder")}
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-black/20 text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-white/15 transition-all duration-300 text-sm ${
                        errors.email
                          ? "border-red-400/60 bg-red-500/10 focus:ring-red-400/50"
                          : ""
                      } ${isRTL ? "text-right pr-10" : "text-left pl-10"}`}
                      disabled={isLoading}
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                    />
                    <FaEnvelope
                      className={`absolute top-3.5 w-4 h-4 text-black pointer-events-none ${
                        isRTL ? "right-3" : "left-3"
                      }`}
                    />
                    {errors.email && (
                      <p
                        id="email-error"
                        className={`text-red-300 text-xs mt-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
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
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-black/20 text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-white/15 transition-all duration-300 text-sm ${
                        errors.phone
                          ? "border-red-400/60 bg-red-500/10 focus:ring-red-400/50"
                          : ""
                      } ${isRTL ? "text-right pr-10" : "text-left pl-10"}`}
                      disabled={isLoading}
                      autoComplete="tel"
                      aria-invalid={!!errors.phone}
                      aria-describedby={
                        errors.phone ? "phone-error" : undefined
                      }
                    />
                    <FaPhoneAlt
                      className={`absolute top-3.5 w-4 h-4 text-black pointer-events-none ${
                        isRTL ? "right-3" : "left-3"
                      }`}
                    />
                    {errors.phone && (
                      <p
                        id="phone-error"
                        className={`text-red-300 text-xs mt-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <div
                      className={`flex items-center gap-2 mb-2 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <label
                        htmlFor="mathAnswer"
                        className={`text-xs text-black font-medium ${
                          isRTL ? "" : ""
                        }`}
                      >
                        {t("footer.mathCaptchaLabel") || "Verify you're human"}{" "}
                        ({mathQuestion})
                      </label>
                    </div>
                    <input
                      type="number"
                      id="mathAnswer"
                      name="mathAnswer"
                      value={mathAnswer}
                      onChange={handleInputChange}
                      placeholder={
                        t("footer.mathPlaceholder") || "Enter answer"
                      }
                      className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border-2 border-black/20 text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-white/15 transition-all duration-300 text-sm ${
                        errors.mathAnswer
                          ? "border-red-400/60 bg-red-500/10 focus:ring-red-400/50"
                          : ""
                      } ${isRTL ? "text-right pr-10" : "text-left pl-10"}`}
                      disabled={isLoading}
                      min="0"
                      aria-invalid={!!errors.mathAnswer}
                      aria-describedby={
                        errors.mathAnswer ? "math-error" : undefined
                      }
                    />
                    {errors.mathAnswer && (
                      <p
                        id="math-error"
                        className={`text-red-300 text-xs mt-1 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      >
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
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-6 border-t border-black/20 space-y-2">
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 mb-4  pt-6">
              <Link
                href="/privacy"
                className="text-sm text-black/70 hover:text-primary transition-colors"
              >
                {t("footer.privacyPolicy")}
              </Link>
              <Link
                href="/terms-conditions"
                className="text-sm text-black/70 hover:text-primary transition-colors"
              >
                {t("footer.termsOfService")}
              </Link>
              <Link
                href="/ai-poilcy"
                className="text-sm text-black/70 hover:text-primary transition-colors"
              >
                {t("footer.aiUsagePolicy")}
              </Link>
              <Link
                href="/data-protection"
                className="text-sm text-black/70 hover:text-primary transition-colors"
              >
                {t("footer.dataProtection")}
              </Link>
              <Link
                href="/security-policy"
                className="text-sm text-black/70 hover:text-primary transition-colors"
              >
                {t("footer.securityDisclosure")}
              </Link>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mt-8 pt-6 border-t border-black/5">
              <p className="text-sm text-black/60 font-medium">
                {currentFooterText}
              </p>

              <a
                href="https://wa.me/201028768312?text=%D8%AA%D8%AD%D9%8A%D8%A9%20%D8%B7%D9%8A%D8%A8%D8%A9%D8%8C%20%20%D9%84%D9%82%D8%AF%20%D8%A3%D8%B9%D8%AC%D8%A8%D9%86%D9%8A%20%D8%A7%D9%84%D9%85%D9%88%D9%82%D8%B9%20%D8%A7%D9%84%D8%B0%D9%8A%20%D8%B5%D9%85%D9%85%D8%AA%D9%87%20%D9%84%D9%84%D8%AF%D9%83%D8%AA%D9%88%D8%B1%20%D9%85%D8%AD%D9%85%D8%AF%20%D8%B7%D9%84%D8%B9%D8%AA%D8%8C%20%20%D9%88%D9%83%D9%86%D8%AA%20%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%D9%83%20%D8%A7%D9%84%D8%A8%D8%B1%D9%85%D8%AC%D9%8A%D8%A9."
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] md:text-sm text-black flex items-center gap-2 font-bold group no-print transition-transform hover:scale-105"
                aria-label="Contact Developer Mohamed Khder on WhatsApp"
                dir="ltr"
              >
                <span className="opacity-50 group-hover:opacity-100 transition-opacity">
                  Made By
                </span>
                <span className="text-primary underline decoration-primary/30 underline-offset-4 group-hover:decoration-primary transition-all">
                  Mohamed Khder
                </span>
                <div className="flex items-center justify-center bg-primary/50 w-8 h-8 rounded-full group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                  <FaHeart className="text-primary group-hover:text-white  w-3 h-3" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
