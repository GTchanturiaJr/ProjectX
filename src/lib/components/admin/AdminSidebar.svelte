<script lang="ts">
  import { page } from '$app/stores';
  import { userRoles, isAdmin } from '$lib/stores/auth';
  import { hasPermission } from '$lib/utils/permissions';
  import { ThemeToggle } from '$lib/components/ui';
  import {
    LayoutDashboard, FileText, Image, Users, Shield, Search, Settings,
    ClipboardList, FormInput, Newspaper, ShoppingBag, Database, LogOut,
    Menu, ChevronRight, ChevronLeft, Navigation, Rows3
  } from 'lucide-svelte';
  import type { PermissionName } from '$lib/types';

  let { collapsed = false }: { collapsed?: boolean } = $props();

  interface NavItem {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
    permission: PermissionName;
  }

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, permission: 'view_dashboard' },
    { label: 'Pages', href: '/admin/pages', icon: FileText, permission: 'manage_pages' },
    { label: 'Navigation', href: '/admin/navigation', icon: Navigation, permission: 'manage_navigation' },
    { label: 'Footer', href: '/admin/footer', icon: Rows3, permission: 'manage_footer' },
    { label: 'Media', href: '/admin/media', icon: Image, permission: 'manage_media' },
    { label: 'Blog', href: '/admin/blog', icon: Newspaper, permission: 'manage_blog' },
    { label: 'Forms', href: '/admin/forms', icon: FormInput, permission: 'manage_forms' },
    { label: 'Users', href: '/admin/users', icon: Users, permission: 'manage_users' },
    { label: 'Roles', href: '/admin/roles', icon: Shield, permission: 'manage_roles' },
    { label: 'SEO', href: '/admin/seo', icon: Search, permission: 'manage_seo' },
    { label: 'Database', href: '/admin/database', icon: Database, permission: 'manage_database' },
    { label: 'Logs', href: '/admin/logs', icon: ClipboardList, permission: 'view_logs' },
    { label: 'Settings', href: '/admin/settings', icon: Settings, permission: 'manage_settings' },
  ];

  let visibleItems = $derived(navItems.filter(item => hasPermission($userRoles, item.permission)));
  let isShopEnabled = $state(false);

  async function logout() {
    const { supabase } = await import('$lib/config/supabase');
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  }
</script>

<aside class="flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-700 dark:bg-gray-900 {collapsed ? 'w-16' : 'w-64'}">
  <div class="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
    {#if !collapsed}
      <span class="text-lg font-bold text-[rgb(var(--color-primary))]">ProjectX</span>
    {/if}
    <button onclick={() => collapsed = !collapsed} class="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
      {#if collapsed}
        <ChevronRight class="h-5 w-5" />
      {:else}
        <ChevronLeft class="h-5 w-5" />
      {/if}
    </button>
  </div>

  <nav class="flex-1 overflow-y-auto py-4">
    <ul class="space-y-1 px-2">
      {#each visibleItems as item}
        <li>
          <a
            href={item.href}
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors {$page.url.pathname === item.href || $page.url.pathname.startsWith(item.href + '/') ? 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'}"
          >
            <svelte:component this={item.icon} class="h-5 w-5 shrink-0" />
            {#if !collapsed}
              <span>{item.label}</span>
            {/if}
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  <div class="border-t border-gray-200 p-4 dark:border-gray-700">
    <div class="mb-3 flex items-center gap-3">
      {#if !collapsed}
        <ThemeToggle />
      {:else}
        <button class="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" title="Toggle theme">
          <Menu class="h-5 w-5" />
        </button>
      {/if}
    </div>
    <button
      onclick={logout}
      class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      <LogOut class="h-5 w-5 shrink-0" />
      {#if !collapsed}
        <span>Logout</span>
      {/if}
    </button>
  </div>
</aside>
