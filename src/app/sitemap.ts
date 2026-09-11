import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wattaro.vercel.app';
  const baseUrl = (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`).replace(/\/$/, '');

  return [
    {
      url: `${baseUrl}/netzteil-rechner/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
  ];
}
