"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  META_PIXEL_ID,
  trackMetaCustomEvent,
  trackMetaEvent,
} from "../lib/tracking";

function initializeMetaPixel() {
  if (window.__META_PIXEL_INITIALIZED__) return;

  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js",
  );

  window.fbq("init", META_PIXEL_ID);
  window.__META_PIXEL_INITIALIZED__ = true;
}

function isWhatsAppLink(href) {
  return (
    href.includes("wa.me/") ||
    href.includes("whatsapp.com/") ||
    href.includes("whatsapp://")
  );
}

export default function MetaPixelTracker() {
  const pathname = usePathname();

  useEffect(() => {
    initializeMetaPixel();
  }, []);

  useEffect(() => {
    initializeMetaPixel();
    trackMetaEvent("PageView", { page_path: pathname });

    if (pathname.includes("/analyses/article/")) {
      trackMetaEvent("ViewContent", {
        content_type: "article",
        content_name: pathname,
      });
    }
  }, [pathname]);

  useEffect(() => {
    let hasTrackedScrollDepth = false;

    const handleScroll = () => {
      if (hasTrackedScrollDepth) return;

      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const scrollDepth = (window.scrollY / scrollableHeight) * 100;
      if (scrollDepth >= 75) {
        hasTrackedScrollDepth = true;
        trackMetaCustomEvent("ScrollDepth75", {
          page_path: pathname,
          scroll_depth: 75,
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event) => {
      const link = event.target.closest("a");
      if (!link || !isWhatsAppLink(link.href)) return;

      trackMetaCustomEvent("WhatsAppClick", {
        link_url: link.href,
        page_path: window.location.pathname,
      });
      trackMetaEvent("Contact", {
        contact_method: "whatsapp",
        page_path: window.location.pathname,
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}

