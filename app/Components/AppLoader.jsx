"use client";

import Image from "next/image";
import { usePathname } from "../../i18n/routing";
import { useEffect, useRef, useState } from "react";
import { useSettings } from "../Context/SettingContext";

const AppLoader = () => {
  const pathname = usePathname();
  const { settings } = useSettings();
  const [isVisible, setIsVisible] = useState(true);
  const previousPathname = useRef(pathname);
  const timerRef = useRef(null);

  const logo =
    settings?.logo ||
    settings?.footer_logo ||
    settings?.main_logo ||
    settings?.main_logo_dark ||
    null;

  useEffect(() => {
    const duration = previousPathname.current === pathname ? 2800 : 1800;

    setIsVisible(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setIsVisible(false);
      previousPathname.current = pathname;
    }, duration);

    return () => window.clearTimeout(timerRef.current);
  }, [pathname]);

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-white transition-all duration-700 ${
        isVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isVisible}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.14),transparent_45%),linear-gradient(135deg,#ffffff_0%,#f8fafc_52%,#ffffff_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-primary/35" />
      <div className="relative flex h-76 w-76 items-center justify-center sm:h-88 sm:w-88">
        <div className="absolute inset-0 rounded-full border border-primary/20 bg-white/70 shadow-[0_0_110px_rgba(197,160,89,0.16)]" />
        <div className="absolute inset-4 rounded-full border border-baseTwo/5" />
        <div className="absolute inset-7 rounded-full border-t-2 border-r-2 border-primary border-b-transparent border-l-transparent animate-loader-spin" />
        <div className="absolute inset-12 rounded-full border-b-2 border-l-2 border-secondary/80 border-t-transparent border-r-transparent animate-loader-spin-reverse" />
        <div className="absolute inset-16 rounded-full bg-primary/8 blur-xl" />
        <div className="relative z-10 flex h-44 w-44 items-center justify-center rounded-full border border-primary/20 bg-white p-6 shadow-2xl shadow-primary/25 sm:h-52 sm:w-52">
          {logo ? (
            <Image
              src={logo}
              alt="Logo"
              width={230}
              height={130}
              priority
              className="max-h-32 w-auto object-contain sm:max-h-36"
            />
          ) : (
            <span className="text-5xl font-black text-primary">MT</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppLoader;
