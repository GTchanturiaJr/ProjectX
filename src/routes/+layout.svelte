<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.css';
  import PublicNav from '$lib/components/public/PublicNav.svelte';
  import PublicFooter from '$lib/components/public/PublicFooter.svelte';
  import { Toast } from '$lib/components/ui';
  import { page } from '$app/stores';

  let mounted = $state(false);

  onMount(() => {
    mounted = true;
    const theme = localStorage.getItem('theme') || 'system';
    applyTheme(theme);
  });

  function applyTheme(t: string) {
    const isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  }

  let isAdminRoute = $derived($page.url.pathname.startsWith('/admin'));
</script>

{#if mounted}
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
{:else}
  <div class="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
    <div class="animate-pulse text-gray-400">Loading...</div>
  </div>
{/if}
