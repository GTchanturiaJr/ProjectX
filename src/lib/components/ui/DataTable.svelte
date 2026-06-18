<script lang="ts">
  import type { Snippet } from 'svelte';
  import { ArrowUp, ArrowDown } from 'lucide-svelte';

  interface Column {
    key: string;
    label: string;
    sortable?: boolean;
  }

  let {
    columns = [],
    rows = [],
    loading = false,
    emptyMessage = 'No data found',
    children
  }: {
    columns?: Column[];
    rows?: Record<string, unknown>[];
    loading?: boolean;
    emptyMessage?: string;
    children: Snippet<[{ col: Column; row: Record<string, unknown> }]>;
  } = $props();

  let sortKey = $state('');
  let sortDir: 'asc' | 'desc' = $state('asc');

  function sortBy(key: string) {
    if (sortKey === key) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = key;
      sortDir = 'asc';
    }
  }

  let sortedRows = $derived(sortKey
    ? [...rows].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp = String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : rows);
</script>

<div class="overflow-x-auto rounded-[var(--radius)] border border-gray-200 dark:border-gray-700">
  <table class="w-full text-sm">
    <thead class="bg-gray-50 dark:bg-gray-800">
      <tr>
        {#each columns as col}
          <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
            {#if col.sortable}
              <button onclick={() => sortBy(col.key)} class="inline-flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                {col.label}
                {#if sortKey === col.key}
                  {#if sortDir === 'asc'}<ArrowUp class="h-3 w-3" />{:else}<ArrowDown class="h-3 w-3" />{/if}
                {/if}
              </button>
            {:else}
              {col.label}
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
      {#if loading}
        <tr>
          <td colspan={columns.length} class="px-4 py-8 text-center text-gray-500">
            Loading...
          </td>
        </tr>
      {:else if sortedRows.length === 0}
        <tr>
          <td colspan={columns.length} class="px-4 py-8 text-center text-gray-500">
            {emptyMessage}
          </td>
        </tr>
      {:else}
        {#each sortedRows as row (row.id as string)}
          <tr class="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
            {#each columns as col}
              <td class="px-4 py-3 text-gray-900 dark:text-white">
                {@render children({ col, row })}
              </td>
            {/each}
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>
