<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { user, isLoading, userRoles, initializeAuth } from '$lib/stores/auth';
  import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
  import { Toast, LoadingSpinner } from '$lib/components/ui';

  let { children }: { children: Snippet } = $props();

  let sidebarCollapsed = $state(false);

  onMount(() => {
    initializeAuth();
  });

  let isLoginPage = $derived($page.url.pathname === '/admin/login');

  $effect(() => {
    if (!$isLoading && !$user && !isLoginPage) {
      goto('/admin/login');
    }
  });
</script>

{#if $isLoading && !isLoginPage}
  <div class="flex h-screen w-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
    <LoadingSpinner size="lg" />
  </div>
{:else if isLoginPage}
  {@render children()}
{:else if $user}
  <div class="flex h-screen bg-gray-100 dark:bg-gray-950">
    <AdminSidebar bind:collapsed={sidebarCollapsed} />
    <main class="flex-1 overflow-y-auto p-6">
      {@render children()}
    </main>
  </div>
{/if}

<Toast />
