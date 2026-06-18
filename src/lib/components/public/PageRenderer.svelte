<script lang="ts">
  import Hero from './Hero.svelte';
  import Section from './Section.svelte';
  import ContactForm from './ContactForm.svelte';
  import type { PageSection, ComponentType } from '$lib/types';

  let { sections }: { sections: PageSection[] } = $props();

  const components: Record<ComponentType, typeof Hero> = {
    hero: Hero,
    text: Section,
    contact: ContactForm,
    form: ContactForm,
    features: Section,
    image: Section,
    gallery: Section,
    video: Section,
    cta: Section,
    testimonial: Section,
    pricing: Section,
    faq: Section,
    team: Section,
    stats: Section,
    products: Section,
    blog: Section,
    newsletter: Section,
    custom: Section,
  };

  function getProps(type: ComponentType, content: Record<string, unknown>): Record<string, unknown> {
    const base = { content, id: `section-${type}` };
    switch (type) {
      case 'hero':
        return base;
      case 'text':
        return base;
      case 'contact':
      case 'form':
        return base;
      default:
        return { content, className: 'py-12', id: `section-${type}` };
    }
  }
</script>

{#each sections.filter(s => s.visible).sort((a, b) => a.sort_order - b.sort_order) as section (section.id)}
  {@const comp = components[section.component_type]}
  <svelte:component this={comp} {...getProps(section.component_type, section.content)} />
{/each}
