<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/config/supabase';
  import { addToast } from '$lib/stores/toast';
  import type { FormField } from '$lib/types';

  let { content }: { content: Record<string, unknown> } = $props();
  let heading = $derived((content.heading as string) ?? '');
  let formId = $derived((content.formId as string) ?? '');
  let successMessage = $derived((content.successMessage as string) ?? 'Thank you! We will be in touch soon.');
  let className = $derived((content.className as string) ?? '');
  let id = $derived((content.id as string) ?? '');

  let fields: FormField[] = $state([]);
  let values: Record<string, string> = $state({});
  let submitted = $state(false);
  let loading = $state(false);

  onMount(async () => {
    if (formId) {
      const { data } = await supabase.from('form_fields').select('*').eq('form_id', formId).order('sort_order');
      fields = data as FormField[] ?? [];
    }
  });

  async function submit() {
    loading = true;
    const { error } = await supabase.from('form_submissions').insert({
      form_id: formId,
      data: values,
      spam_score: 0,
    });
    loading = false;
    if (error) addToast(error.message, 'error');
    else { submitted = true; addToast('Submitted!', 'success'); }
  }
</script>

<section {id} class="w-full {className}">
  {#if heading}
    <h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-white">{heading}</h2>
  {/if}
  {#if submitted}
    <div class="rounded-[var(--radius)] bg-green-50 p-6 text-center dark:bg-green-900/20">
      <p class="text-green-800 dark:text-green-300">{successMessage}</p>
    </div>
  {:else}
    <form onsubmit={(e) => { e.preventDefault(); submit(); }} class="space-y-4">
      {#each fields as field, i}
        <div>
          <label for="field-{i}" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}{#if field.required}<span class="text-red-500">*</span>{/if}
          </label>
          {#if field.field_type === 'textarea'}
            <textarea id="field-{i}" bind:value={values[field.label]} required={field.required} rows={4} class="w-full rounded-[var(--radius)] border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"></textarea>
          {:else if field.field_type === 'select'}
            <select id="field-{i}" bind:value={values[field.label]} required={field.required} class="w-full rounded-[var(--radius)] border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">
              {#each (field.options ?? []) as opt}
                <option value={opt}>{opt}</option>
              {/each}
            </select>
          {:else if field.field_type === 'checkbox'}
            <div class="flex items-center gap-2">
              <input id="field-{i}" type="checkbox" bind:checked={values[field.label]} required={field.required} class="rounded text-[rgb(var(--color-primary))]" />
              <span class="text-sm text-gray-600 dark:text-gray-300">Yes</span>
            </div>
          {:else}
            <input id="field-{i}" type={field.field_type} bind:value={values[field.label]} required={field.required} class="w-full rounded-[var(--radius)] border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
          {/if}
        </div>
      {/each}
      <button type="submit" disabled={loading} class="rounded-[var(--radius)] bg-[rgb(var(--color-primary))] px-6 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
        {loading ? 'Sending...' : 'Submit'}
      </button>
    </form>
  {/if}
</section>
