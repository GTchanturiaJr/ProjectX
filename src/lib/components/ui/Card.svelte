<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title = null,
    className = '',
    children
  }: {
    title?: string | null;
    className?: string;
    children: Snippet;
  } = $props();
</script>

<div class="rounded-[var(--radius)] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 {className}">
  {#if title}
    <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
  {/if}
  {@render children()}
</div>
