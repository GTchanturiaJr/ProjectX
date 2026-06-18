import { supabaseAdmin } from '$lib/server/supabase-admin';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const { data: pages } = await supabaseAdmin.from('pages').select('slug, updated_at').eq('published', true);
  const { data: posts } = await supabaseAdmin.from('blog_posts').select('slug, updated_at').eq('published', true);

  const baseUrl = 'https://example.com';

  const urls = [
    { loc: baseUrl, changefreq: 'weekly', priority: '1.0' },
    ...(pages ?? []).map(p => ({
      loc: `${baseUrl}/${p.slug}`,
      lastmod: p.updated_at?.split('T')[0],
      changefreq: 'weekly',
      priority: '0.8',
    })),
    { loc: `${baseUrl}/blog`, changefreq: 'weekly', priority: '0.7' },
    ...(posts ?? []).map(p => ({
      loc: `${baseUrl}/blog/${p.slug}`,
      lastmod: p.updated_at?.split('T')[0],
      changefreq: 'monthly',
      priority: '0.6',
    })),
    { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.5' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
