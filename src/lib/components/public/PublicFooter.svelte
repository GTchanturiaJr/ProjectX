<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/config/supabase';
  import type { FooterSection, FooterItem } from '$lib/types';

  let sections: FooterSection[] = [];
  let items: FooterItem[] = [];

  onMount(async () => {
    const { data: s } = await supabase.from('footer_sections').select('*').order('sort_order');
    sections = s as FooterSection[] ?? [];
    const { data: i } = await supabase.from('footer_items').select('*');
    items = i as FooterItem[] ?? [];
  });
</script>

<footer class="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="grid gap-8 md:grid-cols-4">
      <div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">ProjectX</h3>
        <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">A modern website powered by SvelteKit and Supabase.</p>
      </div>

      {#each sections as section}
        <div>
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white">{section.title}</h4>
          <ul class="mt-4 space-y-2">
            {#each items.filter(i => i.section_id === section.id) as item}
              <li>
                <a href={item.url} class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  {item.label}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>

    <div class="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} ProjectX. All rights reserved.
      </p>
    </div>
  </div>
</footer>
