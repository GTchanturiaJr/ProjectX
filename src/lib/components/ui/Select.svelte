<script lang="ts">
  let {
    label = null,
    name = null,
    value = '',
    options = [],
    required = false,
    disabled = false,
    placeholder = 'Select...'
  }: {
    label?: string | null;
    name?: string | null;
    value?: string | number;
    options?: { value: string | number; label: string }[];
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
  } = $props();

  const cls = 'w-full rounded-[var(--radius)] border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] dark:border-gray-600 dark:bg-gray-800 dark:text-white';
</script>

<div class="w-full">
  {#if label}
    <label for={name ?? undefined} class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
  {/if}
  <select bind:value {required} {disabled} class={cls}>
    <option value="" disabled hidden>{placeholder}</option>
    {#each options as opt}
      <option value={opt.value}>{opt.label}</option>
    {/each}
  </select>
</div>
