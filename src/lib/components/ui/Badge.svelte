<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    variant = 'default',
    children
  }: {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    children: Snippet;
  } = $props();

  const variantClasses: Record<string, string> = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  };
</script>

<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {variantClasses[variant]}">
  {@render children()}
</span>
