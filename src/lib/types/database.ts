// Supabase database types
// Using generic types to avoid strict typing issues with Supabase client

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      user_roles: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      pages: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      page_sections: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      navigation_menus: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      navigation_items: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      footer_sections: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      footer_items: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      media_files: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      media_folders: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      blog_posts: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      blog_categories: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      forms: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      form_fields: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      form_submissions: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      seo_settings: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      site_settings: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      audit_logs: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      products: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
      product_categories: { Row: Record<string, unknown>; Insert: Record<string, unknown>; Update: Record<string, unknown> };
    };
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: Record<string, unknown>;
  };
}
