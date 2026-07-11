import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  redirectOnRoot: true,
  alternateLinks: false,
});

export const config = {
  matcher: ["/", "/(ar|en)/:path*"],
};
