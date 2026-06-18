<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { supabase } from '$lib/config/supabase';
  import { Button, Card, Modal, Input, Select, ConfirmDialog } from '$lib/components/ui';
  import { addToast } from '$lib/stores/toast';
  import { ArrowUp, ArrowDown, Eye, EyeOff, Trash, Plus, Save, ArrowLeft } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { COMPONENT_TYPES, type PageSection, type Page } from '$lib/types';
  import PageBuilderEditor from './PageBuilderEditor.svelte';

  let pageData: Page | null = null;
  let sections: PageSection[] = [];
  let loading = true;
  let saving = false;
  let editSection: PageSection | null = null;
  let deleteSectionId: string | null = null;
  let addModal = false;
  let newType = '';
  let newVariant = '';

  const pageId = $page.params.id;

  async function load() {
    const { data: p } = await supabase.from('pages').select('*').eq('id', pageId).single();
    pageData = p as Page;
    const { data: s } = await supabase.from('page_sections').select('*').eq('page_id', pageId).order('sort_order');
    sections = s as PageSection[] ?? [];
    loading = false;
  }

  async function addSection() {
    if (!newType) return;
    const maxOrder = sections.reduce((m, s) => Math.max(m, s.sort_order), -1);
    const { data, error } = await supabase.from('page_sections').insert({
      page_id: pageId,
      component_type: newType,
      sort_order: maxOrder + 1,
      content: {},
      visible: true,
      variant: newVariant || null,
    }).select().single();
    if (error) addToast(error.message, 'error');
    else {
      sections = [...sections, data as PageSection];
      addToast('Section added', 'success');
      addModal = false;
      newType = '';
      newVariant = '';
    }
  }

  async function moveSection(id: string, dir: 'up' | 'down') {
    const idx = sections.findIndex(s => s.id === id);
    if (idx < 0) return;
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sections.length) return;
    const a = sections[idx];
    const b = sections[swapIdx];
    const temp = a.sort_order;
    a.sort_order = b.sort_order;
    b.sort_order = temp;
    await supabase.from('page_sections').update({ sort_order: a.sort_order }).eq('id', a.id);
    await supabase.from('page_sections').update({ sort_order: b.sort_order }).eq('id', b.id);
    sections = [...sections];
    addToast('Order updated', 'success');
  }

  async function toggleVisible(id: string) {
    const s = sections.find(x => x.id === id);
    if (!s) return;
    const { error } = await supabase.from('page_sections').update({ visible: !s.visible }).eq('id', id);
    if (error) addToast(error.message, 'error');
    else {
      s.visible = !s.visible;
      sections = [...sections];
      addToast('Visibility updated', 'success');
    }
  }

  async function removeSection() {
    if (!deleteSectionId) return;
    const { error } = await supabase.from('page_sections').delete().eq('id', deleteSectionId);
    if (error) addToast(error.message, 'error');
    else {
      sections = sections.filter(s => s.id !== deleteSectionId);
      deleteSectionId = null;
      addToast('Section removed', 'success');
    }
  }

  async function updateSectionContent(id: string, content: Record<string, unknown>) {
    const { error } = await supabase.from('page_sections').update({ content }).eq('id', id);
    if (error) addToast(error.message, 'error');
    else {
      const s = sections.find(x => x.id === id);
      if (s) s.content = content;
      sections = [...sections];
      addToast('Section saved', 'success');
    }
  }

  onMount(load);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <button on:click={() => goto('/admin/pages')} class="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
        <ArrowLeft class="h-5 w-5" />
      </button>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{pageData?.title ?? 'Page Builder'}</h1>
    </div>
    <Button on:click={() => addModal = true}><Plus class="h-4 w-4" /> Add Section</Button>
  </div>

  {#if loading}
    <p class="text-gray-500">Loading...</p>
  {:else}
    <div class="space-y-4">
      {#each sections.sort((a, b) => a.sort_order - b.sort_order) as section (section.id)}
        <Card className="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {COMPONENT_TYPES.find(c => c.type === section.component_type)?.label ?? section.component_type}
              </span>
              {#if section.variant}
                <span class="text-xs text-gray-500">Variant: {section.variant}</span>
              {/if}
              {#if !section.visible}
                <span class="text-xs text-amber-600">Hidden</span>
              {/if}
            </div>
            <div class="flex items-center gap-1">
              <button on:click={() => moveSection(section.id, 'up')} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" title="Move up">
                <ArrowUp class="h-4 w-4" />
              </button>
              <button on:click={() => moveSection(section.id, 'down')} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" title="Move down">
                <ArrowDown class="h-4 w-4" />
              </button>
              <button on:click={() => toggleVisible(section.id)} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" title="Toggle visibility">
                {#if section.visible}
                  <Eye class="h-4 w-4" />
                {:else}
                  <EyeOff class="h-4 w-4" />
                {/if}
              </button>
              <button on:click={() => deleteSectionId = section.id} class="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete">
                <Trash class="h-4 w-4" />
              </button>
            </div>
          </div>
          <PageBuilderEditor
            type={section.component_type}
            content={section.content}
            on:save={(e) => updateSectionContent(section.id, e.detail)}
          />
        </Card>
      {:else}
        <div class="rounded-[var(--radius)] border border-dashed border-gray-300 py-12 text-center dark:border-gray-700">
          <p class="text-sm text-gray-500 dark:text-gray-400">No sections yet. Add your first section.</p>
        </div>
      {/each}
    </div>
  {/if}
</div>

<Modal title="Add Section" bind:open={addModal}>
  <div class="space-y-4">
    <Select label="Component Type" bind:value={newType} options={COMPONENT_TYPES.map(c => ({ value: c.type, label: c.label }))} placeholder="Choose component..." />
    <Input label="Variant (optional)" bind:value={newVariant} placeholder="e.g. centered, wide, compact" />
    <div class="flex justify-end gap-3">
      <Button variant="ghost" on:click={() => addModal = false}>Cancel</Button>
      <Button on:click={addSection}>Add Section</Button>
    </div>
  </div>
</Modal>

{#if deleteSectionId !== null}
  <ConfirmDialog
    open={true}
    title="Remove Section"
    message="Are you sure you want to remove this section?"
    confirmText="Remove"
    on:confirm={removeSection}
    on:cancel={() => deleteSectionId = null}
  />
{/if}
