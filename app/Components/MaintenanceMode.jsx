import Image from "next/image";

const copy = {
  ar: {
    eyebrow: "تحديث استراتيجي جار",
    title: "الموقع تحت الصيانة",
    message:
      "نُعيد ضبط التجربة بعناية لتعود المنصة أكثر اتزاناً ووضوحاً. شكراً لصبركم، سنعود قريباً.",
    status: "جارٍ التحميل",
  },
  en: {
    eyebrow: "Strategic update in progress",
    title: "Website under maintenance",
    message:
      "We are carefully refining the experience so the platform returns sharper, steadier, and clearer. Thank you for your patience.",
    status: "Loading",
  },
};

export default function MaintenanceMode({ locale = "en", settings }) {
  const isArabic = locale === "ar";
  const text = copy[isArabic ? "ar" : "en"];
  const logo =
    settings?.logo ||
    settings?.footer_logo ||
    settings?.main_logo ||
    settings?.main_logo_dark ||
    "/Home/talaat-logo.png";
  const siteName =
    settings?.site_name?.[locale] ||
    settings?.site_name?.en ||
    "Mohamed Talaat";

  return (
    <main className="relative min-h-screen overflow-hidden bg-base text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(197,160,89,0.22),transparent_34%),linear-gradient(135deg,#13131A_0%,#000_58%,#1b1710_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 py-12">
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <p className="mb-7 text-xs font-black uppercase tracking-[0.34em] text-primary/90">
            {text.eyebrow}
          </p>

          <div className="relative mb-9 flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
            <span className="absolute inset-0 rounded-full border border-primary/20" />
            <span className="absolute inset-3 animate-spin rounded-full border-2 border-transparent border-t-primary border-r-primary/70" />
            <span className="absolute inset-8 animate-[spin_3s_linear_infinite_reverse] rounded-full border border-transparent border-b-secondary border-l-secondary/70" />
            <div className="relative h-28 w-28 rounded-full bg-white p-4 shadow-2xl shadow-primary/20 sm:h-32 sm:w-32">
              <Image
                src={logo}
                alt={`${siteName} Logo`}
                fill
                priority
                sizes="128px"
                className="object-contain p-3"
              />
            </div>
          </div>

          <h1 className="max-w-2xl text-4xl font-black leading-tight text-white sm:text-6xl">
            {text.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-white/74 sm:text-xl">
            {text.message}
          </p>

          <div className="mt-10 flex items-center gap-3 rounded-full border border-primary/25 bg-white/5 px-5 py-3 text-sm font-bold text-primary shadow-lg shadow-black/20 backdrop-blur">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
            <span>{text.status}</span>
          </div>
        </section>
      </div>
    </main>
  );
}
