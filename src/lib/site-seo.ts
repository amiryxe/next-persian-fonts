import manifest from 'next-persian-fonts/fonts.json'
import pkg from 'next-persian-fonts/package.json'

export const SITE_URL = 'https://amiryxe.github.io/next-persian-fonts/'
export const SITE_ORIGIN = 'https://amiryxe.github.io/next-persian-fonts'
export const GITHUB_REPO = 'https://github.com/amiryxe/next-persian-fonts'
export const NPM_URL = 'https://www.npmjs.com/package/next-persian-fonts'

const faCount = String(manifest.families.length).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

export const siteDescription =
  `${faCount} خانوادهٔ فونت فارسی رایگان برای Next.js، داخل پکیج و آفلاین: وزیرمتن، استعداد، ساحل، لاله‌زار، نوتو و… — بدون گوگل و CDN، با تایپ‌اسکریپت.`

const faq: { question: string; answer: string }[] = [
  {
    question: 'چرا فونت‌ها داخل پکیج هستند و از Google Fonts یا CDN استفاده نمی‌کنیم؟',
    answer:
      'اگر اینترنت محدود باشد، next/font/google ممکن است هنگام build نتواند فونت را دانلود کند و فونت‌های CDN هم برای کاربران باز نشوند. اینجا فایل فونت‌ها همراه npm install می‌آیند و Next.js آن‌ها را روی سایت خودتان میزبانی می‌کند، پس همیشه کار می‌کنند. برای همین فونت‌های فارسی Google Fonts هم داخل پکیج قرار گرفته‌اند.',
  },
  {
    question: 'چطور چند فونت را با هم استفاده کنم؟',
    answer:
      'به‌جای className از variable هر فونت استفاده کنید و هر جا لازم است متغیر CSS آن را بنویسید. نام متغیر همیشه --font- به‌علاوهٔ مسیر ایمپورت است. ساده‌ترین راه این است که className فونت را مستقیم روی همان المان بگذارید.',
  },
  {
    question: 'نسخه‌های FD چه هستند؟',
    answer:
      'در نسخه‌های FD حتی اعداد انگلیسی (123) هم فارسی (۱۲۳) نمایش داده می‌شوند؛ برای قیمت و تاریخ مفید است. اگر متن شما خودش اعداد فارسی دارد، نسخهٔ معمولی هم کافی است. vazirMatn همیشه اعداد فارسی دارد.',
  },
  {
    question: 'بدون Next.js هم می‌شود استفاده کرد؟',
    answer:
      'بله. از نسخهٔ ۱.۲ برای هر فونت یک فایل CSS هست، مثلاً import \'next-persian-fonts/css/estedad.css\'، که در Vite، Gatsby، Astro یا با تگ link در HTML ساده کار می‌کند. این فایل‌ها برای کاربران Next.js هیچ هزینه‌ای ندارند، چون فقط وقتی ایمپورتشان کنید وارد خروجی می‌شوند.',
  },
  {
    question: 'optimizePackageImports لازم است؟',
    answer:
      'اگر از مسیر هر فونت ایمپورت کنید (مثلاً next-persian-fonts/estedad)، نه. فقط اگر از ریشهٔ پکیج ایمپورت می‌کنید (روش قدیمی نسخهٔ ۱.۰) و با webpack می‌سازید، این تنظیم را اضافه کنید تا فونت‌های اضافه دانلود نشوند.',
  },
  {
    question: 'Pages Router یا Jest خطای ERR_UNSUPPORTED_DIR_IMPORT می‌دهد؟',
    answer:
      "در next.config بنویسید transpilePackages: ['next-persian-fonts']. Pages Router و next/jest پکیج‌های node_modules را باندل نمی‌کنند، پس next/font/local اجرا نمی‌شود. این تنظیم در App Router هم بی‌ضرر است.",
  },
  {
    question: 'با pnpm نسخهٔ قدیمی (۱.۰) نصب شد؟',
    answer:
      'نسخه‌های جدید pnpm بسته‌هایی را که تازه منتشر شده‌اند تا مدتی نصب نمی‌کنند. نسخه را صریح بنویسید: pnpm add next-persian-fonts@^1.2 یا npm install next-persian-fonts@latest.',
  },
  {
    question: 'چرا بعضی فونت‌ها preload نمی‌شوند؟',
    answer:
      'خروجی‌هایی که بیش از ۳ فایل دارند preload نمی‌شوند تا Next.js همهٔ وزن‌ها را در هر صفحه از قبل دانلود نکند؛ فقط وزن‌هایی که واقعاً استفاده می‌شوند بارگذاری می‌شوند. برای کمترین حجم، نسخه‌های متغیر مثل vazirmatnVariable را انتخاب کنید.',
  },
  {
    question: 'estedadFD چه شد؟',
    answer:
      'استعداد ۸ دیگر نسخهٔ ارقام فارسی ندارد. estedadFD برای سازگاری روی نسخهٔ ۷.۳ مانده و منسوخ است؛ برای پروژهٔ جدید از estedad استفاده کنید.',
  },
  {
    question: 'برای پروژهٔ تجاری رایگان است؟',
    answer:
      'بله. همهٔ فونت‌ها مجوز آزاد دارند (بیشترشان SIL OFL 1.1) و استفاده در سایت‌های تجاری مجاز است. مجوز هر فونت روی کارت آن در گالری لینک شده است.',
  },
]

export const jsonLdGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'next-persian-fonts',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      description: siteDescription,
      url: SITE_URL,
      downloadUrl: NPM_URL,
      installUrl: NPM_URL,
      codeRepository: GITHUB_REPO,
      softwareVersion: pkg.version,
      license: 'https://opensource.org/licenses/ISC',
      programmingLanguage: ['TypeScript', 'JavaScript'],
      author: {
        '@type': 'Person',
        name: 'Amir Salehi',
        url: 'https://github.com/amiryxe',
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'WebSite',
      name: 'Next Persian Fonts',
      url: SITE_URL,
      inLanguage: 'fa-IR',
      description: siteDescription,
      publisher: {
        '@type': 'Person',
        name: 'Amir Salehi',
        url: 'https://github.com/amiryxe',
      },
    },
    {
      '@type': 'FAQPage',
      url: `${SITE_URL}#faq`,
      mainEntity: faq.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      })),
    },
  ],
}
