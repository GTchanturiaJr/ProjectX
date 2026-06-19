<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/config/supabase';
  import type { FooterSection, FooterItem } from '$lib/types';

  let sections: FooterSection[] = $state([]);
  let items: FooterItem[] = $state([]);

  onMount(async () => {
    const { data: s } = await supabase.from('footer_sections').select('*').order('sort_order');
    sections = (s as FooterSection[]) ?? [];
    const { data: i } = await supabase.from('footer_items').select('*');
    items = (i as FooterItem[]) ?? [];
  });
</script>

<footer class="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
  <div class="container py-16">
    <div class="grid gap-12 lg:grid-cols-4">
      <!-- Brand col -->
      <div class="lg:col-span-1">
        <a href="/" class="mb-4 flex items-center gap-2.5 font-extrabold text-gray-900 dark:text-white">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-black">P</div>
          <span class="text-lg tracking-tight">ProjectX</span>
        </a>
        <p class="mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-500">
          A modern, production-ready CMS template built with SvelteKit 5 and Supabase.
        </p>
        <div class="mt-6 flex gap-3">
          {#each [['GitHub','M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'], ['Twitter / X','M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z']] as [title, path]}
            <a href="/" aria-label={title} class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:text-gray-500 dark:hover:border-gray-500 dark:hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={path}/></svg>
            </a>
          {/each}
        </div>
      </div>

      <!-- Link columns -->
      {#if sections.length > 0}
        {#each sections as section}
          <div>
            <h4 class="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              {section.title}
            </h4>
            <ul class="space-y-2.5">
              {#each items.filter(i => i.section_id === section.id) as item}
                <li>
                  <a href={item.url} class="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    {item.label}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      {:else}
        <!-- Default links when DB has no footer items yet -->
        {#each [['Product',['Features','Blog','Contact','Admin']],['Legal',['Privacy Policy','Terms of Service']]] as [title, links]}
          <div>
            <h4 class="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">{title}</h4>
            <ul class="space-y-2.5">
              {#each links as link}
                <li>
                  <span class="text-sm text-gray-500 dark:text-gray-500">{link}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      {/if}
    </div>

    <div class="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
      <p class="text-center text-sm text-gray-500 dark:text-gray-600">
        &copy; {new Date().getFullYear()} ProjectX. Built with SvelteKit &amp; Supabase.
      </p>
    </div>
  </div>
</footer>
