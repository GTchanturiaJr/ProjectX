<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/config/supabase';
  import { Menu, X } from 'lucide-svelte';
  import type { NavigationItem } from '$lib/types';

  let items: NavigationItem[] = $state([]);
  let mobileOpen = $state(false);

  onMount(async () => {
    const { data: m } = await supabase.from('navigation_menus').select('id').eq('location', 'navbar').single();
    if (m) {
      const { data: i } = await supabase.from('navigation_items').select('*').eq('menu_id', m.id).eq('visible', true).order('sort_order');
      items = (i as NavigationItem[]) ?? [];
    }
  });
</script>

<nav class="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
  <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <a href="/" class="text-xl font-bold text-[rgb(var(--color-primary))]">
      ProjectX
    </a>

    <div class="hidden items-center gap-6 md:flex">
      {#each items as item}
        <a href={item.url} class="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
          {item.label}
        </a>
      {/each}
    </div>

    <button onclick={() => mobileOpen = !mobileOpen} class="rounded-md p-2 text-gray-600 md:hidden dark:text-gray-400">
      {#if mobileOpen}
        <X class="h-6 w-6" />
      {:else}
        <Menu class="h-6 w-6" />
      {/if}
    </button>
  </div>

  {#if mobileOpen}
    <div class="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-900 md:hidden">
      {#each items as item}
        <a href={item.url} class="block py-2 text-sm font-medium text-gray-600 dark:text-gray-400" onclick={() => mobileOpen = false}>
          {item.label}
        </a>
      {/each}
    </div>
  {/if}
</nav>
