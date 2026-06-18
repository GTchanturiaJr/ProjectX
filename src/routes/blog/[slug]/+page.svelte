<script lang="ts">
  import { formatDate } from '$lib/utils/helpers';
  import type { BlogPost } from '$lib/types';

  let { data } = $props();
  let post = data.post as BlogPost;
</script>

<article class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
  {#if post.cover_image}
    <img src={post.cover_image} alt={post.title} class="mb-8 aspect-video w-full rounded-[var(--radius)] object-cover" />
  {/if}

  <h1 class="text-4xl font-bold text-gray-900 dark:text-white">{post.title}</h1>

  <div class="mt-4 flex items-center gap-4 text-sm text-gray-500">
    <span>{formatDate(post.created_at)}</span>
  </div>

  {#if post.excerpt}
    <p class="mt-6 text-lg text-gray-600 dark:text-gray-400">{post.excerpt}</p>
  {/if}

  <div class="mt-8 prose prose-lg dark:prose-invert max-w-none">
    {post.content}
  </div>

  <div class="mt-8">
    <a href="/blog" class="text-[rgb(var(--color-primary))] hover:underline">Back to Blog</a>
  </div>
</article>
