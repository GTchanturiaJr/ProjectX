<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { TriangleAlert as AlertTriangle } from 'lucide-svelte';
  import Button from './Button.svelte';

  let {
    open = false,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
  }: {
    open?: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary';
  } = $props();

  const dispatch = createEventDispatcher();

  function confirmAction() {
    dispatch('confirm');
    open = false;
  }

  function cancelAction() {
    dispatch('cancel');
    open = false;
  }
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" transition:fade={{ duration: 150 }}>
    <button type="button" class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick={cancelAction} aria-label="Close dialog"></button>
    <div class="relative w-full max-w-sm rounded-[var(--radius)] bg-white p-6 shadow-xl dark:bg-gray-900" transition:scale={{ duration: 150, start: 0.95 }}>
      <div class="flex items-center gap-3 mb-4">
        <div class="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
          <AlertTriangle class="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <p class="mb-6 text-sm text-gray-600 dark:text-gray-300">{message}</p>
      <div class="flex justify-end gap-3">
        <Button variant="ghost" onclick={cancelAction}>{cancelText}</Button>
        <Button variant={variant} onclick={confirmAction}>{confirmText}</Button>
      </div>
    </div>
  </div>
{/if}
