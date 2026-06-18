<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/config/supabase';
  import { Button, Card, DataTable, Modal, Input, ConfirmDialog } from '$lib/components/ui';
  import { addToast } from '$lib/stores/toast';
  import { Plus, Pencil, Trash, ArrowUp, ArrowDown } from 'lucide-svelte';
  import type { FooterSection, FooterItem } from '$lib/types';

  let sections: FooterSection[] = [];
  let items: FooterItem[] = [];
  let loading = true;
  let editSection: Partial<FooterSection> | null = null;
  let editItem: Partial<FooterItem> | null = null;
  let deleteSectionId: string | null = null;
  let deleteItemId: string | null = null;
  let sectionModal = false;
  let itemModal = false;
  let selectedSection: string | null = null;

  const sectionColumns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'items', label: 'Items', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  const itemColumns = [
    { key: 'label', label: 'Label', sortable: true },
    { key: 'url', label: 'URL', sortable: true },
    { key: 'sort_order', label: 'Order', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  async function load() {
    const { data: s } = await supabase.from('footer_sections').select('*').order('sort_order');
    sections = s as FooterSection[] ?? [];
    const { data: i } = await supabase.from('footer_items').select('*').order('sort_order');
    items = i as FooterItem[] ?? [];
    loading = false;
  }

  function openSection(s: FooterSection | null = null) {
    editSection = s ? { ...s } : { title: '', sort_order: 0 };
    sectionModal = true;
  }

  function openItem(sectionId: string, item: FooterItem | null = null) {
    editItem = item ? { ...item } : { section_id: sectionId, label: '', url: '', sort_order: 0 };
    itemModal = true;
  }

  async function saveSection() {
    if (!editSection?.title) return;
    if (!editSection.id) {
      const { error } = await supabase.from('footer_sections').insert(editSection);
      if (error) addToast(error.message, 'error');
      else { addToast('Section created', 'success'); sectionModal = false; load(); }
    } else {
      const { error } = await supabase.from('footer_sections').update(editSection).eq('id', editSection.id);
      if (error) addToast(error.message, 'error');
      else { addToast('Section updated', 'success'); sectionModal = false; load(); }
    }
  }

  async function saveItem() {
    if (!editItem?.label || !editItem?.url) return;
    if (!editItem.id) {
      const { error } = await supabase.from('footer_items').insert(editItem);
      if (error) addToast(error.message, 'error');
      else { addToast('Item added', 'success'); itemModal = false; load(); }
    } else {
      const { error } = await supabase.from('footer_items').update(editItem).eq('id', editItem.id);
      if (error) addToast(error.message, 'error');
      else { addToast('Item updated', 'success'); itemModal = false; load(); }
    }
  }

  async function deleteSection() {
    if (!deleteSectionId) return;
    const { error } = await supabase.from('footer_sections').delete().eq('id', deleteSectionId);
    if (error) addToast(error.message, 'error');
    else { addToast('Section deleted', 'success'); deleteSectionId = null; load(); }
  }

  async function deleteItem() {
    if (!deleteItemId) return;
    const { error } = await supabase.from('footer_items').delete().eq('id', deleteItemId);
    if (error) addToast(error.message, 'error');
    else { addToast('Item deleted', 'success'); deleteItemId = null; load(); }
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
    await supabase.from('footer_sections').update({ sort_order: a.sort_order }).eq('id', a.id);
    await supabase.from('footer_sections').update({ sort_order: b.sort_order }).eq('id', b.id);
    sections = [...sections];
  }

  async function moveItem(id: string, dir: 'up' | 'down') {
    const secItems = items.filter(i => i.section_id === selectedSection);
    const idx = secItems.findIndex(i => i.id === id);
    if (idx < 0) return;
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= secItems.length) return;
    const a = secItems[idx];
    const b = secItems[swapIdx];
    const temp = a.sort_order;
    a.sort_order = b.sort_order;
    b.sort_order = temp;
    await supabase.from('footer_items').update({ sort_order: a.sort_order }).eq('id', a.id);
    await supabase.from('footer_items').update({ sort_order: b.sort_order }).eq('id', b.id);
    items = [...items];
  }

  onMount(load);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Footer</h1>
    <Button on:click={() => openSection()}><Plus class="h-4 w-4" /> New Section</Button>
  </div>

  <Card title="Sections">
    <DataTable columns={sectionColumns} rows={sections} {loading} emptyMessage="No sections found">
      <svelte:fragment slot="cell" let:col let:row>
        {#if col.key === 'items'}
          {items.filter(i => i.section_id === row.id).length}
        {:else if col.key === 'actions'}
          <div class="flex items-center gap-2">
            <button on:click={() => moveSection(row.id, 'up')} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><ArrowUp class="h-4 w-4" /></button>
            <button on:click={() => moveSection(row.id, 'down')} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><ArrowDown class="h-4 w-4" /></button>
            <button on:click={() => openSection(row)} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><Pencil class="h-4 w-4" /></button>
            <button on:click={() => { selectedSection = row.id; }} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" title="View items"><Pencil class="h-4 w-4" /></button>
            <button on:click={() => deleteSectionId = row.id} class="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash class="h-4 w-4" /></button>
          </div>
        {:else}
          {row[col.key] ?? '-'}
        {/if}
      </svelte:fragment>
    </DataTable>
  </Card>

  {#if selectedSection}
    {@const section = sections.find(s => s.id === selectedSection)}
    <Card title="Items: {section?.title ?? ''}">
      <div class="mb-4 flex items-center justify-between">
        <Button on:click={() => openItem(selectedSection)}><Plus class="h-4 w-4" /> Add Item</Button>
        <button on:click={() => selectedSection = null} class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400">Close</button>
      </div>
      <DataTable columns={itemColumns} rows={items.filter(i => i.section_id === selectedSection)} loading={false} emptyMessage="No items found">
        <svelte:fragment slot="cell" let:col let:row>
          {#if col.key === 'actions'}
            <div class="flex items-center gap-2">
              <button on:click={() => moveItem(row.id, 'up')} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><ArrowUp class="h-4 w-4" /></button>
              <button on:click={() => moveItem(row.id, 'down')} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><ArrowDown class="h-4 w-4" /></button>
              <button on:click={() => openItem(selectedSection, row)} class="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"><Pencil class="h-4 w-4" /></button>
              <button on:click={() => deleteItemId = row.id} class="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash class="h-4 w-4" /></button>
            </div>
          {:else}
            {row[col.key] ?? '-'}
          {/if}
        </svelte:fragment>
      </DataTable>
    </Card>
  {/if}
</div>

<Modal title={editSection?.id ? 'Edit Section' : 'Create Section'} bind:open={sectionModal}>
  <div class="space-y-4">
    <Input label="Title" bind:value={editSection.title} required />
    <Input type="number" label="Sort Order" bind:value={editSection.sort_order} />
    <div class="flex justify-end gap-3">
      <Button variant="ghost" on:click={() => sectionModal = false}>Cancel</Button>
      <Button on:click={saveSection}>Save</Button>
    </div>
  </div>
</Modal>

<Modal title={editItem?.id ? 'Edit Item' : 'Add Item'} bind:open={itemModal}>
  <div class="space-y-4">
    <Input label="Label" bind:value={editItem.label} required />
    <Input label="URL" bind:value={editItem.url} required />
    <Input label="Icon (Lucide name)" bind:value={editItem.icon} />
    <Input type="number" label="Sort Order" bind:value={editItem.sort_order} />
    <div class="flex justify-end gap-3">
      <Button variant="ghost" on:click={() => itemModal = false}>Cancel</Button>
      <Button on:click={saveItem}>Save</Button>
    </div>
  </div>
</Modal>

{#if deleteSectionId !== null}
  <ConfirmDialog open={true} title="Delete Section" message="This will delete the section and all its items." confirmText="Delete" on:confirm={deleteSection} on:cancel={() => deleteSectionId = null} />
{/if}

{#if deleteItemId !== null}
  <ConfirmDialog open={true} title="Delete Item" message="Remove this footer item?" confirmText="Delete" on:confirm={deleteItem} on:cancel={() => deleteItemId = null} />
{/if}
