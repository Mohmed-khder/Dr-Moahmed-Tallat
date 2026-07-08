import "../globals.css";
import Script from "next/script";
import Navbar from "../Components/Navbar";
import Providers from "../Components/Providers";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import Footer from "../Components/Footer";
import { fetchSettings } from "../lib/server-api";
import ScrollToTop from "../Components/ScrollToTop";
import { Top } from "../Components/Top";
import Chatbot from "../Components/Chatbot";
import MetaPixelTracker from "../Components/MetaPixelTracker";
import { META_PIXEL_ID } from "../lib/tracking";
import MaintenanceMode from "../Components/MaintenanceMode";
import AppLoader from "../Components/AppLoader";
import Poup from "../Components/poup";

const SHOW_OFFICIAL_LETTER_POPUP = false;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  let siteName = "Dr. Mohamed Talaat";
  let favicon = "/favicon.ico";

  try {
    const settings = await fetchSettings();
    if (settings) {
      siteName = settings.site_name?.[locale] || siteName;
      favicon = settings.favicon || favicon;
    }
  } catch (err) {}

  const baseUrl = "https://mohamedtalat.com";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: `${siteName} | %s`,
      default: siteName,
    },
    icons: {
      icon: favicon,
      apple: favicon,
    },
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      title: siteName,
      statusBarStyle: "default",
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        ar: `${baseUrl}/ar`,
        en: `${baseUrl}/en`,
      },
    },
    openGraph: {
      url: `${baseUrl}/${locale}`,
      siteName: siteName,
      locale: locale === "ar" ? "ar_AR" : "en_US",
      type: "website",
      images: ["/Home/talaat-logo.png"],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/Home/talaat-logo.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function RootLayout(props) {
  const { children, params } = props;
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Provide all messages to the client side
  const messages = await getMessages();

  // Fetch global settings once on the server side to eliminate redundant client requests
  let globalSettings = null;
  try {
    globalSettings = await fetchSettings();
  } catch (err) {
    console.error("Failed to fetch global settings in root layout", err);
  }
  const baseUrl = "https://mohamedtalat.com";
  const siteName = globalSettings?.site_name?.[locale] || "Dr. Mohamed Talaat";
  const isWebsiteDisabled = globalSettings?.website_enabled === false;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        {/* Google Tag Manager moves to afterInteractive via Script component */}
        <link rel="icon" href={globalSettings?.favicon || "/favicon.ico"} />
        <meta name="referrer" content="no-referrer" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteName,
              url: `${baseUrl}/${locale}`,
              logo: `${baseUrl}/Home/talaat-logo.png`,
            }),
          }}
        />
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YM3MTCNQWE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-YM3MTCNQWE');
          `}
        </Script>
      </head>
      <body className={`antialiased`} suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5KXFQMQT"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element -- Meta requires a raw tracking pixel fallback. */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5KXFQMQT');`}
        </Script>
        <MetaPixelTracker />
        <NextIntlClientProvider messages={messages}>
          <Providers initialSettings={globalSettings}>
            {isWebsiteDisabled ? (
              <MaintenanceMode locale={locale} settings={globalSettings} />
            ) : (
              <div
                id="site-main-content"
                className="transition-opacity duration-1000"
              >
                <AppLoader />
                <ScrollToTop />
                <Top />
                <Navbar />
                <main>{children}</main>
                <Footer />
                <Chatbot />
                {SHOW_OFFICIAL_LETTER_POPUP && <Poup />}
              </div>
            )}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
