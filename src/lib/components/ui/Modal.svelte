<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { X } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';
  import type { Snippet } from 'svelte';

  let {
    open = false,
    title = null,
    size = 'md',
    children
  }: {
    open?: boolean;
    title?: string | null;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    children: Snippet;
  } = $props();

  const dispatch = createEventDispatcher();

  const sizeClasses: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  function close() {
    open = false;
    dispatch('close');
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" transition:fade={{ duration: 150 }}>
    <button type="button" class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick={close} aria-label="Close modal"></button>
    <div
      class="relative w-full rounded-[var(--radius)] bg-white shadow-xl dark:bg-gray-900 {sizeClasses[size]}"
      transition:scale={{ duration: 150, start: 0.95 }}
    >
      <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        {#if title}
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        {:else}
          <div></div>
        {/if}
        <button onclick={close} class="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
          <X class="h-5 w-5" />
        </button>
      </div>
      <div class="px-6 py-4">
        {@render children()}
      </div>
    </div>
  </div>
{/if}
