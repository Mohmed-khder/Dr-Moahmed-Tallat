# Mohamed Talaat Portfolio

Official portfolio and publishing platform for Dr. Mohamed Talaat. The site presents strategic analyses, media appearances, galleries, podcasts, quotations, research archive content, and institutional information pages in Arabic and English.

## Features

- Internationalized routing with Arabic and English locales.
- Portfolio sections for home, about, analyses, galleries, podcasts, quotations, meetings and conferences, FAQs, and contact.
- Dynamic article detail pages with localized SEO metadata.
- Research archive experience with protected archive access.
- API-backed navigation/content data through the local `app/api/nav-data` route.
- Responsive UI built with animations, sliders, icons, and toast feedback.
- SEO, manifest, robots, sitemap, analytics, and security header configuration.

## Tech Stack

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- [next-intl](https://next-intl.dev/) for localization
- [Tailwind CSS](https://tailwindcss.com/) 4
- [styled-components](https://styled-components.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Swiper](https://swiperjs.com/)
- [Axios](https://axios-http.com/)

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production server after a build.

```bash
npm run lint
```

Runs ESLint.

## Project Structure

```text
app/
  [locale]/                 Localized routes and page metadata
  Components/               Shared UI components
  HomePage/                 Home page sections
  AboutPage/                About page sections
  AnalysesPage/             Analysis listing/detail UI
  GalleriesPage/            Gallery UI
  podcastsPage/             Podcast UI
  ResearchArchivePage/      Research archive UI
  InformationPages/         Static information page components
  Locales/                  Translation files
  api/nav-data/             Local API route
i18n/                       next-intl request and routing config
public/                     Public assets and verification files
```

## Localization

Translations live in:

- `app/Locales/en/translation.json`
- `app/Locales/ar/translation.json`

Routing configuration lives in `i18n/routing.js`, and request handling lives in `i18n/request.js`.

## Deployment

The app is configured for standard Next.js deployment. Remote image domains and security headers are configured in `next.config.mjs`.

Build before deployment:

```bash
npm run build
```
