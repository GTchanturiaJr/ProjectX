<script lang="ts">
  import { FileX } from 'lucide-svelte';

  let {
    title = 'No data',
    description = ''
  }: {
    title?: string;
    description?: string;
  } = $props();
</script>

<div class="flex flex-col items-center justify-center py-12 text-center">
  <FileX class="h-12 w-12 text-gray-400" />
  <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
  {#if description}
    <p class="mt-2 text-sm text-gray-500">{description}</p>
  {/if}
</div>
