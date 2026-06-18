<script lang="ts">
  import { Card, Badge } from '$lib/components/ui';
  import { ROLE_PERMISSIONS, type Role, type PermissionName } from '$lib/types';

  const roleDescriptions: Record<Role, string> = {
    super_admin: 'Full access to all features and settings',
    admin: 'Manage pages, media, users, forms, and settings',
    editor: 'Create and edit pages and blog posts',
    seo_manager: 'Manage SEO settings and view pages',
    media_manager: 'Upload and manage media files',
    viewer: 'Read-only access to all content',
    customer: 'Public user with no admin access',
  };

  const allPermissions: { name: PermissionName; label: string }[] = [
    { name: 'view_dashboard', label: 'View Dashboard' },
    { name: 'manage_pages', label: 'Manage Pages' },
    { name: 'manage_navigation', label: 'Manage Navigation' },
    { name: 'manage_footer', label: 'Manage Footer' },
    { name: 'manage_media', label: 'Manage Media' },
    { name: 'manage_blog', label: 'Manage Blog' },
    { name: 'manage_forms', label: 'Manage Forms' },
    { name: 'manage_users', label: 'Manage Users' },
    { name: 'manage_roles', label: 'Manage Roles' },
    { name: 'manage_seo', label: 'Manage SEO' },
    { name: 'manage_database', label: 'Manage Database' },
    { name: 'view_logs', label: 'View Logs' },
    { name: 'manage_settings', label: 'Manage Settings' },
    { name: 'manage_shop', label: 'Manage Shop' },
  ];
</script>

<div class="space-y-6">
  <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Roles & Permissions</h1>

  <div class="grid gap-6 lg:grid-cols-2">
    {#each Object.entries(ROLE_PERMISSIONS) as [role, permissions]}
      <Card>
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{role}</h3>
          <Badge variant={role === 'super_admin' ? 'success' : role === 'admin' ? 'info' : 'default'}>{permissions.length} permissions</Badge>
        </div>
        <p class="mb-4 text-sm text-gray-500">{roleDescriptions[role as Role]}</p>
        <div class="flex flex-wrap gap-2">
          {#each allPermissions as perm}
            <span class="rounded-full px-2 py-1 text-xs {permissions.includes(perm.name) ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'}">
              {perm.label}
            </span>
          {/each}
        </div>
      </Card>
    {/each}
  </div>
</div>
