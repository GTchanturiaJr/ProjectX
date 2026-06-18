<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/config/supabase';
  import { Card, Badge } from '$lib/components/ui';
  import { FileText, Users, Image, Mail, Newspaper, Settings, Activity, Search } from 'lucide-svelte';

  let stats = {
    pages: 0,
    users: 0,
    media: 0,
    forms: 0,
    blog: 0,
    seo: 0,
  };
  let recentLogs: { action: string; table_name: string; created_at: string }[] = [];
  let loading = true;

  onMount(async () => {
    const [p, u, m, f, b, s, logs] = await Promise.all([
      supabase.from('pages').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('media_files').select('*', { count: 'exact', head: true }).is('deleted_at', null),
      supabase.from('forms').select('*', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
      supabase.from('seo_settings').select('*', { count: 'exact', head: true }),
      supabase.from('audit_logs').select('action, table_name, created_at').order('created_at', { ascending: false }).limit(10),
    ]);
    stats.pages = p.count ?? 0;
    stats.users = u.count ?? 0;
    stats.media = m.count ?? 0;
    stats.forms = f.count ?? 0;
    stats.blog = b.count ?? 0;
    stats.seo = s.count ?? 0;
    recentLogs = (logs.data as { action: string; table_name: string; created_at: string }[]) ?? [];
    loading = false;
  });
</script>

<div class="space-y-6">
  <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

  {#if loading}
    <p class="text-gray-500">Loading...</p>
  {:else}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="flex items-center gap-4">
        <div class="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
          <FileText class="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p class="text-sm text-gray-500">Pages</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{stats.pages}</p>
        </div>
      </Card>

      <Card className="flex items-center gap-4">
        <div class="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
          <Users class="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <p class="text-sm text-gray-500">Users</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{stats.users}</p>
        </div>
      </Card>

      <Card className="flex items-center gap-4">
        <div class="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
          <Image class="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <p class="text-sm text-gray-500">Media Files</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{stats.media}</p>
        </div>
      </Card>

      <Card className="flex items-center gap-4">
        <div class="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
          <Mail class="h-6 w-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <p class="text-sm text-gray-500">Forms</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{stats.forms}</p>
        </div>
      </Card>

      <Card className="flex items-center gap-4">
        <div class="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
          <Newspaper class="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <p class="text-sm text-gray-500">Blog Posts</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{stats.blog}</p>
        </div>
      </Card>

      <Card className="flex items-center gap-4">
        <div class="rounded-full bg-teal-100 p-3 dark:bg-teal-900/30">
          <Search class="h-6 w-6 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <p class="text-sm text-gray-500">SEO Settings</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{stats.seo}</p>
        </div>
      </Card>
    </div>

    <Card title="Recent Activity">
      {#if recentLogs.length === 0}
        <p class="text-gray-500">No recent activity</p>
      {:else}
        <div class="space-y-3">
          {#each recentLogs as log}
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <Badge variant={log.action === 'create' ? 'success' : log.action === 'delete' ? 'error' : 'info'}>{log.action}</Badge>
                <span class="text-gray-700 dark:text-gray-300">{log.table_name}</span>
              </div>
              <span class="text-gray-500">{new Date(log.created_at).toLocaleString()}</span>
            </div>
          {/each}
        </div>
      {/if}
    </Card>
  {/if}
</div>
