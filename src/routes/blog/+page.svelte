<script lang="ts">
  import { formatDate } from '$lib/utils/helpers';
  import type { BlogPost } from '$lib/types';

  let { data } = $props();
  let posts = data.posts as BlogPost[];
</script>

<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Blog</h1>

  {#if posts.length === 0}
    <p class="mt-8 text-gray-500">No posts yet.</p>
  {:else}
    <div class="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {#each posts as post}
        <a href="/blog/{post.slug}" class="group rounded-[var(--radius)] border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600">
          {#if post.cover_image}
            <img src={post.cover_image} alt={post.title} class="h-48 w-full rounded-[var(--radius)] object-cover" />
          {/if}
          <h2 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[rgb(var(--color-primary))]">{post.title}</h2>
          {#if post.excerpt}
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{post.excerpt}</p>
          {/if}
          <p class="mt-4 text-xs text-gray-500">{formatDate(post.created_at)}</p>
        </a>
      {/each}
    </div>
  {/if}
</div>
