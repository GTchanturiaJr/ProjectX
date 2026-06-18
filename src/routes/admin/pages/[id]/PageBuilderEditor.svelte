<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button, Input, Select } from '$lib/components/ui';
  import type { ComponentType } from '$lib/types';

  let { type, content = {} }: { type: ComponentType; content?: Record<string, unknown> } = $props();
  const dispatch = createEventDispatcher();

  // Component content state
  let heading = $state((content.heading as string) ?? '');
  let text = $state((content.text as string) ?? '');
  let subheading = $state((content.subheading as string) ?? '');
  let buttonText = $state((content.buttonText as string) ?? '');
  let buttonUrl = $state((content.buttonUrl as string) ?? '');
  let imageUrl = $state((content.imageUrl as string) ?? '');
  let videoUrl = $state((content.videoUrl as string) ?? '');
  let items = $state((content.items as string[]) ?? []);
  let features = $state((content.features as { title: string; description: string; icon: string }[]) ?? []);
  let testimonials = $state((content.testimonials as { name: string; role: string; quote: string; image: string }[]) ?? []);
  let pricingTiers = $state((content.pricingTiers as { name: string; price: string; features: string[]; highlighted: boolean }[]) ?? []);
  let faqs = $state((content.faqs as { question: string; answer: string }[]) ?? []);
  let teamMembers = $state((content.teamMembers as { name: string; role: string; image: string; bio: string }[]) ?? []);
  let stats = $state((content.stats as { label: string; value: string }[]) ?? []);
  let formId = $state((content.formId as string) ?? '');
  let successMessage = $state((content.successMessage as string) ?? '');
  let html = $state((content.html as string) ?? '');
  let alignment = $state((content.alignment as string) ?? 'left');

  // Gallery
  let galleryItems = $state((content.galleryItems as string[]) ?? []);
  function addGallery() { galleryItems = [...galleryItems, '']; }
  function removeGallery(i: number) { galleryItems = galleryItems.filter((_, idx) => idx !== i); }

  function save() {
    let newContent: Record<string, unknown> = {};
    switch (type) {
      case 'hero':
        newContent = { heading, subheading, buttonText, buttonUrl, imageUrl, alignment };
        break;
      case 'text':
        newContent = { heading, text, alignment };
        break;
      case 'features':
        newContent = { heading, features };
        break;
      case 'image':
        newContent = { imageUrl, text };
        break;
      case 'gallery':
        newContent = { galleryItems };
        break;
      case 'video':
        newContent = { videoUrl, heading };
        break;
      case 'cta':
        newContent = { heading, subheading, buttonText, buttonUrl };
        break;
      case 'testimonial':
        newContent = { testimonials };
        break;
      case 'pricing':
        newContent = { heading, pricingTiers };
        break;
      case 'faq':
        newContent = { heading, faqs };
        break;
      case 'team':
        newContent = { heading, teamMembers };
        break;
      case 'stats':
        newContent = { stats };
        break;
      case 'contact':
        newContent = { heading, successMessage };
        break;
      case 'form':
        newContent = { heading, formId, successMessage };
        break;
      case 'products':
        newContent = { heading };
        break;
      case 'blog':
        newContent = { heading };
        break;
      case 'newsletter':
        newContent = { heading, subheading, buttonText };
        break;
      case 'custom':
        newContent = { html };
        break;
    }
    dispatch('save', newContent);
  }
</script>

<div class="space-y-4">
  {#if type === 'hero'}
    <Input label="Heading" bind:value={heading} />
    <Input label="Subheading" bind:value={subheading} />
    <Input label="Button Text" bind:value={buttonText} />
    <Input label="Button URL" bind:value={buttonUrl} />
    <Input label="Background Image URL" bind:value={imageUrl} />
    <Select label="Alignment" bind:value={alignment} options={[{value:'left',label:'Left'},{value:'center',label:'Center'},{value:'right',label:'Right'}]} />
  {:else if type === 'text'}
    <Input label="Heading" bind:value={heading} />
    <Input label="Text Content" rows={6} bind:value={text} />
    <Select label="Alignment" bind:value={alignment} options={[{value:'left',label:'Left'},{value:'center',label:'Center'},{value:'right',label:'Right'}]} />
  {:else if type === 'features'}
    <Input label="Heading" bind:value={heading} />
    <p class="text-sm text-gray-500">Features: {features.length} items</p>
  {:else if type === 'image'}
    <Input label="Image URL" bind:value={imageUrl} />
    <Input label="Caption" bind:value={text} />
  {:else if type === 'gallery'}
    <div class="space-y-2">
      {#each galleryItems as _, i}
        <div class="flex items-center gap-2">
          <Input bind:value={galleryItems[i]} placeholder="Image URL" />
          <button onclick={() => removeGallery(i)} class="rounded p-1 text-red-500 hover:bg-red-50"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
        </div>
      {/each}
      <Button variant="outline" onclick={addGallery}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Add Image</Button>
    </div>
  {:else if type === 'video'}
    <Input label="Heading" bind:value={heading} />
    <Input label="Video URL (YouTube/Vimeo)" bind:value={videoUrl} />
  {:else if type === 'cta'}
    <Input label="Heading" bind:value={heading} />
    <Input label="Subheading" bind:value={subheading} />
    <Input label="Button Text" bind:value={buttonText} />
    <Input label="Button URL" bind:value={buttonUrl} />
  {:else if type === 'testimonial'}
    <Input label="Heading" bind:value={heading} />
    <p class="text-sm text-gray-500">Testimonials: {testimonials.length} items</p>
  {:else if type === 'pricing'}
    <Input label="Heading" bind:value={heading} />
    <p class="text-sm text-gray-500">Pricing tiers: {pricingTiers.length} items</p>
  {:else if type === 'faq'}
    <Input label="Heading" bind:value={heading} />
    <p class="text-sm text-gray-500">FAQs: {faqs.length} items</p>
  {:else if type === 'team'}
    <Input label="Heading" bind:value={heading} />
    <p class="text-sm text-gray-500">Team members: {teamMembers.length} items</p>
  {:else if type === 'stats'}
    <p class="text-sm text-gray-500">Stats: {stats.length} items</p>
  {:else if type === 'contact'}
    <Input label="Heading" bind:value={heading} />
    <Input label="Success Message" bind:value={successMessage} />
  {:else if type === 'form'}
    <Input label="Heading" bind:value={heading} />
    <Input label="Form ID" bind:value={formId} />
    <Input label="Success Message" bind:value={successMessage} />
  {:else if type === 'products'}
    <Input label="Heading" bind:value={heading} />
  {:else if type === 'blog'}
    <Input label="Heading" bind:value={heading} />
  {:else if type === 'newsletter'}
    <Input label="Heading" bind:value={heading} />
    <Input label="Subheading" bind:value={subheading} />
    <Input label="Button Text" bind:value={buttonText} />
  {:else if type === 'custom'}
    <Input label="HTML Content" rows={8} bind:value={html} />
  {/if}

  <div class="flex justify-end">
    <Button onclick={save}>Save Section</Button>
  </div>
</div>
