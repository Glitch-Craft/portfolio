import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: new URL('/', siteConfig.url).toString(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
