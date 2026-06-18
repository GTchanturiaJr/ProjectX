// Core types for the CMS

export type Role = 'super_admin' | 'admin' | 'editor' | 'seo_manager' | 'media_manager' | 'viewer' | 'customer';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: Role;
  created_at: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PageSection {
  id: string;
  page_id: string;
  component_type: ComponentType;
  content: Record<string, unknown>;
  sort_order: number;
  visible: boolean;
  variant: string | null;
  created_at: string;
  updated_at: string;
}

export type ComponentType =
  | 'hero'
  | 'text'
  | 'features'
  | 'image'
  | 'gallery'
  | 'video'
  | 'cta'
  | 'testimonial'
  | 'pricing'
  | 'faq'
  | 'team'
  | 'stats'
  | 'contact'
  | 'form'
  | 'products'
  | 'blog'
  | 'newsletter'
  | 'custom';

export interface NavigationMenu {
  id: string;
  name: string;
  location: 'navbar' | 'footer' | 'sidebar';
  created_at: string;
}

export interface NavigationItem {
  id: string;
  menu_id: string;
  label: string;
  url: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
}

export interface FooterSection {
  id: string;
  title: string;
  sort_order: number;
  created_at: string;
}

export interface FooterItem {
  id: string;
  section_id: string;
  label: string;
  url: string;
  icon: string | null;
  sort_order: number;
  created_at: string;
}

export interface MediaFile {
  id: string;
  name: string;
  path: string;
  url: string;
  size: number;
  mime_type: string;
  folder_id: string | null;
  alt_text: string | null;
  deleted_at: string | null;
  created_at: string;
}

export interface MediaFolder {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  category_id: string | null;
  author_id: string | null;
  published: boolean;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Form {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface FormField {
  id: string;
  form_id: string;
  label: string;
  field_type: 'text' | 'email' | 'textarea' | 'number' | 'select' | 'checkbox' | 'radio' | 'date';
  required: boolean;
  options: string | null;
  sort_order: number;
  created_at: string;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  data: Record<string, unknown>;
  spam_score: number;
  created_at: string;
}

export interface SEOSetting {
  id: string;
  page_id: string | null;
  global: boolean;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_image: string | null;
  robots: string;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: 'create' | 'update' | 'delete' | 'login';
  table_name: string;
  record_id: string;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  image: string | null;
  images: string[] | null;
  category_id: string | null;
  stock: number;
  published: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

// Permission definitions
export type PermissionName =
  | 'view_dashboard'
  | 'manage_pages'
  | 'manage_navigation'
  | 'manage_footer'
  | 'manage_media'
  | 'manage_blog'
  | 'manage_forms'
  | 'manage_users'
  | 'manage_roles'
  | 'manage_seo'
  | 'manage_database'
  | 'view_logs'
  | 'manage_settings'
  | 'manage_shop';

export const ROLE_PERMISSIONS: Record<Role, PermissionName[]> = {
  super_admin: [
    'view_dashboard', 'manage_pages', 'manage_navigation', 'manage_footer',
    'manage_media', 'manage_blog', 'manage_forms', 'manage_users',
    'manage_roles', 'manage_seo', 'manage_database', 'view_logs',
    'manage_settings', 'manage_shop'
  ],
  admin: [
    'view_dashboard', 'manage_pages', 'manage_navigation', 'manage_footer',
    'manage_media', 'manage_blog', 'manage_forms', 'manage_users',
    'manage_seo', 'manage_settings'
  ],
  editor: [
    'view_dashboard', 'manage_pages', 'manage_blog', 'manage_media'
  ],
  seo_manager: [
    'view_dashboard', 'manage_seo', 'manage_pages'
  ],
  media_manager: [
    'view_dashboard', 'manage_media'
  ],
  viewer: [
    'view_dashboard'
  ],
  customer: []
};

export const COMPONENT_TYPES = [
  { type: 'hero', label: 'Hero Section' },
  { type: 'text', label: 'Text Content' },
  { type: 'features', label: 'Feature Grid' },
  { type: 'image', label: 'Image' },
  { type: 'gallery', label: 'Image Gallery' },
  { type: 'video', label: 'Video Embed' },
  { type: 'cta', label: 'Call to Action' },
  { type: 'testimonial', label: 'Testimonial' },
  { type: 'pricing', label: 'Pricing Table' },
  { type: 'faq', label: 'FAQ Section' },
  { type: 'team', label: 'Team Members' },
  { type: 'stats', label: 'Statistics' },
  { type: 'contact', label: 'Contact Form' },
  { type: 'form', label: 'Custom Form' },
  { type: 'products', label: 'Product Grid' },
  { type: 'blog', label: 'Blog Posts' },
  { type: 'newsletter', label: 'Newsletter Signup' },
  { type: 'custom', label: 'Custom HTML' }
];
