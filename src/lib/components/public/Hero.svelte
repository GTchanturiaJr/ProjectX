<script lang="ts">
  let { content }: { content: Record<string, unknown> } = $props();
  let heading = $derived((content.heading as string) ?? '');
  let subheading = $derived((content.subheading as string) ?? '');
  let buttonText = $derived((content.buttonText as string) ?? '');
  let buttonUrl = $derived((content.buttonUrl as string) ?? '');
  let imageUrl = $derived((content.imageUrl as string) ?? '');
  let alignment = $derived((content.alignment as string) ?? 'left');
  let className = $derived((content.className as string) ?? '');
  let id = $derived((content.id as string) ?? '');

  const alignClass: Record<string, string> = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };
</script>

<section {id} class="relative flex min-h-[60vh] flex-col justify-center {alignClass[alignment] ?? 'text-left items-start'} px-4 py-20 sm:px-6 lg:px-8 {className}">
  {#if imageUrl}
    <div class="absolute inset-0 z-0">
      <img src={imageUrl} alt="" class="h-full w-full object-cover" />
      <div class="absolute inset-0 bg-black/50"></div>
    </div>
  {/if}
  <div class="relative z-10 mx-auto max-w-4xl">
    {#if heading}
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl {imageUrl ? '!text-white' : ''}">
        {heading}
      </h1>
    {/if}
    {#if subheading}
      <p class="mt-6 text-lg text-gray-600 dark:text-gray-300 {imageUrl ? '!text-gray-200' : ''}">
        {subheading}
      </p>
    {/if}
    {#if buttonText && buttonUrl}
      <a href={buttonUrl} class="mt-8 inline-block rounded-[var(--radius)] bg-[rgb(var(--color-primary))] px-8 py-3 text-sm font-medium text-white hover:opacity-90">
        {buttonText}
      </a>
    {/if}
  </div>
</section>
