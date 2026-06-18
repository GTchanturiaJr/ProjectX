# ProjectX Deployment Guide

## Requirements

- Node.js 18+
- Supabase project (database + storage + auth)
- Hosting platform (Vercel, Netlify, or custom server)

## Environment Setup

Copy `.env.example` to `.env` and set:

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Migration

Run the Supabase migration (via Supabase SQL Editor or MCP tool) to create all tables, policies, triggers, and default data.

The migration creates:
- `profiles` (user profiles)
- `user_roles` (role assignments)
- `pages` (site pages)
- `page_sections` (page builder components)
- `navigation_menus` and `navigation_items` (menus)
- `footer_sections` and `footer_items` (footer links)
- `media_files` and `media_folders` (media library)
- `blog_posts` and `blog_categories` (blog)
- `forms`, `form_fields`, and `form_submissions` (forms)
- `seo_settings` (SEO meta data)
- `site_settings` (global settings)
- `audit_logs` (activity tracking)

## Build

```bash
npm install
npm run build
```

## Deployment Options

### Vercel
1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect your repo
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables

### Custom Server
1. Build with `npm run build`
2. Serve the `build` folder with your server
3. Ensure Node.js 18+ is available

## Post-Deployment

1. Visit `/admin/login`
2. Sign up with email/password
3. Assign yourself `super_admin` via Supabase SQL:
   ```sql
   INSERT INTO public.user_roles (user_id, role) VALUES ('your-uid', 'super_admin');
   ```
4. Configure site settings in `/admin/settings`
5. Set up navigation and footer
6. Create your first page

## Storage Bucket

Create a Supabase Storage bucket named `media` with public access for the media library to work.
