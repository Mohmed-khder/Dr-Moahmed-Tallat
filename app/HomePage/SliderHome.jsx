"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "../../i18n/routing";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaYoutube,
  FaPenNib,
  FaGlobe,
  FaMicrophoneAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { useSettings } from "../Context/SettingContext";
import { formatWhatsAppUrl } from "../lib/whatsapp";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
const SliderHome = ({ initialSliders = [] }) => {
  const t = useTranslations();
  const locale = useLocale();
  const { settings } = useSettings();
  const isRTL = locale === "ar";
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Social Links mapping from settings - carefully matching the provided structure
  const socialLinks = {
    facebook: settings?.social_links?.facebook || null,
    instagram: settings?.social_links?.instagram || null,
    twitter: settings?.social_links?.twitter || null,
    linkedin: settings?.social_links?.linkedin || null,
    youtube: settings?.social_links?.youtube || null,
    whatsapp: formatWhatsAppUrl(
      settings?.whatsapp || settings?.social_links?.whatsapp,
    ),
  };

  const handleSlideClick = (link) => {
    if (link) {
      window.open(link, "_self");
    }
  };

  if (initialSliders.length === 0) {
    return (
      <div className="relative h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center text-baseTwo">
          <h2 className="text-2xl font-bold mb-4">
            {t("slider.error", "No Sliders Available")}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-24 md:pt-28 min-h-screen lg:min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Immersive Background Pattern - Optimized */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <svg
          className="absolute w-full h-full opacity-[0.03]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="topo"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 25 Q 12.5 0, 25 25 T 50 25"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.2"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#topo)" />
        </svg>

        {/* CSS-Animated Background Pulse */}
        <div className="bg-circle-pulse absolute -top-40 -left-40 w-[800px] h-[800px] bg-primary rounded-full blur-[120px] opacity-[0.05]" />
        <div className="bg-circle-pulse-delayed absolute bottom-0 right-0 w-[600px] h-[600px] bg-baseTwo rounded-full blur-[100px] opacity-[0.03]" />
      </div>

      <Swiper
        key="main-slider"
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
          renderBullet: (index, className) =>
            `<span class="${className} custom-bullet"></span>`,
        }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        onSlideChange={(swiper) => setActiveSlideIndex(swiper.realIndex)}
        loop={true}
        className="h-full w-full relative z-20"
        dir="ltr"
      >
        {initialSliders.map((slider, index) => (
          <SwiperSlide key={slider.id}>
            <div className="relative min-h-[calc(100vh-80px)] py-12 lg:py-16 w-full max-w-[1400px] mx-auto flex items-center px-6 lg:px-12">
              <div
                className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-between w-full ${isRTL ? "lg:flex-row-reverse" : ""}`}
              >
                {/* Text Content - Removed Framer Motion for better performance */}
                <div
                  className={`flex-1 w-full z-30 transition-opacity duration-500 ${activeSlideIndex === index ? "opacity-100" : "opacity-0"} ${isRTL ? "text-right" : "text-left"}`}
                >
                  <div className="inline-flex whitespace-nowrap  gap-2 px-4 py-1.5 md:px-5 md:py-2 bg-white/60 backdrop-blur-sm shadow-sm border border-primary/5 rounded-full text-primary text-md sm:text-[16px] md:text-[15px] font-bold tracking-wider md:tracking-widest  mb-6 md:mb-8 w-fit">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full animate-pulse flex-shrink-0" />
                    <span>
                      {isRTL
                        ? "المحلل الذي يقرأ ما وراء الحدث"
                        : "The Analyst Who Reads Behind The Event"}
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl lg:text-[28px] xl:text-[30px] font-black text-baseTwo mb-4 md:mb-6 leading-[1.2] lg:leading-[1.1] tracking-tight">
                    {slider.title?.[locale]}
                  </h1>

                  <div className="mb-6 md:mb-8 lg:max-w-full">
                    <span className="text-xl sm:text-2xl lg:text-[30px] xl:text-[35px] font-black text-baseTwo mb-4 md:mb-6 leading-[1.4] lg:leading-[1.2] tracking-tight block">
                      {isRTL
                        ? "هندسةُ المبادأةِ والردعِ الجيوسياسيِّ"
                        : "Engineering Initiative and Geopolitical Deterrence"}
                    </span>
                  </div>
                  <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 leading-relaxed">
                    {slider.desc?.[locale]}
                  </p>

                  <div
                    className={`flex flex-wrap items-center gap-4 md:gap-6 mt-6 md:mt-8 ${isRTL ? "justify-end" : "justify-start"}`}
                  >
                    <Link
                      href="/analyses"
                      className="group flex items-center justify-center gap-3 px-8 md:px-10 py-3.5 md:py-4 bg-primary text-white font-bold text-sm md:text-lg rounded-md shadow-[0_10px_25px_-5px_rgb(197,160,89,0.4)] hover:shadow-[0_15px_30px_-5px_rgb(197,160,89,0.6)] hover:-translate-y-1 hover:brightness-110 transition-all duration-400"
                    >
                      <span className="relative z-10">
                        {isRTL ? "استكشف التحليلات" : "Explore Analytics"}
                      </span>
                      <FaArrowLeft
                        className={`text-sm opacity-90 group-hover:translate-x-[-4px] transition-transform ${isRTL ? "" : "hidden"}`}
                      />
                      <FaArrowRight
                        className={`text-sm opacity-90 group-hover:translate-x-[4px] transition-transform ${isRTL ? "hidden" : ""}`}
                      />
                    </Link>

                    <Link
                      href="/executive-identity"
                      className="group flex items-center justify-center px-8 md:px-10 py-3.5 md:py-4 bg-white/40 backdrop-blur-md border border-slate-200 text-baseTwo font-bold text-sm md:text-lg rounded-md shadow-sm hover:border-primary/50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-400"
                    >
                      {isRTL ? "السيرة التنفيذية" : "Executive Resume"}
                    </Link>
                  </div>
                </div>

                {/* Media Content - Removed Framer Motion for better performance */}
                <div
                  className={`flex-1 w-full z-20 relative flex justify-center transition-all duration-700 ${activeSlideIndex === index ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}
                >
                  <div className="relative w-full flex justify-center">
                    {/* Background Frame */}
                    <div className="absolute -inset-6 bg-linear-to-tr from-primary/20 to-baseTwo/20 rounded-[40px] opacity-10 blur-3xl pointer-events-none" />
                    <div className="absolute top-8 -left-8 w-full h-full border-[3px] border-primary/10 rounded-3xl -z-10 pointer-events-none" />

                    {/* Social Icons with CSS-based floating anims - Individually positioned */}
                    {socialLinks.instagram && (
                      <a
                        href={socialLinks.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="float-anim absolute -top-4 -left-4 md:-top-8 md:-left-8 w-10 h-10 md:w-12 md:h-12 bg-white shadow-xl rounded-xl md:rounded-2xl flex items-center justify-center text-[#E4405F] text-xl z-40 border border-gray-50 select-none hover:scale-110 transition-transform duration-300"
                        title="Instagram"
                      >
                        <FaInstagram size={20} className="md:size-6" />
                      </a>
                    )}

                    {socialLinks.facebook && (
                      <a
                        href={socialLinks.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="float-anim-reverse absolute bottom-12 -right-5 md:bottom-16 md:-right-10 w-10 h-10 md:w-12 md:h-12 bg-white shadow-xl rounded-xl md:rounded-2xl flex items-center justify-center text-[#1877F2] text-xl z-40 border border-gray-50 select-none hover:scale-110 transition-transform duration-300"
                        title="Facebook"
                      >
                        <FaFacebookF size={20} className="md:size-6" />
                      </a>
                    )}

                    {socialLinks.twitter && (
                      <a
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="float-anim-delayed absolute -bottom-4 left-1/4 w-10 h-10 md:w-12 md:h-12 bg-white shadow-xl rounded-xl md:rounded-2xl flex items-center justify-center text-[#1DA1F2] text-lg z-40 border border-gray-50 select-none hover:scale-110 transition-transform duration-300"
                        title="Twitter"
                      >
                        <FaTwitter size={20} className="md:size-6" />
                      </a>
                    )}

                    {socialLinks.linkedin && (
                      <a
                        href={socialLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="float-anim-delayed absolute top-0 -right-4 md:-right-5 w-10 h-10 md:w-12 md:h-12 bg-white shadow-xl rounded-xl md:rounded-2xl flex items-center justify-center text-[#0077B5] text-xl z-40 border border-gray-50 select-none hover:scale-110 transition-transform duration-300"
                        title="LinkedIn"
                      >
                        <FaLinkedin size={20} className="md:size-6" />
                      </a>
                    )}

                    {socialLinks.whatsapp && (
                      <a
                        href={socialLinks.whatsapp}
                        target="_blank"
                        rel="noreferrer"
                        className="float-anim absolute -bottom-4 -left-4 md:-bottom-10 md:-left-8 w-10 h-10 md:w-14 md:h-14 bg-white shadow-xl rounded-xl md:rounded-2xl flex items-center justify-center text-[#25D366] text-xl z-40 border border-gray-50 select-none hover:scale-110 transition-transform duration-300"
                        title="WhatsApp"
                      >
                        <FaWhatsapp size={24} className="md:size-8" />
                      </a>
                    )}

                    {socialLinks.youtube && (
                      <a
                        href={socialLinks.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="float-anim-reverse absolute top-1/2 -right-6 md:-right-10 w-10 h-10 md:w-12 md:h-12 bg-white shadow-xl rounded-xl md:rounded-2xl flex items-center justify-center text-[#FF0000] text-xl z-40 border border-gray-50 select-none hover:scale-110 transition-transform duration-300"
                        title="YouTube"
                      >
                        <FaYoutube size={20} className="md:size-6" />
                      </a>
                    )}

                    {/* Hero Image/Video */}
                    <div className="relative z-30 transition-transform duration-700 hover:scale-[1.01]">
                      {(() => {
                        const bannerUrl = slider.banner;
                        const isVideo = bannerUrl
                          ?.toLowerCase()
                          .match(/\.(mp4|webm|mov)$/);

                        if (isVideo) {
                          return (
                            <video
                              src={bannerUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-auto max-h-[300px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[550px] xl:max-h-[600px] rounded-2xl object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                            />
                          );
                        } else {
                          return (
                            <Image
                              src={bannerUrl}
                              alt=""
                              width={800}
                              height={600}
                              priority={index === 0}
                              className="w-full h-auto max-h-[300px] sm:max-h-[350px] md:max-h-[450px] lg:max-h-[550px] xl:max-h-[600px] rounded-2xl object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                            />
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Brand Pagination */}
      <div className="custom-pagination absolute bottom-12 right-12 lg:right-24 z-50 flex gap-4"></div>

      {/* Floating Background Icons (Journalism/Politics Theme) */}
      <motion.div
        animate={{ y: [0, -40, 0], rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] left-[5%] md:left-[5%] opacity-10 pointer-events-none select-none z-10 text-primary"
      >
        <FaPenNib size={80} className="md:w-32 md:h-32" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] right-[2%] md:right-[5%] opacity-20 pointer-events-none select-none z-10 text-primary"
      >
        <FaGlobe size={120} className="md:w-48 md:h-48" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -20, 0], rotate: -15 }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] left-[8%] md:left-[15%] opacity-15 pointer-events-none select-none z-10 text-primary"
      >
        <FaMicrophoneAlt size={60} className="md:w-24 md:h-24" />
      </motion.div>

      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.05;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.1;
          }
        }
        @keyframes floating {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes floating-rev {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(15px);
          }
        }
        .bg-circle-pulse {
          animation: pulse 15s infinite ease-in-out;
        }
        .bg-circle-pulse-delayed {
          animation: pulse 20s infinite ease-in-out 2s;
        }
        .float-anim {
          animation: floating 4s infinite ease-in-out;
        }
        .float-anim-reverse {
          animation: floating-rev 5s infinite ease-in-out;
        }
        .float-anim-delayed {
          animation: floating 6s infinite ease-in-out 1s;
        }

        .custom-bullet {
          width: 12px !important;
          height: 12px !important;
          border-radius: 50% !important;
          background: #000 !important;
          white-space: nowrap;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          cursor: pointer;
        }
        .custom-bullet.swiper-pagination-bullet-active {
          width: 40px !important;
          border-radius: 12px !important;
          background: #c5a059 !important;
          opacity: 1 !important;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @media (max-height: 800px) {
          .pt-24 { padding-top: 5rem !important; }
          .md\:pt-28 { padding-top: 6rem !important; }
          h1 { margin-bottom: 1rem !important; }
          p { margin-bottom: 1.5rem !important; }
          .mt-6 { margin-top: 1rem !important; }
        }
      `}</style>
    </div>
  );
};

export default SliderHome;
