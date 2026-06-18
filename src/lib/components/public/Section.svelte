<script lang="ts">
  let { content }: { content: Record<string, unknown> } = $props();
  let text = $derived((content.text as string) ?? '');
  let heading = $derived((content.heading as string) ?? '');
  let alignment = $derived((content.alignment as string) ?? 'left');
  let className = $derived((content.className as string) ?? '');
  let id = $derived((content.id as string) ?? '');

  const alignClass: Record<string, string> = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right',
  };
</script>

<section {id} class="py-16 px-4 sm:px-6 lg:px-8 {className}">
  <div class="mx-auto max-w-4xl {alignClass[alignment] ?? 'text-left'}">
    {#if heading}
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">{heading}</h2>
    {/if}
    {#if text}
      <div class="mt-4 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{text}</div>
    {/if}
  </div>
</section>
