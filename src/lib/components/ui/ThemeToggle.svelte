<script lang="ts">
  import { onMount } from 'svelte';
  import { Sun, Moon, Monitor } from 'lucide-svelte';

  type Theme = 'light' | 'dark' | 'system';

  let theme: Theme = $state('system');
  let mounted = $state(false);

  onMount(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) theme = stored;
    applyTheme(theme);
    mounted = true;
  });

  function setTheme(t: Theme) {
    theme = t;
    localStorage.setItem('theme', t);
    applyTheme(t);
  }

  function applyTheme(t: Theme) {
    const isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  }

  $effect(() => {
    if (mounted) applyTheme(theme);
  });
</script>

<div class="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
  <button
    onclick={() => setTheme('light')}
    class="rounded-md p-1.5 {theme === 'light' ? 'bg-white shadow dark:bg-gray-700' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}"
    title="Light mode"
  >
    <Sun class="h-4 w-4" />
  </button>
  <button
    onclick={() => setTheme('dark')}
    class="rounded-md p-1.5 {theme === 'dark' ? 'bg-white shadow dark:bg-gray-700' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}"
    title="Dark mode"
  >
    <Moon class="h-4 w-4" />
  </button>
  <button
    onclick={() => setTheme('system')}
    class="rounded-md p-1.5 {theme === 'system' ? 'bg-white shadow dark:bg-gray-700' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}"
    title="System preference"
  >
    <Monitor class="h-4 w-4" />
  </button>
</div>
