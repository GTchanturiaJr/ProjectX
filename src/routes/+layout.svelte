<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import '../app.css';
  import PublicNav from '$lib/components/public/PublicNav.svelte';
  import PublicFooter from '$lib/components/public/PublicFooter.svelte';
  import { Toast } from '$lib/components/ui';
  import { page } from '$app/stores';

  let { children }: { children: Snippet } = $props();

  onMount(() => {
    const theme = localStorage.getItem('theme') || 'system';
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  });

  let isAdminRoute = $derived($page.url.pathname.startsWith('/admin'));
</script>

<div class="flex min-h-screen flex-col bg-white dark:bg-gray-950">
  {#if !isAdminRoute}
    <PublicNav />
  {/if}
  <main class="flex-1">
    {@render children()}
  </main>
  {#if !isAdminRoute}
    <PublicFooter />
  {/if}
</div>
<Toast />
