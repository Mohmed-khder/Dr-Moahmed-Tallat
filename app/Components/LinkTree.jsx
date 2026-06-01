"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "../../i18n/routing";
import { useSettings } from "../Context/SettingContext";
import { useLocale } from "next-intl";
import { formatWhatsAppUrl } from "../lib/whatsapp";
const LinkTree = () => {
  const t = useTranslations();
  const { settings } = useSettings();
  const isRTL = useLocale() === "ar";

  const facebookUrl = settings?.social_links?.facebook || null;
  const instagramUrl = settings?.social_links?.instagram || null;
  const twitterUrl = settings?.social_links?.twitter || null;
  const whatsappUrl = formatWhatsAppUrl(settings?.whatsapp);

  const logo = settings?.logo || null;

  const socialLinks = [
    {
      name: t("linkTree.facebook"),
      url: facebookUrl,
      icon: FaFacebookF,
      color: "bg-[#1877F2]",
    },
    {
      name: t("linkTree.instagram"),
      url: instagramUrl,
      icon: FaInstagram,
      color: "bg-[#E4405F]",
    },
    {
      name: t("linkTree.twitter"),
      url: twitterUrl,
      icon: FaTwitter,
      color: "bg-[#1DA1F2]",
    },
    {
      name: t("linkTree.whatsapp"),
      url: whatsappUrl,
      icon: FaWhatsapp,
      color: "bg-[#25D366]",
    },
  ].filter((link) => link.url);

  if (socialLinks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-gray-600 text-lg">
          {t("linkTree.noLinks") || "No social media links available"}
        </p>
      </div>
    );
  }

  return (
    <div
      className=" flex items-center justify-center py-50 px-4"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with Gradient Background */}
          <div className="w-full bg-primary/10   py-10 flex flex-col items-center justify-center">
            {/* Logo */}
            {logo && (
              <div className="mb-5">
                <Image
                  src={logo}
                  alt="Company Logo"
                  width={200}
                  height={80}
                  className="h-30 w-auto object-contain"
                />
              </div>
            )}

            {/* Text */}
            <p className="text-gray-800 font-medium text-center px-6">
              {t("linkTree.connectText") ||
                "Connect with us on your favorite platform"}
            </p>
          </div>

          {/* Social Media Buttons */}
          <div className="p-6 space-y-3">
            {socialLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between  gap-10  px-5 py-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer ${
                    isRTL ? "" : ""
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white  ${link.color}`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Platform Name */}
                  <span className="text-gray-800 font-bold flex-1">
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkTree;
