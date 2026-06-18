<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/config/supabase';
  import { addToast } from '$lib/stores/toast';
  import type { FormField } from '$lib/types';

  let { data } = $props();
  let fields = data.fields as FormField[];
  let values: Record<string, string> = {};
  let submitted = false;
  let loading = false;

  async function submit() {
    loading = true;
    const { error } = await supabase.from('form_submissions').insert({
      form_id: data.form?.id,
      data: values,
      spam_score: 0,
    });
    loading = false;
    if (error) addToast(error.message, 'error');
    else { submitted = true; addToast('Thank you!', 'success'); }
  }
</script>

<div class="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Contact Us</h1>

  {#if submitted}
    <div class="mt-8 rounded-[var(--radius)] bg-green-50 p-6 text-center dark:bg-green-900/20">
      <p class="text-green-800 dark:text-green-300">Thank you! We will be in touch soon.</p>
    </div>
  {:else}
    <form on:submit|preventDefault={submit} class="mt-8 space-y-4">
      {#each fields as field}
        <div>
          <label for="field-{field.id}" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}{#if field.required}<span class="text-red-500">*</span>{/if}
          </label>
          {#if field.field_type === 'textarea'}
            <textarea id="field-{field.id}" bind:value={values[field.label]} required={field.required} rows={4} class="w-full rounded-[var(--radius)] border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"></textarea>
          {:else if field.field_type === 'select'}
            <select id="field-{field.id}" bind:value={values[field.label]} required={field.required} class="w-full rounded-[var(--radius)] border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white">
              {#each (field.options ?? []) as opt}
                <option value={opt}>{opt}</option>
              {/each}
            </select>
          {:else}
            <input id="field-{field.id}" type={field.field_type} bind:value={values[field.label]} required={field.required} class="w-full rounded-[var(--radius)] border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
          {/if}
        </div>
      {/each}

      {#if fields.length > 0}
        <button type="submit" disabled={loading} class="rounded-[var(--radius)] bg-[rgb(var(--color-primary))] px-6 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      {:else}
        <p class="text-gray-500">No contact form configured. Create one in the admin panel.</p>
      {/if}
    </form>
  {/if}
</div>
