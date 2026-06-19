<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/config/supabase';
  import { Menu, X } from 'lucide-svelte';
  import { ThemeToggle } from '$lib/components/ui';
  import type { NavigationItem } from '$lib/types';

  let items: NavigationItem[] = $state([]);
  let mobileOpen = $state(false);
  let scrolled = $state(false);

  onMount(async () => {
    const handleScroll = () => { scrolled = window.scrollY > 16; };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const { data: m } = await supabase.from('navigation_menus').select('id').eq('location', 'navbar').single();
    if (m) {
      const { data: i } = await supabase.from('navigation_items').select('*').eq('menu_id', m.id).eq('visible', true).order('sort_order');
      items = (i as NavigationItem[]) ?? [];
    }

    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<header class="sticky top-0 z-50 transition-all duration-200 {scrolled ? 'border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-950/90' : 'bg-transparent'}">
  <div class="container">
    <div class="flex h-16 items-center justify-between">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2.5 font-extrabold text-gray-900 dark:text-white">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-black">P</div>
        <span class="text-lg tracking-tight">ProjectX</span>
      </a>

      <!-- Desktop nav -->
      <nav class="hidden items-center gap-1 md:flex">
        {#each items as item}
          <a
            href={item.url}
            class="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            {item.label}
          </a>
        {/each}
      </nav>

      <!-- Desktop actions -->
      <div class="hidden items-center gap-3 md:flex">
        <ThemeToggle />
        <a href="/admin/login" class="btn btn-primary py-2 px-4 text-sm">
          Admin Panel
        </a>
      </div>

      <!-- Mobile toggle -->
      <button
        onclick={() => mobileOpen = !mobileOpen}
        class="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
        aria-label="Toggle menu"
      >
        {#if mobileOpen}
          <X class="h-5 w-5" />
        {:else}
          <Menu class="h-5 w-5" />
        {/if}
      </button>
    </div>
  </div>

  <!-- Mobile menu -->
  {#if mobileOpen}
    <div class="border-t border-gray-200 bg-white px-4 pb-4 pt-2 dark:border-gray-800 dark:bg-gray-950 md:hidden">
      <nav class="space-y-1">
        {#each items as item}
          <a
            href={item.url}
            class="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            onclick={() => mobileOpen = false}
          >
            {item.label}
          </a>
        {/each}
      </nav>
      <div class="mt-4 flex items-center gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <ThemeToggle />
        <a href="/admin/login" class="btn btn-primary flex-1 justify-center py-2.5 text-sm">
          Admin Panel
        </a>
      </div>
    </div>
  {/if}
</header>
