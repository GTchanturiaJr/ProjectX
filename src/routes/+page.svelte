<script lang="ts">
  import PageRenderer from '$lib/components/public/PageRenderer.svelte';
  import type { Page, PageSection } from '$lib/types';

  let { data } = $props();
  let page = data.page as Page | null;
  let sections = data.sections as PageSection[];
</script>

{#if page}
  <PageRenderer {sections} />
{:else}
  <div class="flex min-h-[60vh] items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Welcome to ProjectX</h1>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Create your first page in the admin panel to get started.</p>
      <a href="/admin/login" class="mt-6 inline-block rounded-[var(--radius)] bg-[rgb(var(--color-primary))] px-6 py-3 text-sm font-medium text-white hover:opacity-90">
        Go to Admin
      </a>
    </div>
  </div>
{/if}
