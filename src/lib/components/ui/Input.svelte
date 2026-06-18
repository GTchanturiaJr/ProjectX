<script lang="ts">
  let {
    label = null,
    name = null,
    type = 'text',
    value = '',
    placeholder = '',
    required = false,
    disabled = false,
    error = null,
    rows = null
  }: {
    label?: string | null;
    name?: string | null;
    type?: string;
    value?: string | number | null | boolean;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string | null;
    rows?: number | null;
  } = $props();

  const base = 'w-full rounded-[var(--radius)] border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent';
  const normal = 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white';
  const err = 'border-red-500 bg-red-50 text-red-900 placeholder-red-400 focus:ring-red-500 dark:bg-red-900/20 dark:border-red-500';
  let cls = $derived(`${base} ${error ? err : normal}`);
</script>

<div class="w-full">
  {#if label}
    <label for={name ?? undefined} class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}{#if required}<span class="text-red-500">*</span>{/if}
    </label>
  {/if}
  {#if type === 'checkbox'}
    <label class="inline-flex items-center gap-2">
      <input type="checkbox" {name} checked={value as boolean} {disabled} class="rounded text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))]" onchange={(e) => value = (e.target as HTMLInputElement).checked} />
      <span class="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    </label>
  {:else if rows}
    <textarea {name} {placeholder} {required} {disabled} {rows} class={cls} bind:value></textarea>
  {:else}
    <input {type} {name} {placeholder} {required} {disabled} class={cls} bind:value />
  {/if}
  {#if error}
    <p class="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
  {/if}
</div>
