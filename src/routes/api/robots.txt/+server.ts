import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://example.com/api/sitemap.xml`;

  return new Response(robotsTxt, {
    headers: { 'Content-Type': 'text/plain' },
  });
};
