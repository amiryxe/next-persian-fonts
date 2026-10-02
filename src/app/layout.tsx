import type { Metadata, Viewport } from 'next'
import { siteFont, codeFont } from '@/lib/fonts'
import { themeScript } from '@/components/ThemeToggle'
import './globals.css'

const description =
  '۳۳ خانوادهٔ فونت فارسی رایگان برای Next.js، داخل پکیج و آفلاین: وزیرمتن، استعداد، ساحل، لاله‌زار، نوتو و… — بدون گوگل و CDN، با تایپ‌اسکریپت.'

export const metadata: Metadata = {
  metadataBase: new URL('https://amiryxe.github.io/next-persian-fonts/'),
  title: {
    default: 'Next Persian Fonts — فونت‌های فارسی برای Next.js',
    template: '%s | Next Persian Fonts',
  },
  description,
  keywords: ['Next.js', 'next/font', 'فونت فارسی', 'Persian fonts', 'Vazirmatn', 'Estedad', 'Sahel', 'Samim', 'Shabnam'],
  authors: [{ name: 'Amir Salehi', url: 'https://github.com/amiryxe' }],
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: './',
    siteName: 'Next Persian Fonts',
    title: 'Next Persian Fonts — فونت‌های فارسی برای Next.js',
    description,
    images: [{ url: 'https://raw.githubusercontent.com/amiryxe/next-persian-fonts/main/.github/assets/banner.png', width: 1280, height: 640, alt: 'next-persian-fonts: فونت‌های فارسی برای Next.js' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next Persian Fonts',
    description,
    images: ['https://raw.githubusercontent.com/amiryxe/next-persian-fonts/main/.github/assets/banner.png'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={`${siteFont.variable} ${codeFont.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-white font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">{children}</body>
    </html>
  )
}
