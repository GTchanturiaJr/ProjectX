# ProjectX Admin Guide

## Overview

The ProjectX admin panel is a powerful CMS interface for managing your entire website. Access it at `/admin/login`.

## Dashboard

The admin dashboard provides quick stats and links to all major sections. Key metrics include:
- Total pages
- Blog posts
- Media files
- Form submissions
- Recent activity logs

## Pages

### Page Management
- Create pages with a title, slug, and description
- Manage page visibility (published/unpublished)
- Build pages using the visual page builder

### Page Builder

The page builder supports the following component types:

| Component | Description |
|-----------|-------------|
| Hero | Full-width banner with title, subtitle, image, and CTA button |
| Text | Rich text content block |
| Features | Grid of feature cards with icons |
| Image | Single image with optional caption |
| Gallery | Image grid with layout options |
| Video | Embedded video player |
| CTA | Call-to-action banner with button |
| Testimonial | Customer quote with avatar |
| Pricing | Pricing table with tiers |
| FAQ | Accordion-style questions and answers |
| Team | Team member cards with photos |
| Stats | Numbered statistics display |
| Contact | Embedded contact form |
| Form | Custom form reference |
| Products | Product grid display |
| Blog | Latest blog posts preview |
| Newsletter | Email signup form |
| Custom | Free-form HTML content |

Each component supports:
- Variant selection (e.g., centered, wide, compact)
- Visibility toggle (show/hide sections)
- Reordering (drag up/down)
- Custom content editing per component type

## Navigation

### Menus
- Create multiple menus (e.g., Navbar, Footer, Sidebar)
- Assign menu locations
- Add menu items with labels, URLs, and sort order
- Toggle visibility per item
- Reorder items

## Footer

- Create footer sections (columns)
- Add links per section with labels, URLs, and icons
- Reorder sections and links

## Media Library

- Upload images to Supabase Storage
- Organize files into folders
- Copy image URLs
- Rename files
- Soft delete (move to trash)

## Blog

- Create blog posts with rich text content
- Manage categories and tags
- Publish/unpublish posts
- SEO-friendly slugs

## Forms

- Create custom forms with various field types
- Field types: text, email, textarea, number, select, checkbox, radio, date
- View and export submissions as CSV
- Delete individual submissions

## Users & Roles

### Roles
| Role | Permissions |
|------|-------------|
| super_admin | Full access |
| admin | Manage pages, media, blog, forms, navigation, footer, settings |
| editor | Manage pages, blog, media |
| seo_manager | Manage SEO settings and view pages |
| media_manager | Manage media only |
| viewer | Read-only access to all content |
| customer | No admin access (public user) |

### User Management
- View all registered users
- Edit user names and roles
- No password editing (handled via Supabase Auth)

## SEO

- Manage SEO settings per page
- Edit meta titles, descriptions, and keywords
- Configure Open Graph tags
- Control robots indexing (index/noindex)
- Generate sitemap.xml and robots.txt dynamically

## Database

- View all database tables
- See row counts and sizes
- Quick table management links

## Logs

- View audit logs of all admin actions
- Filter by action type (create, update, delete, login)
- Filter by user
- Sort by date
- Track what changed and when

## Settings

- Site name and description
- Theme color configuration
- Social media links
- Contact information
- Analytics scripts
- Custom CSS/JS

## Tips

- Use the theme toggle in the sidebar for dark mode
- The sidebar collapses for more workspace
- All changes are saved immediately via Supabase
- Use the page builder to create reusable page layouts
- Set up SEO for every page before publishing
