<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/config/supabase';
  import { Card, Badge } from '$lib/components/ui';
  import { Database, Table, FileText, Users, Image, Mail } from 'lucide-svelte';

  interface TableInfo {
    name: string;
    count: number;
    icon: typeof Database;
    color: string;
  }

  let tables: TableInfo[] = [];
  let loading = true;

  async function load() {
    const tableConfigs = [
      { name: 'pages', icon: FileText, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
      { name: 'page_sections', icon: FileText, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
      { name: 'profiles', icon: Users, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
      { name: 'user_roles', icon: Users, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
      { name: 'media_files', icon: Image, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
      { name: 'media_folders', icon: Image, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
      { name: 'blog_posts', icon: FileText, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
      { name: 'forms', icon: Mail, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
      { name: 'form_submissions', icon: Mail, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
      { name: 'seo_settings', icon: Database, color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' },
      { name: 'audit_logs', icon: Database, color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
    ];

    const results = await Promise.all(
      tableConfigs.map(async t => {
        const { count } = await supabase.from(t.name).select('*', { count: 'exact', head: true });
        return { name: t.name, count: count ?? 0, icon: t.icon, color: t.color };
      })
    );
    tables = results;
    loading = false;
  }

  onMount(load);
</script>

<div class="space-y-6">
  <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Database Overview</h1>

  {#if loading}
    <p class="text-gray-500">Loading...</p>
  {:else}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each tables as table}
        <Card className="flex items-center gap-4">
          <div class="rounded-full p-3 {table.color}">
            <svelte:component this={table.icon} class="h-6 w-6" />
          </div>
          <div>
            <p class="text-sm text-gray-500">{table.name}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{table.count}</p>
          </div>
        </Card>
      {/each}
    </div>

    <Card title="Database Notes">
      <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        <p>All tables use Row Level Security (RLS) for access control.</p>
        <p>Audit logs track all create, update, and delete operations.</p>
        <p>Soft deletes are used for media files to allow recovery.</p>
        <p>Use the Supabase dashboard for advanced database operations.</p>
      </div>
    </Card>
  {/if}
</div>
