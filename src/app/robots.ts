import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wattaro.vercel.app';
  const baseUrl = (rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`).replace(/\/$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
