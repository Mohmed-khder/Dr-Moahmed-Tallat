export const revalidate = 0;

export default function robots() {
  const baseUrl = "https://mohamedtalat.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/private/",
        "/cgi-bin/",
        "/*?search=*",
        "/*&search=*",
        "/*?page=*",
        "/*&page=*",
        "/*?is_featured=*",
        "/*&is_featured=*",
      ],
    },
    sitemap: `${baseUrl}/sitemap-main.xml`,
  };
}
