import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-seo'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date('2026-10-30'),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
