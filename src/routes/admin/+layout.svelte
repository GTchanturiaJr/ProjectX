<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { user, isLoading, userRoles, initializeAuth } from '$lib/stores/auth';
  import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
  import { Toast } from '$lib/components/ui';
  import { LoadingSpinner } from '$lib/components/ui';

  let sidebarCollapsed = $state(false);
  let ready = $state(false);

  onMount(() => {
    initializeAuth();
  });

  $effect(() => {
    if (!$isLoading && !$user) {
      goto('/admin/login');
    }
  });

  $effect(() => {
    if (!$isLoading && $user && $userRoles.length === 0) {
      goto('/');
    }
  });

  $effect(() => {
    if (!$isLoading && $user && $userRoles.length > 0) {
      ready = true;
    }
  });
</script>

{#if $isLoading || !ready}
  <div class="flex h-screen w-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
    <LoadingSpinner size="lg" />
  </div>
{:else}
  <div class="flex h-screen bg-gray-100 dark:bg-gray-950">
    <AdminSidebar bind:collapsed={sidebarCollapsed} />
    <main class="flex-1 overflow-y-auto p-6">
      {@render children()}
    </main>
  </div>
{/if}

<Toast />
