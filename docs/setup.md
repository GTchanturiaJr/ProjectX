# ProjectX Setup Guide

## Prerequisites

- Node.js 18+ and npm
- A Supabase project

## Environment Variables

Copy `.env.example` to `.env` and fill in:

- `PUBLIC_SUPABASE_URL` - Your Supabase URL
- `PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_URL` - Same as above (for server)
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

## Setup Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the initial migration via the Supabase MCP tool or SQL editor.

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Visit `/admin/login` and sign up. The first user will have the `customer` role by default. Use the Supabase SQL editor to assign `super_admin` to yourself:
   ```sql
   INSERT INTO public.user_roles (user_id, role) VALUES ('your-user-id', 'super_admin');
   ```

## Admin Access

- Navigate to `/admin/login`
- Sign in with email/password
- The admin panel loads with role-based sidebar navigation
