"use client";
import React, { useState, useEffect, useId } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, usePathname, useRouter } from "../../i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useSettings } from "../Context/SettingContext";
import { useVault } from "../Context/VaultContext";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaPaperPlane, FaChevronDown, FaLock } from "react-icons/fa";
import Image from "next/image";
import VaultModal from "./VaultModal";
import SearchPopup from "./SearchPopup";
import { FiSearch } from "react-icons/fi";

// US Flag Component (Using UK flag as per user change)
const USFlag = ({ className = "w-6 h-4" }) => (
  <div
    className={`${className} relative rounded-sm shadow-sm border border-gray-200 overflow-hidden`}
  >
    <Image
      src="https://flagcdn.com/w40/gb.png"
      alt="English"
      fill
      className="object-cover"
    />
  </div>
);

// Egypt Flag Component (Using Saudi flag as per user change)
const EgyptFlag = ({ className = "" }) => (
  <div
    className={`${className} relative rounded-sm shadow-sm border border-gray-200 overflow-hidden`}
  >
    <Image
      src="https://flagcdn.com/w40/sa.png"
      alt="Arabic"
      fill
      className="object-cover"
    />
  </div>
);

const LanguageDropdown = ({
  className,
  locale,
  isRTL,
  isLangDropdownOpen,
  setIsLangDropdownOpen,
  switchLanguage,
}) => {
  const t = useTranslations("navbar");
  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsLangDropdownOpen(true)}
      onMouseLeave={() => setIsLangDropdownOpen(false)}
    >
      <button
        className={`${className} hidden md:flex items-center gap-2 bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 border border-gray-200 rounded-full px-3 py-2 w-full `}
      >
        <div className="flex items-center gap-2">
          {locale === "en" ? (
            <USFlag className="w-6 h-4 scale-125" />
          ) : (
            <EgyptFlag className="w-6 h-4 scale-125" />
          )}
          <span className="text-baseTwo font-bold uppercase text-xs">
            {locale === "en" ? "EN" : "AR"}
          </span>
        </div>
        <FaChevronDown
          size={10}
          className={`opacity-50 transition-transform duration-300 ${isLangDropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isLangDropdownOpen && (
        <div
          className={`absolute top-full ${isRTL ? "left-0" : "right-0"} pt-2 z-60 min-w-[140px] animate-in fade-in slide-in-from-top-2 duration-200`}
        >
          <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl flex flex-col py-1 overflow-hidden">
            <button
              onClick={() => switchLanguage("en")}
              className={`px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors ${locale === "en" ? "bg-primary/5 text-primary" : "text-baseTwo"}`}
            >
              <USFlag className="w-5 h-3.5" />
              <span className="font-bold text-xs uppercase text-start">
                {t("english")}
              </span>
            </button>
            <button
              onClick={() => switchLanguage("ar")}
              className={`px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors ${locale === "ar" ? "bg-primary/5 text-primary" : "text-baseTwo"}`}
            >
              <EgyptFlag className="w-6 h-4" />
              <span className="font-bold text-xs uppercase text-start">
                {t("arabic")}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { settings } = useSettings();
  const { isUnlocked } = useVault();

  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [openMobileSubDropdown, setOpenMobileSubDropdown] = useState(null);

  const [contactTypes, setContactTypes] = useState([]);
  const [articleTypes, setArticleTypes] = useState([]);
  const [isExecutiveDropdownOpen, setIsExecutiveDropdownOpen] = useState(false);
  const [isMobileExecutiveDropdownOpen, setIsMobileExecutiveDropdownOpen] =
    useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/nav-data", {
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted) return;
        setContactTypes(
          Array.isArray(data?.contactTypes) ? data.contactTypes : [],
        );
        setArticleTypes(
          Array.isArray(data?.articleTypes) ? data.articleTypes : [],
        );
      })
      .catch(() => {
        if (!isMounted) return;
        setContactTypes([]);
        setArticleTypes([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
    setOpenMobileDropdown(null);
    setOpenMobileSubDropdown(null);
    setIsExecutiveDropdownOpen(false);
    setIsMobileExecutiveDropdownOpen(false);
    setIsLangDropdownOpen(false);
  };
  const isActive = (path) => pathname === path;

  const switchLanguage = (newLocale) => {
    router.replace(pathname, {
      locale: newLocale,
      scroll: false,
    });
    setIsLangDropdownOpen(false);
  };

  const getLocalizedSlug = (slug) => {
    if (!slug) return "";
    if (typeof slug === "string") return slug;
    return slug?.[locale] || slug?.["en"] || slug?.["ar"] || "";
  };

  const navLinks = [
    { to: "/", label: t("navbar.home") },
    {
      label: t("navbar.about"),
      isDropdown: true,
      dropdownId: "about",
      items: [
        {
          label: t("navbar.sovereign_identity"),
          to: "/sovereign-manifesto",
          children: [
            {
              to: "/founding-manifesto",
              label: t("navbar.founding_manifesto"),
            },
            {
              to: "/philosophical-statement",
              label: t("navbar.philosophical_statement"),
            },
            {
              to: "/political-manifesto",
              label: t("navbar.strategic_welcome"),
            },
          ],
        },
        {
          label: t("navbar.intellectual_foundations"),
          to: "/political-mandate",
          children: [
            { to: "/political-mandate", label: t("navbar.political_mandate") },
            {
              to: "/operational-paradigm",
              label: t("navbar.operational_paradigm"),
            },
            {
              to: "/axiologicalandstrategic-objectives",
              label: t("navbar.ethical_imperatives"),
            },
          ],
        },
        { to: "/strategic-foresight", label: t("navbar.strategic_foresight") },
        { to: "/executive-identity", label: t("navbar.sovereign_legacy") },
        { to: "/sovereign-manifesto", label: t("navbar.sovereign_manifesto") },
      ],
    },
    {
      label: t("navbar.media.title"),
      isDropdown: true,
      dropdownId: "media",
      items: [
        { to: "/meetings-conferences", label: t("navbar.media.interviews") },
        { to: "/quotations", label: t("navbar.media.citations") },
        { to: "/galleries", label: t("navbar.media.galleries") },
      ],
    },
    {
      label: t("navbar.strategicAnalyses", "Strategic Articles and Analyses"),
      isDropdown: true,
      dropdownId: "strategicAnalyses",
      items: [
        {
          to: "/analyses",
          label: t("navbar.allAnalyses", "All Analyses"),
        },
        ...articleTypes.map((type) => ({
          to: `/analyses/${getLocalizedSlug(type.slug)}`,
          label: type.name?.[locale] || type.name?.["en"] || "",
          children:
            type.children?.map((child) => ({
              to: `/analyses/${getLocalizedSlug(child.slug)}`,
              label: child.name?.[locale] || child.name?.["en"] || "",
            })) || [],
        })),
      ],
    },
    { to: "/podcasts", label: t("navbar.podcasts.title") },
    {
      to: "/research-archive",
      label: t("navbar.researchArchive"),
      isVault: true,
    },
    { to: "/faq", label: t("navbar.faq") },
    // { to: "/contact", label: t("navbar.contact") },
  ];

  const DesktopNavLink = ({ to, children, isVault }) => {
    const handleClick = (e) => {
      if (isVault && !isUnlocked) {
        e.preventDefault();
        setIsVaultModalOpen(true);
      } else {
        closeMenu();
      }
    };

    return (
      <Link
        href={to}
        onClick={handleClick}
        className={`relative group px-1 lg:px-2 xl:px-4 py-3 text-sm lg:text-[13px] xl:text-base 2xl:text-lg font-medium transition-all duration-300 rounded-lg hover:bg-black/5 ${
          isActive(to) ? "text-baseTwo" : "text-baseTwo hover:text-primary"
        }`}
      >
        <div className="flex items-center gap-2">
          {isVault && <FaLock size={20} className="text-primary/70" />}
          {children}
        </div>
        <span
          className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive(to) ? "w-full" : "w-0 group-hover:w-full"}`}
        ></span>
      </Link>
    );
  };

  return (
    <>
      <nav className="bg-white shadow-sm backdrop-blur-sm fixed top-0 left-0 right-0 z-[999] py-4 md:px-6 px-2">
        <div className="max-w-[1600px] mx-auto md:px-4 px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Logo Section */}
            <div className="">
              <Link
                href="/"
                onClick={closeMenu}
                className="block group relative w-30 h-30"
              >
                {settings?.logo && (
                  <Image
                    src={settings?.logo}
                    alt="Dr. Mohamed Talaat Logo"
                    fill
                    priority
                    className="object-contain p-1.5"
                  />
                )}
              </Link>
            </div>

            {/* Mobile Search Trigger (Input Shape) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="lg:hidden flex-1 mx-3 xs:mx-5 relative group max-w-[220px]"
            >
              <div className="bg-gray-50 border border-gray-200 rounded-full py-2.5 px-10 text-[13px] font-bold text-gray-400 flex items-center transition-all group-hover:bg-white group-hover:shadow-lg group-hover:shadow-primary/5 group-hover:border-primary/30">
                <span className="truncate">
                  {isRTL ? "ابحث هنا..." : "Search here..."}
                </span>
              </div>
              <FiSearch
                className={`absolute ${isRTL ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors`}
                size={16}
              />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden whitespace-nowrap lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link, idx) => {
                if (link.isDropdown) {
                  return (
                    <div
                      key={idx}
                      className="relative group"
                      onMouseEnter={() => setOpenDropdown(link.dropdownId)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button
                        className={`flex items-center gap-1 px-1 lg:px-2 xl:px-4 py-3 text-sm lg:text-[13px] xl:text-base 2xl:text-lg font-medium transition-all duration-300 rounded-lg hover:bg-black/5 text-baseTwo group-hover:text-primary`}
                      >
                        <span>{link.label}</span>
                        <FaChevronDown
                          size={12}
                          className={`opacity-50 transition-transform duration-300 ${openDropdown === link.dropdownId ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openDropdown === link.dropdownId && (
                        <div
                          className={`absolute top-full ${isRTL ? "right-0" : "left-0"} pt-1 min-w-[220px] animate-in fade-in slide-in-from-top-2 duration-200 z-[9000]`}
                        >
                          <div className="bg-white border border-gray-100 shadow-xl rounded-2xl flex flex-col py-1">
                            {link.items.length > 0 ? (
                              link.items.map((item, i) => {
                                if (item.isSeparator) {
                                  return (
                                    <hr
                                      key={i}
                                      className="border-t-2 border-slate-200 my-3 mx-2 opacity-100"
                                    />
                                  );
                                }

                                const hasChildren =
                                  item.children && item.children.length > 0;
                                const isChildActive =
                                  hasChildren &&
                                  item.children.some((child) =>
                                    isActive(child.to),
                                  );
                                const isItemActive =
                                  isActive(item.to) || isChildActive;

                                return (
                                  <div
                                    key={i}
                                    className="relative group/subitem w-full"
                                  >
                                    {hasChildren ? (
                                      <div
                                        className={`px-5 py-3 w-full transition-all border-b last:border-0 border-gray-50 flex items-center justify-between cursor-default ${isRTL ? "text-right" : "text-left"} ${isItemActive ? "text-primary bg-primary/[0.05]" : "text-baseTwo bg-white"} group-hover/subitem:text-primary group-hover/subitem:bg-primary/[0.03]`}
                                      >
                                        <span
                                          className={`text-sm pr-2 font-bold`}
                                        >
                                          {item.label}
                                        </span>
                                        <div
                                          className={`shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform duration-300 shadow-sm ${isRTL ? "group-hover/subitem:-translate-x-1" : "group-hover/subitem:translate-x-1"}`}
                                        >
                                          <MdOutlineKeyboardArrowDown
                                            size={16}
                                            className={`${isRTL ? "rotate-90" : "-rotate-90"}`}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <Link
                                        href={item.to}
                                        onClick={() => {
                                          setOpenDropdown(null);
                                        }}
                                        className={`px-5 py-3 w-full transition-all border-b last:border-0 border-gray-50 flex items-center justify-between ${isRTL ? "text-right" : "text-left"} ${isItemActive ? "text-primary bg-primary/[0.05]" : "text-baseTwo hover:bg-gray-50 hover:text-primary bg-white"}`}
                                      >
                                        <span
                                          className={`text-sm pr-2 ${isItemActive ? "font-bold" : "font-semibold"}`}
                                        >
                                          {item.label}
                                        </span>
                                        <MdOutlineKeyboardArrowDown
                                          size={16}
                                          className={`opacity-0 group-hover/subitem:opacity-30 transition-all ${isRTL ? "rotate-90" : "-rotate-90"}`}
                                        />
                                      </Link>
                                    )}

                                    {hasChildren && (
                                      <div
                                        className={`absolute -top-3 ${isRTL ? "right-full pr-4" : "left-full pl-4"} hidden group-hover/subitem:block pt-3 pb-3 min-w-[240px] z-[9010] animate-in fade-in zoom-in-95 duration-200`}
                                      >
                                        <div className="bg-white border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-2xl flex flex-col py-2 mx-1 overflow-hidden">
                                          {item.children.map((child, j) => (
                                            <Link
                                              key={j}
                                              href={child.to}
                                              onClick={() =>
                                                setOpenDropdown(null)
                                              }
                                              className={`px-5 py-3 text-baseTwo hover:bg-gray-50 hover:text-primary transition-all border-b last:border-0 border-gray-50 flex items-center gap-3 group/child ${isRTL ? "text-right" : "text-left"}`}
                                            >
                                              <span
                                                className={`w-3 h-[2px] bg-primary/60 group-hover/child:bg-primary transition-colors shrink-0`}
                                              ></span>
                                              <span
                                                className={`font-semibold text-sm ${isActive(child.to) ? "text-primary" : ""}`}
                                              >
                                                {child.label}
                                              </span>
                                            </Link>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="px-5 py-3.5 text-slate-400 text-sm font-semibold">
                                {t("navbar.loading", "Loading...")}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <DesktopNavLink
                    key={link.to}
                    to={link.to}
                    isVault={link.isVault}
                  >
                    {link.label}
                  </DesktopNavLink>
                );
              })}
            </div>

            {/* Utility Space*/}
            <div className="flex items-center md:space-x-4 space-x-2">
              <LanguageDropdown
                className=""
                locale={locale}
                isRTL={isRTL}
                isLangDropdownOpen={isLangDropdownOpen}
                setIsLangDropdownOpen={setIsLangDropdownOpen}
                switchLanguage={switchLanguage}
              />

              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center justify-center w-10 h-10 bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 border border-gray-200 rounded-full text-baseTwo hover:text-primary"
              >
                <FiSearch size={18} />
              </button>

              {/* Desktop Executive Request CTA */}
              <div
                className="relative group lg:block hidden"
                onMouseEnter={() => setIsExecutiveDropdownOpen(true)}
                onMouseLeave={() => setIsExecutiveDropdownOpen(false)}
              >
                <button className="flex items-center justify-center whitespace-nowrap gap-1 xl:gap-2 px-3 xl:px-5 py-2 xl:py-3 bg-primary text-white font-bold rounded-md shadow-lg hover:shadow-primary/30 transition-all text-[11px] lg:text-xs xl:text-sm">
                  <span>{t("navbar.executiveRequest")}</span>
                  <FaChevronDown
                    size={12}
                    className={`transition-transform duration-300 ${isExecutiveDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isExecutiveDropdownOpen && (
                  <div
                    className={`absolute top-full ${isRTL ? "-left-4" : "-right-4"} pt-2  min-w-[240px] animate-in fade-in slide-in-from-top-2 duration-200`}
                  >
                    <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl flex flex-col py-1 overflow-y-auto max-h-[350px] scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                      {contactTypes.map((type) => (
                        <Link
                          key={type.id}
                          href={`/contact?type=${type.id}`}
                          onClick={() => setIsExecutiveDropdownOpen(false)}
                          className={`px-6 py-4 text-baseTwo hover:bg-gray-50 hover:text-primary transition-colors border-b border-gray-50 flex items-center gap-4 group ${isRTL ? "flex-row-reverse text-right" : "flex-row text-left"}`}
                        >
                          <span className="font-semibold whitespace-nowrap text-md flex-1">
                            {type.name?.[locale] || ""}
                          </span>
                          <FaPaperPlane
                            size={12}
                            className={`opacity-0 group-hover:opacity-100 transition-all shrink-0 ${isRTL ? "-translate-x-2 group-hover:translate-x-0" : "translate-x-2 group-hover:translate-x-0"}`}
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button toggle */}
              <button
                onClick={toggleMenu}
                className="lg:hidden text-primary p-2 transition-all duration-300"
              >
                <div className="relative w-7 h-7">
                  <FiMenu
                    size={28}
                    className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? "opacity-0 rotate-180" : "opacity-100 rotate-0"}`}
                  />
                  <FiX
                    size={28}
                    className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-180"}`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-[1000] transition-all duration-500 ${isMenuOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={closeMenu}
        />

        <div
          className={`absolute top-0 ${isRTL ? "right-0 translate-x-full" : "left-0 -translate-x-full"} w-90 h-full bg-white shadow-2xl transition-transform duration-500 transform ${isMenuOpen && "!translate-x-0"}`}
        >
          <div className="flex flex-col h-full bg-third/5">
            {/* Header */}
            <div className="p-2 flex items-center justify-between border-b border-gray-100 shadow-sm bg-white">
              <Link
                href="/"
                onClick={closeMenu}
                className="block relative h-20 w-32"
              >
                {settings?.logo ||
                settings?.footer_logo ||
                settings?.main_logo ||
                settings?.main_logo_dark ? (
                  <Image
                    src={
                      settings?.logo ||
                      settings?.footer_logo ||
                      settings?.main_logo ||
                      settings?.main_logo_dark
                    }
                    alt="Dr. Mohamed Talaat Logo"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <span className="text-xl font-bold text-primary">
                    {settings?.site_name?.[locale] || "Logo"}
                  </span>
                )}
              </Link>
              <button
                onClick={closeMenu}
                className="p-2 text-primary hover:bg-primary/5 rounded-full bg-gray-50"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-8 flex flex-col gap-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {navLinks.map((link, idx) => {
                if (link.isDropdown) {
                  return (
                    <div key={idx} className="flex flex-col">
                      <button
                        onClick={() =>
                          setOpenMobileDropdown(
                            openMobileDropdown === link.dropdownId
                              ? null
                              : link.dropdownId,
                          )
                        }
                        className={`text-md font-bold py-3 text-left transition-colors flex items-center justify-between ${openMobileDropdown === link.dropdownId ? "text-primary" : "text-baseTwo hover:text-primary"}`}
                      >
                        <span className="text-start">{link.label}</span>
                        <FaChevronDown
                          size={14}
                          className={`opacity-50 transition-transform duration-300 ${openMobileDropdown === link.dropdownId ? "rotate-180" : ""}`}
                        />
                      </button>
                      {/* Mobile Dropdown Menu Items */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          openMobileDropdown === link.dropdownId
                            ? "max-h-[800px] opacity-100 mb-2"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="flex flex-col border-l-2 border-gray-100 ml-2 pl-4 space-y-1 overflow-y-auto max-h-[400px]">
                          {link.items.length > 0 ? (
                            link.items.map((item, i) => {
                              if (item.isSeparator) {
                                return (
                                  <div
                                    key={i}
                                    className="h-[2px] bg-gray-100 my-2 mr-4 rtl:ml-4 rtl:mr-0"
                                  />
                                );
                              }

                              const hasChildren =
                                item.children && item.children.length > 0;
                              const isSubOpen =
                                openMobileSubDropdown === item.label;
                              const isItemActive =
                                isActive(item.to) ||
                                (hasChildren &&
                                  item.children.some((c) => isActive(c.to)));

                              return (
                                <div
                                  key={i}
                                  className={`flex flex-col mb-1 transition-all duration-300 ${isSubOpen || isItemActive ? "bg-primary/5 rounded-xl px-2 py-1" : ""}`}
                                >
                                  <div className="flex items-center justify-between group">
                                    {hasChildren ? (
                                      <div
                                        className={`py-2 text-base transition-colors flex items-center flex-1 cursor-default ${isSubOpen || isItemActive ? "font-bold text-primary" : "font-medium text-baseTwo"}`}
                                      >
                                        <span>{item.label}</span>
                                      </div>
                                    ) : (
                                      <Link
                                        href={item.to}
                                        onClick={closeMenu}
                                        className={`py-2 text-base transition-colors flex items-center flex-1 ${isActive(item.to) ? "font-bold text-primary" : "font-medium text-baseTwo hover:text-primary"}`}
                                      >
                                        <span>{item.label}</span>
                                      </Link>
                                    )}
                                    {hasChildren && (
                                      <button
                                        onClick={() =>
                                          setOpenMobileSubDropdown(
                                            isSubOpen ? null : item.label,
                                          )
                                        }
                                        className={`p-1.5 rounded-lg transition-colors ${isSubOpen ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary/80 hover:bg-primary/20 hover:text-primary"}`}
                                      >
                                        <MdOutlineKeyboardArrowDown
                                          size={18}
                                          className={`transition-transform duration-300 ${isSubOpen ? "rotate-180" : ""}`}
                                        />
                                      </button>
                                    )}
                                  </div>

                                  {hasChildren && (
                                    <div
                                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        openMobileSubDropdown === item.label
                                          ? "max-h-[800px] opacity-100"
                                          : "max-h-0 opacity-0"
                                      }`}
                                    >
                                      <div className="flex flex-col border-l-[1.5px] border-primary/30 ml-2 pl-3 rtl:mr-2 rtl:pr-3 rtl:border-l-0 rtl:border-r-[1.5px] space-y-1 mb-2 mt-1">
                                        {item.children.map((child, j) => (
                                          <Link
                                            key={j}
                                            href={child.to}
                                            onClick={closeMenu}
                                            className={`py-2.5 text-[0.9rem] font-semibold transition-colors flex items-center gap-3 group/child-mobile ${isActive(child.to) ? "text-primary" : "text-baseTwo hover:text-primary"}`}
                                          >
                                            <span
                                              className={`w-4 h-[2px] bg-primary/60 group-hover/child-mobile:bg-primary shrink-0 transition-colors ${isActive(child.to) ? "bg-primary" : ""}`}
                                            ></span>
                                            <span className="text-start">
                                              {child.label}
                                            </span>
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className="py-2.5 text-base font-medium ">
                              {t("navbar.loading", "Loading...")}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.to}
                    href={link.to}
                    onClick={(e) => {
                      if (link.isVault && !isUnlocked) {
                        e.preventDefault();
                        setIsVaultModalOpen(true);
                      } else {
                        closeMenu();
                      }
                    }}
                    className={`text-md font-bold py-3 transition-colors flex items-center justify-between ${isActive(link.to) ? "text-primary" : "text-baseTwo hover:text-primary"}`}
                  >
                    <div className="flex items-center gap-2">
                      {link.isVault && (
                        <FaLock size={12} className="text-primary/70" />
                      )}
                      <span className="text-start">{link.label}</span>
                    </div>
                    <MdOutlineKeyboardArrowDown
                      className={`opacity-30 ${isRTL ? "rotate-90" : "-rotate-90"}`}
                    />
                  </Link>
                );
              })}

              {/* Mobile Executive Request Collapsible */}
              {contactTypes.length > 0 && (
                <div className="w-full mt-6">
                  <button
                    onClick={() =>
                      setIsMobileExecutiveDropdownOpen(
                        !isMobileExecutiveDropdownOpen,
                      )
                    }
                    className="w-full bg-gray-50 rounded-xl px-4 flex items-center justify-between text-baseTwo hover:text-primary py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 block"></span>
                      <span className="text-baseTwo text-md font-black uppercase tracking-widest text-start">
                        {t("navbar.executiveRequest")}
                      </span>
                    </div>
                    <FaChevronDown
                      size={14}
                      className={`transition-transform duration-300 opacity-60 ${isMobileExecutiveDropdownOpen ? "rotate-180" : "rotate-0"}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileExecutiveDropdownOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}
                  >
                    <div className="flex flex-col gap-2 border-s-2 border-gray-100 rtl:border-r-2 rtl:border-l-0 pl-4 rtl:pr-4 mx-2 overflow-y-auto max-h-[400px]">
                      {contactTypes.map((type) => (
                        <Link
                          key={type.id}
                          href={`/contact?type=${type.id}`}
                          onClick={closeMenu}
                          className="p-3 bg-white border border-gray-50 rounded-xl text-baseTwo hover:text-primary transition-all flex items-center gap-3 group shadow-sm hover:bg-primary/5 hover:border-primary"
                        >
                          <div className="w-7 h-7 shrink-0 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <FaPaperPlane
                              size={10}
                              className="opacity-80 rtl:rotate-180"
                            />
                          </div>
                          <span className="text-sm font-bold flex-1 text-start">
                            {type.name?.[locale] || ""}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-bold text-baseTwo uppercase">
                  {t("navbar.language", "Language")}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => switchLanguage("en")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${locale === "en" ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white border-gray-200 text-baseTwo hover:border-primary"}`}
                >
                  <USFlag className="w-5 h-3.5" />
                  <span className="font-bold text-sm uppercase">
                    {t("navbar.english")}
                  </span>
                </button>
                <button
                  onClick={() => switchLanguage("ar")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${locale === "ar" ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white border-gray-200 text-baseTwo hover:border-primary"}`}
                >
                  <EgyptFlag className="w-5 h-3.5" />
                  <span className="font-bold text-sm uppercase">
                    {t("navbar.arabic")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Vault Password Modal */}
      <VaultModal
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
      />

      {/* Search Popup */}
      <SearchPopup
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;
