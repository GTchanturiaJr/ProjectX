# ProjectX Database Schema

## Overview

All tables use Row Level Security (RLS) with policies for authenticated users. The `audit_log` trigger records all insert/update/delete operations.

## Tables

### `profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, references auth.users |
| email | text | |
| full_name | text | nullable |
| avatar_url | text | nullable |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### `user_roles`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | references profiles.id |
| role | text | enum: super_admin, admin, editor, seo_manager, media_manager, viewer, customer |
| created_at | timestamptz | default now() |

### `pages`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| title | text | |
| slug | text | unique |
| description | text | nullable |
| published | boolean | default false |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### `page_sections`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| page_id | uuid | references pages.id |
| component_type | text | hero, text, features, image, gallery, video, cta, testimonial, pricing, faq, team, stats, contact, form, products, blog, newsletter, custom |
| content | jsonb | component-specific data |
| sort_order | integer | default 0 |
| visible | boolean | default true |
| variant | text | nullable |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### `navigation_menus`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | |
| location | text | navbar, footer, sidebar |
| created_at | timestamptz | default now() |

### `navigation_items`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| menu_id | uuid | references navigation_menus.id |
| label | text | |
| url | text | |
| sort_order | integer | default 0 |
| visible | boolean | default true |
| created_at | timestamptz | default now() |

### `footer_sections`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| title | text | |
| sort_order | integer | default 0 |
| created_at | timestamptz | default now() |

### `footer_items`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| section_id | uuid | references footer_sections.id |
| label | text | |
| url | text | |
| icon | text | Lucide icon name, nullable |
| sort_order | integer | default 0 |
| created_at | timestamptz | default now() |

### `media_files`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | |
| path | text | Storage path |
| url | text | Public URL |
| size | integer | bytes |
| mime_type | text | |
| folder_id | uuid | nullable, references media_folders.id |
| alt_text | text | nullable |
| deleted_at | timestamptz | nullable (soft delete) |
| created_at | timestamptz | default now() |

### `media_folders`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | |
| parent_id | uuid | nullable, self-referencing |
| created_at | timestamptz | default now() |

### `blog_posts`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| title | text | |
| slug | text | unique |
| content | text | HTML/Markdown |
| excerpt | text | nullable |
| cover_image | text | nullable |
| category_id | uuid | nullable |
| author_id | uuid | nullable |
| published | boolean | default false |
| published_at | timestamptz | nullable |
| meta_title | text | nullable |
| meta_description | text | nullable |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### `blog_categories`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | |
| slug | text | unique |
| created_at | timestamptz | default now() |

### `forms`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | |
| slug | text | unique |
| description | text | nullable |
| created_at | timestamptz | default now() |

### `form_fields`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| form_id | uuid | references forms.id |
| label | text | |
| field_type | text | text, email, textarea, number, select, checkbox, radio, date |
| required | boolean | default false |
| options | text | nullable, comma-separated |
| sort_order | integer | default 0 |
| created_at | timestamptz | default now() |

### `form_submissions`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| form_id | uuid | references forms.id |
| data | jsonb | submitted field values |
| spam_score | integer | default 0 |
| created_at | timestamptz | default now() |

### `seo_settings`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| page_id | uuid | nullable |
| global | boolean | default false |
| meta_title | text | nullable |
| meta_description | text | nullable |
| meta_keywords | text | nullable |
| og_image | text | nullable |
| robots | text | default 'index,follow' |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### `site_settings`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| key | text | unique |
| value | text | nullable |
| type | text | default 'string' |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### `audit_logs`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | nullable |
| action | text | create, update, delete, login |
| table_name | text | |
| record_id | text | |
| old_data | jsonb | nullable |
| new_data | jsonb | nullable |
| created_at | timestamptz | default now() |

## RLS Policies

All tables have `ENABLE ROW LEVEL SECURITY`. Each table has SELECT, INSERT, UPDATE, DELETE policies for the `authenticated` role, using `auth.uid()` for ownership checks where applicable.

## Triggers

- `audit_log`: Fires on all tables (except audit_logs) to record changes to `audit_logs`.
- `update_profiles_updated_at`: Updates `updated_at` on profile changes.

## Default Data

The migration seeds initial `site_settings` for site name, description, and primary color.
