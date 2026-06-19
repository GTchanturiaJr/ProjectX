<script lang="ts">
  import { page } from '$app/stores';
  import { userRoles } from '$lib/stores/auth';
  import { hasPermission } from '$lib/utils/permissions';
  import { ThemeToggle } from '$lib/components/ui';
  import {
    LayoutDashboard, FileText, Image, Users, Shield, Search,
    Settings, ClipboardList, Newspaper, Database, LogOut,
    ChevronRight, ChevronLeft, Navigation, Rows3,
    FolderInput as FormInput
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
    { label: 'Dashboard',  href: '/admin/dashboard',  icon: LayoutDashboard, permission: 'view_dashboard' },
    { label: 'Pages',      href: '/admin/pages',      icon: FileText,        permission: 'manage_pages' },
    { label: 'Navigation', href: '/admin/navigation', icon: Navigation,      permission: 'manage_navigation' },
    { label: 'Footer',     href: '/admin/footer',     icon: Rows3,           permission: 'manage_footer' },
    { label: 'Media',      href: '/admin/media',      icon: Image,           permission: 'manage_media' },
    { label: 'Blog',       href: '/admin/blog',       icon: Newspaper,       permission: 'manage_blog' },
    { label: 'Forms',      href: '/admin/forms',      icon: FormInput,       permission: 'manage_forms' },
    { label: 'Users',      href: '/admin/users',      icon: Users,           permission: 'manage_users' },
    { label: 'Roles',      href: '/admin/roles',      icon: Shield,          permission: 'manage_roles' },
    { label: 'SEO',        href: '/admin/seo',        icon: Search,          permission: 'manage_seo' },
    { label: 'Database',   href: '/admin/database',   icon: Database,        permission: 'manage_database' },
    { label: 'Logs',       href: '/admin/logs',       icon: ClipboardList,   permission: 'view_logs' },
    { label: 'Settings',   href: '/admin/settings',   icon: Settings,        permission: 'manage_settings' },
  ];

  let visibleItems = $derived(navItems.filter(item => hasPermission($userRoles, item.permission)));

  function isActive(href: string) {
    return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
  }

  async function logout() {
    const { supabase } = await import('$lib/config/supabase');
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  }
</script>

<aside
  class="flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-950 {collapsed ? 'w-16' : 'w-60'}"
>
  <!-- Header -->
  <div class="flex h-14 items-center justify-between border-b border-gray-100 dark:border-gray-800 {collapsed ? 'px-3' : 'px-4'}">
    {#if !collapsed}
      <a href="/" class="flex items-center gap-2 font-extrabold text-gray-900 dark:text-white">
        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-black">P</div>
        <span class="tracking-tight">ProjectX</span>
      </a>
    {:else}
      <a href="/" class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-black mx-auto">P</a>
    {/if}
    <button
      onclick={() => collapsed = !collapsed}
      class="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 {collapsed ? 'mx-auto mt-0' : ''}"
      aria-label="Toggle sidebar"
    >
      {#if collapsed}
        <ChevronRight class="h-4 w-4" />
      {:else}
        <ChevronLeft class="h-4 w-4" />
      {/if}
    </button>
  </div>

  <!-- Navigation -->
  <nav class="flex-1 overflow-y-auto py-3">
    <ul class="space-y-0.5 px-2">
      {#each visibleItems as item}
        <li>
          <a
            href={item.href}
            class="sidebar-link {isActive(item.href) ? 'active' : ''} {collapsed ? 'justify-center px-2' : ''}"
            title={collapsed ? item.label : undefined}
          >
            <svelte:component this={item.icon} class="h-[18px] w-[18px] shrink-0" />
            {#if !collapsed}
              <span>{item.label}</span>
            {/if}
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  <!-- Footer -->
  <div class="border-t border-gray-100 p-3 dark:border-gray-800">
    <div class="flex items-center {collapsed ? 'justify-center' : 'gap-2'} mb-2">
      <ThemeToggle />
    </div>
    <button
      onclick={logout}
      class="sidebar-link w-full {collapsed ? 'justify-center px-2' : ''}"
      title={collapsed ? 'Logout' : undefined}
    >
      <LogOut class="h-[18px] w-[18px] shrink-0" />
      {#if !collapsed}
        <span>Logout</span>
      {/if}
    </button>
  </div>
</aside>
