"use client";

import React, { useState, useContext, useEffect, Suspense } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { submitContactForm } from "../lib/server-api";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCommentDots,
  FaPaperPlane,
  FaSpinner,
  FaListUl,
  FaPaperclip,
  FaChevronDown,
} from "react-icons/fa";
const ContactFormContent = () => {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const isRTL = locale === "ar";

  const initialTypeId = searchParams.get("type") || "";

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    extra_key: "",
    contact_type_id: initialTypeId,
    attachment: null,
  });

  const [contactTypes, setContactTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mathQuestion, setMathQuestion] = useState("");
  const [mathAnswer, setMathAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);

  // Fetch Contact Types
  useEffect(() => {
    let isMounted = true;

    const getContactTypes = async () => {
      try {
        const response = await fetch("/api/nav-data", {
          headers: {
            Accept: "application/json",
          },
        });
        const data = response.ok ? await response.json() : null;

        if (!isMounted) return;
        setContactTypes(
          Array.isArray(data?.contactTypes) ? data.contactTypes : [],
        );
      } catch (err) {
        if (isMounted) {
          setContactTypes([]);
        }
      }
    };

    getContactTypes();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update selection if URL param changes
  useEffect(() => {
    if (initialTypeId) {
      setFormData((prev) => ({
        ...prev,
        contact_type_id: initialTypeId,
      }));
    }
  }, [initialTypeId]);

  // Generate random math question
  useEffect(() => {
    const generateMathQuestion = () => {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      const operations = ["+", "-", "*"];
      const operation =
        operations[Math.floor(Math.random() * operations.length)];
      let question, answer;

      switch (operation) {
        case "+":
          question = `${num1} + ${num2} = ?`;
          answer = num1 + num2;
          break;
        case "-":
          question = `${num1} - ${num2} = ?`;
          answer = num1 - num2;
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
    };

    generateMathQuestion();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "attachment") {
      setFormData((prev) => ({
        ...prev,
        attachment: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing/changing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle math answer change
  const handleMathAnswerChange = (e) => {
    setMathAnswer(e.target.value);
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t("contactForm.errorNameRequired");
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t("contactForm.errorNameTooShort");
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = t("contactForm.errorPhoneRequired");
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = t("contactForm.errorPhoneInvalid");
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t("contactForm.errorEmailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("contactForm.errorEmailInvalid");
    }

    // Contact Type validation
    if (!formData.contact_type_id) {
      newErrors.contact_type_id = t("contactForm.errorContactTypeRequired");
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = t("contactForm.errorMessageRequired");
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t("contactForm.errorMessageTooShort");
    }

    // Extra key validation (honeypot)
    if (formData.extra_key && formData.extra_key.trim() !== "") {
      newErrors.extra_key = t("contactForm.errorInvalidSubmission");
    }

    // Math answer validation
    if (!mathAnswer.trim()) {
      newErrors.mathAnswer = t("contactForm.errorMathRequired");
    } else if (parseInt(mathAnswer) !== correctAnswer) {
      newErrors.mathAnswer = t("contactForm.errorMathIncorrect");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("contactForm.errorValidation"), {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Construct FormData
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("message", formData.message);
      data.append("contact_type_id", formData.contact_type_id);
      data.append("extra_key", ""); // Always empty on success submission

      if (formData.attachment) {
        data.append("attachment", formData.attachment);
      }

      console.log("Submitting FormData...");

      const response = await submitContactForm(data);

      console.log("API Response:", response);

      if (response.ok) {
        toast.success(t("contactForm.successMessage"), {
          position: isRTL ? "top-left" : "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "",
          extra_key: "",
          contact_type_id: "",
          attachment: null,
        });
        setMathAnswer("");
        setErrors({});
        // Generate new math question
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operations = ["+", "-", "*"];
        const operation =
          operations[Math.floor(Math.random() * operations.length)];
        let question, answer;
        switch (operation) {
          case "+":
            question = `${num1} + ${num2} = ?`;
            answer = num1 + num2;
            break;
          case "-":
            question = `${num1} - ${num2} = ?`;
            answer = num1 - num2;
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
      }
    } catch (error) {
      console.error("Contact form submission error:", error);

      let errorMessage = t("contactForm.errorGeneral");

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Response) {
        const errorData = await error.json().catch(() => ({}));
        errorMessage = errorData.message || t("contactForm.errorGeneral");
      }

      toast.error(errorMessage, {
        position: isRTL ? "top-left" : "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Executive Gateway Intro */}
      <section className=" py-10 px-4 md:px-8 relative overflow-hidden border-b border-gray-100">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#C5A059"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-6xl font-black text-baseTwo mb-10 leading-[1.15] tracking-tight">
            {t("navbar.executiveGateway.title")}
          </h2>

          <div className="w-24 h-1 bg-primary mx-auto mb-10 rounded-full opacity-30"></div>

          <p
            className={`max-w-4xl mx-auto text-gray-600 text-lg md:text-2xl leading-relaxed ${
              isRTL ? "font-medium" : "font-light"
            }`}
          >
            {t("navbar.executiveGateway.description")}
          </p>
        </div>
      </section>

      <section className="py-10 md:py-20 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center">
            {/* Contact Form */}
            <div className="w-full max-w-2xl bg-gray-50/50 backdrop-blur-sm rounded-[2.5rem] p-8 md:p-8 border border-gray-100 flex flex-col justify-center shadow-sm relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10"></div>

              <form
                onSubmit={handleSubmit}
                className="space-y-10  relative z-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Name Field */}
                  <div className="space-y-3">
                    <label
                      htmlFor="name"
                      className={`flex items-center gap-3 text-sm font-black uppercase tracking-widest text-baseTwo ${
                        isRTL ? "flex-row-reverse justify-end" : "justify-start"
                      }`}
                    >
                      <FaUser className="text-primary text-xs" />
                      <span>{t("contactForm.labelName")}</span>
                      <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary ${
                        errors.name ? "border-red-400 bg-red-50/30" : ""
                      } ${isRTL ? "text-right" : "text-left"}`}
                      placeholder={t("contactForm.placeholderName")}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-3">
                    <label
                      htmlFor="phone"
                      className={`flex items-center gap-3 text-sm font-black uppercase tracking-widest text-baseTwo ${
                        isRTL ? "flex-row-reverse justify-end" : "justify-start"
                      }`}
                    >
                      <FaPhone className="text-primary text-xs" />
                      <span>{t("contactForm.labelPhone")}</span>
                      <span className="text-primary">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary ${
                        errors.phone ? "border-red-400 bg-red-50/30" : ""
                      } ${isRTL ? "text-right" : "text-left"}`}
                      placeholder={t("contactForm.placeholderPhone")}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Email Field */}
                  <div className="space-y-3">
                    <label
                      htmlFor="email"
                      className={`flex items-center gap-3 text-sm font-black uppercase tracking-widest text-baseTwo ${
                        isRTL ? "flex-row-reverse justify-end" : "justify-start"
                      }`}
                    >
                      <FaEnvelope className="text-primary text-xs" />
                      <span>{t("contactForm.labelEmail")}</span>
                      <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary ${
                        errors.email ? "border-red-400 bg-red-50/30" : ""
                      } ${isRTL ? "text-right" : "text-left"}`}
                      placeholder={t("contactForm.placeholderEmail")}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Contact Type Dropdown */}
                  <div className="space-y-3">
                    <label
                      htmlFor="contact_type_id"
                      className={`flex items-center gap-3 text-sm font-black uppercase tracking-widest text-baseTwo ${
                        isRTL ? "flex-row-reverse justify-end" : "justify-start"
                      }`}
                    >
                      <FaListUl className="text-primary text-xs" />
                      <span>{t("contactForm.labelContactType")}</span>
                      <span className="text-primary">*</span>
                    </label>
                    <div className="relative group/select">
                      <select
                        id="contact_type_id"
                        name="contact_type_id"
                        value={formData.contact_type_id}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary appearance-none cursor-pointer ${
                          errors.contact_type_id ? "border-red-400" : ""
                        } ${isRTL ? "text-right pr-5 pl-12" : "text-left pr-12 pl-5"}`}
                        disabled={isLoading}
                      >
                        <option value="">
                          {t("contactForm.placeholderContactType")}
                        </option>
                        {contactTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name[locale]}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown
                        size={12}
                        className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 transition-all group-focus-within/select:text-primary ${
                          isRTL ? "left-5" : "right-5"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Message Field */}
                <div className="space-y-3">
                  <label
                    htmlFor="message"
                    className={`flex items-center gap-3 text-sm font-black uppercase tracking-widest text-baseTwo ${
                      isRTL ? "flex-row-reverse justify-end" : "justify-start"
                    }`}
                  >
                    <FaCommentDots className="text-primary text-xs" />
                    <span>{t("contactForm.labelMessage")}</span>
                    <span className="text-primary">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary resize-none ${
                      errors.message ? "border-red-400" : ""
                    } ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={t("contactForm.placeholderMessage")}
                    disabled={isLoading}
                  />
                </div>

                {/* Attachment Field */}
                <div className="space-y-3">
                  <label
                    htmlFor="attachment"
                    className={`flex items-center gap-3 text-sm font-black uppercase tracking-widest text-baseTwo ${
                      isRTL ? "flex-row-reverse justify-end" : "justify-start"
                    }`}
                  >
                    <FaPaperclip className="text-primary text-xs" />
                    <span>{t("contactForm.labelAttachment")}</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="file"
                      id="attachment"
                      name="attachment"
                      onChange={handleChange}
                      className="hidden"
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="attachment"
                      className={`flex items-center justify-between w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-lg transition-all duration-300 cursor-pointer hover:border-primary/50 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span className="text-gray-400 truncate text-sm">
                        {formData.attachment
                          ? formData.attachment.name
                          : t("contactForm.placeholderAttachment")}
                      </span>
                      <div className="px-5 py-2 bg-gray-50 text-baseTwo rounded-xl text-xs font-black uppercase tracking-wider group-hover:bg-primary group-hover:text-white transition-all">
                        {isRTL ? "إرفاق وثيقة" : "Attach File"}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Math CAPTCHA */}
                <div className="space-y-3">
                  <label
                    htmlFor="mathAnswer"
                    className={`flex items-center gap-3 text-sm font-black uppercase tracking-widest text-baseTwo ${
                      isRTL ? "flex-row-reverse justify-end" : "justify-start"
                    }`}
                  >
                    <span>
                      {t("contactForm.labelMath")} ({mathQuestion})
                    </span>
                    <span className="text-primary">*</span>
                  </label>
                  <input
                    type="number"
                    id="mathAnswer"
                    name="mathAnswer"
                    value={mathAnswer}
                    onChange={handleMathAnswerChange}
                    className={`w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary ${
                      errors.mathAnswer ? "border-red-400" : ""
                    } ${isRTL ? "text-right" : "text-left"}`}
                    placeholder={t("contactForm.placeholderMath")}
                    disabled={isLoading}
                  />
                </div>

                {/* Security Seal & Submit */}
                <div className="flex flex-col items-center gap-8 pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full md:w-auto min-w-[300px] flex items-center justify-center gap-4 px-6 py-4 bg-primary text-white text-lg font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:bg-primary transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>{t("contactForm.buttonSending")}</span>
                      </>
                    ) : (
                      <>
                        <span>{t("contactForm.buttonSend")}</span>
                        <FaPaperPlane className="text-white " />
                      </>
                    )}
                  </button>

                  {/* Digital Security Seal */}
                  <div className="flex items-center gap-4 px-6 py-3 bg-gray-100/50 rounded-full border border-gray-100 backdrop-blur-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-[0.1em] whitespace-nowrap">
                      {t("navbar.executiveGateway.securitySeal")}
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const ContactForm = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-primary text-4xl" />
        </div>
      }
    >
      <ContactFormContent />
    </Suspense>
  );
};

export default ContactForm;
