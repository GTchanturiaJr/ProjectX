<script lang="ts">
  import PageRenderer from '$lib/components/public/PageRenderer.svelte';
  import type { Page, PageSection } from '$lib/types';

  let { data } = $props();
  let page = data.page as Page;
  let sections = data.sections as PageSection[];
</script>

<PageRenderer {sections} />
