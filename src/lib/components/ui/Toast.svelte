<script lang="ts">
  import { fade } from 'svelte/transition';
  import { X, CircleCheck as CheckCircle, CircleAlert as AlertCircle, TriangleAlert as AlertTriangle, Info } from 'lucide-svelte';
  import { toasts, removeToast } from '$lib/stores/toast';

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    error: 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    warning: 'bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    info: 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  };
</script>

<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
  {#each $toasts as toast (toast.id)}
    <div
      class="flex items-center gap-3 rounded-[var(--radius)] px-4 py-3 shadow-lg {colors[toast.type]}"
      transition:fade={{ duration: 150 }}
    >
      <svelte:component this={icons[toast.type]} class="h-5 w-5" />
      <span class="text-sm font-medium">{toast.message}</span>
      <button on:click={() => removeToast(toast.id)} class="ml-2 hover:opacity-70">
        <X class="h-4 w-4" />
      </button>
    </div>
  {/each}
</div>
